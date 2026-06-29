import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  ArrowDownUp,
  BookOpenText,
  Brain,
  Calculator,
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
  Zap,
  XCircle,
} from "lucide-react";
import "./styles.css";

const STORAGE_KEY = "odak-atolyesi-progress";
const MAX_LEVEL = 10;
const LEVEL_UP_STREAK = 3;
const TIMED_SESSION_BASE_SECONDS = 32;
const TIMED_SESSION_MIN_SECONDS = 10;

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
  { id: "tepki", title: "Tepki Testi", skill: "hızlı karar", icon: Zap, tone: "orange" },
  { id: "dizi", title: "Sayı Hafızası", skill: "kısa süreli hafıza", icon: Brain, tone: "blue" },
  { id: "gorselhafiza", title: "Görsel Hafıza", skill: "konum belleği", icon: Grid3X3, tone: "rose" },
  { id: "harf", title: "Harf Avı", skill: "görsel tarama", icon: Search, tone: "amber" },
  { id: "sekil", title: "Şekil Sayacı", skill: "ayrıntı takibi", icon: Shapes, tone: "violet" },
  { id: "yon", title: "Yön Takibi", skill: "dikkat sürdürme", icon: ArrowDownUp, tone: "sky" },
  { id: "karisikyon", title: "Yön Şaşırtmacası", skill: "tepki kontrolü", icon: ArrowDownUp, tone: "sky" },
  { id: "fark", title: "Fark Bulucu", skill: "karşılaştırma", icon: Layers3, tone: "rose" },
  { id: "toplam", title: "Matematik Yarışı", skill: "hızlı hesaplama", icon: Sigma, tone: "teal" },
  { id: "buyukkucuk", title: "Sayı Düellosu", skill: "işlem karşılaştırma", icon: Calculator, tone: "blue" },
  { id: "kelime", title: "Kavram Dedektifi", skill: "anlam ilişkisi", icon: CircleDot, tone: "lime" },
  { id: "kod", title: "Kod Hafızası", skill: "eşleme", icon: Grid3X3, tone: "indigo" },
  { id: "renkhafiza", title: "Renk Hafızası", skill: "sıralı hatırlama", icon: Brain, tone: "rose" },
  { id: "sirahafiza", title: "Sıra Takibi", skill: "dizi belleği", icon: Layers3, tone: "teal" },
  { id: "desen", title: "Örüntü Bul", skill: "dizi örüntüsü", icon: Target, tone: "orange" },
  { id: "anagram", title: "Anagram", skill: "harfleri sırala", icon: Grid3X3, tone: "sky" },
  { id: "esanlam", title: "Eş Anlam", skill: "anlam eşleştirme", icon: BookOpenText, tone: "emerald" },
  { id: "zitanlam", title: "Zıt Anlam", skill: "karşıt anlam", icon: ArrowDownUp, tone: "violet" },
];

const gameCategories = [
  {
    id: "hiz",
    title: "Hız & Refleks",
    subtitle: "Hızlı tepki ver",
    exerciseIds: ["renk", "tepki", "yon", "karisikyon"],
    icon: Zap,
    accent: "from-violet-500 to-fuchsia-500",
    chip: "bg-white/20 text-white",
  },
  {
    id: "hafiza",
    title: "Hafıza & Görsel",
    subtitle: "Gördüğünü aklında tut",
    exerciseIds: ["dizi", "gorselhafiza", "renkhafiza", "sirahafiza", "harf", "sekil", "fark", "kod"],
    icon: Brain,
    accent: "from-cyan-500 to-blue-500",
    chip: "bg-white/20 text-white",
  },
  {
    id: "mantik",
    title: "Mantık & Matematik",
    subtitle: "Düşün, eşleştir, çöz",
    exerciseIds: ["toplam", "buyukkucuk", "desen"],
    icon: Calculator,
    accent: "from-emerald-500 to-teal-500",
    chip: "bg-white/20 text-white",
  },
  {
    id: "dil",
    title: "Kelime & Dil",
    subtitle: "Sözcük dikkatini geliştir",
    exerciseIds: ["kelime", "anagram", "esanlam", "zitanlam"],
    icon: BookOpenText,
    accent: "from-amber-500 to-orange-500",
    chip: "bg-white/20 text-white",
  },
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
  { minLevel: 1, name: "Hayvan", words: ["kedi", "köpek", "kuş", "balık", "at", "arı"], distractors: ["masa", "kalem", "defter", "kapı"] },
  { minLevel: 1, name: "Meyve", words: ["elma", "armut", "muz", "kiraz", "üzüm", "şeftali"], distractors: ["kitap", "çanta", "bulut", "tahta"] },
  { minLevel: 1, name: "Okul eşyası", words: ["kalem", "silgi", "defter", "cetvel", "kitap"], distractors: ["elma", "bulut", "kedi", "deniz"] },
  { minLevel: 3, name: "Taşıt", words: ["araba", "otobüs", "tren", "uçak", "gemi"], distractors: ["masa", "çiçek", "bulut", "defter"] },
  { minLevel: 3, name: "Doğa", words: ["orman", "deniz", "dağ", "ırmak", "göl"], distractors: ["kalem", "saat", "kapı", "koltuk"] },
  { minLevel: 5, name: "Duygu", words: ["sevinç", "üzüntü", "korku", "öfke", "heyecan"], distractors: ["cetvel", "ırmak", "tren", "pencere"] },
  { minLevel: 5, name: "Bilim", words: ["gezegen", "deney", "enerji", "mikrop", "madde"], distractors: ["armut", "koltuk", "oyuncak", "kapı"] },
  { minLevel: 7, name: "Soyut kavram", words: ["özgürlük", "sorumluluk", "adalet", "emek", "saygı"], distractors: ["kalem", "gemi", "elma", "masa"] },
  { minLevel: 8, name: "Düşünme becerisi", words: ["çıkarım", "yorum", "kanıt", "neden", "sonuç"], distractors: ["kiraz", "otobüs", "deniz", "silgi"] },
  { minLevel: 9, name: "Kişilik özelliği", words: ["sabırlı", "dürüst", "kararlı", "çalışkan", "cesur"], distractors: ["mavi", "uzun", "yuvarlak", "soğuk"] },
];

