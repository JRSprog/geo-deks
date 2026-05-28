"use client";

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";

type CardType = "lokasyon" | "rehiyon" | "paggalaw" | "interaksyon" | "disaster" | "adaptation";
type Place = { id: string; name: string; details: string; tags: string[] };
type Card = { id: string; type: CardType; title: string; text: string; tags: string[] };
type Civilization = { lokasyon?: Card; rehiyon?: Card; paggalaw?: Card; interaksyon?: Card };
type Player = { id: number; name: string; isHuman: boolean; place: Place; hand: Card[]; civ: Civilization };

const PLACES: Place[] = [
  { id: "sahara", name: "Disyerto ng Sahara", details: "Mainit, tuyo, oasis-based survival.", tags: ["desert", "africa", "arid"] },
  { id: "japan", name: "Kapuluan ng Japan", details: "Pulo, lindol-prone, maritime culture.", tags: ["island", "asia", "coastal"] },
  { id: "himalayas", name: "Kabundukan ng Himalayas", details: "Mataas, malamig, terraced adaptation.", tags: ["mountain", "asia", "cold"] },
  { id: "amazon", name: "Rainforest ng Amazon", details: "Basang tropikal, ilog at kagubatan.", tags: ["rainforest", "south-america", "river"] },
  { id: "nile", name: "Lambak ng Nile", details: "Ilog ang sentro ng agrikultura.", tags: ["river", "africa", "agri"] },
  { id: "arctic", name: "Arctic Circle", details: "Yelo at malamig na rehiyon.", tags: ["polar", "cold", "ocean"] },
  { id: "andes", name: "Kabundukan ng Andes", details: "Mataas at malamig na kabundukan.", tags: ["mountain", "south-america", "cold"] },
  { id: "gobi", name: "Disyerto ng Gobi", details: "Malamig-init na disyerto sa Asya.", tags: ["desert", "asia", "arid"] },
];

function c(type: CardType, title: string, text: string, tags: string[]): Omit<Card, "id"> {
  return { type, title, text, tags };
}

const COMPONENTS: Omit<Card, "id">[] = [
  c("lokasyon", "Lokasyong Absolute", "Latitude at longitude grid reference.", ["asia", "africa", "south-america", "ocean"]),
  c("lokasyon", "Relatibong Lokasyon", "Batay sa nakapaligid na anyong lupa/tubig.", ["coastal", "river", "mountain", "desert", "island"]),
  c("lokasyon", "Equator Reference", "Posisyong malapit sa equatorial belt.", ["rainforest", "africa", "south-america", "island"]),
  c("lokasyon", "Polar Latitude", "Mataas na latitude, malamig na klima.", ["polar", "cold"]),
  c("rehiyon", "Silangang Asya", "Pagkakabuklod ng kultura at heograpiya.", ["asia"]),
  c("rehiyon", "Hilagang Aprika", "Arid at disyertong rehiyon.", ["africa", "desert"]),
  c("rehiyon", "Timog Amerika", "Rehiyong may rainforest at kabundukan.", ["south-america", "rainforest", "mountain"]),
  c("rehiyon", "Arctic Zone", "Malamig at polar na bahagi ng daigdig.", ["polar", "cold", "ocean"]),
  c("paggalaw", "Maritime Trade Route", "Paggalaw ng tao/produkto sa dagat.", ["coastal", "island", "ocean"]),
  c("paggalaw", "Mountain Pass Mobility", "Paglakbay sa lagusang kabundukan.", ["mountain"]),
  c("paggalaw", "River Transport", "Paggalaw gamit ang ilog.", ["river", "agri"]),
  c("paggalaw", "Nomadic Migration", "Paglipat batay sa klima at pastulan.", ["desert", "arid"]),
  c("lokasyon", "Global Coordinates", "Flexible location reference usable in many terrains.", ["asia", "africa", "south-america", "polar", "coastal", "river", "mountain", "desert", "island", "rainforest", "ocean", "cold", "arid", "agri"]),
  c("rehiyon", "Transregional Network", "Malawak na ugnayang rehiyonal.", ["asia", "africa", "south-america", "polar", "coastal", "river", "mountain", "desert", "island", "rainforest", "ocean", "cold", "arid", "agri"]),
  c("paggalaw", "Adaptive Mobility", "Paggalaw na umaangkop sa kahit anong heograpiya.", ["asia", "africa", "south-america", "polar", "coastal", "river", "mountain", "desert", "island", "rainforest", "ocean", "cold", "arid", "agri"]),
  c("lokasyon", "Highland Coordinates", "Reference system for elevated terrain zones.", ["mountain", "cold", "asia", "south-america"]),
  c("lokasyon", "Coastal Bearing", "Positioning via coastline and sea approach.", ["coastal", "island", "ocean"]),
  c("lokasyon", "Hemisphere Reference", "Pagkilala sa hilaga o timog na bahagi ng daigdig.", ["polar", "ocean", "asia", "africa", "south-america"]),
  c("rehiyon", "Pacific Rim", "Mga bansang nasa palibot ng Pasipiko.", ["ocean", "island", "coastal", "asia", "south-america"]),
  c("rehiyon", "Mountain Belt", "Magkakaugnay na kabundukang rehiyon.", ["mountain", "asia", "south-america"]),
  c("rehiyon", "Dry Zone", "Rehiyon ng matitinding tuyong klima.", ["desert", "arid", "africa", "asia"]),
  c("paggalaw", "Caravan Route", "Paggalaw sa tuyong ruta ng kalakalan.", ["desert", "arid"]),
  c("paggalaw", "Coastal Navigation", "Paggalaw at kalakalan sa baybaying dagat.", ["coastal", "ocean", "island"]),
  c("paggalaw", "Glacier Trail", "Paglalakbay sa malamig na bulubundukin.", ["mountain", "cold", "polar"]),
  c("paggalaw", "Meridian Crossing", "Paglipat o paglalakbay na nakaayon sa prime meridian.", ["ocean", "asia", "africa", "south-america", "polar"]),
  c("lokasyon", "Ilang Hemisphere ang Daigdig?", "Hati ang daigdig sa Northern, Southern, Eastern, at Western Hemisphere.", ["polar", "ocean", "asia", "africa", "south-america"]),
  c("lokasyon", "Nasaan ang Pilipinas?", "Ang bansa ay nasa kanluran ng Pacific Ocean at silangan ng West Philippine Sea.", ["ocean", "island", "coastal", "asia"]),
  c("rehiyon", "Ano ang Five Themes?", "Lokasyon, Lugar, Rehiyon, Paggalaw, at Interaksyon.", ["asia", "africa", "south-america", "polar", "coastal", "river", "mountain", "desert", "island", "rainforest", "ocean", "cold", "arid", "agri"]),
  c("paggalaw", "Guhit ng Lokasyon", "Latitude at longitude ang ginagamit sa paghanap ng lugar.", ["asia", "africa", "south-america", "polar", "ocean"]),
];

