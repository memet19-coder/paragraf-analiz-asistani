import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownUp,
  Brain,
  CheckCircle2,
  CircleDot,
  Eye,
  Grid3X3,
  Layers3,
  Medal,
  RotateCcw,
  Search,
  Shapes,
  Sigma,
  Sparkles,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import "./styles.css";

const STORAGE_KEY = "odak-atolyesi-progress";
const MAX_LEVEL = 10;
const LEVEL_UP_STREAK = 3;

const colors = [
  { name: "Kırmızı", hex: "#dc2626", bg: "bg-red-500" },
  { name: "Mavi", hex: "#2563eb", bg: "bg-blue-500" },
  { name: "Yeşil", hex: "#059669", bg: "bg-emerald-500" },
  { name: "Sarı", hex: "#ca8a04", bg: "bg-yellow-500" },
  { name: "Mor", hex: "#7c3aed", bg: "bg-violet-500" },
  { name: "Turuncu", hex: "#ea580c", bg: "bg-orange-500" },
];

const shapeSymbols = ["●", "▲", "■", "◆", "★", "⬟"];
const arrows = ["↑", "↓", "←", "→"];
const letters = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");

const exercises = [
  { id: "renk", title: "Renk Seçici", skill: "seçici dikkat", icon: Eye, tone: "emerald" },
  { id: "dizi", title: "Sayı Hafızası", skill: "kısa süreli hafıza", icon: Brain, tone: "blue" },
  { id: "harf", title: "Harf Avı", skill: "görsel tarama", icon: Search, tone: "amber" },
  { id: "sekil", title: "Şekil Sayacı", skill: "ayrıntı takibi", icon: Shapes, tone: "violet" },
  { id: "yon", title: "Yön Takibi", skill: "dikkat sürdürme", icon: ArrowDownUp, tone: "sky" },
  { id: "fark", title: "Fark Bulucu", skill: "karşılaştırma", icon: Layers3, tone: "rose" },
  { id: "toplam", title: "Toplam Çifti", skill: "zihinsel işlem", icon: Sigma, tone: "teal" },
  { id: "kelime", title: "Kelime Odağı", skill: "sınıflama", icon: CircleDot, tone: "lime" },
  { id: "kod", title: "Kod Hafızası", skill: "eşleme", icon: Grid3X3, tone: "indigo" },
  { id: "desen", title: "Desen Tamamla", skill: "örüntü takibi", icon: Target, tone: "orange" },
];

const toneStyles = {
  emerald: { soft: "bg-emerald-50 text-emerald-700", line: "bg-emerald-500", border: "border-emerald-200" },
  blue: { soft: "bg-blue-50 text-blue-700", line: "bg-blue-500", border: "border-blue-200" },
  amber: { soft: "bg-amber-50 text-amber-700", line: "bg-amber-500", border: "border-amber-200" },
  violet: { soft: "bg-violet-50 text-violet-700", line: "bg-violet-500", border: "border-violet-200" },
  sky: { soft: "bg-sky-50 text-sky-700", line: "bg-sky-500", border: "border-sky-200" },
  rose: { soft: "bg-rose-50 text-rose-700", line: "bg-rose-500", border: "border-rose-200" },
  teal: { soft: "bg-teal-50 text-teal-700", line: "bg-teal-500", border: "border-teal-200" },
  lime: { soft: "bg-lime-50 text-lime-800", line: "bg-lime-500", border: "border-lime-200" },
  indigo: { soft: "bg-indigo-50 text-indigo-700", line: "bg-indigo-500", border: "border-indigo-200" },
  orange: { soft: "bg-orange-50 text-orange-700", line: "bg-orange-500", border: "border-orange-200" },
};

