import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpenText,
  BookmarkCheck,
  Brain,
  CheckCircle2,
  ClipboardList,
  Eye,
  EyeOff,
  Hash,
  Languages,
  ListChecks,
  Loader2,
  Save,
  Sparkles,
  Trash2,
  Wand2,
  XCircle,
} from "lucide-react";
import "./styles.css";

const sampleParagraph =
  "Dünya, üzerinde bulunan canlı ve cansız varlıklar ile bunların ilişkilerinden meydana gelen büyük bir ekosistemden oluşur. İnsanoğlu bu ekosistemin etkin bir parçasıdır. Ancak aynı zamanda ekosistemin en önemli tehdit kaynaklarından biri de insandır. Çeşitli görüşlere göre 4,5 milyar yaşında olan Dünya'mızda bugüne kadar yaşanan doğal afetler neticesinde yaşamsal varlıkların 5 kez yok olduğu, günümüzde ise 6. yok oluşun başladığı ileri sürülmektedir. Türlerin yok oluş hızını değerlendiren uzmanlara göre insanoğlu bu yok oluşun temel sebebidir.";

function readSavedQuestions() {
  try {
    return JSON.parse(localStorage.getItem("savedQuestions") || "[]");
  } catch {
    return [];
  }
}

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

function SegmentButton({ active, children, icon: Icon, onClick }) {
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
        active ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50"
      }`}
      onClick={onClick}
      type="button"
    >
      <Icon size={16} />
      {children}
    </button>
  );
}

function QuestionCard({ isSaved, onSave, question, revealAll }) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const hasSelection = Boolean(selectedKey);
  const selectedIsCorrect = selectedKey === question.correctKey;
  const showAnswer = revealAll || isVisible || hasSelection;

  useEffect(() => {
    setIsVisible(false);
    setSelectedKey("");
  }, [question.question, question.answer]);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="inline-flex rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
            {question.type}
          </span>
          <h3 className="mt-3 text-base font-semibold leading-7 text-slate-950">{question.question}</h3>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition ${
              isSaved
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            disabled={isSaved}
            onClick={onSave}
            type="button"
          >
            {isSaved ? <BookmarkCheck size={16} /> : <Save size={16} />}
            {isSaved ? "Kaydedildi" : "Kaydet"}
          </button>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={() => setIsVisible((current) => !current)}
            type="button"
          >
            {showAnswer ? <EyeOff size={16} /> : <Eye size={16} />}
            {showAnswer ? "Gizle" : "Cevabı göster"}
          </button>
        </div>
      </div>

      <div className="grid gap-2">
        {question.options.map((option) => {
          const isCorrectOption = option.key === question.correctKey;
          const isSelected = selectedKey === option.key;
          const showCorrect = showAnswer && isCorrectOption;
          const showWrong = hasSelection && isSelected && !isCorrectOption;

          return (
            <button
              className={`flex w-full gap-3 rounded-lg border px-3 py-3 text-left text-sm leading-6 transition ${
                showCorrect
                  ? "border-emerald-400 bg-emerald-50 text-emerald-950"
                  : showWrong
                    ? "border-red-400 bg-red-50 text-red-950"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
              }`}
              key={option.key}
              onClick={() => setSelectedKey(option.key)}
              type="button"
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-md text-xs font-bold ${
                  showCorrect ? "bg-emerald-600 text-white" : showWrong ? "bg-red-600 text-white" : "bg-white text-slate-700"
                }`}
              >
                {option.key}
              </span>
              <span>{option.text}</span>
            </button>
          );
        })}
      </div>

      {showAnswer ? (
        <div
          className={`mt-4 rounded-lg border p-4 ${
            hasSelection && !selectedIsCorrect ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"
          }`}
        >
          {hasSelection ? (
            <div
              className={`mb-2 flex items-center gap-2 text-sm font-semibold ${
                selectedIsCorrect ? "text-emerald-900" : "text-red-900"
              }`}
            >
              {selectedIsCorrect ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
              {selectedIsCorrect ? "Tebrikler, doğru işaretledin" : `Seçtiğin cevap: ${selectedKey}`}
            </div>
          ) : null}
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

function ItemListCard({ description, items, title }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
      {items.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => (
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-700" key={item}>
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-500">Bu bölüm için belirgin örnek bulunamadı.</p>
      )}
    </section>
  );
}

function LanguagePanel({ analysis }) {
  if (!analysis) return null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {analysis.verbals.map((group) => (
          <ItemListCard description={group.explanation} items={group.items} key={group.label} title={group.label} />
        ))}
      </div>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-950">Cümle türleri</h3>
          <p className="mt-1 text-sm text-slate-600">Her cümle yüklemine, anlamına ve yüklemin yerine göre sınıflandırılmıştır.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <thead className="bg-white text-xs uppercase tracking-normal text-slate-500">
              <tr>
                <th className="border-b border-slate-200 px-5 py-3 font-semibold">No</th>
                <th className="border-b border-slate-200 px-5 py-3 font-semibold">Cümle</th>
                <th className="border-b border-slate-200 px-5 py-3 font-semibold">Yüklemine göre</th>
                <th className="border-b border-slate-200 px-5 py-3 font-semibold">Anlamına göre</th>
                <th className="border-b border-slate-200 px-5 py-3 font-semibold">Yüklemin yerine göre</th>
              </tr>
            </thead>
            <tbody>
              {analysis.sentenceTypes.map((row) => (
                <tr className="align-top odd:bg-slate-50/60" key={`${row.order}-${row.sentence}`}>
                  <td className="w-16 border-b border-slate-100 px-5 py-4 font-semibold text-slate-900">{row.order}</td>
                  <td className="border-b border-slate-100 px-5 py-4 leading-6 text-slate-700">{row.sentence}</td>
                  <td className="w-40 border-b border-slate-100 px-5 py-4 font-medium text-slate-900">{row.predicateType}</td>
                  <td className="w-40 border-b border-slate-100 px-5 py-4 font-medium text-slate-900">{row.meaningType}</td>
                  <td className="w-44 border-b border-slate-100 px-5 py-4 font-medium text-slate-900">{row.orderType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <ItemListCard description={analysis.adjectives.explanation} items={analysis.adjectives.items} title="Sıfatlar" />
        <ItemListCard description={analysis.nounPhrases.explanation} items={analysis.nounPhrases.items} title="İsim tamlamaları" />
        <ItemListCard description={analysis.adjectivePhrases.explanation} items={analysis.adjectivePhrases.items} title="Sıfat tamlamaları" />
      </div>
    </div>
  );
}

function SavedQuestions({ onRemove, questions }) {
  if (questions.length === 0) {
    return (
      <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
        <BookmarkCheck className="mx-auto mb-3 h-8 w-8 text-slate-400" />
        <h3 className="text-base font-semibold text-slate-950">Henüz kaydedilmiş soru yok</h3>
        <p className="mt-2 text-sm text-slate-600">Beğendiğin sorulardaki Kaydet düğmesine basınca burada görünecek.</p>
      </section>
    );
  }

  return (
    <div className="space-y-3">
      {questions.map((question) => (
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={question.savedId}>
          <div className="mb-3 flex items-start justify-between gap-3">
            <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">{question.type}</span>
            <button
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              onClick={() => onRemove(question.savedId)}
              type="button"
            >
              <Trash2 size={15} />
              Sil
            </button>
          </div>
          <h3 className="text-base font-semibold leading-7 text-slate-950">{question.question}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            <strong>Doğru cevap:</strong> {question.correctKey}) {question.answer}
          </p>
        </article>
      ))}
    </div>
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
        Paragrafı ekleyip soruları hazırladığında soru seti ve dil bilgisi incelemesi sekmeler hâlinde açılır.
      </p>
    </section>
  );
}

function App() {
  const [paragraph, setParagraph] = useState("");
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("questions");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [revealAll, setRevealAll] = useState(false);
  const [savedQuestions, setSavedQuestions] = useState(readSavedQuestions);

  const stats = useMemo(() => {
    const words = paragraph.trim().split(/\s+/).filter(Boolean);
    const sentences = paragraph.split(/[.!?]+/).map((item) => item.trim()).filter(Boolean);
    return { words: words.length, sentences: sentences.length, chars: paragraph.trim().length };
  }, [paragraph]);

  function persistSaved(nextQuestions) {
    setSavedQuestions(nextQuestions);
    localStorage.setItem("savedQuestions", JSON.stringify(nextQuestions));
  }

  function questionSignature(question) {
    return `${question.type}-${question.question}-${question.answer}`;
  }

  function saveQuestion(question) {
    const signature = questionSignature(question);
    if (savedQuestions.some((item) => item.signature === signature)) return;

    persistSaved([
      {
        ...question,
        signature,
        savedId: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        paragraphPreview: paragraph.slice(0, 160),
      },
      ...savedQuestions,
    ]);
  }

  function removeSavedQuestion(savedId) {
    persistSaved(savedQuestions.filter((question) => question.savedId !== savedId));
  }

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
      setActiveTab("questions");
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
                    <h2 className="text-lg font-semibold text-slate-950">Hazırlanan çalışma seti</h2>
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

                <div className="inline-flex flex-wrap rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                  <SegmentButton active={activeTab === "questions"} icon={ListChecks} onClick={() => setActiveTab("questions")}>
                    Sorular
                  </SegmentButton>
                  <SegmentButton active={activeTab === "language"} icon={Languages} onClick={() => setActiveTab("language")}>
                    Dil bilgisi
                  </SegmentButton>
                  <SegmentButton active={activeTab === "saved"} icon={BookmarkCheck} onClick={() => setActiveTab("saved")}>
                    Kaydedilenler ({savedQuestions.length})
                  </SegmentButton>
                </div>

                {activeTab === "questions" ? (
                  <div className="space-y-4">
                    {result.questions.map((question) => {
                      const signature = questionSignature(question);
                      const isSaved = savedQuestions.some((saved) => saved.signature === signature);

                      return (
                        <QuestionCard
                          isSaved={isSaved}
                          key={question.id}
                          onSave={() => saveQuestion(question)}
                          question={question}
                          revealAll={revealAll}
                        />
                      );
                    })}
                  </div>
                ) : null}

                {activeTab === "language" ? <LanguagePanel analysis={result.languageAnalysis} /> : null}

                {activeTab === "saved" ? <SavedQuestions onRemove={removeSavedQuestion} questions={savedQuestions} /> : null}
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