const INTERACTIONS: Omit<Card, "id">[] = [
  c("interaksyon", "Terracing", "Hakbang-hagdang sakahan.", ["mountain", "agri"]),
  c("interaksyon", "Oasis Farming", "Pagsasaka sa disyerto gamit bukal.", ["desert", "arid"]),
  c("interaksyon", "Maritime Fishing", "Pangingisda sa kapuluan/baybayin.", ["island", "coastal", "ocean"]),
  c("interaksyon", "Floodplain Irrigation", "Irigasyon sa lambak-ilog.", ["river", "agri"]),
  c("interaksyon", "Igloo Housing", "Pamumuhay na angkop sa lamig.", ["polar", "cold"]),
  c("interaksyon", "Rainforest Agroforestry", "Pag-angkop sa basang kagubatan.", ["rainforest", "agri"]),
  c("interaksyon", "Mixed Survival Strategy", "Pangkalahatang interaksyon para sa iba-ibang lugar.", ["asia", "africa", "south-america", "polar", "coastal", "river", "mountain", "desert", "island", "rainforest", "ocean", "cold", "arid", "agri"]),
  c("interaksyon", "Stone Terrace Housing", "Pamayanan na naka-angkop sa matarik na lupain.", ["mountain", "cold"]),
  c("interaksyon", "Canal Settlements", "Komunidad na umiikot sa daluyan ng tubig.", ["river", "agri", "coastal"]),
  c("interaksyon", "Desert Windbreaks", "Proteksyon at pagsasaka sa tuyong lupa.", ["desert", "arid"]),
  c("interaksyon", "Cold-Climate Storage", "Pag-iimbak ng pagkain sa malamig na klima.", ["cold", "polar", "mountain"]),
  c("interaksyon", "Island Port Culture", "Kabuhayan na nakasentro sa pantalan.", ["island", "coastal", "ocean"]),
  c("interaksyon", "Earth Layers Model", "Pag-unawa sa crust, mantle, at core.", ["mountain", "polar", "ocean", "desert", "river", "coastal", "island", "rainforest"]),
  c("interaksyon", "Ocean Basin Study", "Pag-aaral sa lawak at lalim ng mga dagat.", ["ocean", "coastal", "island"]),
  c("interaksyon", "Continent Survey", "Paghahambing ng lawak ng mga kontinente.", ["asia", "africa", "south-america", "mountain", "desert", "rainforest", "polar"]),
  c("interaksyon", "Theme Mapping", "Pag-uugnay ng lokasyon, lugar, rehiyon, paggalaw, at interaksyon.", ["asia", "africa", "south-america", "polar", "coastal", "river", "mountain", "desert", "island", "rainforest", "ocean", "cold", "arid", "agri"]),
  c("interaksyon", "Ilang Porsiyento ang Tubig?", "Mga 71% ng daigdig ay tubig at 29% ay lupa.", ["ocean", "coastal", "island"]),
  c("interaksyon", "Ano ang Pinakamataas na Bundok?", "Everest ang pinakamataas na bundok sa daigdig.", ["mountain", "cold", "asia"]),
  c("interaksyon", "Ano ang Pinakamalaking Kontinente?", "Asya ang may pinakamalawak na lawak.", ["asia", "mountain", "desert", "ocean", "rainforest", "coastal"]),
  c("interaksyon", "Ano ang Pitong Kontinente?", "Australia at Oceania, Europe, South America, Antarctica, North America, Africa, at Asya.", ["asia", "africa", "south-america", "polar", "mountain", "desert", "rainforest"]),
  c("interaksyon", "Ano ang Limang Karagatan?", "Pacific, Atlantic, Indian, Southern, at Arctic Ocean.", ["ocean", "coastal", "island", "polar"]),
  c("interaksyon", "Ano ang Tatlong Bahagi ng Daigdig?", "Crust, mantle, at core ang pangunahing bahagi.", ["mountain", "polar", "ocean", "desert", "river", "coastal", "island", "rainforest"]),
  c("interaksyon", "Ano ang Relatibong Lokasyon?", "Pagtukoy sa lugar batay sa mga katabi o kalapit na anyong lupa at tubig.", ["coastal", "river", "mountain", "desert", "island", "ocean"]),
  c("interaksyon", "Ano ang Absolute Location?", "Pagtukoy sa lugar gamit ang latitude at longitude.", ["asia", "africa", "south-america", "ocean", "polar"]),
  c("interaksyon", "Ano ang Distribusyon?", "Pagkakahati-hati ng mga bagay o pangyayari sa isang pook.", ["asia", "africa", "south-america", "polar", "coastal", "river", "mountain", "desert", "island", "rainforest", "ocean", "cold", "arid", "agri"]),
  c("interaksyon", "Ano ang Interaksyon?", "Ugnayan ng tao at pisikal na kapaligiran sa isang lugar.", ["asia", "africa", "south-america", "polar", "coastal", "river", "mountain", "desert", "island", "rainforest", "ocean", "cold", "arid", "agri"]),
];