const categorySets = [
  { name: "Hayvan", words: ["kedi", "köpek", "kuş", "balık", "at", "arı"], distractors: ["masa", "kalem", "defter", "kapı"] },
  { name: "Meyve", words: ["elma", "armut", "muz", "kiraz", "üzüm", "şeftali"], distractors: ["kitap", "çanta", "bulut", "tahta"] },
  { name: "Renk", words: ["mavi", "yeşil", "sarı", "mor", "turuncu", "beyaz"], distractors: ["şehir", "yol", "ders", "oyun"] },
  { name: "Okul eşyası", words: ["kalem", "silgi", "defter", "cetvel", "kitap"], distractors: ["elma", "bulut", "kedi", "deniz"] },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function unique(items) {
  return [...new Set(items)];
}

function option(text, correct = false, visual = null) {
  return { id: crypto.randomUUID(), text, correct, visual };
}

function makeNumberOptions(correct, min = 0, max = 30) {
  const values = new Set([correct]);
  let distance = 1;

  while (values.size < 4) {
    values.add(clamp(correct + distance, min, max));
    if (values.size < 4) values.add(clamp(correct - distance, min, max));
    distance += 1;
  }

  return shuffle([...values]).map((value) => option(String(value), value === correct));
}

function makeProgress() {
  return exercises.reduce((progress, exercise) => {
    progress[exercise.id] = { level: 1, bestLevel: 1, correct: 0, attempts: 0, streak: 0 };
    return progress;
  }, {});
}

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return { ...makeProgress(), ...saved };
  } catch {
    return makeProgress();
  }
}

function generateExercise(exerciseId, level) {
  const safeLevel = clamp(level, 1, MAX_LEVEL);

  if (exerciseId === "renk") return generateColorTask(safeLevel);
  if (exerciseId === "dizi") return generateSequenceTask(safeLevel);
  if (exerciseId === "harf") return generateLetterTask(safeLevel);
  if (exerciseId === "sekil") return generateShapeTask(safeLevel);
  if (exerciseId === "yon") return generateDirectionTask(safeLevel);
  if (exerciseId === "fark") return generateDifferenceTask(safeLevel);
  if (exerciseId === "toplam") return generateSumTask(safeLevel);
  if (exerciseId === "kelime") return generateWordTask(safeLevel);
  if (exerciseId === "kod") return generateCodeTask(safeLevel);
  return generatePatternTask(safeLevel);
}

function generateColorTask(level) {
  const ink = randomItem(colors);
  const word = randomItem(colors.filter((color) => color.name !== ink.name));
  const optionColors = [ink, ...shuffle(colors.filter((color) => color.name !== ink.name)).slice(0, 3 + Math.min(1, Math.floor(level / 5)))];

  return {
    prompt: "Yazının rengini seç.",
    display: { type: "stroop", word: word.name, color: ink.hex },
    options: shuffle(optionColors).map((color) => option(color.name, color.name === ink.name)),
    answerText: ink.name,
  };
}

function generateSequenceTask(level) {
  const length = clamp(3 + Math.floor(level / 2), 3, 8);
  const sequence = Array.from({ length }, () => String(Math.floor(Math.random() * 9) + 1));
  const wrong = Array.from({ length: 3 }, (_, index) => {
    const copy = [...sequence];
    const pos = (index + level) % copy.length;
    copy[pos] = String(((Number(copy[pos]) + index + 2) % 9) + 1);
    return copy.join(" ");
  });

  return {
    prompt: "Diziyi aklında tut, sonra aynı diziyi seç.",
    display: { type: "memory", items: sequence },
    preview: true,
    options: shuffle([sequence.join(" "), ...wrong]).map((text) => option(text, text === sequence.join(" "))),
    answerText: sequence.join(" "),
  };
}

function generateLetterTask(level) {
  const target = randomItem(letters);
  const size = clamp(20 + level * 3, 20, 52);
  const targetCount = clamp(2 + Math.floor(level / 2), 2, 8);
  const grid = Array.from({ length: size }, () => randomItem(letters.filter((letter) => letter !== target)));
  const positions = shuffle(Array.from({ length: size }, (_, index) => index)).slice(0, targetCount);
  positions.forEach((index) => {
    grid[index] = target;
  });

  return {
    prompt: `${target} harfi kaç kez geçiyor?`,
    display: { type: "letterGrid", items: grid, target },
    options: makeNumberOptions(targetCount, 0, 12),
    answerText: String(targetCount),
  };
}

