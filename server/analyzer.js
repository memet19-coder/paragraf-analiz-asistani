const STOP_WORDS = new Set([
  "acaba",
  "ama",
  "ancak",
  "aslında",
  "bazı",
  "bir",
  "birçok",
  "bu",
  "bunu",
  "da",
  "de",
  "daha",
  "diye",
  "en",
  "gibi",
  "göre",
  "hem",
  "için",
  "ile",
  "ise",
  "kadar",
  "ki",
  "mi",
  "ne",
  "olan",
  "olarak",
  "olduğu",
  "sonra",
  "ve",
  "veya",
]);

const TEXT_TYPES = [
  "Açıklayıcı anlatım",
  "Tartışmacı anlatım",
  "Öyküleyici anlatım",
  "Betimleyici anlatım",
];

const TOPIC_PROFILES = [
  {
    terms: ["belgelerim", "yazar", "öykü", "öyküler", "gerçek", "kurmaca", "tasarlamış", "anlatılanların"],
    topic: "yazarın kurmaca metinlerde gerçeklik izlenimi oluşturma çabası",
    mainIdea:
      "Yazar, anlatılarını gerçek belgelere dayanıyormuş gibi kurgulayarak okurda yaşanmışlık duygusu uyandırmak istemiştir.",
    direct:
      "Anlatılanların gerçekmiş gibi görünmesi, yazarın bu etkiyi baştan tasarlamış olmasıyla ilişkilidir.",
    inference:
      "Yazarın amacı, kurmaca ile gerçeklik arasındaki sınırı okur açısından belirsizleştirmektir.",
    wrong:
      "Yazarın amacı, metinlerinin kurmaca olduğunu özellikle gizlemeden ve gerçeklik izlenimi oluşturmadan anlatmaktır.",
    topicWrong:
      "Yazarın çocukluk anılarının kronolojik biçimde aktarılması",
    title: "Kurmaca ile Gerçeklik Arasında",
    titleOptions: ["Gerçeklik İzlenimi ve Kurmaca", "Belgelerle Kurulan Anlatı", "Öyküde Yaşanmışlık Etkisi"],
    textType: "Açıklayıcı anlatım",
    answeredQuestion: "Anlatılanlar neden gerçekten yaşanmış gibi görünmektedir?",
    support: [
      "Yazarın gerçekmiş gibi görünen öyküler kurmayı baştan tasarladığı anlaşılmaktadır.",
      "Metinde anlatılanların okurda yaşanmışlık izlenimi bıraktığı vurgulanmaktadır.",
      "Bu etki, yazarın bilinçli anlatım tercihiyle açıklanmaktadır.",
    ],
  },
  {
    terms: ["dünya", "ekosistem", "canlı", "cansız", "insanoğlu", "insan", "tehdit", "doğal afet", "yok oluş", "tür"],
    topic: "insanın Dünya ekosistemi içindeki yeri ve ekolojik dengeye etkisi",
    mainIdea:
      "İnsan, ekosistemin bir parçası olmasına rağmen canlı türlerinin yok oluşunu hızlandıran önemli tehdit kaynaklarından biri hâline gelmiştir.",
    direct: "İnsanoğlu ekosistemin etkin bir parçası olmakla birlikte bu sistem için önemli bir tehdit kaynağıdır.",
    inference: "İnsan faaliyetleri, doğal dengenin bozulmasında ve tür kayıplarının hızlanmasında etkili olabilir.",
    wrong: "Canlı türlerinin yok oluşunda insanın hiçbir etkisi bulunmamaktadır.",
    topicWrong: "Doğal afetlerin insan yaşamındaki olumlu sonuçları",
    title: "Dünya Ekosisteminde İnsan Etkisi",
    titleOptions: ["Altıncı Yok Oluş Tehlikesi", "İnsan ve Ekolojik Denge", "Ekosistemin En Büyük Tehdidi"],
    textType: "Açıklayıcı anlatım",
    answeredQuestion: "İnsanın ekosistem üzerindeki etkisi nasıl değerlendirilmektedir?",
    support: [
      "Dünya, canlı ve cansız varlıkların ilişkilerinden oluşan büyük bir ekosistemdir.",
      "İnsan bu ekosistemin hem etkin bir parçası hem de tehdit kaynaklarından biridir.",
      "Uzmanlara göre türlerin yok oluş hızında insan etkisi belirleyicidir.",
    ],
  },
  {
    terms: ["su", "tasarruf", "kuraklık", "tüketim", "bilinçli", "kaynak", "gelecek", "israf"],
    topic: "su kaynaklarının bilinçli kullanılması ve tasarrufun önemi",
    mainIdea: "Su kaynaklarını korumak için bireylerin günlük yaşamda bilinçli ve tasarruflu davranması gerekir.",
    direct: "Küçük önlemler bile su kaynaklarının korunmasına katkı sağlayabilir.",
    inference: "Bireysel davranışlar doğal kaynakların korunmasında etkili olabilir.",
    wrong: "Su kaynakları sınırsız olduğu için tasarruf yapmaya gerek yoktur.",
    topicWrong: "Suyun yalnızca sanayide kullanım alanları",
    title: "Su Tasarrufunun Önemi",
    titleOptions: ["Kuraklığa Karşı Bilinçli Tüketim", "Suyu Korumak Geleceği Korumaktır", "Kaynakları Bilinçli Kullanmak"],
    textType: "Açıklayıcı anlatım",
    answeredQuestion: "Su kaynaklarını korumak için bireylere hangi görev düşmektedir?",
    support: [
      "Su kaynakları sınırsız değildir.",
      "Bilinçli tüketim gelecek için önemlidir.",
      "Tasarruf, kuraklık riskine karşı alınabilecek önlemlerden biridir.",
    ],
  },
  {
    terms: ["kitap", "okuma", "okumak", "roman", "öykü", "düşünce", "hayal", "dil", "kelime"],
    topic: "kitap okumanın düşünce, dil ve hayal gücü üzerindeki etkileri",
    mainIdea:
      "Düzenli kitap okuma alışkanlığı bireyin düşünme becerisini, dil kullanımını ve hayal gücünü geliştirir.",
    direct: "Kitap okuma bireyin kelime dağarcığını ve düşünce dünyasını geliştirebilir.",
    inference: "Okuma alışkanlığı bireyin kendini daha iyi ifade etmesine katkı sağlayabilir.",
    wrong: "Kitap okuma, bireyin düşünme ve anlatma becerilerini olumsuz etkiler.",
    topicWrong: "Kitapların basım teknikleri ve fiyat değişimleri",
    title: "Kitap Okumanın Katkıları",
    titleOptions: ["Okuma Alışkanlığının Gücü", "Kitaplarla Gelişen Düşünce", "Hayal Gücünü Besleyen Kitaplar"],
    textType: "Açıklayıcı anlatım",
    answeredQuestion: "Kitap okuma bireye hangi yönlerden katkı sağlar?",
    support: [
      "Kitaplar farklı bakış açıları kazandırır.",
      "Okuma alışkanlığı dil gelişimini destekler.",
      "Hayal gücü ve düşünme becerisi kitaplarla gelişebilir.",
    ],
  },
  {
    terms: ["teknoloji", "internet", "dijital", "bilgi", "kaynak", "öğrenme", "araştırma", "eleştirel"],
    topic: "teknolojinin bilgiye ulaşma ve öğrenme sürecine etkisi",
    mainIdea:
      "Teknoloji bilgiye erişimi kolaylaştırsa da doğru bilgiyi seçme ve eleştirel düşünme becerisini daha önemli hâle getirmiştir.",
    direct: "Teknoloji sayesinde bilgiye ulaşmak eskiye göre daha hızlı ve kolaydır.",
    inference: "Bilgi kaynaklarının artması, doğru bilgiyi ayırt etmeyi gerekli kılar.",
    wrong: "İnternette ulaşılan bütün bilgiler güvenilir ve sorgulanmadan kullanılabilir niteliktedir.",
    topicWrong: "Teknolojik araçların üretim maliyetleri",
    title: "Teknoloji ve Doğru Bilgi",
    titleOptions: ["Dijital Çağda Seçici Olmak", "Bilgiye Erişim ve Eleştirel Düşünme", "Teknolojinin Öğrenmeye Etkisi"],
    textType: "Açıklayıcı anlatım",
    answeredQuestion: "Teknoloji bilgiye ulaşma sürecini nasıl etkilemiştir?",
    support: [
      "Bilgiye ulaşmak kolaylaşmıştır.",
      "Kaynak sayısının artması seçici olmayı gerektirir.",
      "Eleştirel düşünme dijital çağda önem kazanmıştır.",
    ],
  },
  {
    terms: ["spor", "beden", "sağlık", "ruhsal", "fiziksel", "hareket", "stres", "enerjik", "egzersiz"],
    topic: "sporun beden ve ruh sağlığı üzerindeki olumlu etkileri",
    mainIdea:
      "Düzenli spor yapmak, bireyin hem fiziksel sağlığını korur hem de ruhsal açıdan daha dengeli olmasına katkı sağlar.",
    direct: "Spor yapmak kişinin bedensel ve ruhsal sağlığını destekler.",
    inference: "Düzenli hareket eden bireyler kendilerini daha sağlıklı ve enerjik hissedebilir.",
    wrong: "Sporun insan sağlığı üzerinde herhangi bir olumlu etkisi yoktur.",
    topicWrong: "Spor karşılaşmalarının tarihsel sıralaması",
    title: "Sporun Sağlığa Katkıları",
    titleOptions: ["Düzenli Hareketin Önemi", "Beden ve Ruh Sağlığı İçin Spor", "Hareketli Yaşamın Gücü"],
    textType: "Açıklayıcı anlatım",
    answeredQuestion: "Düzenli spor yapmak bireye hangi açılardan katkı sağlar?",
    support: [
      "Spor beden sağlığını destekler.",
      "Düzenli hareket ruhsal dengeye katkı sağlar.",
      "Stresle baş etmede fiziksel aktivite etkili olabilir.",
    ],
  },
];