const DISASTERS: Omit<Card, "id">[] = [
  c("disaster", "Bagyo", "Puwedeng ma-block ng Adaptation card.", []),
  c("disaster", "Lindol", "Puwedeng ma-block ng Adaptation card.", []),
  c("disaster", "Tsunami", "Puwedeng ma-block ng Adaptation card.", []),
  c("disaster", "Tagtuyot", "Puwedeng ma-block ng Adaptation card.", []),
  c("disaster", "Landslide", "Puwedeng ma-block ng Adaptation card.", []),
];

const ADAPTATIONS: Omit<Card, "id">[] = [
  c("adaptation", "Deep Well Water System", "Panangga laban sa disaster.", []),
  c("adaptation", "Early Warning System", "Panangga laban sa disaster.", []),
  c("adaptation", "Evacuation Protocol", "Panangga laban sa disaster.", []),
  c("adaptation", "Drought-Resistant Seeds", "Panangga laban sa disaster.", []),
  c("adaptation", "Resilient Infrastructure", "Panangga laban sa disaster.", []),
];

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function buildDeck(): Card[] {
  const raw = [
    ...COMPONENTS,
    ...INTERACTIONS,
    ...DISASTERS,
    ...ADAPTATIONS,
  ];
  return shuffle(raw.map((x, i) => ({ ...x, id: `${x.type}-${i + 1}` })));
}

function isMatch(place: Place, card: Card): boolean {
  if (card.type === "disaster" || card.type === "adaptation") return false;
  return card.tags.some((t) => place.tags.includes(t));
}

function isWinning(civ: Civilization): boolean {
  return Boolean(civ.lokasyon && civ.rehiyon && civ.paggalaw && civ.interaksyon);
}

function typeLabel(type: CardType): string {
  if (type === "lokasyon") return "Lokasyon";
  if (type === "rehiyon") return "Rehiyon";
  if (type === "paggalaw") return "Paggalaw";
  if (type === "interaksyon") return "Interaksyon";
  if (type === "disaster") return "Disaster";
  return "Adaptation";
}

function cardTone(type: CardType): {
  base: string;
  border: string;
  text: string;
  label: string;
} {
  if (type === "lokasyon") {
    return {
      base: "bg-[#e11d1d]",
      border: "border-[#f6f1e8]",
      text: "text-white",
      label: "text-white/90",
    };
  }
  if (type === "rehiyon") {
    return {
      base: "bg-[#f3c516]",
      border: "border-[#fff5d6]",
      text: "text-[#13212f]",
      label: "text-[#13212f]/80",
    };
  }
  if (type === "paggalaw") {
    return {
      base: "bg-[#2f9e44]",
      border: "border-[#eaf8e8]",
      text: "text-white",
      label: "text-white/90",
    };
  }
  if (type === "disaster") {
    return {
      base: "bg-[#c24d19]",
      border: "border-[#fff2e6]",
      text: "text-white",
      label: "text-white/90",
    };
  }
  if (type === "adaptation") {
    return {
      base: "bg-[#2563eb]",
      border: "border-[#e7f1ff]",
      text: "text-white",
      label: "text-white/90",
    };
  }
  return {
    base: "bg-[#f5b91e]",
    border: "border-[#fff3cc]",
    text: "text-[#14202e]",
    label: "text-[#14202e]/80",
  };
}

function handCardClassName(selected: boolean): string {
  return [
    "group relative overflow-hidden rounded-[1.35rem] border-[6px] shadow-[0_12px_24px_rgba(0,0,0,0.18)] transition",
    "aspect-[2.3/3.4] w-full text-left",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2f6fa7]/70",
    selected ? "ring-4 ring-[#2f6fa7] scale-[1.02]" : "hover:-translate-y-1 hover:scale-[1.01]",
  ].join(" ");
}

function handCardInnerClassName(type: CardType): string {
  const tone = cardTone(type);
  return `${tone.base} ${tone.border} ${tone.text}`;
}

function cardBackStyle(offset: number): CSSProperties {
  const wobble = offset % 2 === 0 ? -1.8 : 1.6;
  return {
    transform: `translateX(${offset * 11}px) translateY(${Math.abs(offset) * 1.5 + 1}px) rotate(${offset * 2.7 + wobble}deg)`,
    zIndex: 10 + offset,
  };
}

