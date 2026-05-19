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
  c("rehiyon", "Mountain Belt", "Magkakaugnay na kabundukang rehiyon.", ["mountain", "asia", "south-america"]),
  c("rehiyon", "Dry Zone", "Rehiyon ng matitinding tuyong klima.", ["desert", "arid", "africa", "asia"]),
  c("paggalaw", "Caravan Route", "Paggalaw sa tuyong ruta ng kalakalan.", ["desert", "arid"]),
  c("paggalaw", "Coastal Navigation", "Paggalaw at kalakalan sa baybaying dagat.", ["coastal", "ocean", "island"]),
  c("paggalaw", "Glacier Trail", "Paglalakbay sa malamig na bulubundukin.", ["mountain", "cold", "polar"]),
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
  const duplicate = <T,>(arr: T[], count: number): T[] => Array.from({ length: count }, () => arr).flat();
  const raw = [
    ...duplicate(COMPONENTS, 3),
    ...duplicate(INTERACTIONS, 3),
    ...duplicate(DISASTERS, 2),
    ...duplicate(ADAPTATIONS, 2),
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

function cardFrame(type: CardType): string {
  if (type === "disaster") return "from-[#a76b3d] to-[#7a4121] text-white border-[#7a4121]";
  if (type === "adaptation") return "from-[#2e5d8a] to-[#1f456a] text-white border-[#173650]";
  return "from-[#efe3cf] to-[#dcc09b] text-[#1f2b38] border-[#9f7b54]";
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
  const [winDrops, setWinDrops] = useState<Array<{ id: number; left: number; color: string; delay: number; duration: number }>>([]);

  const active = players[turn];
  const humanIndex = 0;
  const isHumanTurn = Boolean(active?.isHuman);

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
    setMessage(`${nextPlayers[nt].name} turn: Draw phase.`);
  }, [turn]);

  const setupGame = () => {
    const placePool = shuffle(PLACES).slice(0, 4);
    const deck = buildDeck();
    const nextPlayers: Player[] = [
      { id: 0, name: "Player 1", isHuman: true, place: placePool[0], hand: [], civ: {} },
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
    setMessage("Your turn: Draw 2 cards.");
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
    const result = drawFromPiles(drawPile, discardPile, 2);
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_15%_0%,#4f79a7_0%,#254c72_45%,#1b3550_100%)] p-5 text-[#102031] md:p-8">
      <div className="mx-auto max-w-6xl rounded-3xl border border-[#9c784f] bg-[#efe4d2] p-5 shadow-2xl md:p-7">
        <h1 className="text-3xl font-black tracking-tight">GEO-DECK Solo Mode</h1>
        <p className="mt-2 text-sm">1 player + 3 computer players (hidden CPU cards).</p>

        {!started ? <button type="button" onClick={setupGame} className="mt-5 rounded-full bg-[#2f5d8a] px-5 py-2 text-sm font-bold text-white">Start Game</button> : null}

        {started && active ? (
          <>
            <section className="mt-5 grid gap-3 md:grid-cols-4">
              <div className="rounded-xl bg-[#2b567f] px-4 py-3 text-sm font-bold text-white">Turn: {active.name}</div>
              <div className="rounded-xl bg-[#2b567f] px-4 py-3 text-sm font-bold text-white">Phase: {phase.toUpperCase()}</div>
              <div className="rounded-xl bg-[#2b567f] px-4 py-3 text-sm font-bold text-white">Actions: {phase === "action" && isHumanTurn ? actionsLeft : "-"}</div>
              <div className="rounded-xl bg-[#2b567f] px-4 py-3 text-sm font-bold text-white">Draw/Discard: {drawPile.length}/{discardPile.length}</div>
            </section>

            <p className="mt-4 rounded-xl bg-[#e2c8a6] px-4 py-3 text-sm font-semibold text-[#5d3417]">{message}</p>

            <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(330px,1fr)]">
              <section className="relative rounded-[3rem] border-[10px] border-[#8b4e2a] bg-[linear-gradient(145deg,#b66a37_0%,#8c4d27_45%,#6f3b1f_100%)] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)] md:h-[920px] md:p-5">
              <div className="absolute inset-[18px] rounded-[2.3rem] bg-[radial-gradient(circle_at_50%_45%,#5ad0ff_0%,#1d7bb2_38%,#155f8f_65%,#114f79_100%)] shadow-[inset_0_0_0_2px_rgba(255,255,255,0.2),inset_0_0_40px_rgba(0,0,0,0.35)]" />
              <div className="pointer-events-none absolute inset-[54px] rounded-[999px] border border-[#0f4467]/45" />
              <div className="pointer-events-none absolute inset-x-[23%] top-[22%] h-[56%] rounded-[999px] border border-[#0f4467]/35" />
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
                  className={`relative z-10 rounded-2xl border p-4 shadow-xl ${idx === turn ? "border-[#2f6fa7] bg-[#e7f2fe]" : "border-[#ba9b76] bg-[#f7f0e4]"} md:absolute ${
                    idx === 0
                      ? "md:bottom-3 md:left-1/2 md:w-[40%] md:-translate-x-1/2"
                      : idx === 1
                        ? "md:right-3 md:top-1/2 md:w-[30%] md:-translate-y-1/2"
                        : idx === 2
                          ? "md:left-1/2 md:top-3 md:w-[40%] md:-translate-x-1/2"
                          : "md:left-3 md:top-1/2 md:w-[30%] md:-translate-y-1/2"
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
                  {!p.isHuman ? (
                    <div className="mt-3">
                      <p className="text-xs italic text-slate-600">Player hand hidden</p>
                      <div className="relative mt-2 h-24 w-full overflow-visible">
                        {Array.from({ length: Math.min(p.hand.length, 7) }).map((_, i) => {
                          const centered = i - Math.floor(Math.min(p.hand.length, 7) / 2);
                          return (
                            <div
                              key={`${p.id}-back-${i}`}
                              style={cardBackStyle(centered)}
                              className="absolute left-[44%] top-1 h-20 w-14 -translate-x-1/2 rounded-lg border-2 border-white bg-[repeating-linear-gradient(135deg,#2f5d8a_0_6px,#3f74a8_6px_12px)] shadow-md"
                            />
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
              </section>

              <aside className="rounded-2xl border border-[#ba9b76] bg-[#f7f0e4] p-4 shadow-xl">
                <h3 className="text-lg font-bold">Your Card Choices</h3>
                <p className="mt-1 text-xs text-[#5f4c36]">Select a card on the right panel, then use action buttons below.</p>
                <div className="mt-3 max-h-[620px] space-y-2 overflow-y-auto pr-1">
                  {players[0]?.hand.map((card, idx) => (
                    <button
                      key={`${card.id}-${idx}`}
                      type="button"
                      onClick={() => setSelectedHandIndex(idx)}
                      className={`w-full rounded-xl border-2 bg-gradient-to-b p-3 text-left shadow-sm transition hover:-translate-y-0.5 ${cardFrame(card.type)} ${selectedHandIndex === idx ? "ring-4 ring-[#2f6fa7]" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-extrabold uppercase tracking-wide">{typeLabel(card.type)}</p>
                        <span className="text-[10px] font-bold opacity-90">Card {idx + 1}</span>
                      </div>
                      <p className="mt-1 text-base font-black leading-tight">{card.title}</p>
                      <p className="mt-1 text-xs leading-snug opacity-90">{card.text}</p>
                    </button>
                  ))}
                  {players[0]?.hand.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-[#8e6b48] bg-[#efe1cd] p-3 text-xs text-[#5f4c36]">No cards in hand.</p>
                  ) : null}
                </div>

                {winner == null && isHumanTurn ? (
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#d7c2a3] pt-4">
                    {phase === "draw" ? <button type="button" onClick={humanDraw} className="rounded-full bg-[#2f5d8a] px-4 py-2 text-sm font-bold text-white">Draw 2</button> : null}
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

            {winner != null ? (
              <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/45 p-4">
                <section className="w-full max-w-md rounded-3xl border-2 border-[#d9b68b] bg-[#f7e8d4] p-7 text-center shadow-2xl">
                  <h3 className="text-3xl font-black text-[#1f3550]">{winner === 0 ? `You Win ${players[winner].name}` : `${players[winner].name} Wins`}</h3>
                  <button type="button" onClick={setupGame} className="mt-5 rounded-full bg-[#2f5d8a] px-6 py-3 text-sm font-bold text-white">Play Again</button>
                </section>
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
        @keyframes geoDrop {
          0% { transform: translateY(-12px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(92vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </main>
  );
}