const wordBank = ["kalem", "kitap", "okul", "defter", "başarı", "dikkat", "oyun", "bilgi", "çalışma", "zihin", "öğretmen", "arkadaş", "gezegen", "orman", "deniz", "pencere"];

const analogySets = [
  { minLevel: 5, stem: "Kalem : yazmak = Fırça : ?", answer: "boyamak", wrong: ["okumak", "ölçmek", "kesmek"] },
  { minLevel: 5, stem: "Doktor : hastane = Öğretmen : ?", answer: "okul", wrong: ["liman", "orman", "pazar"] },
  { minLevel: 6, stem: "Tohum : bitki = Yumurta : ?", answer: "civciv", wrong: ["ağaç", "balık", "meyve"] },
  { minLevel: 6, stem: "Sebep : sonuç = Soru : ?", answer: "cevap", wrong: ["renk", "taşıt", "ses"] },
  { minLevel: 7, stem: "Kanıt : düşünce = Örnek : ?", answer: "açıklama", wrong: ["gölge", "tahta", "sayı"] },
  { minLevel: 8, stem: "Adalet : toplum = Dürüstlük : ?", answer: "güven", wrong: ["hız", "renk", "mesafe"] },
  { minLevel: 9, stem: "Plan : başarı = Dikkat : ?", answer: "anlama", wrong: ["yükseklik", "sıcaklık", "gürültü"] },
];

const synonymPairs = [
  ["hızlı", "çabuk"],
  ["mutlu", "sevinçli"],
  ["akıllı", "zeki"],
  ["öğrenci", "talebe"],
  ["cevap", "yanıt"],
  ["kolay", "basit"],
];

