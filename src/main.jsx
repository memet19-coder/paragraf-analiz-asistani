import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpenText,
  Brain,
  CheckCircle2,
  ClipboardList,
  Eye,
  EyeOff,
  Hash,
  Lightbulb,
  Loader2,
  PenLine,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react";
import "./styles.css";

const sampleParagraph =
  "Dünya, üzerinde bulunan canlı ve cansız varlıklar ile bunların ilişkilerinden meydana gelen büyük bir ekosistemden oluşur. İnsanoğlu bu ekosistemin etkin bir parçasıdır. Ancak aynı zamanda ekosistemin en önemli tehdit kaynaklarından biri de insandır. Çeşitli görüşlere göre 4,5 milyar yaşında olan Dünya'mızda bugüne kadar yaşanan doğal afetler neticesinde yaşamsal varlıkların 5 kez yok olduğu, günümüzde ise 6. yok oluşun başladığı ileri sürülmektedir. Türlerin yok oluş hızını değerlendiren uzmanlara göre insanoğlu bu yok oluşun temel sebebidir.";

const overviewItems = [
  { key: "topic", title: "Konu", icon: BookOpenText },
  { key: "mainIdea", title: "Ana fikir", icon: Target },
  { key: "textType", title: "Anlatım biçimi", icon: PenLine },
  { key: "suggestedTitle", title: "Başlık önerisi", icon: Lightbulb },
];

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-500">
        <Icon size={14} />
        {label}
      </div>
      <strong className="text-xl font-semibold text-slate-950">{value}</strong>
    </div>
  );
}

function OverviewCard({ item, value }) {
  const Icon = item.icon;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-950">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
          <Icon size={17} />
        </span>
        {item.title}
      </div>
      <p className="text-sm leading-6 text-slate-700">{value}</p>
    </section>
  );
}

function QuestionCard({ question, revealAll }) {
  const [isVisible, setIsVisible] = useState(false);
  const showAnswer = revealAll || isVisible;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="inline-flex rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
            {question.type}
          </span>
          <h3 className="mt-3 text-base font-semibold leading-7 text-slate-950">{question.question}</h3>
        </div>
        <button
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          onClick={() => setIsVisible((current) => !current)}
          type="button"
        >
          {showAnswer ? <EyeOff size={16} /> : <Eye size={16} />}
          {showAnswer ? "Gizle" : "Cevabı göster"}
        </button>
      </div>

      <div className="grid gap-2">
        {question.options.map((option) => {
          const isCorrect = showAnswer && option.key === question.correctKey;

          return (
            <div
              className={`flex gap-3 rounded-lg border px-3 py-3 text-sm leading-6 transition ${
                isCorrect ? "border-emerald-300 bg-emerald-50 text-emerald-950" : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
              key={option.key}
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-md text-xs font-bold ${
                  isCorrect ? "bg-emerald-600 text-white" : "bg-white text-slate-700"
                }`}
              >
                {option.key}
              </span>
              <span>{option.text}</span>
            </div>
          );
        })}
      </div>

      {showAnswer ? (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-900">
            <CheckCircle2 size={17} />
            Doğru cevap: {question.correctKey}
          </div>
          <p className="text-sm leading-6 text-emerald-950">{question.explanation}</p>
        </div>
      ) : null}
    </article>
  );
}

function EmptyState() {
  return (
    <section className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-lg bg-amber-50 text-amber-700">
        <Sparkles size={26} />
      </span>
      <h2 className="text-lg font-semibold text-slate-950">Sorular burada hazırlanacak</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
        Paragrafı ekleyip soruları hazırladığında konu, ana fikir, çıkarım, söylenemez ve anlatım biçimi gibi soru türleri oluşur.
      </p>
    </section>
  );
}

function App() {
  const [paragraph, setParagraph] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [revealAll, setRevealAll] = useState(false);

  const stats = useMemo(() => {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    const sentences = paragraph.split(/[.!?]+/).map((item) => item.trim()).filter(Boolean);
    return { words: words.length, sentences: sentences.length, chars: paragraph.trim().length };
  }, [paragraph]);

  async function generateQuestionSet() {
    setError("");
    setIsLoading(true);
    setRevealAll(false);

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paragraph }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Sorular hazırlanırken bir sorun oluştu.");
      }

      setResult(data);
    } catch (currentError) {
      setError(currentError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              <Brain size={14} />
              Türkçe paragraf soru hazırlama aracı
            </p>
            <h1 className="text-2xl font-bold tracking-normal text-slate-950 sm:text-3xl">Paragraf Soru Asistanı</h1>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <StatCard icon={Hash} label="Kelime" value={stats.words} />
            <StatCard icon={ClipboardList} label="Cümle" value={stats.sentences} />
            <StatCard icon={BookOpenText} label="Karakter" value={stats.chars} />
          </div>
        </header>

        <div className="grid flex-1 gap-6 py-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
          <section className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-slate-950">Paragraf</h2>
              <button
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                onClick={() => setParagraph(sampleParagraph)}
                type="button"
              >
                <Wand2 size={16} />
                Örnek metin
              </button>
            </div>
            <textarea
              className="min-h-[430px] flex-1 resize-none rounded-lg border border-slate-200 bg-slate-50 p-4 text-base leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              onChange={(event) => setParagraph(event.target.value)}
              placeholder="Soru hazırlamak istediğin paragrafı buraya yapıştır..."
              value={paragraph}
            />
            {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}
            <button
              className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={isLoading || paragraph.trim().length < 20}
              onClick={generateQuestionSet}
              type="button"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles size={20} />}
              Soruları Hazırla
            </button>
          </section>

          <section className="min-w-0">
            {result ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">Hazırlanan soru seti</h2>
                    <p className="mt-1 text-sm text-slate-600">{result.questions.length} soru oluşturuldu.</p>
                  </div>
                  <button
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    onClick={() => setRevealAll((current) => !current)}
                    type="button"
                  >
                    {revealAll ? <EyeOff size={16} /> : <Eye size={16} />}
                    {revealAll ? "Tüm cevapları gizle" : "Tüm cevapları göster"}
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {overviewItems.map((item) => (
                    <OverviewCard item={item} key={item.key} value={result.overview[item.key]} />
                  ))}
                </div>

                <div className="space-y-4">
                  {result.questions.map((question) => (
                    <QuestionCard key={question.id} question={question} revealAll={revealAll} />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