function normalize(text) {
  return text.toLocaleLowerCase("tr-TR");
}

function splitSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function tokenize(text) {
  return text.match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu) || [];
}

function cleanWord(word) {
  return normalize(word).replace(/['’].*$/, "");
}

function cleanSentence(sentence) {
  return sentence.replace(/[.!?]$/, "").trim();
}

function shorten(text, maxLength = 165) {
  const clean = cleanSentence(text);
  return clean.length <= maxLength ? clean : `${clean.slice(0, maxLength).trim()}...`;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function getContentWords(text) {
  return tokenize(text)
    .map(cleanWord)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word) && !/^\d+$/.test(word));
}

function getKeywords(text, limit = 8) {
  const counts = new Map();

  for (const word of getContentWords(text)) {
    counts.set(word, (counts.get(word) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .slice(0, limit)
    .map(([word]) => word);
}

function scoreProfile(text, profile) {
  const lower = normalize(text);
  return profile.terms.reduce((score, term) => (lower.includes(term) ? score + 1 : score), 0);
}

function findProfile(text) {
  const best = TOPIC_PROFILES.map((profile) => ({ profile, score: scoreProfile(text, profile) })).sort(
    (a, b) => b.score - a.score,
  )[0];

  return best?.score >= 2 ? best.profile : null;
}

function inferTextType(text) {
  const lower = normalize(text);

  if (/(bence|savunur|kanıtlar|gereklidir|olmalıdır|yanlıştır|doğrudur|oysa|halbuki)/.test(lower)) {
    return "Tartışmacı anlatım";
  }

  if (/(kahraman|olay|zaman|yer|yaşadı|gördü|duydu|geldi|gitti|başladı)/.test(lower)) {
    return "Öyküleyici anlatım";
  }

  if (/(masmavi|yemyeşil|sessiz|karanlık|aydınlık|güzel|uzun|kısa|geniş|dar|sıcak|soğuk)/.test(lower)) {
    return "Betimleyici anlatım";
  }

  return "Açıklayıcı anlatım";
}

function findMainIdea(sentences, keywords) {
  const markers = /(bu nedenle|bu yüzden|sonuç olarak|dolayısıyla|kısacası|özetle|böylece|temel sebep|en önemli|asıl|ancak|fakat)/i;
  const keywordSet = new Set(keywords.slice(0, 8));

  const scored = sentences.map((sentence, index) => {
    const words = getContentWords(sentence);
    const keywordScore = words.reduce((score, word) => score + (keywordSet.has(word) ? 1.4 : 0), 0);
    const markerScore = markers.test(sentence) ? 4 : 0;
    const positionScore = index === sentences.length - 1 ? 2 : index === 0 ? 0.5 : 0;
    const lengthScore = Math.min(words.length / 9, 2);

    return { sentence: cleanSentence(sentence), score: keywordScore + markerScore + positionScore + lengthScore };
  });

  return scored.sort((a, b) => b.score - a.score)[0]?.sentence || cleanSentence(sentences.at(-1) || sentences[0] || "");
}

function makeGenericAnalysis(paragraph) {
  const sentences = splitSentences(paragraph).map(cleanSentence);
  const keywords = getKeywords(paragraph);
  const mainIdea = findMainIdea(sentences, keywords);
  const first = sentences[0] || mainIdea;
  const second = sentences.find((sentence) => sentence !== first) || mainIdea;
  const focus = keywords.slice(0, 3).join(", ");
  const textType = inferTextType(paragraph);
  const titleSeed = keywords.slice(0, 2).map(toTitleCase).join(" ve ");

  return {
    topic: focus ? `parçada ${focus} ekseninde ele alınan düşünce` : shorten(first, 120),
    mainIdea: shorten(mainIdea, 190),
    direct: shorten(first, 180),
    inference: `${shorten(mainIdea, 150)} yargısından hareketle metindeki asıl vurgunun bu düşünce etrafında toplandığı söylenebilir.`,
    wrong: "Parçada sözü edilen durumun metnin ana düşüncesiyle hiçbir ilgisi olmadığı savunulmaktadır.",
    topicWrong: "Metindeki olayların kronolojik bir macera şeklinde anlatılması",
    title: titleSeed ? `${titleSeed} Üzerine` : "Parçanın Ana Düşüncesi",
    titleOptions: [
      titleSeed ? `${titleSeed} ve Ana Düşünce` : "Metnin Temel Düşüncesi",
      "Parçada Verilen Temel Mesaj",
      "Düşüncenin Dayanakları",
    ],
    textType,
    answeredQuestion: "Parçada hangi düşünce üzerinde durulmaktadır?",
    support: unique([first, second, mainIdea]).filter(Boolean).slice(0, 3),
    keywords,
  };
}

function getAnalysis(paragraph) {
  const profile = findProfile(paragraph);

  if (profile) {
    return {
      ...profile,
      keywords: getKeywords(paragraph),
    };
  }

  return makeGenericAnalysis(paragraph);
}

function toTitleCase(text) {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6)
    .map((word) => `${word.charAt(0).toLocaleUpperCase("tr-TR")}${word.slice(1)}`)
    .join(" ");
}

function capitalizeFirst(text) {
  if (!text) return text;
  return `${text.charAt(0).toLocaleUpperCase("tr-TR")}${text.slice(1)}`;
}

function option(text, isCorrect = false) {
  return { text, isCorrect };
}

function compactOptions(options) {
  const seen = new Set();
  const cleaned = [];

  for (const current of options) {
    const key = normalize(current.text).replace(/\s+/g, " ").trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    cleaned.push(current);
  }

  return cleaned.slice(0, 4);
}

function rotateOptions(options, offset) {
  const clean = compactOptions(options);
  return [...clean.slice(offset), ...clean.slice(0, offset)].slice(0, 4);
}

function makeQuestion({ id, type, question, options, explanation }, offset = 0) {
  const finalOptions = rotateOptions(options, offset);
  const correctIndex = Math.max(0, finalOptions.findIndex((item) => item.isCorrect));

  return {
    id,
    type,
    question,
    options: finalOptions.map((item, index) => ({
      key: String.fromCharCode(65 + index),
      text: item.text,
    })),
    correctKey: String.fromCharCode(65 + correctIndex),
    answer: finalOptions[correctIndex]?.text || "",
    explanation,
  };
}

function getTextTypeExplanation(textType) {
  if (textType === "Tartışmacı anlatım") {
    return "Parçada bir düşünce savunulduğu ya da okuyucu belli bir görüşe yönlendirildiği için bu seçenek doğrudur.";
  }

  if (textType === "Öyküleyici anlatım") {
    return "Parçada olay akışı, kişi, zaman veya hareket unsurları öne çıktığı için bu seçenek doğrudur.";
  }

  if (textType === "Betimleyici anlatım") {
    return "Parçada varlıkların ayırt edici özellikleri betimlenerek aktarıldığı için bu seçenek doğrudur.";
  }

  return "Parçada bilgi verme ve bir düşünceyi açıklama amacı ağır bastığı için bu seçenek doğrudur.";
}

function relatedDistractors(analysis) {
  return {
    mainIdea: [
      analysis.wrong,
      `${analysis.topic} yalnızca yüzeysel bir ayrıntı olarak verilmiş, metnin temel düşüncesiyle ilişkilendirilmemiştir.`,
      "Parçada asıl amaç, okuyucuya olayların geçtiği yeri ayrıntılı biçimde betimlemektir.",
    ],
    direct: [
      analysis.wrong,
      `${analysis.topic} konusunda kesin bir yargıya varılamayacağı özellikle belirtilmiştir.`,
      "Parçada ele alınan durumun nedeni ve sonucu üzerinde hiç durulmamıştır.",
    ],
    inference: [
      analysis.wrong,
      "Metinde verilenlerden hareketle tam tersi bir sonuca ulaşmak gerekir.",
      "Parçada sözü edilen durum yalnızca kişisel bir anı olarak aktarılmıştır.",
    ],
    topic: [
      analysis.topicWrong,
      "Parçada kişilerin fiziksel özelliklerinin ayrıntılı biçimde betimlenmesi",
      "Bir olayın başlangıçtan sona kadar serim, düğüm ve çözüm bölümleriyle anlatılması",
    ],
  };
}

export function generateQuestions(paragraph) {
  const analysis = getAnalysis(paragraph);
  const distractors = relatedDistractors(analysis);
  const support = analysis.support.length > 0 ? analysis.support : [analysis.direct, analysis.mainIdea];
  const titleOptions = [analysis.title, ...analysis.titleOptions].slice(0, 4);

  const questions = [
    makeQuestion(
      {
        id: "main-idea",
        type: "Ana düşünce",
        question: "Bu parçada asıl vurgulanmak istenen düşünce aşağıdakilerden hangisidir?",
        options: [option(analysis.mainIdea, true), ...distractors.mainIdea.map((text) => option(text))],
        explanation: "Doğru seçenek, parçadaki ayrıntıların bağlandığı temel düşünceyi verir.",
      },
      2,
    ),
    makeQuestion(
      {
        id: "certain",
        type: "Kesin yargı",
        question: "Bu parçadan aşağıdakilerden hangisine kesin olarak ulaşılabilir?",
        options: [
          option(analysis.direct, true),
          option(analysis.wrong),
          option(distractors.direct[1]),
          option("Parçada verilen bilgiler, metindeki ana düşüncenin tersini kanıtlamaktadır."),
        ],
        explanation: "Kesin yargı sorularında doğru seçenek, metinde açıkça desteklenen bilgidir.",
      },
      3,
    ),
    makeQuestion(
      {
        id: "not-said",
        type: "Söylenemez",
        question: "Bu parçaya göre aşağıdakilerden hangisi söylenemez?",
        options: [
          option(analysis.wrong, true),
          option(analysis.direct),
          option(support[0]),
          option(support[1] || analysis.mainIdea),
        ],
        explanation: "Doğru seçenek, parçanın anlamıyla çelişen yargıdır.",
      },
      0,
    ),
    makeQuestion(
      {
        id: "inference",
        type: "Çıkarım",
        question: "Bu parçada anlatılanlardan hareketle aşağıdakilerden hangisi çıkarılabilir?",
        options: [option(analysis.inference, true), ...distractors.inference.map((text) => option(text))],
        explanation: "Doğru seçenek, metindeki bilgilerden mantıklı biçimde ulaşılabilen sonuçtur.",
      },
      1,
    ),
    makeQuestion(
      {
        id: "topic",
        type: "Konu",
        question: "Bu parçada üzerinde durulan konu aşağıdakilerden hangisidir?",
        options: [option(capitalizeFirst(analysis.topic), true), ...distractors.topic.map((text) => option(text))],
        explanation: "Konu, parçanın genelinde üzerinde durulan duygu, düşünce ya da durumdur.",
      },
      2,
    ),
    makeQuestion(
      {
        id: "answered-question",
        type: "Cevabı olan soru",
        question: "Bu parçada aşağıdaki sorulardan hangisinin cevabı vardır?",
        options: [
          option(analysis.answeredQuestion, true),
          option("Parçada adı geçen kişilerin doğum tarihleri nelerdir?"),
          option("Metindeki olaylar hangi şehirde ve hangi gün gerçekleşmiştir?"),
          option("Yazarın bütün eserleri hangi sırayla yayımlanmıştır?"),
        ],
        explanation: "Doğru soru, parçadaki bilgilerle cevaplanabilen sorudur.",
      },
      3,
    ),
    makeQuestion(
      {
        id: "text-type",
        type: "Anlatım biçimi",
        question: "Bu parçanın anlatımında aşağıdakilerden hangisi ağır basmaktadır?",
        options: TEXT_TYPES.map((type) => option(type, type === analysis.textType)),
        explanation: getTextTypeExplanation(analysis.textType),
      },
      0,
    ),
    makeQuestion(
      {
        id: "title",
        type: "Başlık",
        question: "Bu parçaya getirilebilecek en uygun başlık aşağıdakilerden hangisidir?",
        options: [
          option(titleOptions[0], true),
          option(titleOptions[1] || "Parçanın Temel Mesajı"),
          option(titleOptions[2] || "Konuya Genel Bakış"),
          option(titleOptions[3] || "Günlük Yaşamdan Bir Kesit"),
        ],
        explanation: "En uygun başlık, parçanın ana düşüncesini özel ve kısa biçimde karşılar.",
      },
      1,
    ),
  ];

  return {
    questions,
  };
}

export function analyzeParagraph(paragraph) {
  const analysis = getAnalysis(paragraph);

  return {
    konu: `Metnin konusu, ${analysis.topic}.`,
    anaFikir: analysis.mainIdea,
    yardimciFikirler: analysis.support,
    ozet: `${analysis.topic} çerçevesinde metin, "${analysis.mainIdea}" düşüncesini vurgular.`,
    baslikOnerileri: [analysis.title, ...analysis.titleOptions].slice(0, 3),
    anahtarKelimeler: analysis.keywords,
    metinTuru: analysis.textType,
    zorlukSeviyesi: inferDifficulty(paragraph),
  };
}

function inferDifficulty(text) {
  const words = tokenize(text);
  const sentences = splitSentences(text);
  const average = sentences.length ? words.length / sentences.length : words.length;

  if (words.length > 120 || average > 20) return "İleri";
  if (words.length > 65 || average > 14) return "Orta";
  return "Temel";
}

export function analyzeText(paragraph) {
  return {
    ...analyzeParagraph(paragraph),
    questionSet: generateQuestions(paragraph),
  };
}