function generateShapeTask(level) {
  const shape = randomItem(shapeSymbols);
  const color = randomItem(colors);
  const size = clamp(16 + level * 3, 16, 46);
  const count = clamp(2 + Math.floor(level / 2), 2, 8);
  const items = Array.from({ length: size }, () => {
    const nextShape = randomItem(shapeSymbols);
    const nextColor = randomItem(colors);
    return nextShape === shape && nextColor.name === color.name ? { shape: randomItem(shapeSymbols.filter((item) => item !== shape)), color: nextColor } : { shape: nextShape, color: nextColor };
  });
  shuffle(Array.from({ length: size }, (_, index) => index))
    .slice(0, count)
    .forEach((index) => {
      items[index] = { shape, color };
    });

  return {
    prompt: `${color.name} ${shape} kaç tane?`,
    display: { type: "shapeGrid", items },
    options: makeNumberOptions(count, 0, 12),
    answerText: String(count),
  };
}

function generateDirectionTask(level) {
  const target = randomItem(arrows);
  const size = clamp(14 + level * 2, 14, 38);
  const items = Array.from({ length: size }, () => randomItem(arrows));
  const count = items.filter((item) => item === target).length;

  return {
    prompt: `${target} yön oku kaç kez geçiyor?`,
    display: { type: "arrowRow", items, target },
    options: makeNumberOptions(count, 0, 20),
    answerText: String(count),
  };
}

function generateDifferenceTask(level) {
  const size = clamp(8 + level, 8, 18);
  const left = Array.from({ length: size }, () => randomItem(shapeSymbols));
  const right = [...left];
  const changeCount = clamp(1 + Math.floor(level / 3), 1, 5);

  shuffle(Array.from({ length: size }, (_, index) => index))
    .slice(0, changeCount)
    .forEach((index) => {
      right[index] = randomItem(shapeSymbols.filter((shape) => shape !== left[index]));
    });

  return {
    prompt: "İki sırada kaç farklı konum var?",
    display: { type: "pairRows", left, right },
    options: makeNumberOptions(changeCount, 0, 8),
    answerText: String(changeCount),
  };
}

function generateSumTask(level) {
  const target = 8 + level * 2 + Math.floor(Math.random() * 6);
  const first = Math.floor(target / 2) + Math.floor(Math.random() * 3) - 1;
  const correctPair = [clamp(first, 1, target - 1), target - clamp(first, 1, target - 1)];
  const wrongPairs = [];

  while (wrongPairs.length < 3) {
    const a = Math.floor(Math.random() * (target + 4)) + 1;
    const b = Math.floor(Math.random() * (target + 4)) + 1;
    const text = `${a} + ${b}`;

    if (a + b !== target && !wrongPairs.some((pair) => `${pair[0]} + ${pair[1]}` === text)) {
      wrongPairs.push([a, b]);
    }
  }

  return {
    prompt: `Toplamı ${target} olan çifti seç.`,
    display: { type: "targetNumber", value: target },
    options: shuffle([correctPair, ...wrongPairs]).map((pair) => option(`${pair[0]} + ${pair[1]}`, pair[0] + pair[1] === target)),
    answerText: `${correctPair[0]} + ${correctPair[1]}`,
  };
}

function generateWordTask(level) {
  const category = randomItem(categorySets);
  const correctWord = randomItem(category.words);
  const options = unique([correctWord, ...shuffle(category.distractors).slice(0, 3 + Math.floor(level / 5))]).slice(0, 4);

  return {
    prompt: `${category.name} grubuna ait olan kelimeyi seç.`,
    display: { type: "wordFocus", label: category.name },
    options: shuffle(options).map((text) => option(text, text === correctWord)),
    answerText: correctWord,
  };
}

