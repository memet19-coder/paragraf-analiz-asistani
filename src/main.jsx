import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpenText,
  Brain,
  CheckCircle2,
  ClipboardList,
  FileText,
  Gauge,
  Hash,
  Languages,
  Lightbulb,
  Loader2,
  PenLine,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react";
import "./styles.css";

const sampleParagraph =
  "Binlerce yıl önce yaşayan insanlar, bazı taşların diğerlerinden farklı olduğunu fark etmişti. Kimi taşlar güneş ışığında parlıyor, kimileri olağanüstü renklere sahip oluyor, bazıları ise nadir bulunuyordu. Antik Mısır'dan Mezopotamya'ya, Çin'den Anadolu'ya kadar birçok medeniyet, taşların yalnızca süs eşyası olmadığını düşünüyordu. Krallar, savaşçılar, din adamları ve şifacılar belirli taşları koruyucu bir güç olarak taşıyorlardı.";

const analysisCards = [
  { key: "konu", title: "Konu", icon: BookOpenText },
  { key: "anaFikir", title: "Ana fikir", icon: Target },
  { key: "yardimciFikirler", title: "Yardımcı fikirler", icon: Lightbulb },
  { key: "ozet", title: "Özet", icon: FileText },
  { key: "baslikOnerileri", title: "Başlık önerileri", icon: PenLine },
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

function ResultCard({ item, value }) {
  const Icon = item.icon;
  const listValue = Array.isArray(value) ? value : null;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-cyan-50 text-cyan-700">
          <Icon size={20} />
        </span>
        <h2 className="text-base font-semibold text-slate-950">{item.title}</h2>
      </div>
      {listValue ? (
        <ul className="space-y-2 text-sm leading-6 text-slate-700">
          {listValue.map((entry) => (
            <li className="flex gap-2" key={entry}>
              <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
              <span>{entry}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm leading-6 text-slate-700">{value}</p>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <section className="flex min-h-[420px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-lg bg-amber-50 text-amber-700">
        <Sparkles size={26} />
      </span>
      <h2 className="text-lg font-semibold text-slate-950">Analiz sonucu burada görünecek</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
        Paragrafı yazıp analiz ettiğinde anlam analizi ve dil bilgisi çözümlemesi ayrı sekmelerde hazırlanır.
      </p>
    </section>
  );
}

function GrammarTable({ rows }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">Dil bilgisi analizi</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-white text-xs uppercase tracking-normal text-slate-500">
            <tr>
              <th className="border-b border-slate-200 px-5 py-3 font-semibold">Kelime türü</th>
              <th className="border-b border-slate-200 px-5 py-3 font-semibold">Bulunan kelimeler</th>
              <th className="border-b border-slate-200 px-5 py-3 font-semibold">Açıklama</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr className="align-top odd:bg-slate-50/60" key={row.key}>
                <td className="w-48 border-b border-slate-100 px-5 py-4 font-semibold text-slate-950">{row.label}</td>
                <td className="border-b border-slate-100 px-5 py-4 text-slate-700">
                  {row.words.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {row.words.map((word) => (
                        <span className="rounded-md bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-800" key={word}>
                          {word}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400">Tespit edilmedi</span>
                  )}
                </td>
                <td className="border-b border-slate-100 px-5 py-4 leading-6 text-slate-600">{row.explanation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function App() {
  const [paragraph, setParagraph] = useState("");
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("analysis");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const stats = useMemo(() => {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    const sentences = paragraph.split(/[.!?]+/).map((item) => item.trim()).filter(Boolean);
    return { words: words.length, sentences: sentences.length, chars: paragraph.trim().length };
  }, [paragraph]);

  async function analyzeParagraph() {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paragraph }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Analiz sırasında bir sorun oluştu.");
      }

      setResult(data);
      setActiveTab("analysis");
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
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">
              <Brain size={14} />
              Türkçe paragraf analiz aracı
            </p>
            <h1 className="text-2xl font-bold tracking-normal text-slate-950 sm:text-3xl">Paragraf Analiz Asistanı</h1>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <StatCard icon={Hash} label="Kelime" value={stats.words} />
            <StatCard icon={ClipboardList} label="Cümle" value={stats.sentences} />
            <StatCard icon={Gauge} label="Karakter" value={stats.chars} />
          </div>
        </header>

        <div className="grid flex-1 gap-6 py-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
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
              className="min-h-[410px] flex-1 resize-none rounded-lg border border-slate-200 bg-slate-50 p-4 text-base leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
              onChange={(event) => setParagraph(event.target.value)}
              placeholder="Analiz etmek istediğin paragrafı buraya yapıştır..."
              value={paragraph}
            />
            {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}
            <button
              className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={isLoading || paragraph.trim().length < 20}
              onClick={analyzeParagraph}
              type="button"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles size={20} />}
              Analiz Et
            </button>
          </section>

          <section className="min-w-0">
            {result ? (
              <div className="space-y-4">
                <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                  <button
                    className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
                      activeTab === "analysis" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50"
                    }`}
                    onClick={() => setActiveTab("analysis")}
                    type="button"
                  >
                    <BookOpenText size={16} />
                    Paragraf analizi
                  </button>
                  <button
                    className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
                      activeTab === "grammar" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50"
                    }`}
                    onClick={() => setActiveTab("grammar")}
                    type="button"
                  >
                    <Languages size={16} />
                    Dil bilgisi analizi
                  </button>
                </div>

                {activeTab === "analysis" ? (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {analysisCards.map((item) => (
                        <ResultCard item={item} key={item.key} value={result[item.key]} />
                      ))}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <span className="text-xs font-medium text-slate-500">Anahtar kelimeler</span>
                        <p className="mt-2 text-sm font-semibold text-slate-800">{result.anahtarKelimeler.join(", ") || "Yok"}</p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <span className="text-xs font-medium text-slate-500">Metin türü</span>
                        <p className="mt-2 text-sm font-semibold text-slate-800">{result.metinTuru}</p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <span className="text-xs font-medium text-slate-500">Zorluk seviyesi</span>
                        <p className="mt-2 text-sm font-semibold text-slate-800">{result.zorlukSeviyesi}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <GrammarTable rows={result.dilBilgisi} />
                )}
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