const antonymPairs = [
  ["hızlı", "yavaş"],
  ["kolay", "zor"],
  ["uzun", "kısa"],
  ["açık", "kapalı"],
  ["az", "çok"],
  ["geniş", "dar"],
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

function makeMathOptions(correct) {
  const offsets = correct > 80 ? [2, 4, 6, 10, 12] : correct > 30 ? [1, 2, 3, 5, 8] : [1, 2, 3, 4, 5];
  const values = new Set([correct]);

  offsets.forEach((offset) => {
    if (values.size < 4) values.add(Math.max(0, correct + offset));
    if (values.size < 4) values.add(Math.max(0, correct - offset));
  });

  while (values.size < 4) {
    values.add(correct + values.size + 1);
  }

  return shuffle([...values]).map((value) => option(String(value), value === correct));
}

function makeProgress() {
  return exercises.reduce((progress, exercise) => {
    progress[exercise.id] = { level: 1, bestLevel: 1, correct: 0, attempts: 0, streak: 0 };
    return progress;
  }, {});
}

function getTimedSessionSeconds(level) {
  return Math.max(TIMED_SESSION_MIN_SECONDS, TIMED_SESSION_BASE_SECONDS - (clamp(level, 1, MAX_LEVEL) - 1) * 2);
}

function makeTimedSession(level, score = 0, mistakes = 0) {
  const totalSeconds = getTimedSessionSeconds(level);

  return {
    active: true,
    finished: false,
    secondsLeft: totalSeconds,
    totalSeconds,
    score,
    mistakes,
  };
}

const emptyTimedSession = {
  active: false,
  finished: false,
  secondsLeft: 0,
  totalSeconds: 0,
  score: 0,
  mistakes: 0,
};

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
  if (exerciseId === "tepki") return generateReactionTask(safeLevel);
  if (exerciseId === "dizi") return generateSequenceTask(safeLevel);
  if (exerciseId === "gorselhafiza") return generateVisualMemoryTask(safeLevel);
  if (exerciseId === "harf") return generateLetterTask(safeLevel);
  if (exerciseId === "sekil") return generateShapeTask(safeLevel);
  if (exerciseId === "yon") return generateDirectionTask(safeLevel);
  if (exerciseId === "karisikyon") return generateMixedDirectionTask(safeLevel);
  if (exerciseId === "fark") return generateDifferenceTask(safeLevel);
  if (exerciseId === "toplam") return generateSumTask(safeLevel);
  if (exerciseId === "buyukkucuk") return generateCompareTask(safeLevel);
  if (exerciseId === "kelime") return generateWordTask(safeLevel);
  if (exerciseId === "kod") return generateCodeTask(safeLevel);
  if (exerciseId === "renkhafiza") return generateColorMemoryTask(safeLevel);
  if (exerciseId === "sirahafiza") return generateOrderMemoryTask(safeLevel);
  if (exerciseId === "anagram") return generateAnagramTask(safeLevel);
  if (exerciseId === "esanlam") return generateSynonymTask(safeLevel);
  if (exerciseId === "zitanlam") return generateAntonymTask(safeLevel);
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

function generateReactionTask(level) {
  const pool = level < 4 ? shapeSymbols.slice(0, 4) : shapeSymbols;
  const target = randomItem(pool);
  const choices = unique([target, ...shuffle(pool.filter((shape) => shape !== target))]).slice(0, 4);

  return {
    prompt: "Ekrandaki hedef sembolü hızlıca seç.",
    display: { type: "wordFocus", label: target },
    options: shuffle(choices).map((shape) => option(shape, shape === target, { shape })),
    answerText: target,
  };
}

function generateSequenceTask(level) {
  const length = clamp(3 + Math.floor((level - 1) / 2), 3, 9);
  const maxNumber = level <= 3 ? 9 : level <= 5 ? 30 : level <= 7 ? 60 : 99;
  const minNumber = level <= 3 ? 1 : level <= 7 ? 10 : 20;
  const sequence = Array.from({ length }, () => String(Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber));
  const wrong = Array.from({ length: 3 }, (_, index) => {
    const copy = [...sequence];
    const pos = (index + level) % copy.length;
    const current = Number(copy[pos]);
    const shift = level <= 3 ? index + 2 : (index + 1) * (level + 2);
    copy[pos] = String(clamp(current + (index % 2 === 0 ? shift : -shift), minNumber, maxNumber));
    if (copy[pos] === sequence[pos]) copy[pos] = String(current === maxNumber ? current - 1 : current + 1);
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

function generateMixedDirectionTask(level) {
  const directionNames = {
    "↑": "Yukarı",
    "↓": "Aşağı",
    "←": "Sol",
    "→": "Sağ",
  };
  const opposites = {
    "↑": "↓",
    "↓": "↑",
    "←": "→",
    "→": "←",
  };
  const arrow = randomItem(arrows);
  const isReverse = level >= 2 && Math.random() < Math.min(0.35 + level * 0.05, 0.75);
  const correctArrow = isReverse ? opposites[arrow] : arrow;

  return {
    prompt: "Yeşil okta aynı yönü, kırmızı okta ters yönü seç.",
    display: { type: "trickArrow", arrow, mode: isReverse ? "reverse" : "same" },
    options: arrows.map((item) => option(directionNames[item], item === correctArrow)),
    answerText: directionNames[correctArrow],
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
  let expression = "";
  let correct = 0;

  if (level <= 1) {
    const first = Math.floor(Math.random() * 8) + 2;
    const second = Math.floor(Math.random() * 8) + 2;
    expression = `${first} + ${second}`;
    correct = first + second;
  } else if (level <= 2) {
    const operation = randomItem(["+", "-"]);
    const first = Math.floor(Math.random() * 16) + 5;
    const second = Math.floor(Math.random() * 9) + 2;
    expression = operation === "-" ? `${first} - ${Math.min(first - 1, second)}` : `${first} + ${second}`;
    correct = operation === "-" ? first - Math.min(first - 1, second) : first + second;
  } else if (level <= 3) {
    const operation = randomItem(["+", "-"]);
    const first = Math.floor(Math.random() * 35) + 15;
    const second = Math.floor(Math.random() * 25) + 10;
    expression = operation === "-" ? `${Math.max(first, second)} - ${Math.min(first, second)}` : `${first} + ${second}`;
    correct = operation === "-" ? Math.max(first, second) - Math.min(first, second) : first + second;
  } else if (level <= 4) {
    const first = Math.floor(Math.random() * 8) + 2;
    const second = Math.floor(Math.random() * 8) + 2;
    expression = `${first} × ${second}`;
    correct = first * second;
  } else if (level <= 5) {
    const first = Math.floor(Math.random() * 20) + 10;
    const second = Math.floor(Math.random() * 16) + 5;
    const third = Math.floor(Math.random() * 9) + 2;
    const operation = randomItem(["+", "-"]);
    expression = operation === "-" ? `${first} + ${second} - ${third}` : `${first} + ${second} + ${third}`;
    correct = operation === "-" ? first + second - third : first + second + third;
  } else if (level <= 6) {
    const operation = randomItem(["×", "÷"]);
    const first = Math.floor(Math.random() * 11) + 2;
    const second = Math.floor(Math.random() * 10) + 2;
    expression = operation === "÷" ? `${first * second} ÷ ${first}` : `${first} × ${second}`;
    correct = operation === "÷" ? second : first * second;
  } else if (level <= 7) {
    const first = Math.floor(Math.random() * 9) + 3;
    const second = Math.floor(Math.random() * 8) + 2;
    const third = Math.floor(Math.random() * 18) + 5;
    const operation = randomItem(["+", "-"]);
    expression = operation === "-" ? `${first} × ${second} - ${third}` : `${first} × ${second} + ${third}`;
    correct = operation === "-" ? first * second - third : first * second + third;
  } else if (level <= 8) {
    const first = Math.floor(Math.random() * 16) + 8;
    const second = Math.floor(Math.random() * 12) + 4;
    const third = Math.floor(Math.random() * 4) + 2;
    expression = `(${first} + ${second}) × ${third}`;
    correct = (first + second) * third;
  } else {
    const first = Math.floor(Math.random() * 8) + 4;
    const second = Math.floor(Math.random() * 8) + 3;
    const third = Math.floor(Math.random() * 7) + 3;
    const fourth = Math.floor(Math.random() * 7) + 2;
    expression = `${first} × ${second} + ${third} × ${fourth}`;
    correct = first * second + third * fourth;
  }

  return {
    prompt: "İşlemin sonucunu hızlıca seç.",
    display: { type: "mathExpression", expression },
    options: makeMathOptions(correct),
    answerText: String(correct),
  };
}

function generateCompareTask(level) {
  function makeSide() {
    if (level <= 2) {
      const value = Math.floor(Math.random() * 30) + 1;
      return { expression: String(value), value };
    }

    if (level <= 4) {
      const first = Math.floor(Math.random() * 30) + 10;
      const second = Math.floor(Math.random() * 20) + 2;
      const operation = randomItem(["+", "-"]);
      return operation === "+"
        ? { expression: `${first} + ${second}`, value: first + second }
        : { expression: `${first} - ${Math.min(first - 1, second)}`, value: first - Math.min(first - 1, second) };
    }

    if (level <= 6) {
      const first = Math.floor(Math.random() * 9) + 2;
      const second = Math.floor(Math.random() * 9) + 2;
      const bonus = Math.floor(Math.random() * 15) + 3;
      return Math.random() < 0.5
        ? { expression: `${first} × ${second}`, value: first * second }
        : { expression: `${first} × ${second} + ${bonus}`, value: first * second + bonus };
    }

    if (level <= 8) {
      const first = Math.floor(Math.random() * 20) + 8;
      const second = Math.floor(Math.random() * 12) + 4;
      const third = Math.floor(Math.random() * 4) + 2;
      return { expression: `(${first} + ${second}) × ${third}`, value: (first + second) * third };
    }

    const first = Math.floor(Math.random() * 8) + 3;
    const second = Math.floor(Math.random() * 8) + 3;
    const third = Math.floor(Math.random() * 30) + 10;
    const fourth = Math.floor(Math.random() * 9) + 2;
    return Math.random() < 0.5
      ? { expression: `${first} × ${second} + ${third}`, value: first * second + third }
      : { expression: `${third} + ${first} × ${fourth}`, value: third + first * fourth };
  }

  let left = makeSide();
  let right = makeSide();

  if (left.value === right.value && Math.random() < 0.75) {
    right = makeSide();
  }

  const correct = left.value > right.value ? "Sol" : left.value < right.value ? "Sağ" : "Eşit";

  return {
    prompt: "Hangi tarafın sonucu daha büyük?",
    display: { type: "compareDuel", left: left.expression, right: right.expression },
    options: ["Sol", "Sağ", "Eşit"].map((text) => option(text, text === correct)),
    answerText: correct,
  };
}

function generateWordTask(level) {
  const availableSets = categorySets.filter((set) => level >= set.minLevel);
  const allWords = categorySets.flatMap((set) => set.words);

  if (level <= 3) {
    const category = randomItem(availableSets);
    const examples = shuffle(category.words).slice(0, 3);
    const correctWord = randomItem(category.words.filter((word) => !examples.includes(word)) || category.words);
    const options = unique([correctWord, ...shuffle(category.distractors).slice(0, 3)]).slice(0, 4);

    return {
      prompt: "Verilen kelimelerle aynı kavram alanına giren kelimeyi seç.",
      display: { type: "wordFocus", label: examples.join(" • ") },
      options: shuffle(options).map((text) => option(text, text === correctWord)),
      answerText: correctWord,
    };
  }

  if (level <= 6) {
    const category = randomItem(availableSets.filter((set) => set.words.length >= 4));
    const sameWords = shuffle(category.words).slice(0, 3);
    const oddWord = randomItem(shuffle(allWords.filter((word) => !category.words.includes(word))));
    const shownWords = shuffle([...sameWords, oddWord]);

    return {
      prompt: "Anlam ilişkisine göre diğerlerinden farklı olan kelimeyi seç.",
      display: { type: "wordFocus", label: shownWords.join(" • ") },
      options: shownWords.map((text) => option(text, text === oddWord)),
      answerText: oddWord,
    };
  }

  const relation = randomItem(analogySets.filter((item) => level >= item.minLevel));

  return {
    prompt: "Anlam ilişkisini tamamlayan kelimeyi seç.",
    display: { type: "wordFocus", label: relation.stem },
    options: shuffle([relation.answer, ...relation.wrong]).map((text) => option(text, text === relation.answer)),
    answerText: relation.answer,
  };
}

function generateColorMemoryTask(level) {
  const length = clamp(3 + Math.floor((level - 1) / 2), 3, 8);
  const sequence = Array.from({ length }, () => randomItem(colors));
  const sequenceNames = sequence.map((color) => color.name);
  const correct = sequenceNames.join(" - ");
  const wrong = Array.from({ length: 3 }, (_, index) => {
    const copy = [...sequenceNames];
    const pos = (index + level) % copy.length;
    copy[pos] = randomItem(colors.filter((color) => color.name !== copy[pos])).name;
    return copy.join(" - ");
  });

  return {
    prompt: "Renk sırasını aklında tut, sonra aynı sırayı seç.",
    display: { type: "colorMemory", items: sequence },
    preview: true,
    options: shuffle([correct, ...wrong]).map((text) => option(text, text === correct)),
    answerText: correct,
  };
}

function generateVisualMemoryTask(level) {
  const gridSize = level <= 3 ? 3 : level <= 7 ? 4 : 5;
  const cellCount = gridSize * gridSize;
  const activeCount = clamp(3 + Math.floor((level - 1) / 2), 3, gridSize === 3 ? 5 : gridSize === 4 ? 7 : 9);
  const active = shuffle(Array.from({ length: cellCount }, (_, index) => index)).slice(0, activeCount).sort((a, b) => a - b);
  const correct = active.map((index) => index + 1).join(" - ");

  return {
    prompt: "Ekranda yanan kareleri aklında tut, sonra aynı kareleri seç.",
    display: { type: "visualMemory", gridSize, active },
    inputMode: "visualRecall",
    preview: true,
    options: [],
    answerText: correct,
  };
}

function generateOrderMemoryTask(level) {
  const length = clamp(3 + Math.floor((level - 1) / 2), 3, 9);
  const symbolPool = level >= 7 ? [...letters.slice(0, 12), ...shapeSymbols] : letters;
  const pool = shuffle(symbolPool).slice(0, clamp(10 + level, 10, 18));
  const sequence = Array.from({ length }, () => randomItem(pool));
  const correct = sequence.join(" ");
  const wrong = Array.from({ length: 3 }, (_, index) => {
    const copy = [...sequence];
    const pos = (index + 1) % copy.length;
    copy[pos] = randomItem(pool.filter((letter) => letter !== copy[pos]));
    return copy.join(" ");
  });

  return {
    prompt: level >= 7 ? "Harf ve sembol sırasını aklında tut, sonra aynı sırayı seç." : "Harf sırasını aklında tut, sonra aynı sırayı seç.",
    display: { type: "memory", items: sequence },
    preview: true,
    options: shuffle([correct, ...wrong]).map((text) => option(text, text === correct)),
    answerText: correct,
  };
}

function scrambleWord(word) {
  const letters = word.split("");
  let scrambled = shuffle(letters).join("");
  if (scrambled === word && letters.length > 2) {
    scrambled = [letters[1], letters[0], ...letters.slice(2)].join("");
  }
  return scrambled;
}

function generateAnagramTask() {
  const correct = randomItem(wordBank.filter((word) => word.length >= 4));
  const choices = unique([correct, ...shuffle(wordBank.filter((word) => word !== correct)).slice(0, 3)]).slice(0, 4);

  return {
    prompt: "Harfleri doğru sırala, kelimeyi oluştur.",
    display: { type: "wordFocus", label: scrambleWord(correct).toLocaleUpperCase("tr-TR") },
    options: shuffle(choices).map((text) => option(text, text === correct)),
    answerText: correct,
  };
}

function generateSynonymTask() {
  const pair = randomItem(synonymPairs);
  const wrong = shuffle(synonymPairs.flat().filter((word) => !pair.includes(word))).slice(0, 3);

  return {
    prompt: `"${pair[0]}" kelimesinin eş anlamlısını seç.`,
    display: { type: "wordFocus", label: pair[0] },
    options: shuffle([pair[1], ...wrong]).map((text) => option(text, text === pair[1])),
    answerText: pair[1],
  };
}

function generateAntonymTask() {
  const pair = randomItem(antonymPairs);
  const wrong = shuffle(antonymPairs.flat().filter((word) => !pair.includes(word))).slice(0, 3);

  return {
    prompt: `"${pair[0]}" kelimesinin zıt anlamlısını seç.`,
    display: { type: "wordFocus", label: pair[0] },
    options: shuffle([pair[1], ...wrong]).map((text) => option(text, text === pair[1])),
    answerText: pair[1],
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
  const base = shuffle(shapeSymbols).slice(0, clamp(2 + Math.floor(level / 3), 2, 5));
  let pattern = [];
  let prompt = "Desende sıradaki şekli seç.";

  if (level <= 2) {
    pattern = Array.from({ length: 10 }, (_, index) => base[index % 2]);
    prompt = "Tekrar eden desende sıradaki şekli seç.";
  } else if (level <= 4) {
    pattern = Array.from({ length: 12 }, (_, index) => base[index % base.length]);
    prompt = "Üçlü veya dörtlü desende sıradaki şekli seç.";
  } else if (level <= 6) {
    pattern = Array.from({ length: 14 }, (_, index) => base[Math.floor(index / 2) % base.length]);
    prompt = "İkili tekrar eden desende sıradaki şekli seç.";
  } else if (level <= 8) {
    const blocks = [];
    for (let round = 0; round < 4; round += 1) {
      base.slice(0, 3).forEach((shape, shapeIndex) => {
        blocks.push(...Array.from({ length: shapeIndex + 1 }, () => shape));
      });
    }
    pattern = blocks;
    prompt = "Büyüyen desende sıradaki şekli seç.";
  } else {
    const firstCycle = base.slice(0, 3);
    const secondCycle = shuffle(shapeSymbols.filter((shape) => !firstCycle.includes(shape))).slice(0, 2);
    pattern = Array.from({ length: 16 }, (_, index) => (index % 2 === 0 ? firstCycle[Math.floor(index / 2) % firstCycle.length] : secondCycle[Math.floor(index / 2) % secondCycle.length]));
    prompt = "İç içe ilerleyen desende sıradaki şekli seç.";
  }

  const length = clamp(5 + Math.floor(level / 2), 5, 11);
  const sequence = pattern.slice(0, length);
  const correct = pattern[length];
  const choices = unique([correct, ...shuffle(shapeSymbols.filter((shape) => shape !== correct))]).slice(0, 4);

  return {
    prompt,
    display: { type: "pattern", items: sequence },
    options: shuffle(choices).map((shape) => option(shape, shape === correct, { shape })),
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

function CategoryCard({ category, onClick }) {
  const Icon = category.icon;

  return (
    <button
      className={`group min-h-48 overflow-hidden rounded-[28px] bg-gradient-to-br ${category.accent} p-6 text-left text-white shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:shadow-2xl`}
      onClick={onClick}
      type="button"
    >
      <div className="mb-10 flex items-start justify-between gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 text-white">
          <Icon size={30} />
        </span>
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black text-white">{category.exerciseIds.length} oyun</span>
      </div>
      <h2 className="text-2xl font-black tracking-normal">{category.title}</h2>
      <p className="mt-2 text-sm font-bold text-white/80">{category.subtitle}</p>
    </button>
  );
}

function GameListItem({ exercise, progress, onClick }) {
  const Icon = exercise.icon;
  const tone = toneStyles[exercise.tone] || toneStyles.blue;
  const accuracy = progress.attempts > 0 ? Math.round((progress.correct / progress.attempts) * 100) : 0;

  return (
    <button
      className="flex w-full items-center gap-5 rounded-[24px] border border-white/10 bg-white/10 p-5 text-left text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-white/15"
      onClick={onClick}
      type="button"
    >
      <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${tone.soft}`}>
        <Icon size={30} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xl font-black">{exercise.title}</span>
        <span className="mt-1 block text-sm font-bold text-white/55">{exercise.skill}</span>
        <span className="mt-3 inline-flex rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-200">Seviye {progress.level}</span>
      </span>
      <span className="hidden text-right text-xs font-bold text-white/55 sm:block">
        {progress.attempts} deneme
        <br />%{accuracy} başarı
      </span>
    </button>
  );
}

function MiniGridOption({ gridSize, active }) {
  return (
    <span className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}>
      {Array.from({ length: gridSize * gridSize }, (_, index) => (
        <span className={`h-3 w-3 rounded-[3px] ${active.includes(index) ? "bg-pink-500" : "bg-slate-200"}`} key={index} />
      ))}
    </span>
  );
}

function ChallengeDisplay({ challenge, phase, recallSelection = [], onToggleRecall, recallDisabled = false }) {
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

  if (display.type === "colorMemory") {
    return (
      <div className="grid min-h-48 place-items-center rounded-lg border border-slate-200 bg-white p-5 shadow-inner">
        {phase === "preview" ? (
          <div className="flex flex-wrap justify-center gap-3">
            {display.items.map((item, index) => (
              <span className="grid h-16 w-16 place-items-center rounded-2xl text-xs font-black text-white shadow-lg" key={`${item.name}-${index}`} style={{ backgroundColor: item.hex }}>
                {item.name}
              </span>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {display.items.map((_, index) => (
              <span className="h-4 w-14 rounded-full bg-slate-300" key={index} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (display.type === "visualMemory") {
    return (
      <div className="grid min-h-48 place-items-center rounded-lg border border-slate-200 bg-white p-5 shadow-inner">
        <div className="grid gap-2 rounded-3xl bg-slate-100 p-4" style={{ gridTemplateColumns: `repeat(${display.gridSize}, minmax(0, 1fr))` }}>
          {Array.from({ length: display.gridSize * display.gridSize }, (_, index) => {
            const active = phase === "preview" ? display.active.includes(index) : recallSelection.includes(index);
            return (
              <button
                className={`grid h-12 w-12 place-items-center rounded-xl text-xs font-black transition ${
                  active
                    ? "bg-pink-500 text-white shadow-lg shadow-pink-300"
                    : phase === "preview"
                      ? "bg-white text-slate-400"
                      : "bg-white text-slate-500 hover:bg-pink-50"
                }`}
                disabled={phase === "preview" || recallDisabled}
                key={index}
                onClick={() => onToggleRecall?.(index)}
                type="button"
              >
                {phase === "preview" ? "" : index + 1}
              </button>
            );
          })}
        </div>
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

  if (display.type === "trickArrow") {
    const isReverse = display.mode === "reverse";

    return (
      <div className="grid min-h-48 place-items-center rounded-lg border border-slate-200 bg-white p-5 shadow-inner">
        <div className="text-center">
          <div className={`mx-auto mb-3 grid h-24 w-24 place-items-center rounded-[28px] ${isReverse ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
            <span className="text-7xl font-black leading-none">{display.arrow}</span>
          </div>
          <div className="space-y-1 text-lg font-black">
            <p className="text-emerald-600">YEŞİL OK: Gösterdiği yöne bas.</p>
            <p className="text-red-500">KIRMIZI OK: Tam tersi yöne bas.</p>
          </div>
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

  if (display.type === "mathExpression") {
    return (
      <div className="grid min-h-48 place-items-center rounded-lg border border-slate-200 bg-white shadow-inner">
        <div className="text-center">
          <span className="text-sm font-semibold text-slate-500">Hızlı hesapla</span>
          <strong className="block text-6xl font-black text-slate-950">{display.expression}</strong>
        </div>
      </div>
    );
  }

  if (display.type === "compareDuel") {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-inner">
        <div className="grid items-stretch gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <div className="grid min-h-36 place-items-center rounded-2xl bg-blue-50 p-4 text-center">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-blue-500">Sol</span>
            <strong className="text-4xl font-black text-blue-950">{display.left}</strong>
          </div>
          <div className="grid place-items-center text-3xl font-black text-slate-400">?</div>
          <div className="grid min-h-36 place-items-center rounded-2xl bg-orange-50 p-4 text-center">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-orange-500">Sağ</span>
            <strong className="text-4xl font-black text-orange-950">{display.right}</strong>
          </div>
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
      <div className="space-y-5 rounded-lg border border-slate-200 bg-white p-4 shadow-inner">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {display.codeMap.map((item) => (
            <span className="rounded-lg bg-indigo-50 px-3 py-3 text-center text-lg font-black text-indigo-950" key={item.shape}>
              <span className="mr-2 text-xl text-indigo-700">{item.shape}</span>= {item.code}
            </span>
          ))}
        </div>
        <div className="flex justify-center gap-3 rounded-xl bg-slate-950 px-4 py-5">
          {display.sequence.map((item, index) => (
            <span className="grid h-14 w-14 place-items-center rounded-xl bg-white text-3xl font-black text-indigo-700 shadow-md" key={`${item.shape}-${index}`}>
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

function GamePanel({ challenge, exercise, onAnswer, phase, progress, result, selectedOption, timedSession }) {
  const Icon = exercise.icon;
  const tone = toneStyles[exercise.tone] || toneStyles.blue;
  const levelPercent = (progress.level / MAX_LEVEL) * 100;
  const hasTimer = Boolean(timedSession?.active || timedSession?.finished);
  const timePercent = hasTimer && timedSession.totalSeconds > 0 ? (timedSession.secondsLeft / timedSession.totalSeconds) * 100 : 0;
  const isVisualRecall = challenge.inputMode === "visualRecall";
  const [recallSelection, setRecallSelection] = useState([]);

  useEffect(() => {
    setRecallSelection([]);
  }, [challenge]);

  function toggleRecallCell(index) {
    if (result || phase === "preview") return;
    const maxSelection = challenge.display.active.length;
    setRecallSelection((current) => {
      if (current.includes(index)) return current.filter((item) => item !== index);
      if (current.length >= maxSelection) return current;
      return [...current, index].sort((a, b) => a - b);
    });
  }

  function submitVisualRecall() {
    const selected = [...recallSelection].sort((a, b) => a - b);
    const correctCells = [...challenge.display.active].sort((a, b) => a - b);
    const correct = selected.length === correctCells.length && selected.every((item, index) => item === correctCells[index]);

    onAnswer({
      id: crypto.randomUUID(),
      text: selected.map((index) => index + 1).join(" - "),
      correct,
    });
  }

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

      {hasTimer ? (
        <div className="mb-4 rounded-lg border border-orange-100 bg-orange-50 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-500">Süreli tur</p>
              <p className="text-sm font-bold text-orange-950">Süre bitene kadar soruları çöz.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm font-black text-orange-950">
              <span className="rounded-full bg-white px-3 py-1">{timedSession.secondsLeft} sn</span>
              <span className="rounded-full bg-white px-3 py-1">{timedSession.score} doğru</span>
              <span className="rounded-full bg-white px-3 py-1">{timedSession.mistakes} hata</span>
            </div>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${timePercent}%` }} />
          </div>
        </div>
      ) : null}

      <div className="mb-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
        <p className="text-base font-black leading-7 text-slate-950">{challenge.prompt}</p>
      </div>

      <ChallengeDisplay
        challenge={challenge}
        onToggleRecall={toggleRecallCell}
        phase={phase}
        recallDisabled={Boolean(result)}
        recallSelection={recallSelection}
      />

      {phase === "preview" ? (
        <div className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-center text-sm font-bold text-slate-600">
          {isVisualRecall ? "Yanan kareleri aklında tut. Kareler birazdan kapanacak." : "Diziyi aklında tut. Seçenekler birazdan açılacak."}
        </div>
      ) : isVisualRecall ? (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold text-slate-700">
              Seçilen kare: {recallSelection.length}/{challenge.display.active.length}
            </p>
            <button
              className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={Boolean(result) || recallSelection.length !== challenge.display.active.length}
              onClick={submitVisualRecall}
              type="button"
            >
              Kontrol et
            </button>
          </div>
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
                {item.visual?.gridSize ? (
                  <span className="flex items-center justify-between gap-3">
                    <span>{item.text}</span>
                    <MiniGridOption active={item.visual.active} gridSize={item.visual.gridSize} />
                  </span>
                ) : (
                  item.visual?.shape || item.text
                )}
              </button>
            );
          })}
        </div>
      )}

      {result ? (
        <div className={`mt-4 rounded-lg border p-4 ${result.correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
          <div className={`mb-1 flex items-center gap-2 text-sm font-bold ${result.correct ? "text-emerald-900" : "text-red-900"}`}>
            {result.correct ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
            {result.timedOut ? "Süre doldu" : result.correct ? "Doğru" : "Tekrar denemeye değer"}
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
  const [activeId, setActiveId] = useState(null);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [screen, setScreen] = useState("home");
  const [progress, setProgress] = useState(readProgress);
  const activeCategory = gameCategories.find((category) => category.id === activeCategoryId) || null;
  const activeExercise = exercises.find((exercise) => exercise.id === activeId) || exercises[0];
  const activeProgress = progress[activeExercise.id];
  const [challenge, setChallenge] = useState(() => generateExercise(exercises[0].id, progress[exercises[0].id].level));
  const [phase, setPhase] = useState(challenge.preview ? "preview" : "answer");
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState(null);
  const [timedSession, setTimedSession] = useState(emptyTimedSession);

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
      startNewChallenge(progress, activeExercise.id);
    }, result.correct ? 650 : 1100);

    return () => window.clearTimeout(timer);
  }, [activeExercise.id, progress, result]);

  useEffect(() => {
    if (screen !== "play" || phase !== "answer" || result || !timedSession.active) return undefined;

    if (timedSession.secondsLeft <= 0) {
      handleTimeout();
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setTimedSession((current) => {
        if (!current.active) return current;
        return { ...current, secondsLeft: Math.max(0, current.secondsLeft - 1) };
      });
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [phase, result, screen, timedSession.active, timedSession.secondsLeft]);

  function startNewChallenge(nextProgress = progress, nextId = activeExercise.id) {
    const nextChallenge = generateExercise(nextId, nextProgress[nextId].level);
    setChallenge(nextChallenge);
    setPhase(nextChallenge.preview ? "preview" : "answer");
    setSelectedOption(null);
    setResult(null);
    setTimedSession((current) => {
      if (!current.active) return current;
      return makeTimedSession(nextProgress[nextId].level, current.score, current.mistakes);
    });
  }

  function startTimedSession(nextProgress = progress, exerciseId = activeExercise.id) {
    setTimedSession(makeTimedSession(nextProgress[exerciseId].level));
    startNewChallenge(nextProgress, exerciseId);
  }

  function selectExercise(exerciseId) {
    setActiveId(exerciseId);
    setScreen("play");
    startTimedSession(progress, exerciseId);
  }

  function selectCategory(categoryId) {
    setActiveCategoryId(categoryId);
    setScreen("category");
  }

  function backToHome() {
    setScreen("home");
    setActiveCategoryId(null);
    setActiveId(null);
    setSelectedOption(null);
    setResult(null);
    setTimedSession(emptyTimedSession);
  }

  function backToCategory() {
    setScreen("category");
    setActiveId(null);
    setSelectedOption(null);
    setResult(null);
    setTimedSession(emptyTimedSession);
  }

  function handleAnswer(item) {
    if (result) return;
    finishRound(item);
  }

  function finishRound(item, timedOut = false) {
    const current = progress[activeExercise.id];
    const correct = Boolean(item?.correct) && !timedOut;
    const nextStreak = correct ? current.streak + 1 : 0;
    const leveledUp = correct && nextStreak >= LEVEL_UP_STREAK && current.level < MAX_LEVEL;
    const nextLevel = leveledUp ? current.level + 1 : current.level;
    const nextProgress = {
      ...progress,
      [activeExercise.id]: {
        level: nextLevel,
        bestLevel: Math.max(current.bestLevel, nextLevel),
        correct: current.correct + (correct ? 1 : 0),
        attempts: current.attempts + 1,
        streak: leveledUp ? 0 : nextStreak,
      },
    };

    setSelectedOption(item);
    setResult({ correct, leveledUp, timedOut });
    setProgress(nextProgress);
    if (timedSession.active) {
      setTimedSession((currentSession) => ({
        ...currentSession,
        score: currentSession.score + (correct ? 1 : 0),
        mistakes: currentSession.mistakes + (correct ? 0 : 1),
      }));
    }
  }

  function handleTimeout() {
    if (result) return;
    finishRound(null, true);
  }

  function resetCurrent() {
    const nextProgress = {
      ...progress,
      [activeExercise.id]: { level: 1, bestLevel: progress[activeExercise.id].bestLevel, correct: 0, attempts: 0, streak: 0 },
    };
    setProgress(nextProgress);
    startTimedSession(nextProgress, activeExercise.id);
  }

  function resetAllProgress() {
    const freshProgress = makeProgress();
    setProgress(freshProgress);
    setTimedSession(emptyTimedSession);
    setSelectedOption(null);
    setResult(null);
  }

  if (screen === "home") {
    return (
      <main className="min-h-screen bg-[#100b2b] text-white">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 sm:px-8">
          <header className="mx-auto mb-8 max-w-xl text-center">
            <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-orange-500 text-white shadow-2xl shadow-orange-500/30">
              <Brain size={46} />
            </div>
            <h1 className="text-4xl font-black tracking-normal sm:text-5xl">Odak Akademisi</h1>
            <p className="mt-3 text-base font-bold text-white/55">{exercises.length} oyun · 4 kategori · Odaklanmayı geliştir</p>
            <button
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 text-sm font-black text-white/75 transition hover:bg-white/15"
              onClick={resetAllProgress}
              type="button"
            >
              <RotateCcw size={16} />
              Tüm ilerlemeyi sıfırla
            </button>
          </header>

          <section className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-white/40">Kategori seç</p>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {gameCategories.map((category) => (
              <CategoryCard category={category} key={category.id} onClick={() => selectCategory(category.id)} />
            ))}
          </section>

          <section className="mt-6 grid gap-3 rounded-[24px] border border-white/10 bg-white/5 p-4 sm:grid-cols-3">
            <div>
              <span className="block text-xs font-bold text-white/45">Ortalama seviye</span>
              <strong className="text-3xl font-black">{totals.averageLevel}</strong>
            </div>
            <div>
              <span className="block text-xs font-bold text-white/45">Toplam doğru</span>
              <strong className="text-3xl font-black">{totals.correct}</strong>
            </div>
            <div>
              <span className="block text-xs font-bold text-white/45">Başarı</span>
              <strong className="text-3xl font-black">%{totals.accuracy}</strong>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (screen === "category" && activeCategory) {
    const categoryExercises = activeCategory.exerciseIds.map((id) => exercises.find((exercise) => exercise.id === id)).filter(Boolean);
    const CategoryIcon = activeCategory.icon;

    return (
      <main className="min-h-screen bg-[#100b2b] text-white">
        <div className="mx-auto min-h-screen w-full max-w-5xl px-5 py-8 sm:px-8">
          <button
            className="mb-5 inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 text-sm font-black text-white/75 transition hover:bg-white/15"
            onClick={backToHome}
            type="button"
          >
            <ArrowLeft size={17} />
            Geri
          </button>

          <header className="mb-7 flex items-center gap-4">
            <span className={`grid h-16 w-16 place-items-center rounded-[22px] bg-gradient-to-br ${activeCategory.accent} text-white shadow-xl shadow-black/20`}>
              <CategoryIcon size={32} />
            </span>
            <div>
              <h1 className="text-3xl font-black">{activeCategory.title}</h1>
              <p className="mt-1 text-sm font-bold text-white/50">{categoryExercises.length} oyun · {activeCategory.subtitle}</p>
            </div>
          </header>

          <section className="space-y-4">
            {categoryExercises.map((exercise) => (
              <GameListItem exercise={exercise} key={exercise.id} onClick={() => selectExercise(exercise.id)} progress={progress[exercise.id]} />
            ))}
          </section>
        </div>
      </main>
    );
  }

  if (screen === "play") {
    return (
      <main className="min-h-screen bg-[#100b2b] text-white">
        <div className="mx-auto min-h-screen w-full max-w-5xl px-5 py-6 sm:px-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <button
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 text-sm font-black text-white/75 transition hover:bg-white/15"
              onClick={backToCategory}
              type="button"
            >
              <ArrowLeft size={17} />
              Oyunlar
            </button>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 text-sm font-black text-white/75 transition hover:bg-white/15"
              onClick={resetCurrent}
              type="button"
            >
              <RotateCcw size={16} />
              Sıfırla
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
            timedSession={timedSession}
          />

          <section className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-white/10 bg-white/10 p-4">
              <span className="block text-xs font-bold text-white/45">Seri</span>
              <strong className="text-2xl font-black">{activeProgress.streak}/{LEVEL_UP_STREAK}</strong>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/10 p-4">
              <span className="block text-xs font-bold text-white/45">Seviye</span>
              <strong className="text-2xl font-black">{activeProgress.level}</strong>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/10 p-4">
              <span className="block text-xs font-bold text-white/45">Toplam görev</span>
              <strong className="text-2xl font-black">{totals.attempts}</strong>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return null;

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
                <h1 className="text-2xl font-black text-white">Odak Akademisi</h1>
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