function generateCodeTask(level) {
  const mapShapes = shuffle(shapeSymbols).slice(0, 4);
  const codes = shuffle(["1", "2", "3", "4", "5", "6"]).slice(0, 4);
  const codeMap = mapShapes.map((shape, index) => ({ shape, code: codes[index] }));
  const length = clamp(3 + Math.floor(level / 3), 3, 6);
  const sequence = Array.from({ length }, () => randomItem(codeMap));
  const correct = sequence.map((item) => item.code).join("");
  const wrong = Array.from({ length: 3 }, (_, index) => {
    const chars = correct.split("");
    const pos = index % chars.length;
    chars[pos] = codes[(codes.indexOf(chars[pos]) + index + 1) % codes.length];
    return chars.join("");
  });

  return {
    prompt: "Şekil dizisinin kodunu seç.",
    display: { type: "code", codeMap, sequence },
    options: shuffle([correct, ...wrong]).map((text) => option(text, text === correct)),
    answerText: correct,
  };
}

function generatePatternTask(level) {
  const base = shuffle(shapeSymbols).slice(0, clamp(2 + Math.floor(level / 4), 2, 4));
  const length = clamp(5 + Math.floor(level / 2), 5, 9);
  const sequence = Array.from({ length }, (_, index) => base[index % base.length]);
  const correct = base[length % base.length];

  return {
    prompt: "Desende sıradaki şekli seç.",
    display: { type: "pattern", items: sequence },
    options: shuffle(shapeSymbols.slice(0, 4).includes(correct) ? shapeSymbols.slice(0, 4) : [correct, ...shapeSymbols.slice(0, 3)]).map((shape) =>
      option(shape, shape === correct, { shape }),
    ),
    answerText: correct,
  };
}

