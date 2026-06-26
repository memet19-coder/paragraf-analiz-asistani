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
  "hem",
  "için",
  "ile",
  "ise",
  "ki",
  "mi",
  "ne",
  "olarak",
  "olan",
  "olduğu",
  "sonra",
  "ve",
  "veya",
  "göre",
  "kadar",
  "bugüne",
  "günümüzde",
  "ileri",
  "sürülmektedir",
]);

const TEXT_TYPES = [
  "Açıklayıcı anlatım",
  "Tartışmacı anlatım",
  "Öyküleyici anlatım",
  "Betimleyici anlatım",
];

const TOPIC_PROFILES = [
  {
    terms: [
      "dünya",
      "ekosistem",
      "canlı",
      "cansız",
      "insanoğlu",
      "insan",
      "tehdit",
      "doğal afet",
      "yok oluş",
      "tür",
      "yaşamsal",
    ],
    topic: "Dünya ekosisteminde insanın yeri ve ekolojik dengeye etkisi",
    mainIdea:
      "İnsan, Dünya ekosisteminin bir parçası olmasına rağmen canlı türlerinin yok oluşunu hızlandıran en önemli tehdit kaynaklarından biri hâline gelmiştir.",
    title: "Dünya Ekosisteminde İnsan Etkisi",
    textType: "Açıklayıcı anlatım",
    said:
      "İnsan hem ekosistemin etkin bir parçasıdır hem de ekosistemi tehdit eden önemli unsurlardan biridir.",
    notSaid:
      "Metinde insanların doğal afetleri tamamen engellediği ve ekosistemi bütünüyle koruduğu belirtilmiştir.",
    inference:
      "İnsan faaliyetleri, doğal dengenin bozulmasında ve tür kayıplarının hızlanmasında belirleyici olabilir.",
    noInference:
      "Dünya üzerindeki tüm canlı türlerinin yok oluş nedeni yalnızca doğal afetlerdir.",
    kesin:
      "Paragrafta insanın ekosistem için önemli bir tehdit kaynağı olarak görüldüğü kesin biçimde söylenebilir.",
    support: [
      "Dünya, canlı ve cansız varlıkların ilişkilerinden oluşan büyük bir ekosistemdir.",
      "İnsan bu ekosistemin hem parçası hem de tehdit kaynağıdır.",
      "Uzmanlara göre türlerin yok oluş hızında insan etkisi önemlidir.",
    ],
  },
  {
    terms: ["su", "tasarruf", "kuraklık", "tüketim", "bilinçli", "kaynak", "gelecek", "israf"],
    topic: "Su kaynaklarının bilinçli kullanılması ve tasarrufun önemi",
    mainIdea:
      "Su kaynaklarını korumak için bireylerin günlük yaşamda bilinçli ve tasarruflu davranması gerekir.",
    title: "Su Tasarrufunun Önemi",
    textType: "Açıklayıcı anlatım",
    said: "Küçük önlemler bile su kaynaklarının korunmasına katkı sağlayabilir.",
    notSaid: "Metinde su kaynaklarının sınırsız olduğu ve tasarrufa gerek bulunmadığı söylenmiştir.",
    inference: "Bireysel davranışlar doğal kaynakların korunmasında etkili olabilir.",
    noInference: "Kuraklıkla mücadelede bireylerin hiçbir sorumluluğu yoktur.",
    kesin: "Paragrafta suyun bilinçli kullanılması gerektiği kesin olarak çıkarılabilir.",
    support: [
      "Su kaynakları sınırsız değildir.",
      "Bilinçli tüketim gelecek için önemlidir.",
      "Tasarruf, kuraklık riskine karşı alınabilecek önlemlerden biridir.",
    ],
  },
  {
    terms: ["kitap", "okuma", "okumak", "roman", "öykü", "düşünce", "hayal", "dil", "kelime"],
    topic: "Kitap okumanın düşünce, dil ve hayal gücü üzerindeki etkileri",
    mainIdea:
      "Düzenli kitap okuma alışkanlığı bireyin düşünme becerisini, dil kullanımını ve hayal gücünü geliştirir.",
    title: "Kitap Okumanın Katkıları",
    textType: "Açıklayıcı anlatım",
    said: "Kitap okuma bireyin kelime dağarcığını ve düşünce dünyasını geliştirebilir.",
    notSaid: "Metinde kitap okumanın öğrenmeyi engellediği belirtilmiştir.",
    inference: "Okuma alışkanlığı bireyin kendini daha iyi ifade etmesine katkı sağlayabilir.",
    noInference: "Kitap okuyan herkes aynı roman türünü tercih etmek zorundadır.",
    kesin: "Paragrafta kitap okumanın bireye yarar sağladığı kesin olarak çıkarılabilir.",
    support: [
      "Kitaplar farklı bakış açıları kazandırır.",
      "Okuma alışkanlığı dil gelişimini destekler.",
      "Hayal gücü ve düşünme becerisi kitaplarla gelişebilir.",
    ],
  },
  {
    terms: ["teknoloji", "internet", "dijital", "bilgi", "kaynak", "öğrenme", "araştırma", "eleştirel"],
    topic: "Teknolojinin bilgiye ulaşma ve öğrenme sürecine etkisi",
    mainIdea:
      "Teknoloji bilgiye erişimi kolaylaştırsa da doğru bilgiyi seçme ve eleştirel düşünme becerisini daha önemli hâle getirmiştir.",
    title: "Teknoloji ve Doğru Bilgi",
    textType: "Açıklayıcı anlatım",
    said: "Teknoloji sayesinde bilgiye ulaşmak eskiye göre daha hızlı ve kolaydır.",
    notSaid: "Metinde internetteki bütün bilgilerin kesinlikle doğru olduğu savunulmuştur.",
    inference: "Bilgi kaynaklarının artması, doğru bilgiyi ayırt etmeyi gerekli kılar.",
    noInference: "Teknoloji kullanan kişiler araştırma yapmaya ihtiyaç duymaz.",
    kesin: "Paragrafta teknolojinin bilgiye erişimi kolaylaştırdığı kesin olarak çıkarılabilir.",
    support: [
      "Bilgiye ulaşmak kolaylaşmıştır.",
      "Kaynak sayısının artması seçici olmayı gerektirir.",
      "Eleştirel düşünme dijital çağda önem kazanmıştır.",
    ],
  },
  {
    terms: ["spor", "beden", "sağlık", "ruhsal", "fiziksel", "hareket", "stres", "enerjik", "egzersiz"],
    topic: "Sporun beden ve ruh sağlığı üzerindeki olumlu etkileri",
    mainIdea:
      "Düzenli spor yapmak, bireyin hem fiziksel sağlığını korur hem de ruhsal açıdan daha dengeli olmasına katkı sağlar.",
    title: "Sporun Sağlığa Katkıları",
    textType: "Açıklayıcı anlatım",
    said: "Spor yapmak kişinin bedensel ve ruhsal sağlığını destekler.",
    notSaid: "Metinde sporun insan sağlığına hiçbir katkısı olmadığı söylenmiştir.",
    inference: "Düzenli hareket eden bireyler kendilerini daha sağlıklı ve enerjik hissedebilir.",
    noInference: "Spor yapan herkes profesyonel sporcu olmak zorundadır.",
    kesin: "Paragrafta düzenli sporun yararlı olduğu kesin olarak çıkarılabilir.",
    support: [
      "Spor beden sağlığını destekler.",
      "Düzenli hareket ruhsal dengeye katkı sağlar.",
      "Stresle baş etmede fiziksel aktivite etkili olabilir.",
    ],
  },
  {
    terms: ["arkadaş", "dost", "dostluk", "güven", "paylaş", "yardım", "samimiyet", "dayanışma"],
    topic: "Dostluk ve arkadaşlık ilişkilerinde güven ile dayanışmanın önemi",
    mainIdea:
      "Gerçek dostluk, zor zamanlarda destek olmak, güven vermek ve paylaşmayı bilmekle değer kazanır.",
    title: "Gerçek Dostluğun Önemi",
    textType: "Açıklayıcı anlatım",
    said: "Dostlukta güven ve dayanışma önemli bir yere sahiptir.",
    notSaid: "Metinde gerçek dostluğun yalnızca çıkar ilişkisine dayandığı belirtilmiştir.",
    inference: "İyi bir arkadaşlık ilişkisi karşılıklı güven ve yardım duygusuyla güçlenir.",
    noInference: "İnsanların hiç arkadaşa ihtiyaç duymadığı sonucuna ulaşılabilir.",
    kesin: "Paragrafta dostlukta güvenin önemli olduğu kesin olarak çıkarılabilir.",
    support: [
      "Dostluk güvenle güçlenir.",
      "Paylaşma ve yardımlaşma arkadaşlığı değerli kılar.",
      "Zor zamanlarda verilen destek gerçek dostluğu gösterir.",
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

function shorten(text, maxLength = 145) {
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

  if (/(bence|savunur|kanıtlar|gereklidir|olmalıdır|yanlıştır|doğrudur)/.test(lower)) {
    return "Tartışmacı anlatım";
  }

  if (/(kahraman|olay|zaman|yer|yaşadı|gördü|duydu|geldi|gitti|başladı)/.test(lower)) {
    return "Öyküleyici anlatım";
  }

  if (/(masmavi|yemyeşil|sessiz|karanlık|aydınlık|güzel|uzun|kısa|geniş|dar)/.test(lower)) {
    return "Betimleyici anlatım";
  }

  return "Açıklayıcı anlatım";
}

function findMainIdea(sentences, keywords) {
  const markers = /(bu nedenle|bu yüzden|sonuç olarak|dolayısıyla|kısacası|özetle|böylece|temel sebep|en önemli|ancak|fakat)/i;
  const keywordSet = new Set(keywords.slice(0, 8));

  const scored = sentences.map((sentence, index) => {
    const words = getContentWords(sentence);
    const keywordScore = words.reduce((score, word) => score + (keywordSet.has(word) ? 1.5 : 0), 0);
    const markerScore = markers.test(sentence) ? 4 : 0;
    const positionScore = index === sentences.length - 1 ? 2 : index === 0 ? 0.7 : 0;
    const lengthScore = Math.min(words.length / 8, 2);

    return { sentence, score: keywordScore + markerScore + positionScore + lengthScore };
  });

  return cleanSentence(scored.sort((a, b) => b.score - a.score)[0]?.sentence || sentences.at(-1) || sentences[0] || "");
}

function getGenericTopic(sentences, keywords) {
  if (keywords.length >= 2) {
    return `${keywords[0]} ve ${keywords[1]} kavramları etrafında verilen temel düşünce`;
  }

  return sentences[0] ? shorten(sentences[0], 95) : "metinde ele alınan temel düşünce";
}

function buildGenericAnalysis(paragraph) {
  const sentences = splitSentences(paragraph);
  const keywords = getKeywords(paragraph);
  const mainIdeaSentence = findMainIdea(sentences, keywords);
  const topic = getGenericTopic(sentences, keywords);
  const first = cleanSentence(sentences[0] || "");
  const textType = inferTextType(paragraph);
  const support = unique(sentences.map(cleanSentence).filter((sentence) => sentence && sentence !== mainIdeaSentence)).slice(0, 3);

  return {
    topic,
    mainIdea:
      /gerekir|gereklidir|önemlidir|sağlar|azaltır|artırır|sebebidir|kaynağıdır/i.test(mainIdeaSentence)
        ? mainIdeaSentence
        : `Paragrafın ana fikri, "${mainIdeaSentence}" cümlesinde yoğunlaşan düşüncedir.`,
    title: keywords.length > 0 ? `${toTitleCase(keywords[0])} Üzerine` : "Paragrafın Ana Düşüncesi",
    textType,
    said: first || mainIdeaSentence,
    notSaid: "Metinde anlatılan durumun tamamen önemsiz olduğu ve hiçbir sonuç doğurmadığı söylenmiştir.",
    inference: `${mainIdeaSentence} düşüncesinden hareketle metindeki olay ya da durumun bir sonuç doğurduğu söylenebilir.`,
    noInference: "Paragrafta yer almayan kişi, yer ve sayısal bilgiler kesin bilgi gibi kabul edilebilir.",
    kesin: first || mainIdeaSentence,
    support:
      support.length > 0
        ? support
        : ["Metindeki ayrıntılar ana düşünceyi açıklamak ve desteklemek için kullanılmıştır."],
    keywords,
  };
}

function toTitleCase(text) {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 7)
    .map((word) => `${word.charAt(0).toLocaleUpperCase("tr-TR")}${word.slice(1)}`)
    .join(" ");
}

function getAnalysis(paragraph) {
  const profile = findProfile(paragraph);
  const keywords = getKeywords(paragraph);

  if (profile) {
    return {
      topic: profile.topic,
      mainIdea: profile.mainIdea,
      title: profile.title,
      textType: profile.textType,
      said: profile.said,
      notSaid: profile.notSaid,
      inference: profile.inference,
      noInference: profile.noInference,
      kesin: profile.kesin,
      support: profile.support,
      keywords,
    };
  }

  return buildGenericAnalysis(paragraph);
}

function option(label, isCorrect = false) {
  return { label, isCorrect };
}

function rotateOptions(options, offset) {
  const clean = unique(options.map((item) => item.label)).map((label) => {
    const source = options.find((item) => item.label === label);
    return option(label, source?.isCorrect);
  });

  return [...clean.slice(offset), ...clean.slice(0, offset)].slice(0, 4);
}

function makeQuestion({ id, type, question, options, explanation }, offset = 0) {
  const finalOptions = rotateOptions(options, offset);
  const correctIndex = finalOptions.findIndex((item) => item.isCorrect);
  const correctOption = finalOptions[correctIndex] || finalOptions[0];

  return {
    id,
    type,
    question,
    options: finalOptions.map((item, index) => ({
      key: String.fromCharCode(65 + index),
      text: item.label,
    })),
    correctKey: String.fromCharCode(65 + Math.max(correctIndex, 0)),
    answer: correctOption?.label || "",
    explanation,
  };
}

function getTextTypeExplanation(textType) {
  if (textType === "Tartışmacı anlatım") {
    return "Paragrafta bir düşünce savunulduğu ya da okuyucu belli bir görüşe yönlendirildiği için bu seçenek doğrudur.";
  }

  if (textType === "Öyküleyici anlatım") {
    return "Paragrafta olay, kişi, zaman ya da hareket akışı öne çıktığı için bu seçenek doğrudur.";
  }

  if (textType === "Betimleyici anlatım") {
    return "Paragrafta varlıkların ayırt edici özellikleri betimlenerek aktarıldığı için bu seçenek doğrudur.";
  }

  return "Paragrafta bilgi verme ve düşünceyi açıklama amacı ağır bastığı için bu seçenek doğrudur.";
}

export function generateQuestions(paragraph) {
  const analysis = getAnalysis(paragraph);
  const genericTopicDistractors = [
    "Metinde olayın geçtiği yerin ayrıntılı biçimde tasvir edilmesi",
    "Bir kişinin çocukluk anılarının olay örgüsüyle anlatılması",
    "Bir ürünün kullanım aşamalarının sırasıyla açıklanması",
  ];

  const genericIdeaDistractors = [
    "Metinde anlatılan durumun hiçbir sorun ya da sonuç doğurmadığı savunulmaktadır.",
    "Paragraf, yalnızca kişisel bir anıyı aktarmak amacıyla yazılmıştır.",
    "Metinde bütün varlıkların birbirinden bağımsız olduğu düşüncesi öne çıkarılmıştır.",
  ];

  const questions = [
    makeQuestion(
      {
        id: "topic",
        type: "Konu",
        question: "Bu paragrafın konusu aşağıdakilerden hangisidir?",
        options: [
          option(analysis.topic, true),
          ...genericTopicDistractors.map((text) => option(text)),
        ],
        explanation: `Paragrafın geneli "${analysis.topic}" düşüncesi etrafında kurulmuştur.`,
      },
      1,
    ),
    makeQuestion(
      {
        id: "main-idea",
        type: "Ana fikir",
        question: "Bu paragrafın ana fikri aşağıdakilerden hangisidir?",
        options: [
          option(analysis.mainIdea, true),
          ...genericIdeaDistractors.map((text) => option(text)),
        ],
        explanation: "Ana fikir, paragrafın okuyucuya vermek istediği temel mesajdır.",
      },
      2,
    ),
    makeQuestion(
      {
        id: "said",
        type: "Söylenebilir",
        question: "Bu paragraftan hareketle aşağıdakilerden hangisi söylenebilir?",
        options: [
          option(analysis.said, true),
          option(analysis.notSaid),
          option("Metinde verilen düşüncenin tam tersi savunulmaktadır."),
          option("Paragraf yalnızca kişilerin fiziksel özelliklerini anlatmaktadır."),
        ],
        explanation: "Doğru seçenek paragrafta açıkça verilen bilgiyle uyumludur.",
      },
      3,
    ),
    makeQuestion(
      {
        id: "not-said",
        type: "Söylenemez",
        question: "Bu paragrafa göre aşağıdakilerden hangisi söylenemez?",
        options: [
          option(analysis.notSaid, true),
          option(analysis.said),
          option(analysis.support[0]),
          option(analysis.mainIdea),
        ],
        explanation: "Doğru seçenek, paragrafın anlamıyla çelişen ya da paragrafta yer almayan yargıdır.",
      },
      0,
    ),
    makeQuestion(
      {
        id: "inference",
        type: "Çıkarım",
        question: "Bu paragraftan aşağıdakilerden hangisi çıkarılabilir?",
        options: [
          option(analysis.inference, true),
          option(analysis.noInference),
          option("Metindeki bütün yargılar yalnızca bir kişinin hayal ürünüdür."),
          option("Paragraftaki temel düşünce metnin ilk cümlesiyle ilgisizdir."),
        ],
        explanation: "Çıkarım sorularında doğru seçenek, metinde doğrudan söylenmese bile anlamdan ulaşılabilen yargıdır.",
      },
      1,
    ),
    makeQuestion(
      {
        id: "not-inference",
        type: "Çıkarılamaz",
        question: "Bu paragraftan aşağıdakilerden hangisi çıkarılamaz?",
        options: [
          option(analysis.noInference, true),
          option(analysis.inference),
          option(analysis.said),
          option(analysis.support[1] || analysis.mainIdea),
        ],
        explanation: "Doğru seçenek metnin anlamının dışına çıkan, metinden desteklenemeyen bir yargıdır.",
      },
      2,
    ),
    makeQuestion(
      {
        id: "text-type",
        type: "Anlatım biçimi",
        question: "Bu paragrafta ağırlıklı olarak hangi anlatım biçimi kullanılmıştır?",
        options: TEXT_TYPES.map((type) => option(type, type === analysis.textType)),
        explanation: getTextTypeExplanation(analysis.textType),
      },
      0,
    ),
    makeQuestion(
      {
        id: "certain",
        type: "Kesin çıkarım",
        question: "Bu paragraftan kesin olarak çıkarılabilecek yargı aşağıdakilerden hangisidir?",
        options: [
          option(analysis.kesin, true),
          option("Metinde sözü edilen durumun hiçbir etkisi yoktur."),
          option("Paragrafta bütün ayrıntılar sayısal verilerle kanıtlanmıştır."),
          option("Metnin amacı okuyucuyu bir kahramanın macerasına ortak etmektir."),
        ],
        explanation: "Kesin çıkarım, metinde açıkça desteklenen ve yoruma fazla açık olmayan yargıdır.",
      },
      3,
    ),
    makeQuestion(
      {
        id: "title",
        type: "Başlık",
        question: "Bu paragrafa getirilebilecek en uygun başlık aşağıdakilerden hangisidir?",
        options: [
          option(analysis.title, true),
          option("Konuya Genel Bakış"),
          option("Metnin Ana Mesajı"),
          option("Günlük Yaşamdan Bir Kesit"),
        ],
        explanation: "Uygun başlık, paragrafın konusunu kısa, açık ve özel biçimde yansıtmalıdır.",
      },
      1,
    ),
  ];

  return {
    overview: {
      topic: analysis.topic,
      mainIdea: analysis.mainIdea,
      textType: analysis.textType,
      suggestedTitle: analysis.title,
      keywords: analysis.keywords,
    },
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
    baslikOnerileri: [analysis.title, `${analysis.title}: Ana Düşünce`, "Paragrafın Temel Mesajı"],
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