function nextTurn(turn: number, count: number): number {
  return (turn + 1) % count;
}

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [drawPile, setDrawPile] = useState<Card[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [turn, setTurn] = useState(0);
  const [phase, setPhase] = useState<"draw" | "action" | "discard">("draw");
  const [actionsLeft, setActionsLeft] = useState(2);
  const [message, setMessage] = useState("Click Start Game.");
  const [selectedHandIndex, setSelectedHandIndex] = useState<number | null>(null);
  const [selectedTarget, setSelectedTarget] = useState(1);
  const [winner, setWinner] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [showMobileHand, setShowMobileHand] = useState(false);
  const [winDrops, setWinDrops] = useState<Array<{ id: number; left: number; color: string; delay: number; duration: number }>>([]);

  const active = players[turn];
  const humanIndex = 0;
  const isHumanTurn = Boolean(active?.isHuman);
  const toggleMobileHand = useCallback(() => {
    setShowMobileHand((prev) => !prev);
  }, []);

  const renderHandCard = (card: Card, idx: number, compact = false) => {
    const tone = cardTone(card.type);
    return (
      <button
        key={`${card.id}-${idx}`}
        type="button"
        onClick={() => setSelectedHandIndex(idx)}
        className={`${handCardClassName(selectedHandIndex === idx)} ${handCardInnerClassName(card.type)} ${compact ? "max-w-[170px]" : "max-w-none"}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.12)_16%,transparent_30%),radial-gradient(circle_at_80%_82%,rgba(255,255,255,0.12)_0%,transparent_28%)]" />
        <div className="absolute left-0 top-0 h-full w-full rounded-[1.35rem] border-4 border-white/65 opacity-90" />
        <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border-[5px] border-white/88 rotate-[-22deg]" />
        <div className={`absolute left-3 top-2 ${compact ? "text-[0.9rem]" : "text-[clamp(0.95rem,2vw,1.35rem)]"} font-black leading-none drop-shadow-[0_1px_0_rgba(255,255,255,0.35)]`}>
          {idx + 1}
        </div>
        <div className={`absolute bottom-2 right-3 rotate-180 ${compact ? "text-[0.9rem]" : "text-[clamp(0.95rem,2vw,1.35rem)]"} font-black leading-none drop-shadow-[0_1px_0_rgba(255,255,255,0.35)]`}>
          {idx + 1}
        </div>
        <div className={`absolute right-3 top-3 ${compact ? "text-[0.52rem]" : "text-[0.6rem]"} font-black uppercase tracking-[0.22em] ${tone.label}`}>
          {typeLabel(card.type)}
        </div>
        <div className={`relative z-10 flex h-full flex-col justify-between ${compact ? "p-3" : "p-4"}`}>
          <div />
          <div className="text-center">
            <p className={`${compact ? "text-[0.54rem]" : "text-[0.62rem]"} font-black uppercase tracking-[0.24em] ${tone.label}`}>{typeLabel(card.type)}</p>
            <p className={`${compact ? "mt-1 text-[0.84rem]" : "mt-2 text-[1.05rem]"} font-black leading-[1.03] drop-shadow-[0_1px_0_rgba(255,255,255,0.18)]`}>
              {card.title}
            </p>
            <p className={`mx-auto mt-2 max-w-[13ch] ${compact ? "text-[0.55rem]" : "text-[0.72rem]"} font-medium leading-snug opacity-95`}>
              {card.text}
            </p>
          </div>
          <div className="flex items-end justify-between">
            <span className={`text-[0.5rem] font-black uppercase tracking-[0.25em] ${tone.label}`}>Geo-Deck</span>
            <span className={`text-[0.5rem] font-black uppercase tracking-[0.25em] ${tone.label}`}>UNO</span>
          </div>
        </div>
      </button>
    );
  };

  const drawFromPiles = useCallback((currentDraw: Card[], currentDiscard: Card[], count: number) => {
    const draw = [...currentDraw];
    let discard = [...currentDiscard];
    const drawn: Card[] = [];

    for (let i = 0; i < count; i += 1) {
      if (draw.length === 0 && discard.length > 0) {
        draw.push(...shuffle(discard));
        discard = [];
      }
      const top = draw.shift();
      if (top) drawn.push(top);
    }

    return { drawn, draw, discard };
  }, []);

  const advanceTurn = useCallback((nextPlayers: Player[], nextDraw: Card[], nextDiscard: Card[]) => {
    const nt = nextTurn(turn, nextPlayers.length);
    setPlayers(nextPlayers);
    setDrawPile(nextDraw);
    setDiscardPile(nextDiscard);
    setTurn(nt);
    setPhase("draw");
    setActionsLeft(2);
    setSelectedHandIndex(null);
    setSelectedTarget(nt === 0 ? 1 : 0);
    setShowMobileHand(false);
    setMessage(`${nextPlayers[nt].name} turn: Draw phase.`);
  }, [turn]);

  const setupGame = () => {
    const placePool = shuffle(PLACES).slice(0, 4);
    const deck = buildDeck();
    const nextPlayers: Player[] = [
      { id: 0, name: "You", isHuman: true, place: placePool[0], hand: [], civ: {} },
      { id: 1, name: "Player 2", isHuman: false, place: placePool[1], hand: [], civ: {} },
      { id: 2, name: "Player 3", isHuman: false, place: placePool[2], hand: [], civ: {} },
      { id: 3, name: "Player 4", isHuman: false, place: placePool[3], hand: [], civ: {} },
    ];

    for (let r = 0; r < 5; r += 1) {
      for (let i = 0; i < nextPlayers.length; i += 1) {
        const top = deck.shift();
        if (top) nextPlayers[i].hand.push(top);
      }
    }

    setPlayers(nextPlayers);
    setDrawPile(deck);
    setDiscardPile([]);
    setTurn(0);
    setPhase("draw");
    setActionsLeft(2);
    setSelectedHandIndex(null);
    setSelectedTarget(1);
    setWinner(null);
    setWinDrops([]);
    setShowMobileHand(false);
    setMessage("Your turn: Draw a card.");
    setStarted(true);
  };

  const launchWinDrops = useCallback(() => {
    const colors = ["#ff4d4d", "#ffd24d", "#4dd2ff", "#6fe06f", "#b084ff", "#ff9f43"];
    const drops = Array.from({ length: 110 }, (_, i) => ({
      id: i + Date.now(),
      left: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.8,
      duration: 2.2 + Math.random() * 1.6,
    }));
    setWinDrops(drops);
    setTimeout(() => setWinDrops([]), 4200);
  }, []);

  const consumeAction = () => {
    if (actionsLeft <= 1) {
      setActionsLeft(0);
      setPhase("discard");
      setMessage("Discard phase: keep 5 cards max.");
      return;
    }
    setActionsLeft((v) => v - 1);
  };

  const humanDraw = () => {
    if (!active || !isHumanTurn || phase !== "draw" || winner != null) return;
    const result = drawFromPiles(drawPile, discardPile, 1);
    const nextPlayers = [...players];
    nextPlayers[humanIndex] = { ...active, hand: [...active.hand, ...result.drawn] };
    setPlayers(nextPlayers);
    setDrawPile(result.draw);
    setDiscardPile(result.discard);
    setPhase("action");
    setActionsLeft(2);
    setMessage("Your Action phase: up to 2 actions.");
  };

  const humanPlace = () => {
    if (!active || !isHumanTurn || phase !== "action" || selectedHandIndex == null) return;
    const card = active.hand[selectedHandIndex];
    if (!card) return;
    if (!["lokasyon", "rehiyon", "paggalaw", "interaksyon"].includes(card.type)) return;
    if (!isMatch(active.place, card)) return;

    const slot = card.type as keyof Civilization;
    if (active.civ[slot]) return;

    const nextPlayers = [...players];
    const hand = [...active.hand];
    hand.splice(selectedHandIndex, 1);
    const nextCiv = { ...active.civ, [slot]: card };
    nextPlayers[humanIndex] = { ...active, hand, civ: nextCiv };

    setPlayers(nextPlayers);
    setSelectedHandIndex(null);
    setMessage(`Placed ${typeLabel(card.type)}.`);

    if (isWinning(nextCiv)) {
      setWinner(humanIndex);
      setShowMobileHand(false);
      setMessage("You win! Master Geographer!");
      launchWinDrops();
      return;
    }
    consumeAction();
  };

  const humanDisaster = () => {
    if (!active || !isHumanTurn || phase !== "action" || selectedHandIndex == null) return;
    const card = active.hand[selectedHandIndex];
    if (!card || card.type !== "disaster") return;
    if (!players[selectedTarget] || selectedTarget === humanIndex) return;

    const nextPlayers = [...players];
    const attacker = { ...nextPlayers[humanIndex], hand: [...nextPlayers[humanIndex].hand] };
    attacker.hand.splice(selectedHandIndex, 1);
    nextPlayers[humanIndex] = attacker;

    const defender = { ...nextPlayers[selectedTarget], hand: [...nextPlayers[selectedTarget].hand], civ: { ...nextPlayers[selectedTarget].civ } };
    const adaptIdx = defender.hand.findIndex((x) => x.type === "adaptation");
    const nextDiscard = [...discardPile, card];

    if (adaptIdx >= 0) {
      nextDiscard.push(defender.hand.splice(adaptIdx, 1)[0]);
      setMessage(`${defender.name} blocked your disaster.`);
    } else {
      setMessage(`${defender.name} has no Adaptation card. Civilization cards stay protected.`);
    }

    nextPlayers[selectedTarget] = defender;
    setPlayers(nextPlayers);
    setDiscardPile(nextDiscard);
    setSelectedHandIndex(null);
    consumeAction();
  };

  const humanTrade = () => {
    if (!active || !isHumanTurn || phase !== "action" || selectedHandIndex == null) return;
    const target = selectedTarget;
    if (!players[target] || target === humanIndex) return;
    const nextPlayers = [...players];
    const you = { ...nextPlayers[humanIndex], hand: [...nextPlayers[humanIndex].hand] };
    const cpu = { ...nextPlayers[target], hand: [...nextPlayers[target].hand] };
    if (!you.hand[selectedHandIndex] || cpu.hand.length === 0) return;

    const yourCard = you.hand.splice(selectedHandIndex, 1)[0];
    const rand = Math.floor(Math.random() * cpu.hand.length);
    const cpuCard = cpu.hand.splice(rand, 1)[0];
    you.hand.push(cpuCard);
    cpu.hand.push(yourCard);
    nextPlayers[humanIndex] = you;
    nextPlayers[target] = cpu;

    setPlayers(nextPlayers);
    setSelectedHandIndex(null);
    setMessage(`You traded with ${nextPlayers[target].name}.`);
    consumeAction();
  };

  const humanDiscard = () => {
    if (!active || !isHumanTurn || phase !== "discard" || selectedHandIndex == null) return;
    const nextPlayers = [...players];
    const hand = [...active.hand];
    const removed = hand.splice(selectedHandIndex, 1)[0];
    nextPlayers[humanIndex] = { ...active, hand };
    setPlayers(nextPlayers);
    setSelectedHandIndex(null);
    if (removed) setDiscardPile((prev) => [...prev, removed]);
  };

  const endHumanTurn = () => {
    if (!active || !isHumanTurn || phase !== "discard" || active.hand.length > 5) return;
    advanceTurn(players, drawPile, discardPile);
  };

  useEffect(() => {
    if (!started || winner != null || !active || active.isHuman) return;

    const t = setTimeout(() => {
      const cpuIdx = turn;
      const nextPlayers = [...players];
      let nextDraw = [...drawPile];
      let nextDiscard = [...discardPile];
      const cpu = { ...nextPlayers[cpuIdx], hand: [...nextPlayers[cpuIdx].hand], civ: { ...nextPlayers[cpuIdx].civ } };

      const drawnPack = drawFromPiles(nextDraw, nextDiscard, 2);
      cpu.hand.push(...drawnPack.drawn);
      nextDraw = drawnPack.draw;
      nextDiscard = drawnPack.discard;

      for (let i = 0; i < 2; i += 1) {
        const playableIdx = cpu.hand.findIndex((card) => {
          if (!["lokasyon", "rehiyon", "paggalaw", "interaksyon"].includes(card.type)) return false;
          const slot = card.type as keyof Civilization;
          return !cpu.civ[slot] && isMatch(cpu.place, card);
        });

        if (playableIdx >= 0) {
          const card = cpu.hand.splice(playableIdx, 1)[0];
          const slot = card.type as keyof Civilization;
          cpu.civ[slot] = card;
          if (isWinning(cpu.civ)) {
            nextPlayers[cpuIdx] = cpu;
            setPlayers(nextPlayers);
            setDrawPile(nextDraw);
            setDiscardPile(nextDiscard);
            setWinner(cpuIdx);
            setShowMobileHand(false);
            setMessage(`${cpu.name} wins.`);
            launchWinDrops();
            return;
          }
          continue;
        }

        const disasterIdx = cpu.hand.findIndex((card) => card.type === "disaster");
        if (disasterIdx >= 0) {
          const targetOrder = [0, 1, 2, 3].filter((x) => x !== cpuIdx);
          const targetIdx = targetOrder.find((x) => nextPlayers[x].civ.interaksyon) ?? targetOrder[0];
          const disaster = cpu.hand.splice(disasterIdx, 1)[0];
          const target = { ...nextPlayers[targetIdx], hand: [...nextPlayers[targetIdx].hand], civ: { ...nextPlayers[targetIdx].civ } };
          const adaptIdx = target.hand.findIndex((card) => card.type === "adaptation");
          nextDiscard.push(disaster);
          if (adaptIdx >= 0) {
            nextDiscard.push(target.hand.splice(adaptIdx, 1)[0]);
          }
          nextPlayers[targetIdx] = target;
        }
      }

      while (cpu.hand.length > 5) {
        nextDiscard.push(cpu.hand.pop() as Card);
      }

      nextPlayers[cpuIdx] = cpu;
      advanceTurn(nextPlayers, nextDraw, nextDiscard);
    }, 1000);

    return () => clearTimeout(t);
  }, [started, winner, active, turn, players, drawPile, discardPile, drawFromPiles, advanceTurn, launchWinDrops]);

  const rules = useMemo(() => [
    "You vs 3 players.",
    "You can only see your own cards.",
    "Each Player auto-plays in order.",
    "Win by completing: Lugar + Lokasyon + Rehiyon + Paggalaw + Interaksyon.",
  ], []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[url('/images/bg.png')] bg-cover bg-center bg-no-repeat p-3 pb-28 text-[#102031] md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(29,18,8,0.18)_0%,rgba(29,18,8,0.26)_100%)]" />
            {winner == null && isHumanTurn ? (
              <div className="fixed inset-x-0 bottom-0 z-[70] lg:hidden">
                <div className="mx-auto max-w-6xl px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                  <div className="flex items-center gap-2 rounded-2xl border border-[#b58f60] bg-[#efe4d2]/95 px-3 py-3 shadow-2xl backdrop-blur-sm">
                    {phase === "draw" ? (
                      <button
                        type="button"
                        onClick={humanDraw}
                        className="rounded-full bg-[#2f5d8a] px-4 py-2 text-sm font-bold text-white shadow-xl"
                      >
                        Draw card
                      </button>
                    ) : null}
                    {!showMobileHand ? (
                      <button
                        type="button"
                        onClick={toggleMobileHand}
                        className="rounded-full bg-[#1f5f3a] px-4 py-2 text-sm font-bold text-white shadow-xl"
                      >
                        Open Cards
                      </button>
                    ) : null}
                    {phase !== "draw" ? (
                      <p className="text-xs font-semibold text-[#5d3417]">
                        {showMobileHand ? "Cards are open for your turn." : "Open your hand to choose a card."}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

      <div className="mx-auto max-w-6xl rounded-3xl border border-[#b58f60] bg-[#efe4d2]/92 p-5 shadow-2xl backdrop-blur-[1px] md:p-7">
        <h1 className="text-3xl font-black tracking-tight">GEO-DECK Solo Mode</h1>
        <p className="mt-2 text-sm">1 player + 3 computer players (hidden CPU cards).</p>

        {!started ? <button type="button" onClick={setupGame} className="mt-5 rounded-full bg-[#2f5d8a] px-5 py-2 text-sm font-bold text-white">Start Game</button> : null}

        {started && active ? (
          <>
            <section className="mt-5 hidden gap-3 md:grid md:grid-cols-4">
              <div className="rounded-xl bg-[#2b567f] px-4 py-3 text-sm font-bold text-white">Turn: {active.name}</div>
              <div className="rounded-xl bg-[#2b567f] px-4 py-3 text-sm font-bold text-white">Phase: {phase.toUpperCase()}</div>
              <div className="rounded-xl bg-[#2b567f] px-4 py-3 text-sm font-bold text-white">Actions: {phase === "action" && isHumanTurn ? actionsLeft : "-"}</div>
              <div className="rounded-xl bg-[#2b567f] px-4 py-3 text-sm font-bold text-white">Draw/Discard: {drawPile.length}/{discardPile.length}</div>
            </section>

            <p className="mt-4 hidden rounded-xl bg-[#e2c8a6] px-4 py-3 text-sm font-semibold text-[#5d3417] md:block">{message}</p>

            <div className="sticky top-2 z-40 mt-5 lg:hidden">
              <div className="rounded-2xl border border-[#b58f60] bg-[#efe4d2]/95 p-3 shadow-xl backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-white">
                  <div className="rounded-xl bg-[#2b567f] px-3 py-2">Turn: {active.name}</div>
                  <div className="rounded-xl bg-[#2b567f] px-3 py-2">Phase: {phase.toUpperCase()}</div>
                  <div className="rounded-xl bg-[#2b567f] px-3 py-2">Actions: {phase === "action" && isHumanTurn ? actionsLeft : "-"}</div>
                  <div className="rounded-xl bg-[#2b567f] px-3 py-2">Draw/Discard: {drawPile.length}/{discardPile.length}</div>
                </div>
                <p className="mt-2 rounded-xl bg-[#e2c8a6] px-3 py-2 text-sm font-semibold text-[#5d3417]">{message}</p>
              </div>
            </div>

            <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.9fr)_minmax(320px,1fr)]">
              <section className="overflow-visible pb-3">
              <div className="relative mx-auto w-full max-w-[1020px] px-2 pb-4 pt-4 md:px-[170px] md:pb-[210px] md:pt-[210px] 2xl:px-[190px]">
              <div className="relative mx-auto aspect-[16/9] w-full max-w-[820px] rounded-[3rem] border-[10px] border-[#8b4e2a] bg-[radial-gradient(circle_at_12%_12%,#87c8e8_0%,#3d80b2_24%,#244a70_50%,#152840_100%)] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:p-5">
              <div className="absolute inset-[18px] rounded-[2.3rem] bg-[radial-gradient(circle_at_50%_45%,#0d8946_0%,#066735_45%,#04592e_70%,#034b27_100%)] shadow-[inset_0_0_0_2px_rgba(255,255,255,0.16),inset_0_0_45px_rgba(0,0,0,0.35)]" />
              <div className="pointer-events-none absolute inset-[54px] rounded-[999px] border border-[#013f20]/60" />
              <div className="pointer-events-none absolute inset-x-[23%] top-[22%] h-[56%] rounded-[999px] border border-[#013f20]/50" />
              <div className="pointer-events-none absolute left-[16%] top-[19%] text-3xl opacity-90">🌍</div>
              <div className="pointer-events-none absolute right-[19%] top-[20%] text-3xl opacity-90">🧭</div>
              <div className="pointer-events-none absolute bottom-[18%] left-[16%] text-3xl opacity-90">🗺️</div>
              <div className="pointer-events-none absolute bottom-[17%] right-[17%] text-3xl opacity-90">📍</div>
              {winDrops.map((drop) => (
                <span
                  key={drop.id}
                  className="pointer-events-none absolute top-0 z-50 h-3 w-2 rounded-sm"
                  style={{
                    left: `${drop.left}%`,
                    backgroundColor: drop.color,
                    animation: `geoDrop ${drop.duration}s linear ${drop.delay}s forwards`,
                  }}
                />
              ))}

              <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-56 w-56 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[#e6c293] bg-[#f4e2c7]/95 shadow-2xl md:flex">
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#6e4a2f]">Center Table</p>
                  <p className="mt-2 text-sm font-extrabold text-[#1f3550]">Draw: {drawPile.length}</p>
                  <p className="text-sm font-extrabold text-[#1f3550]">Discard: {discardPile.length}</p>
                </div>
              </div>
              <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-[120px] -translate-y-[74px] rotate-[-18deg] md:block">
                <div className="h-24 w-16 rounded-lg border-2 border-white bg-[repeating-linear-gradient(135deg,#2f5d8a_0_6px,#3f74a8_6px_12px)] shadow-xl" />
              </div>
              <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-[40px] -translate-y-[88px] rotate-[10deg] md:block">
                <div className="h-24 w-16 rounded-lg border-2 border-white bg-[repeating-linear-gradient(135deg,#2f5d8a_0_6px,#3f74a8_6px_12px)] shadow-xl" />
              </div>
              <div className="pointer-events-none absolute left-1/2 top-1/2 hidden translate-x-[74px] translate-y-[40px] md:block">
                <div className="h-8 w-8 rounded-full border-2 border-white bg-[#ffb703] shadow-lg" />
              </div>
              <div className="pointer-events-none absolute left-1/2 top-1/2 hidden translate-x-[102px] translate-y-[52px] md:block">
                <div className="h-8 w-8 rounded-full border-2 border-white bg-[#fb5607] shadow-lg" />
              </div>
              <div className="pointer-events-none absolute left-1/2 top-1/2 hidden translate-x-[130px] translate-y-[36px] md:block">
                <div className="h-8 w-8 rounded-full border-2 border-white bg-[#8338ec] shadow-lg" />
              </div>

              {players.map((p, idx) => (
                <div
                  key={p.id}
                  className={`relative z-20 rounded-2xl border p-4 shadow-xl ${idx === turn ? "border-[#2f6fa7] bg-[#e7f2fe]" : "border-[#ba9b76] bg-[#f7f0e4]"} md:absolute ${
                    idx === 0
                      ? "md:bottom-0 md:left-1/2 md:w-[30%] md:min-w-[210px] md:-translate-x-1/2 md:translate-y-[calc(100%+22px)]"
                      : idx === 1
                        ? "md:right-0 md:top-1/2 md:w-[24%] md:min-w-[190px] md:-translate-y-1/2 md:translate-x-[calc(100%+22px)]"
                        : idx === 2
                          ? "md:top-0 md:left-1/2 md:w-[30%] md:min-w-[210px] md:-translate-x-1/2 md:-translate-y-[calc(100%+22px)]"
                          : "md:left-0 md:top-1/2 md:w-[24%] md:min-w-[190px] md:-translate-y-1/2 md:-translate-x-[calc(100%+22px)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">{p.name}</h2>
                    <span className="text-xs font-semibold">Hand: {p.isHuman ? p.hand.length : `${p.hand.length} cards`}</span>
                  </div>
                  <p className="mt-1 text-sm"><span className="font-semibold">Lugar:</span> {p.place.name}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-[#dfccb2] p-2">Lokasyon: {p.civ.lokasyon?.title ?? "-"}</div>
                    <div className="rounded-lg bg-[#dfccb2] p-2">Rehiyon: {p.civ.rehiyon?.title ?? "-"}</div>
                    <div className="rounded-lg bg-[#dfccb2] p-2">Paggalaw: {p.civ.paggalaw?.title ?? "-"}</div>
                    <div className="rounded-lg bg-[#dfccb2] p-2">Interaksyon: {p.civ.interaksyon?.title ?? "-"}</div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs italic text-slate-600">{p.isHuman ? "Your hand on table" : "Player hand hidden"}</p>
                    <div className="relative mt-2 h-24 w-full overflow-visible">
                      {Array.from({ length: Math.min(p.hand.length, 7) }).map((_, i) => {
                        const centered = i - Math.floor(Math.min(p.hand.length, 7) / 2);
                        return (
                          <div
                            key={`${p.id}-back-${i}`}
                            style={cardBackStyle(centered)}
                            className="absolute left-[44%] top-1 h-20 w-14 -translate-x-1/2 rounded-xl border-2 border-white bg-[radial-gradient(circle_at_30%_22%,#ffffff_0%,#f5f5f5_22%,transparent_23%),linear-gradient(135deg,#f94144_0%,#f3722c_24%,#f9c74f_48%,#43aa8b_72%,#577590_100%)] shadow-lg"
                          >
                            <div className="mx-auto mt-5 h-9 w-9 rounded-full border-2 border-white/95 bg-[#1f2a44]/75 text-center text-[10px] font-black leading-9 text-white">
                              UNO
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
              </div>
              </div>
              </section>

              <aside className="hidden rounded-2xl border border-[#ba9b76] bg-[#f7f0e4] p-4 shadow-xl xl:block">
                <h3 className="text-lg font-bold">Your Card Choices</h3>
                <p className="mt-1 text-xs text-[#5f4c36]">Select a card on the right panel, then use action buttons below.</p>
                <div className="mt-3 max-h-[620px] overflow-y-auto pr-1">
                  <div className="grid grid-cols-1 gap-3">
                    {players[0]?.hand.map((card, idx) => renderHandCard(card, idx))}
                  </div>
                  {players[0]?.hand.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-[#8e6b48] bg-[#efe1cd] p-3 text-xs text-[#5f4c36]">No cards in hand.</p>
                  ) : null}
                </div>

                {winner == null && isHumanTurn ? (
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#d7c2a3] pt-4">
                    {phase === "draw" ? <button type="button" onClick={humanDraw} className="rounded-full bg-[#2f5d8a] px-4 py-2 text-sm font-bold text-white">Draw card</button> : null}
                    {phase === "action" ? (
                      <>
                        <button type="button" onClick={humanPlace} className="rounded-full bg-[#2f6fa7] px-4 py-2 text-sm font-bold text-white">Place Card</button>
                        <button type="button" onClick={humanTrade} className="rounded-full bg-[#6e4a2f] px-4 py-2 text-sm font-bold text-white">Trade with Player {selectedTarget}</button>
                        <select className="rounded-lg border border-[#8e6b48] bg-[#f7f0e4] px-2 py-2 text-sm" value={selectedTarget} onChange={(e) => setSelectedTarget(Number(e.target.value))}>
                          <option value={1}>Player 1</option><option value={2}>Player 2</option><option value={3}>Player 3</option>
                        </select>
                        <button type="button" onClick={humanDisaster} className="rounded-full bg-[#8a4b2f] px-4 py-2 text-sm font-bold text-white">Disaster Attack</button>
                      </>
                    ) : null}
                    {phase === "discard" ? (
                      <>
                        <button type="button" onClick={humanDiscard} className="rounded-full bg-[#8a5a2f] px-4 py-2 text-sm font-bold text-white">Discard Selected</button>
                        <button type="button" onClick={endHumanTurn} className="rounded-full bg-[#2b567f] px-4 py-2 text-sm font-bold text-white">End Turn</button>
                      </>
                    ) : null}
                  </div>
                ) : null}
              </aside>
            </section>

            {showMobileHand ? (
              <div className="fixed inset-0 z-[80] bg-black/55 p-3 lg:hidden">
                <section className="mx-auto flex h-[calc(100dvh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-[#ba9b76] bg-[#f7f0e4] shadow-2xl">
                  <div className="flex items-center justify-between border-b border-[#d7c2a3] px-4 py-3">
                    <h3 className="text-lg font-bold">Your Cards</h3>
                    <button type="button" onClick={() => setShowMobileHand(false)} className="rounded-full bg-[#6e4a2f] px-3 py-1 text-xs font-bold text-white">Close</button>
                  </div>
                  <p className="px-4 pt-2 text-xs text-[#5f4c36]">Mobile mode: cards are shown in this modal for easier play.</p>
                  <div className="mt-2 grid min-h-0 flex-1 auto-rows-min content-start grid-cols-1 gap-3 overflow-y-auto px-4 pb-3 pr-4 min-[420px]:grid-cols-2">
                    {players[0]?.hand.map((card, idx) => renderHandCard(card, idx, true))}
                    {players[0]?.hand.length === 0 ? (
                      <p className="col-span-full rounded-lg border border-dashed border-[#8e6b48] bg-[#efe1cd] p-3 text-xs text-[#5f4c36]">No cards in hand.</p>
                    ) : null}
                  </div>
                  {winner == null && isHumanTurn ? (
                    <div className="shrink-0 flex flex-wrap items-center gap-2 border-t border-[#d7c2a3] bg-[#f7f0e4] px-4 py-3">
                      {phase === "draw" ? (
                        <button type="button" onClick={humanDraw} className="rounded-full bg-[#2f5d8a] px-4 py-2 text-sm font-bold text-white">
                          Draw card
                        </button>
                      ) : null}
                      {phase === "action" ? (
                        <>
                          <button type="button" onClick={humanPlace} className="rounded-full bg-[#2f6fa7] px-4 py-2 text-sm font-bold text-white">Place Card</button>
                          <button type="button" onClick={humanTrade} className="rounded-full bg-[#6e4a2f] px-4 py-2 text-sm font-bold text-white">Trade with Player {selectedTarget}</button>
                          <select className="rounded-lg border border-[#8e6b48] bg-[#f7f0e4] px-2 py-2 text-sm" value={selectedTarget} onChange={(e) => setSelectedTarget(Number(e.target.value))}>
                            <option value={1}>Player 1</option><option value={2}>Player 2</option><option value={3}>Player 3</option>
                          </select>
                          <button type="button" onClick={humanDisaster} className="rounded-full bg-[#8a4b2f] px-4 py-2 text-sm font-bold text-white">Disaster Attack</button>
                        </>
                      ) : null}
                      {phase === "discard" ? (
                        <>
                          <button type="button" onClick={humanDiscard} className="rounded-full bg-[#8a5a2f] px-4 py-2 text-sm font-bold text-white">Discard Selected</button>
                          <button type="button" onClick={endHumanTurn} className="rounded-full bg-[#2b567f] px-4 py-2 text-sm font-bold text-white">End Turn</button>
                        </>
                      ) : null}
                    </div>
                  ) : null}
                </section>
              </div>
            ) : null}

            {winner != null ? (
              <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/45 p-4">
                <div className="w-full max-w-md">
                  <section className="w-full rounded-3xl border-2 border-[#d9b68b] bg-[#f7e8d4] p-7 text-center shadow-2xl">
                    <h3 className="text-3xl font-black text-[#1f3550]">{winner === 0 ? `You Win ${players[winner].name}` : `${players[winner].name} Wins`}</h3>
                    <button type="button" onClick={setupGame} className="mt-5 rounded-full bg-[#2f5d8a] px-6 py-3 text-sm font-bold text-white">Play Again</button>
                  </section>
                </div>
              </div>
            ) : null}


          </>
        ) : null}

        <section className="mt-6 rounded-2xl bg-[#dfccb2] p-4 text-sm">
          <h3 className="font-bold">Rules</h3>
          <ul className="mt-2 list-disc pl-5">{rules.map((r) => <li key={r}>{r}</li>)}</ul>
        </section>
      </div>
      <style jsx global>{`
        @media (max-width: 1023px) and (orientation: portrait) {
          html, body {
            min-height: 100%;
          }
        }

        @keyframes geoDrop {
          0% { transform: translateY(-12px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(92vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </main>
  );
}