function ExerciseCard({ active, exercise, progress, onClick }) {
  const Icon = exercise.icon;
  const accuracy = progress.attempts > 0 ? Math.round((progress.correct / progress.attempts) * 100) : 0;
  const tone = toneStyles[exercise.tone] || toneStyles.blue;

  return (
    <button
      className={`group relative overflow-hidden rounded-lg border p-4 text-left shadow-sm transition ${
        active ? "border-slate-950 bg-slate-950 text-white shadow-md" : `${tone.border} bg-white text-slate-900 hover:-translate-y-0.5 hover:shadow-md`
      }`}
      onClick={onClick}
      type="button"
    >
      <span className={`absolute inset-x-0 top-0 h-1 ${active ? tone.line : "bg-slate-100"}`} />
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-lg ${active ? "bg-white/15" : tone.soft}`}>
          <Icon size={20} />
        </span>
        <span className={`rounded-md px-2 py-1 text-xs font-bold ${active ? "bg-white text-slate-950" : "bg-slate-100 text-slate-700"}`}>
          Seviye {progress.level}
        </span>
      </div>
      <h3 className="text-sm font-bold">{exercise.title}</h3>
      <p className={`mt-1 text-xs ${active ? "text-slate-200" : "text-slate-500"}`}>{exercise.skill}</p>
      <div className={`mt-3 h-2 rounded-full ${active ? "bg-white/15" : "bg-slate-100"}`}>
        <div className={`h-full rounded-full ${active ? "bg-emerald-300" : tone.line}`} style={{ width: `${progress.streak * 33.33}%` }} />
      </div>
      <p className={`mt-2 text-xs ${active ? "text-slate-200" : "text-slate-500"}`}>{progress.attempts} deneme · %{accuracy} başarı</p>
    </button>
  );
}

function ChallengeDisplay({ challenge, phase }) {
  const display = challenge.display;

  if (display.type === "stroop") {
    return (
      <div className="grid min-h-48 place-items-center rounded-lg border border-slate-200 bg-white shadow-inner">
        <span className="text-5xl font-black tracking-normal" style={{ color: display.color }}>
          {display.word}
        </span>
      </div>
    );
  }

  if (display.type === "memory") {
    return (
      <div className="grid min-h-48 place-items-center rounded-lg border border-slate-200 bg-white p-5 shadow-inner">
        {phase === "preview" ? (
          <div className="flex flex-wrap justify-center gap-2">
            {display.items.map((item, index) => (
              <span className="grid h-14 w-14 place-items-center rounded-lg bg-blue-50 text-2xl font-black text-blue-900 shadow-sm" key={`${item}-${index}`}>
                {item}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex gap-2">
            {display.items.map((_, index) => (
            <span className="h-4 w-12 rounded-full bg-slate-300" key={index} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (display.type === "letterGrid") {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-inner">
        <div className="grid grid-cols-8 gap-2 sm:grid-cols-10">
          {display.items.map((item, index) => (
            <span className="grid h-9 place-items-center rounded-md bg-slate-100 text-sm font-bold text-slate-800" key={`${item}-${index}`}>
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (display.type === "shapeGrid") {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-inner">
        <div className="grid grid-cols-8 gap-2 sm:grid-cols-10">
          {display.items.map((item, index) => (
            <span className="grid h-9 place-items-center rounded-md bg-slate-100 text-xl" key={`${item.shape}-${index}`} style={{ color: item.color.hex }}>
              {item.shape}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (display.type === "arrowRow") {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-inner">
        <div className="flex flex-wrap gap-2">
          {display.items.map((item, index) => (
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-xl font-bold text-slate-800" key={`${item}-${index}`}>
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (display.type === "pairRows") {
    return (
      <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-inner">
        {[display.left, display.right].map((row, rowIndex) => (
          <div className="flex flex-wrap gap-2" key={rowIndex}>
            {row.map((item, index) => (
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-xl text-slate-800" key={`${item}-${index}`}>
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (display.type === "targetNumber") {
    return (
      <div className="grid min-h-48 place-items-center rounded-lg border border-slate-200 bg-white shadow-inner">
        <div className="text-center">
          <span className="text-sm font-semibold text-slate-500">Hedef toplam</span>
          <strong className="block text-6xl font-black text-slate-950">{display.value}</strong>
        </div>
      </div>
    );
  }

  if (display.type === "wordFocus") {
    return (
      <div className="grid min-h-48 place-items-center rounded-lg border border-slate-200 bg-white shadow-inner">
        <span className="rounded-lg bg-lime-50 px-5 py-3 text-2xl font-black text-lime-900">{display.label}</span>
      </div>
    );
  }

  if (display.type === "code") {
    return (
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-inner">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {display.codeMap.map((item) => (
            <span className="rounded-lg bg-indigo-50 px-3 py-2 text-center text-lg font-bold text-indigo-900" key={item.shape}>
              {item.shape} = {item.code}
            </span>
          ))}
        </div>
        <div className="flex justify-center gap-2">
          {display.sequence.map((item, index) => (
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-slate-100 text-2xl" key={`${item.shape}-${index}`}>
              {item.shape}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-inner">
      <div className="flex justify-center gap-2">
        {display.items.map((item, index) => (
          <span className="grid h-12 w-12 place-items-center rounded-lg bg-orange-50 text-2xl text-orange-900" key={`${item}-${index}`}>
            {item}
          </span>
        ))}
        <span className="grid h-12 w-12 place-items-center rounded-lg bg-slate-950 text-2xl font-bold text-white">?</span>
      </div>
    </div>
  );
}

function GamePanel({ challenge, exercise, onAnswer, phase, progress, result, selectedOption }) {
  const Icon = exercise.icon;
  const tone = toneStyles[exercise.tone] || toneStyles.blue;
  const levelPercent = (progress.level / MAX_LEVEL) * 100;

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className={`h-1.5 ${tone.line}`} />
      <div className="p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className={`grid h-12 w-12 place-items-center rounded-lg ${tone.soft}`}>
            <Icon size={21} />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-950">{exercise.title}</h2>
            <p className="text-sm text-slate-500">Seviye {progress.level} · Seri {progress.streak}/{LEVEL_UP_STREAK}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800">
          <Medal size={16} />
          En iyi seviye {progress.bestLevel}
        </span>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Seviye ilerlemesi</span>
          <span>{progress.level}/{MAX_LEVEL}</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100">
          <div className={`h-full rounded-full ${tone.line}`} style={{ width: `${levelPercent}%` }} />
        </div>
      </div>

      <div className="mb-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
        <p className="text-base font-black leading-7 text-slate-950">{challenge.prompt}</p>
      </div>

      <ChallengeDisplay challenge={challenge} phase={phase} />

      {phase === "preview" ? (
        <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-center text-sm font-bold text-slate-600">
          Diziyi aklında tut. Seçenekler birazdan açılacak.
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {challenge.options.map((item) => {
            const isSelected = selectedOption?.id === item.id;
            const showCorrect = result && item.correct;
            const showWrong = result && isSelected && !item.correct;

            return (
              <button
                className={`min-h-14 rounded-lg border px-4 py-3 text-left text-sm font-black shadow-sm transition ${
                  showCorrect
                    ? "border-emerald-400 bg-emerald-50 text-emerald-950"
                    : showWrong
                      ? "border-red-400 bg-red-50 text-red-950"
                      : "border-slate-200 bg-white text-slate-800 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
                }`}
                disabled={Boolean(result)}
                key={item.id}
                onClick={() => onAnswer(item)}
                type="button"
              >
                {item.visual?.shape || item.text}
              </button>
            );
          })}
        </div>
      )}

      {result ? (
        <div className={`mt-4 rounded-lg border p-4 ${result.correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
          <div className={`mb-1 flex items-center gap-2 text-sm font-bold ${result.correct ? "text-emerald-900" : "text-red-900"}`}>
            {result.correct ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
            {result.correct ? "Doğru" : "Tekrar denemeye değer"}
          </div>
          <p className="text-sm leading-6 text-slate-800">
            Doğru cevap: <strong>{challenge.answerText}</strong>
            {result.leveledUp ? " · Seviye yükseldi." : ""}
          </p>
        </div>
      ) : null}
      </div>
    </section>
  );
}

function App() {
  const [grade, setGrade] = useState("5");
  const [activeId, setActiveId] = useState(exercises[0].id);
  const [progress, setProgress] = useState(readProgress);
  const activeExercise = exercises.find((exercise) => exercise.id === activeId) || exercises[0];
  const activeProgress = progress[activeId];
  const [challenge, setChallenge] = useState(() => generateExercise(activeId, activeProgress.level));
  const [phase, setPhase] = useState(challenge.preview ? "preview" : "answer");
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState(null);

  const totals = useMemo(() => {
    const values = Object.values(progress);
    const attempts = values.reduce((sum, item) => sum + item.attempts, 0);
    const correct = values.reduce((sum, item) => sum + item.correct, 0);
    const levelTotal = values.reduce((sum, item) => sum + item.level, 0);

    return {
      attempts,
      correct,
      averageLevel: Math.max(1, Math.round(levelTotal / values.length)),
      accuracy: attempts > 0 ? Math.round((correct / attempts) * 100) : 0,
    };
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    if (phase !== "preview") return undefined;

    const timer = window.setTimeout(() => {
      setPhase("answer");
    }, 1600);

    return () => window.clearTimeout(timer);
  }, [challenge, phase]);

  useEffect(() => {
    if (!result) return undefined;

    const timer = window.setTimeout(() => {
      startNewChallenge();
    }, result.correct ? 650 : 1200);

    return () => window.clearTimeout(timer);
  }, [result]);

  function startNewChallenge(nextProgress = progress, nextId = activeId) {
    const nextChallenge = generateExercise(nextId, nextProgress[nextId].level);
    setChallenge(nextChallenge);
    setPhase(nextChallenge.preview ? "preview" : "answer");
    setSelectedOption(null);
    setResult(null);
  }

  function selectExercise(exerciseId) {
    setActiveId(exerciseId);
    startNewChallenge(progress, exerciseId);
  }

  function handleAnswer(item) {
    if (result) return;

    const current = progress[activeId];
    const nextStreak = item.correct ? current.streak + 1 : 0;
    const leveledUp = item.correct && nextStreak >= LEVEL_UP_STREAK && current.level < MAX_LEVEL;
    const nextLevel = leveledUp ? current.level + 1 : current.level;
    const nextProgress = {
      ...progress,
      [activeId]: {
        level: nextLevel,
        bestLevel: Math.max(current.bestLevel, nextLevel),
        correct: current.correct + (item.correct ? 1 : 0),
        attempts: current.attempts + 1,
        streak: leveledUp ? 0 : nextStreak,
      },
    };

    setSelectedOption(item);
    setResult({ correct: item.correct, leveledUp });
    setProgress(nextProgress);
  }

  function resetCurrent() {
    const nextProgress = {
      ...progress,
      [activeId]: { level: 1, bestLevel: progress[activeId].bestLevel, correct: 0, attempts: 0, streak: 0 },
    };
    setProgress(nextProgress);
    startNewChallenge(nextProgress, activeId);
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
        <aside className="space-y-4">
          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="bg-slate-950 p-4 text-white">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-emerald-200">
                  <Brain size={14} />
                  4-8. sınıf
                </p>
                <h1 className="text-2xl font-black text-white">Odak Atölyesi</h1>
              </div>
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-white text-slate-950">
                <Trophy size={21} />
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {["4", "5", "6", "7", "8"].map((item) => (
                <button
                  className={`h-9 rounded-lg text-sm font-bold transition ${
                    grade === item ? "bg-white text-slate-950" : "bg-white/10 text-slate-200 hover:bg-white/20"
                  }`}
                  key={item}
                  onClick={() => setGrade(item)}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
            </div>

            <div className="grid grid-cols-3 gap-2 p-4">
              <div className="rounded-lg bg-slate-50 p-3">
                <span className="block text-xs font-semibold text-slate-500">Ortalama</span>
                <strong className="text-xl font-black text-slate-950">{totals.averageLevel}</strong>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <span className="block text-xs font-semibold text-slate-500">Doğru</span>
                <strong className="text-xl font-black text-slate-950">{totals.correct}</strong>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <span className="block text-xs font-semibold text-slate-500">Başarı</span>
                <strong className="text-xl font-black text-slate-950">%{totals.accuracy}</strong>
              </div>
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {exercises.map((exercise) => (
              <ExerciseCard
                active={exercise.id === activeId}
                exercise={exercise}
                key={exercise.id}
                onClick={() => selectExercise(exercise.id)}
                progress={progress[exercise.id]}
              />
            ))}
          </section>
        </aside>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950">{grade}. sınıf çalışma oturumu</h2>
              <p className="mt-1 text-sm text-slate-500">Kısa görevler, hızlı geri bildirim ve kademeli seviye sistemi.</p>
            </div>
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              onClick={resetCurrent}
              type="button"
            >
              <RotateCcw size={16} />
              Bu çalışmayı sıfırla
            </button>
          </div>

          <GamePanel
            challenge={challenge}
            exercise={activeExercise}
            onAnswer={handleAnswer}
            phase={phase}
            progress={activeProgress}
            result={result}
            selectedOption={selectedOption}
          />

          <section className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-emerald-200 bg-white p-4 shadow-sm">
              <span className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
                <CheckCircle2 size={22} />
              </span>
              <h3 className="text-sm font-bold text-slate-950">Seri ilerleme</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">Aktif çalışmada {activeProgress.streak} doğru seri var.</p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-white p-4 shadow-sm">
              <span className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-700">
                <Target size={22} />
              </span>
              <h3 className="text-sm font-bold text-slate-950">Zorluk</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">Seviye yükseldikçe sayı, şekil ve seçenek yoğunluğu artar.</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-white p-4 shadow-sm">
              <span className="mb-3 grid h-10 w-10 place-items-center rounded-lg bg-amber-50 text-amber-700">
                <Sparkles size={22} />
              </span>
              <h3 className="text-sm font-bold text-slate-950">Oturum</h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">Toplam {totals.attempts} görev çözüldü.</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
