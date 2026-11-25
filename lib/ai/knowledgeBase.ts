import { DiagnoseRequest, DiagnoseResponse } from "./schemas";
import { getLanguageConfig } from "@/lib/i18n/languages";

interface LocalizedLabels {
  unsurePrefix: string;
  kvkAdvice: string;
  photoTip: string;
  safety: string[];
  offTopicName: string;
  offTopicCause: string;
  followupQ1: string;
  followupQ1Opts: string[];
  followupQ2: string;
  followupQ2Opts: string[];
}

const LABELS: Record<string, LocalizedLabels> = {
  hi: {
    unsurePrefix: "संभावित पहचान (कृपया स्थानीय कृषि केंद्र से पुष्टि करें): ",
    kvkAdvice: "मैं पूरी तरह पक्का नहीं हूं — कृपया प्रभावित पत्ता नजदीकी कृषि विज्ञान केंद्र (KVK) में दिखाएं या 1800-180-1551 पर कॉल करें।",
    photoTip: "अकेली फोटो या छोटे विवरण से 100% पक्का नहीं होता; पत्ते के नीचे की तरफ, तने के आधार और कितने पौधों में समस्या है यह भी देखें।",
    safety: [
      "दवा मिलाने या छिड़काव से पहले हमेशा पैकेट पर लिखा लेबल पढ़ें और उसी मात्रा का पालन करें।",
      "छिड़काव करते समय मास्क, दस्ताने और चश्मा जरूर पहनें।",
      "फसल कटाई से पहले पैकेट पर लिखा प्रतीक्षा समय (waiting period) पूरा करें।",
      "दवाओं को बच्चों, खाने-पीने की चीजों और पानी के स्रोतों से दूर रखें।",
    ],
    offTopicName: "केवल खेती-बाड़ी से जुड़े सवाल पूछें",
    offTopicCause: "मैं किसानमित्र हूं और केवल फसल रोग, कीड़े, खाद और खेती की समस्याओं में मदद कर सकता हूं।",
    followupQ1: "पत्तों पर किस तरह के निशान या बदलाव दिख रहे हैं?",
    followupQ1Opts: ["पीले या भूरे धब्बे", "पत्ते मुड़ रहे हैं / सफेद मक्खी", "पत्तों या फल में छेद / कीड़े"],
    followupQ2: "खेत में यह समस्या कितने पौधों में दिख रही है?",
    followupQ2Opts: ["सिर्फ कुछ पौधों में", "आधे खेत में", "लगभग पूरे खेत में"],
  },
  bn: {
    unsurePrefix: "সম্ভাব্য শনাক্তকরণ (কৃষি অফিসে যাচাই করুন): ",
    kvkAdvice: "আমি সম্পূর্ণ নিশ্চিত নই — অনুগ্রহ করে আক্রান্ত পাতা নিকটস্থ কৃষি বিজ্ঞান কেন্দ্রে (KVK) দেখান বা 1800-180-1551 নম্বরে কল করুন।",
    photoTip: "শুধু একটি ছবি বা অল্প তথ্যে ১০০% নিশ্চিত হওয়া যায় না; পাতার নিচের দিক এবং কতগুলো গাছ আক্রান্ত তা দেখুন।",
    safety: [
      "ওষুধ মেশানোর আগে সর্বদা প্যাকেটের লেবেল পড়ুন এবং লেখা মাত্রা মেনে চলুন।",
      "স্প্রে করার সময় মাস্ক, গ্লাভস এবং চশমা পরুন।",
      "ফসল তোলার আগে লেবেলে লেখা অপেক্ষার সময় (waiting period) মানুন।",
      "ওষুধ শিশু, খাবার এবং জলের উৎস থেকে দূরে রাখুন।",
    ],
    offTopicName: "অনুগ্রহ করে শুধু চাষবাস সংক্রান্ত প্রশ্ন করুন",
    offTopicCause: "আমি কিষাণমিত্র এবং কেবল ফসলের রোগ, পোকা ও কৃষি বিষয়ে সাহায্য করতে পারি।",
    followupQ1: "পাতায় কী ধরনের লক্ষণ দেখা যাচ্ছে?",
    followupQ1Opts: ["হলুদ বা বাদামী দাগ", "পাতা কোঁকড়ানো / সাদা মাছি", "পাতা বা ফলে ছিদ্র / পোকা"],
    followupQ2: "জমির কতটা অংশে এই সমস্যা দেখা যাচ্ছে?",
    followupQ2Opts: ["অল্প কয়েকটি গাছে", "অর্ধেক জমিতে", "প্রায় পুরো জমিতে"],
  },
  te: {
    unsurePrefix: "సంభావ్య గుర్తింపు (KVK లో నిర్ధారించుకోండి): ",
    kvkAdvice: "నేను పూర్తిగా ఖచ్చితంగా చెప్పలేను — దయచేసి సమీపంలోని కృషి విజ్ఞాన కేంద్రం (KVK) లో చూపించండి లేదా 1800-180-1551 కి కాల్ చేయండి.",
    photoTip: "ఒకే ఫోటోతో 100% నిర్ధారణ సాధ్యం కాదు; ఆకు అడుగు భాగం మరియు ఎన్ని మొక్కలు దెబ్బతిన్నాయో పరిశీలించండి.",
    safety: [
      "మందు కలిపే ముందు ఎల్లప్పుడూ ప్యాకెట్ లేబుల్‌పై ఉన్న మోతాదును చదివి పాటించండి.",
      "స్ప్రే చేసేటప్పుడు మాస్క్, చేతి తొడుగులు మరియు కళ్ళద్దాలు ధరించండి.",
      "పంట కోతకు ముందు లేబుల్‌పై ఉన్న వేచి ఉండే సమయాన్ని పాటించండి.",
      "మందులను పిల్లలు, ఆహారం మరియు నీటి వనరులకు దూరంగా ఉంచండి.",
    ],
    offTopicName: "దయచేసి వ్యవసాయానికి సంబంధించిన ప్రశ్నలు మాత్రమే అడగండి",
    offTopicCause: "నేను కిసాన్‌మిత్రను, పంట తెగుళ్ళు మరియు వ్యవసాయ సమస్యలలో మాత్రమే సహాయం చేయగలను.",
    followupQ1: "ఆకులపై ఎలాంటి లక్షణాలు కనిపిస్తున్నాయి?",
    followupQ1Opts: ["పసుపు లేదా గోధుమ రంగు మచ్చలు", "ఆకులు ముడతలు / తెల్ల దోమ", "ఆకులు లేదా కాయల్లో రంధ్రాలు / పురుగులు"],
    followupQ2: "పొలంలో ఎన్ని మొక్కలకు ఈ సమస్య ఉంది?",
    followupQ2Opts: ["కొన్ని మొక్కలకు మాత్రమే", "సగం పొలంలో", "దాదాపు పొలం అంతా"],
  },
  mr: {
    unsurePrefix: "संभाव्य ओळख (कृपया KVK कडून खात्री करा): ",
    kvkAdvice: "मला पूर्ण खात्री नाही — कृपया बाधित पान जवळच्या कृषी विज्ञान केंद्रात (KVK) दाखवा किंवा 1800-180-1551 वर कॉल करा.",
    photoTip: "फक्त एका फोटोवरून 100% खात्री देता येत नाही; पानाची खालची बाजू आणि किती झाडे बाधित आहेत ते तपासा.",
    safety: [
      "औषध मिसळण्यापूर्वी नेहमी पॅकेटवरील लेबल वाचा आणि दिलेले प्रमाणच वापरा.",
      "फवारणी करताना मास्क, हातमोजे आणि चष्मा घाला.",
      "कापणीपूर्वी पॅकेटवरील प्रतीक्षा कालावधी (waiting period) पाळा.",
      "औषधे लहान मुले, अन्न आणि पिण्याच्या पाण्यापासून दूर ठेवा.",
    ],
    offTopicName: "कृपया फक्त शेतीसंबंधित प्रश्न विचारा",
    offTopicCause: "मी किसानमित्र आहे आणि फक्त पीक रोग, कीड आणि शेतीच्या समस्यांमध्ये मदत करू शकतो.",
    followupQ1: "पानांवर कोणत्या प्रकारची लक्षणे दिसत आहेत?",
    followupQ1Opts: ["पिवळे किंवा तपकिरी डाग", "पाने मुरडणे / पांढरी माशी", "पानांना किंवा फळांना छिद्रे / अळी"],
    followupQ2: "शेतातील किती रोपांवर ही समस्या दिसत आहे?",
    followupQ2Opts: ["फक्त काही झाडांवर", "अर्ध्या शेतात", "जवळजवळ संपूर्ण शेतात"],
  },
  ta: {
    unsurePrefix: "சாத்தியமான அடையாளம் (KVK-இல் உறுதி செய்யவும்): ",
    kvkAdvice: "எனக்கு முழுமையாக உறுதியாகத் தெரியவில்லை — அருகிலுள்ள வேளாண் அறிவியல் மையத்தில் (KVK) காட்டவும் அல்லது 1800-180-1551 எண்ணிற்கு அழைக்கவும்.",
    photoTip: "ஒரு புகைப்படத்தால் மட்டும் 100% உறுதியாகச் சொல்ல முடியாது; இலையின் அடிப்பகுதி மற்றும் எத்தனை செடிகள் பாதிக்கப்பட்டுள்ளன என்பதைச் சரிபார்க்கவும்.",
    safety: [
      "மருந்து கலக்கும் முன் எப்போதும் பாக்கெட் லேபிளில் உள்ள அளவைப் படித்துப் பின்பற்றவும்.",
      "தெளிக்கும்போது முகக்கவசம், கையுறை மற்றும் கண் பாதுகாப்பு அணியவும்.",
      "அறுவடைக்கு முன் லேபிளில் உள்ள காத்திருப்பு காலத்தைப் பின்பற்றவும்.",
      "மருந்துகளை குழந்தைகள், உணவு மற்றும் நீர்நிலைகளிலிருந்து விலக்கி வைக்கவும்.",
    ],
    offTopicName: "விவசாயம் தொடர்பான கேள்விகளை மட்டும் கேட்கவும்",
    offTopicCause: "நான் கிசான்மித்ரா; பயிர் நோய்கள், பூச்சிகள் மற்றும் விவசாய உதவிகளுக்கு மட்டுமே உதவ முடியும்.",
    followupQ1: "இலைகளில் என்ன மாதிரியான அறிகுறிகள் தெரிகின்றன?",
    followupQ1Opts: ["மஞ்சள் அல்லது பழுப்பு புள்ளிகள்", "இலை சுருட்டல் / வெள்ளை ஈ", "இலை அல்லது காய்களில் துளை / புழு"],
    followupQ2: "வயலில் எத்தனை செடிகளில் இந்தப் பிரச்சினை உள்ளது?",
    followupQ2Opts: ["சில செடிகளில் மட்டும்", "பாதி வயலில்", "முழு வயலிலும்"],
  },
  gu: {
    unsurePrefix: "સંભવિત ઓળખ (કૃપા કરીને KVK માં ખાતરી કરો): ",
    kvkAdvice: "મને પૂરી ખાતરી નથી — કૃપા કરીને નજીકના કૃષિ વિજ્ઞાન કેન્દ્ર (KVK) માં બતાવો અથવા 1800-180-1551 પર કોલ કરો.",
    photoTip: "માત્ર એક ફોટાથી 100% ખાતરી થઈ શકતી નથી; પાનની નીચેની બાજુ અને કેટલા છોડને અસર થઈ છે તે પણ જુઓ.",
    safety: [
      "દવા ભેળવતા પહેલાં હંમેશા પેકેટનું લેબલ વાંચો અને લખેલું પ્રમાણ જ વાપરો.",
      "છંટકાવ કરતી વખતે માસ્ક, મોજા અને ચશ્મા પહેરો.",
      "લણણી પહેલાં લેબલ પર લખેલો રાહ જોવાનો સમય પાળો.",
      "દવાઓને બાળકો, ખોરાક અને પાણીના સ્ત્રોતોથી દૂર રાખો.",
    ],
    offTopicName: "કૃપા કરીને ફક્ત ખેતીને લગતા પ્રશ્નો પૂછો",
    offTopicCause: "હું કિસાનમિત્ર છું અને ફક્ત પાક રોગ, જીવાત અને ખેતીમાં મદદ કરી શકું છું.",
    followupQ1: "પાન પર કેવા લક્ષણો દેખાય છે?",
    followupQ1Opts: ["પીળા કે કથ્થઈ ડાઘ", "પાન વળી જવા / સફેદ માખી", "પાન કે ફળમાં કાણાં / ઈયળ"],
    followupQ2: "ખેતરમાં કેટલા છોડમાં આ સમસ્યા છે?",
    followupQ2Opts: ["થોડા છોડમાં જ", "અડધા ખેતરમાં", "લગભગ આખા ખેતરમાં"],
  },
  kn: {
    unsurePrefix: "ಸಂಭವನೀಯ ಗುರುತಿಸುವಿಕೆ (KVK ಯಲ್ಲಿ ದೃಢಪಡಿಸಿ): ",
    kvkAdvice: "ನನಗೆ ಸಂಪೂರ್ಣ ಖಚಿತವಾಗಿಲ್ಲ — ದಯವಿಟ್ಟು ಹತ್ತಿರದ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರದಲ್ಲಿ (KVK) ತೋರಿಸಿ ಅಥವಾ 1800-180-1551 ಗೆ ಕರೆ ಮಾಡಿ.",
    photoTip: "ಒಂದೇ ಫೋಟೋದಿಂದ 100% ಖಚಿತವಾಗುವುದಿಲ್ಲ; ಎಲೆಯ ಕೆಳಭಾಗ ಮತ್ತು ಎಷ್ಟು ಗಿಡಗಳಿಗೆ ತೊಂದರೆಯಾಗಿದೆ ಎಂಬುದನ್ನು ಪರಿಶೀಲಿಸಿ.",
    safety: [
      "ಔಷಧಿ ಬೆರೆಸುವ ಮೊದಲು ಯಾವಾಗಲೂ ಪ್ಯಾಕೆಟ್ ಲೇಬಲ್ ಓದಿ ಮತ್ತು ತಿಳಿಸಿದ ಪ್ರಮಾಣವನ್ನೇ ಬಳಸಿ.",
      "ಸಿಂಪಡಿಸುವಾಗ ಮಾಸ್ಕ್, ಕೈಗವಸು ಮತ್ತು ಕನ್ನಡಕ ಧರಿಸಿ.",
      "ಕೊಯ್ಲಿನ ಮೊದಲು ಲೇಬಲ್‌ನಲ್ಲಿರುವ ಕಾಯುವ ಅವಧಿಯನ್ನು ಪಾಲಿಸಿ.",
      "ಔಷಧಿಗಳನ್ನು ಮಕ್ಕಳು, ಆಹಾರ ಮತ್ತು ನೀರಿನ ಮೂಲಗಳಿಂದ ದೂರವಿಡಿ.",
    ],
    offTopicName: "ದಯವಿಟ್ಟು ಕೃಷಿಗೆ ಸಂಬಂಧಿಸಿದ ಪ್ರಶ್ನೆಗಳನ್ನು ಮಾತ್ರ ಕೇಳಿ",
    offTopicCause: "ನಾನು ಕಿಸಾನ್‌ಮಿತ್ರ, ಬೆಳೆ ರೋಗಗಳು ಮತ್ತು ಕೃಷಿ ಸಮಸ್ಯೆಗಳಲ್ಲಿ ಮಾತ್ರ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ.",
    followupQ1: "ಎಲೆಗಳ ಮೇಲೆ ಯಾವ ರೀತಿಯ ಲಕ್ಷಣಗಳು ಕಾಣಿಸುತ್ತಿವೆ?",
    followupQ1Opts: ["ಹಳದಿ ಅಥವಾ ಕಂದು ಚುಕ್ಕೆಗಳು", "ಎಲೆ ಮುರುಟು / ಬಿಳಿ ನೊಣ", "ಎಲೆ ಅಥವಾ ಕಾಯಿಯಲ್ಲಿ ರಂಧ್ರ / ಹುಳು"],
    followupQ2: "ಹೊಲದಲ್ಲಿ ಎಷ್ಟು ಗಿಡಗಳಿಗೆ ಈ ಸಮಸ್ಯೆ ಇದೆ?",
    followupQ2Opts: ["ಕೆಲವು ಗಿಡಗಳಲ್ಲಿ ಮಾತ್ರ", "ಅರ್ಧ ಹೊಲದಲ್ಲಿ", "ಬಹುತೇಕ ಪೂರ್ತಿ ಹೊಲದಲ್ಲಿ"],
  },
  ml: {
    unsurePrefix: "സാധ്യതയുള്ള രോഗം (KVK-യിൽ ഉറപ്പാക്കുക): ",
    kvkAdvice: "എനിക്ക് പൂർണ്ണ ഉറപ്പില്ല — ദയവായി അടുത്തുള്ള കൃഷി വിജ്ഞാന കേന്ദ്രത്തിൽ (KVK) കാണിക്കുക അല്ലെങ്കിൽ 1800-180-1551 വിളിക്കുക.",
    photoTip: "ഒരു ഫോട്ടോ മാത്രം വെച്ച് 100% ഉറപ്പിക്കാനാവില്ല; ഇലയുടെ അടിഭാഗവും എത്ര ചെടികളിൽ രോഗമുണ്ടെന്നും പരിശോധിക്കുക.",
    safety: [
      "മരുന്ന് കലർത്തുന്നതിന് മുമ്പ് എപ്പോഴും പാക്കറ്റിലെ ലേബൽ വായിച്ച് അളവ് പാലിക്കുക.",
      "തളിക്കുമ്പോൾ മാസ്ക്, കയ്യുറ, കണ്ണട എന്നിവ ധരിക്കുക.",
      "വിളവെടുപ്പിന് മുമ്പ് ലേബലിൽ പറഞ്ഞിരിക്കുന്ന കാത്തിരിപ്പ് സമയം പാലിക്കുക.",
      "മരുന്നുകൾ കുട്ടികൾ, ഭക്ഷണം, ജലസ്രോതസ്സുകൾ എന്നിവയിൽ നിന്ന് അകറ്റി സൂക്ഷിക്കുക.",
    ],
    offTopicName: "കൃഷിയുമായി ബന്ധപ്പെട്ട ചോദ്യങ്ങൾ മാത്രം ചോദിക്കുക",
    offTopicCause: "ഞാൻ കിസാൻമിത്രയാണ്; വിള രോഗങ്ങളിലും കീടനിയന്ത്രണത്തിലും മാത്രമേ സഹായിക്കാനാകൂ.",
    followupQ1: "ഇലകളിൽ എന്തെല്ലാം ലക്ഷണങ്ങളാണ് കാണുന്നത്?",
    followupQ1Opts: ["മഞ്ഞയോ തവിട്ടോ പാടുകൾ", "ഇല ചുരുളൽ / വെള്ളീച്ച", "ഇലയിലോ കായയിലോ ദ്വാരം / പുഴു"],
    followupQ2: "പാടത്ത് എത്ര ചെടികളിൽ ഈ പ്രശ്നമുണ്ട്?",
    followupQ2Opts: ["കുറച്ച് ചെടികളിൽ മാത്രം", "പകുതി സ്ഥലത്ത്", "ഏകദേശം മുഴുവൻ പാടത്തും"],
  },
  pa: {
    unsurePrefix: "ਸੰਭਾਵਿਤ ਪਛਾਣ (KVK ਤੋਂ ਪੁਸ਼ਟੀ ਕਰੋ): ",
    kvkAdvice: "ਮੈਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਪੱਕਾ ਨਹੀਂ ਹੈ — ਕਿਰਪਾ ਕਰਕੇ ਨੇੜਲੇ ਕ੍ਰਿਸ਼ੀ ਵਿਗਿਆਨ ਕੇਂਦਰ (KVK) ਵਿੱਚ ਦਿਖਾਓ ਜਾਂ 1800-180-1551 'ਤੇ ਕਾਲ ਕਰੋ।",
    photoTip: "ਸਿਰਫ਼ ਇੱਕ ਫ਼ੋਟੋ ਤੋਂ 100% ਪੱਕਾ ਨਹੀਂ ਹੁੰਦਾ; ਪੱਤੇ ਦੇ ਹੇਠਲੇ ਪਾਸੇ ਅਤੇ ਕਿੰਨੇ ਬੂਟਿਆਂ 'ਤੇ ਅਸਰ ਹੈ ਇਹ ਵੀ ਦੇਖੋ।",
    safety: [
      "ਦਵਾਈ ਮਿਲਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਹਮੇਸ਼ਾ ਪੈਕੇਟ ਦਾ ਲੇਬਲ ਪੜ੍ਹੋ ਅਤੇ ਲਿਖੀ ਮਾਤਰਾ ਹੀ ਵਰਤੋ।",
      "ਛਿੜਕਾਅ ਵੇਲੇ ਮਾਸਕ, ਦਸਤਾਨੇ ਅਤੇ ਐਨਕਾਂ ਜ਼ਰੂਰ ਪਾਓ।",
      "ਵਾਢੀ ਤੋਂ ਪਹਿਲਾਂ ਲੇਬਲ 'ਤੇ ਲਿਖਿਆ ਉਡੀਕ ਸਮਾਂ (waiting period) ਪੂਰਾ ਕਰੋ।",
      "ਦਵਾਈਆਂ ਨੂੰ ਬੱਚਿਆਂ, ਖਾਣੇ ਅਤੇ ਪਾਣੀ ਦੇ ਸਰੋਤਾਂ ਤੋਂ ਦੂਰ ਰੱਖੋ।",
    ],
    offTopicName: "ਕਿਰਪਾ ਕਰਕੇ ਸਿਰਫ਼ ਖੇਤੀ ਨਾਲ ਜੁੜੇ ਸਵਾਲ ਪੁੱਛੋ",
    offTopicCause: "ਮੈਂ ਕਿਸਾਨਮਿੱਤਰ ਹਾਂ ਅਤੇ ਸਿਰਫ਼ ਫ਼ਸਲ ਦੇ ਰੋਗਾਂ, ਕੀੜਿਆਂ ਅਤੇ ਖੇਤੀ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।",
    followupQ1: "ਪੱਤਿਆਂ 'ਤੇ ਕਿਸ ਤਰ੍ਹਾਂ ਦੇ ਨਿਸ਼ਾਨ ਦਿਖ ਰਹੇ ਹਨ?",
    followupQ1Opts: ["ਪੀਲੇ ਜਾਂ ਭੂਰੇ ਧੱਬੇ", "ਪੱਤੇ ਮੁੜਨਾ / ਚਿੱਟੀ ਮੱਖੀ", "ਪੱਤਿਆਂ ਜਾਂ ਫਲ ਵਿੱਚ ਛੇਕ / ਸੁੰਡੀ"],
    followupQ2: "ਖੇਤ ਵਿੱਚ ਕਿੰਨੇ ਬੂਟਿਆਂ 'ਤੇ ਇਹ ਸਮੱਸਿਆ ਹੈ?",
    followupQ2Opts: ["ਸਿਰਫ਼ ਕੁਝ ਬੂਟਿਆਂ 'ਤੇ", "ਅੱਧੇ ਖੇਤ ਵਿੱਚ", "ਲਗਭਗ ਸਾਰੇ ਖੇਤ ਵਿੱਚ"],
  },
  or: {
    unsurePrefix: "ସମ୍ଭାବ୍ୟ ଚିହ୍ନଟ (KVK ରେ ଯାଞ୍ଚ କରନ୍ତୁ): ",
    kvkAdvice: "ମୁଁ ସମ୍ପୂର୍ଣ୍ଣ ନିଶ୍ଚିତ ନୁହେଁ — ଦୟାକରି ନିକଟସ୍ଥ କୃଷି ବିଜ୍ଞାନ କେନ୍ଦ୍ର (KVK) ରେ ଦେଖାନ୍ତୁ କିମ୍ବା 1800-180-1551 କୁ କଲ୍ କରନ୍ତୁ।",
    photoTip: "କେବଳ ଗୋଟିଏ ଫଟୋରୁ 100% ନିଶ୍ଚିତ ହୋଇପାରିବ ନାହିଁ; ପତ୍ରର ତଳ ପାର୍ଶ୍ୱ ଏବଂ କେତେ ଗଛ ଆକ୍ରାନ୍ତ ତାହା ଦେଖନ୍ତୁ।",
    safety: [
      "ଔଷଧ ମିଶାଇବା ପୂର୍ବରୁ ସର୍ବଦା ପ୍ୟାକେଟ୍ ଲେବଲ୍ ପଢ଼ନ୍ତୁ ଏବଂ ଲେଖାଥିବା ମାତ୍ରା ଅନୁସରଣ କରନ୍ତୁ।",
      "ସ୍ପ୍ରେ କରିବା ସମୟରେ ମାସ୍କ, ଗ୍ଲୋଭସ୍ ଏବଂ ଚଷମା ପିନ୍ଧନ୍ତୁ।",
      "ଅମଳ ପୂର୍ବରୁ ଲେବଲ୍‌ରେ ଥିବା ଅପେକ୍ଷା ସମୟ ପାଳନ କରନ୍ତୁ।",
      "ଔଷଧକୁ ପିଲା, ଖାଦ୍ୟ ଏବଂ ଜଳ ଉତ୍ସଠାରୁ ଦୂରରେ ରଖନ୍ତୁ।",
    ],
    offTopicName: "ଦୟାକରି କେବଳ ଚାଷ ସମ୍ବନ୍ଧୀୟ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ",
    offTopicCause: "ମୁଁ କିଷାନମିତ୍ର ଏବଂ କେବଳ ଫସଲ ରୋଗ, ପୋକ ଓ କୃଷି ସହାୟତା ଦେଇପାରିବି।",
    followupQ1: "ପତ୍ରରେ କିପରି ଲକ୍ଷଣ ଦେଖାଯାଉଛି?",
    followupQ1Opts: ["ହଳଦିଆ ବା ବାଦାମୀ ଦାଗ", "ପତ୍ର ମୋଡ଼ି ହେବା / ଧଳା ମାଛି", "ପତ୍ର ବା ଫଳରେ କଣା / ପୋକ"],
    followupQ2: "ଜମିର କେତେ ଗଛରେ ଏହି ସମସ୍ୟା ଅଛି?",
    followupQ2Opts: ["କେବଳ କିଛି ଗଛରେ", "ଅଧା ଜମିରେ", "ପ୍ରାୟ ସମ୍ପୂର୍ଣ୍ଣ ଜମିରେ"],
  },
  en: {
    unsurePrefix: "Likely issue (verify locally): ",
    kvkAdvice: "I am not completely sure — please show an affected leaf at your nearest Krishi Vigyan Kendra (KVK) or call 1800-180-1551.",
    photoTip: "A single photo or short note is never 100% certain; also check the underside of leaves, stem base, and how many plants are affected.",
    safety: [
      "Always check the product label and follow the exact dose printed on the pack.",
      "Wear gloves, a face mask, and eye protection while mixing and spraying.",
      "Wait for the full pre-harvest waiting period listed on the label before picking produce.",
      "Keep all sprays locked away from children, food, and drinking water sources.",
    ],
    offTopicName: "Please ask a farming-related question",
    offTopicCause: "I am KisanMitra and can only help with crop diseases, pests, soil nutrition, and farming care.",
    followupQ1: "What do you see on the leaves or plants?",
    followupQ1Opts: ["Yellow or brown spots", "Curled leaves / white tiny flies", "Holes in leaves or fruit / caterpillars"],
    followupQ2: "How many plants in your field show this problem?",
    followupQ2Opts: ["Only a few plants", "About half the field", "Almost the whole field"],
  },
};

type PatternId =
  | "rust"
  | "blight"
  | "borer"
  | "sucking"
  | "mildew"
  | "wilt"
  | "deficiency";

interface DiseasePattern {
  id: PatternId;
  keywords: string[];
  crops?: string[];
  costRangeINR: string;
  productKeywords: string[];
  severity: "Low" | "Medium" | "High";
  names: Record<string, string>;
  causes: Record<string, string>;
  steps: Record<
    string,
    Array<{ type: "organic" | "biological" | "chemical"; text: string; timing: string }>
  >;
}

const PATTERNS: DiseasePattern[] = [
  {
    id: "rust",
    crops: ["wheat", "maize", "soybean"],
    keywords: [
      "rust", "yellow stripe", "orange powder", "पिला", "पीली धारी", "रतुआ", "पाउडर",
      "रस्ट", "हळद", "மஞ்சள் கோடு", "పసుపు చారలు", "হলুদ দাগ", "ਪੀਲੀਆਂ ਧਾਰੀਆਂ", "peela", "ratua",
    ],
    costRangeINR: "Rs 240 - Rs 520",
    productKeywords: ["propiconazole", "mancozeb", "neem oil", "safety"],
    severity: "Medium",
    names: {
      hi: "गेहूं का पीला / भूरा रतुआ (Yellow / Brown Rust - फफूंद रोग)",
      mr: "तांबेरा रोग (Rust - बुरशीजन्य रोग)",
      bn: "মরিচা রোগ / রাস্ট (Rust - ছত্রাকজনিত)",
      ta: "துரு நோய் (Rust - பூஞ்சை நோய்)",
      te: "తుప్పు తెగులు (Rust - శిలీంధ్ర వ్యాధి)",
      gu: "ગેરુ રોગ (Rust - ફૂગનો રોગ)",
      kn: "ತುಕ್ಕು ರೋಗ (Rust - ಶಿಲೀಂಧ್ರ ರೋಗ)",
      ml: "തുരുമ്പ് രോഗം (Rust - കുമിൾ രോഗം)",
      pa: "ਕਣਕ ਦੀ ਪੀਲੀ ਕੁੰਗੀ (Yellow Rust)",
      or: "କଳଙ୍କି ରୋଗ (Rust - ଫିମ୍ପି ରୋଗ)",
      en: "Crop Rust (Fungal yellow/orange powder streaks)",
    },
    causes: {
      hi: "पत्तों पर पीली-नारंगी धारियां और छूने पर पाउडर लगना फफूंद (फंगस) के कारण होता है, जो ठंडे व नम मौसम में तेजी से फैलता है।",
      mr: "पानांवर पिवळ्या-नारिंगी रेषा आणि हाताला पावडर लागणे हे बुरशीमुळे होते; थंड व दमट हवामानात हा रोग वेगाने पसरतो.",
      bn: "পাতায় হলুদ-কমলা দাগ ও গুঁড়ো দেখা যাওয়া ছত্রাকের কারণে হয়, যা ঠান্ডা ও ভেজা আবহাওয়ায় দ্রুত ছড়ায়।",
      ta: "இலைகளில் மஞ்சள்-ஆரஞ்சு கோடுகள் மற்றும் தூள் போன்ற அமைப்பு பூஞ்சையால் ஏற்படுகிறது; குளிர்ந்த ஈரமான வானிலையில் வேகமாகப் பரவும்.",
      te: "ఆకులపై పసుపు-నారింజ చారలు మరియు పొడి శిలీంధ్రం (ఫంగస్) వల్ల వస్తుంది; చల్లని తేమ వాతావరణంలో వేగంగా వ్యాపిస్తుంది.",
      gu: "પાન પર પીળા-કેસરી પટ્ટા અને પાવડર જેવું લાગવું ફૂગને કારણે થાય છે, જે ઠંડા અને ભેજવાળા હવામાનમાં ઝડપથી ફેલાય છે.",
      kn: "ಎಲೆಗಳ ಮೇಲೆ ಹಳದಿ-ಕಿತ್ತಳೆ ಗೆರೆಗಳು ಮತ್ತು ಪುಡಿ ಕಾಣಿಸುವುದು ಶಿಲೀಂಧ್ರದಿಂದಾಗುತ್ತದೆ; ತಂಪಾದ ತೇವ ವಾತಾವರಣದಲ್ಲಿ ಬೇಗ ಹರಡುತ್ತದೆ.",
      ml: "ഇലകളിൽ മഞ്ഞ-ഓറഞ്ച് വരകളും പൊടിയും കുമിൾ മൂലമാണ് ഉണ്ടാകുന്നത്; തണുപ്പും ഈർപ്പവുമുള്ള കാലാവസ്ഥയിൽ വേഗം പടരുന്നു.",
      pa: "ਪੱਤਿਆਂ 'ਤੇ ਪੀਲੀਆਂ ਧਾਰੀਆਂ ਅਤੇ ਹੱਥ 'ਤੇ ਪਾਊਡਰ ਲੱਗਣਾ ਉੱਲੀ ਕਾਰਨ ਹੁੰਦਾ ਹੈ, ਜੋ ਠੰਢੇ ਤੇ ਸਿੱਲ੍ਹੇ ਮੌਸਮ ਵਿੱਚ ਤੇਜ਼ੀ ਨਾਲ ਫੈਲਦਾ ਹੈ।",
      or: "ପତ୍ରରେ ହଳଦିଆ-କମଳା ଗାର ଏବଂ ଗୁଣ୍ଡ ଲାଗିବା ଫିମ୍ପି ଯୋଗୁଁ ହୁଏ, ଯାହା ଥଣ୍ଡା ଓ ଓଦା ପାଣିପାଗରେ ଶୀଘ୍ର ବ୍ୟାପେ।",
      en: "Yellow or orange powdery streaks along leaves are caused by rust fungus spreading in cool, humid weather.",
    },
    steps: {
      hi: [
        { type: "organic", text: "शुरुआती पीले पत्ते सावधानी से हटाकर खेत से बाहर दबा दें और अतिरिक्त यूरिया खाद रोक दें।", timing: "आज सुबह करें" },
        { type: "biological", text: "हल्के बचाव के लिए नीम तेल आधारित घोल (पैकेट के लेबल के अनुसार मात्रा) का छिड़काव करें।", timing: "शाम को करें, 7 दिन बाद दोहराएं" },
        { type: "chemical", text: "फैलाव बढ़ने पर प्रोपिकोनाजोल या मैंकोजेब (फफूंदनाशी) का छिड़काव करें; हमेशा उत्पाद के लेबल पर लिखी मात्रा ही लें।", timing: "साफ शाम में स्प्रे करें, 14 दिन बाद जरूरत पर दोहराएं" },
      ],
      en: [
        { type: "organic", text: "Remove the first heavily streaked leaves safely away from the field and avoid excess urea.", timing: "Do today morning" },
        { type: "biological", text: "Apply Neem oil spray following the dose printed on the product label.", timing: "Spray in evening; repeat after 7 days" },
        { type: "chemical", text: "If streaks spread rapidly, spray Propiconazole or Mancozeb fungicide; always follow the dose on the product label.", timing: "Calm dry evening; repeat after 14 days if needed" },
      ],
    },
  },
  {
    id: "blight",
    crops: ["tomato", "potato", "rice", "onion", "chilli"],
    keywords: [
      "blight", "spot", "brown", "ring", "black spot", "purple blotch", "blast",
      "झुलसा", "धब्बे", "दाग", "काला", "करपा", "ठिपके", "கருகல்", "புள்ளி",
      "మచ్చ", "తెగులు", "দাগ", "ধসা", "ડાઘ", "ಚುಕ್ಕೆ", "പുള്ളി", "ਧੱਬੇ", "ଦାଗ", "dhaba", "jhulsa",
    ],
    costRangeINR: "Rs 180 - Rs 450",
    productKeywords: ["trichoderma", "neem oil", "mancozeb", "copper oxychloride"],
    severity: "Medium",
    names: {
      hi: "पत्ती झुलसा / धब्बा रोग (Leaf Blight / Spot - फफूंद रोग)",
      mr: "करपा / ठिपके रोग (Early / Late Blight)",
      bn: "পাতা ধসা ও দাগ রোগ (Leaf Blight / Spot)",
      ta: "இலைக் கருகல் / புள்ளி நோய் (Leaf Blight / Spot)",
      te: "ఆకు మచ్చ / మాడు తెగులు (Leaf Blight / Spot)",
      gu: "પાનનો સુકારો / ટપકાંનો રોગ (Leaf Blight)",
      kn: "ಎಲೆ ಚುಕ್ಕೆ / ಅಂಗಮಾರಿ ರೋಗ (Leaf Blight)",
      ml: "ഇലപ്പുള്ളി / ബ്ലൈറ്റ് രോഗം (Leaf Blight)",
      pa: "ਪੱਤਾ ਝੁਲਸ / ਧੱਬੇ ਰੋਗ (Leaf Blight)",
      or: "ପତ୍ର ପୋଡ଼ା / ଦାଗ ରୋଗ (Leaf Blight)",
      en: "Leaf Blight / Fungal Leaf Spot",
    },
    causes: {
      hi: "निचले या पुराने पत्तों पर गोल भूरे-काले धब्बे फफूंद (Alternaria या Phytophthora) से होते हैं, जो बारिश की छींटों और नमी से फैलते हैं।",
      mr: "खालच्या पानांवर गोल तपकिरी-काळे डाग बुरशीमुळे येतात आणि पावसाच्या शिंतोड्यांमुळे वाढतात.",
      bn: "নিচের পাতায় গোল বাদামী বা কালো দাগ ছত্রাকের কারণে হয়, যা বৃষ্টির জল ও আর্দ্রতায় দ্রুত বাড়ে।",
      ta: "கீழ் இலைகளில் வட்டமான பழுப்பு/கருப்பு புள்ளிகள் பூஞ்சையால் ஏற்பட்டு ஈரப்பதத்தால் பரவுகின்றன.",
      te: "కింది ఆకులపై గోధుమ లేదా నల్లటి మచ్చలు శిలీంధ్రం వల్ల వస్తాయి, తేమ వల్ల వేగంగా పెరుగుతాయి.",
      en: "Circular brown or dark water-soaked spots on leaves are caused by fungal blight spreading via rain splash and high humidity.",
    },
    steps: {
      hi: [
        { type: "organic", text: "नीचे के रोगग्रस्त पत्ते तोड़कर हटाएं, सिंचाई सीधे जड़ों के पास करें ताकि पत्ते गीले न हों, और सूखी घास की मल्चिंग करें।", timing: "आज सुबह करें" },
        { type: "biological", text: "ट्राइकोडर्मा विरिडी (लाभकारी फफूंद) या नीम तेल का प्रयोग उत्पाद लेबल के अनुसार करें।", timing: "शाम को करें, 7 दिन बाद दोहराएं" },
        { type: "chemical", text: "धब्बे बढ़ने पर कॉपर ऑक्सीक्लोराइड या मैंकोजेब का छिड़काव करें; हमेशा पैकेट के लेबल पर लिखी मात्रा ही इस्तेमाल करें।", timing: "बारिश न होने पर शाम को छिड़कें, 7-10 दिन में दोहराएं" },
      ],
      en: [
        { type: "organic", text: "Pluck badly spotted lower leaves, water only at the root base, and spread dry straw mulch.", timing: "Do today morning" },
        { type: "biological", text: "Apply Trichoderma viride near roots or spray Neem oil following the product label.", timing: "Spray in the cool evening; repeat after 7 days" },
        { type: "chemical", text: "If spots spread upward, spray Mancozeb or Copper Oxychloride; always follow the dose on the product label.", timing: "Dry evening spray; repeat after 7-10 days" },
      ],
    },
  },
  {
    id: "borer",
    crops: ["cotton", "tomato", "chilli", "maize", "rice", "sugarcane"],
    keywords: [
      "borer", "bollworm", "worm", "caterpillar", "hole", "holes", "armyworm",
      "छेद", "अळी", "इल्ली", "सुंडी", "बोंडअळी", "तना छेदक", "कीड़ा",
      "புழு", "துளை", "పురుగు", "రంధ్రం", "পোকা", "ছিদ্র", "ઈયળ", "ಹುಳು", "പുഴു", "ਸੁੰਡੀ", "keeda", "sundi", "illi",
    ],
    costRangeINR: "Rs 260 - Rs 650",
    productKeywords: ["pheromone trap", "bt", "beauveria", "emamectin", "chlorantraniliprole"],
    severity: "High",
    names: {
      hi: "फल छेदक / तना छेदक / बोंडअळी (Borer / Caterpillar Pest)",
      mr: "बोंडअळी / फळ पोखरणाऱ्या अळ्या (Bollworm / Fruit Borer)",
      bn: "ফল ছিদ্রকারী / মাজরা পোকা (Borer / Caterpillar)",
      ta: "காய் / தண்டு துளைப்பான் புழு (Borer / Bollworm)",
      te: "కాయ తొలుచు పురుగు / కాండం తొలుచు పురుగు (Borer)",
      gu: "ઈયળ / જીંડવા કોરી ખાનાર (Bollworm / Borer)",
      kn: "ಕಾಯಿ ಕೊರಕ / ಕಾಂಡ ಕೊರಕ ಹುಳು (Borer)",
      ml: "കായ്‌തുരപ്പൻ / തണ്ടുതുരപ്പൻ പുഴു (Borer)",
      pa: "ਗੁਲਾਬੀ ਸੁੰਡੀ / ਤਣਾ ਛੇਦਕ (Bollworm / Stem Borer)",
      or: "ଫଳ ବିନ୍ଧା / କାଣ୍ଡ ବିନ୍ଧା ପୋକ (Borer)",
      en: "Fruit / Stem Borer or Bollworm Caterpillar",
    },
    causes: {
      hi: "मादा पतंगे पत्तों या कलियों पर अंडे देते हैं, जिनसे निकलने वाली सुंडी (इल्ली) पत्तों, तने या फल में छेद करके अंदर से खाती है।",
      mr: "पतंगांनी घातलेल्या अंड्यांतून निघालेली अळी पाने, बोंडे किंवा फळांत छिद्र पाडून आतून खाते.",
      bn: "মথের ডিম থেকে বের হওয়া শূককীট পাতা, কাণ্ড বা ফলে ছিদ্র করে ভেতর থেকে খেয়ে ফেলে।",
      ta: "அந்துப்பூச்சிகள் இடும் முட்டைகளிலிருந்து வரும் புழுக்கள் இலை, தண்டு அல்லது காய்களைத் துளைத்து உண்ணுகின்றன.",
      te: "రెక్కల పురుగులు పెట్టిన గుడ్ల నుండి వచ్చిన లార్వా ఆకులు, కాండం లేదా కాయలకు రంధ్రాలు చేసి లోపల తింటాయి.",
      en: "Moths lay eggs on buds and leaves; hatched caterpillars bore holes into stems, bolls, or fruits.",
    },
    steps: {
      hi: [
        { type: "organic", text: "छेद वाले फल/बोंड तोड़कर मिट्टी में दबा दें और खेत में फेरोमोन ट्रैप (गंध पाश) लगाएं।", timing: "तुरंत लगाएं, हर हफ्ते जांचें" },
        { type: "biological", text: "छोटी सुंडी के लिए बी.टी. (Bacillus thuringiensis) या ब्यूवेरिया बैसियाना और नीम तेल का छिड़काव लेबल के अनुसार करें।", timing: "शाम के समय छिड़काव करें, 7 दिन बाद दोहराएं" },
        { type: "chemical", text: "प्रकोप ज्यादा होने पर इमामेक्टिन बेंजोएट या क्लोरेंट्रानिलिप्रोल का छिड़काव करें; हमेशा पैकेट के लेबल पर लिखी मात्रा ही लें।", timing: "शांत शाम को स्प्रे करें, जरूरत पर 10-12 दिन बाद दोहराएं" },
      ],
      en: [
        { type: "organic", text: "Collect and destroy bored fruits/bolls, and install Pheromone Traps to catch adult moths early.", timing: "Install immediately, check weekly" },
        { type: "biological", text: "Spray Bacillus thuringiensis (Bt) or Beauveria bassiana mixed with Neem oil following the product label.", timing: "Spray in evening; repeat after 7 days" },
        { type: "chemical", text: "For heavy infestation, spray Emamectin Benzoate or Chlorantraniliprole; always follow the dose on the product label.", timing: "Calm evening spray; repeat after 10-12 days if needed" },
      ],
    },
  },
  {
    id: "sucking",
    crops: ["chilli", "tomato", "cotton", "onion", "rice"],
    keywords: [
      "whitefly", "white fly", "aphid", "thrips", "curl", "curled", "jassid", "hopper", "mite", "sticky",
      "सफेद मक्खी", "माहू", "मावा", "तेला", "चुरड़ा", "पत्ता मुड़ना", "कोकडा", "थ्रिप्स",
      "வெள்ளை ஈ", "இலை சுருள்", "తెల్ల దోమ", "ముడత", "সাদা মাছি", "સફેદ માખી", "ಬಿಳಿ ನೊಣ", "വെള്ളീച്ച", "ਚਿੱਟੀ ਮੱਖੀ", "ଧଳା ମାଛି", "makkhi", "mava",
    ],
    costRangeINR: "Rs 190 - Rs 440",
    productKeywords: ["yellow sticky trap", "neem oil", "imidacloprid", "thiamethoxam"],
    severity: "Medium",
    names: {
      hi: "रस चूसक कीट व पत्ता मरोड़ (Whitefly / Thrips / Leaf Curl)",
      mr: "रस शोषक किडी आणि चुरडा-मुरडा (Sucking Pests / Leaf Curl)",
      bn: "রস চোষা পোকা ও পাতা কোঁকড়ানো (Whitefly / Thrips)",
      ta: "சாறு உறிஞ்சும் பூச்சி & இலை சுருட்டல் (Whitefly / Thrips)",
      te: "రసం పీల్చే పురుగులు & ఆకు ముడత (Whitefly / Thrips)",
      gu: "ચૂસિયા જીવાત અને પાન કોકડવા (Whitefly / Thrips)",
      kn: "ರಸ ಹೀರುವ ಕೀಟ ಮತ್ತು ಎಲೆ ಮುರುಟು (Whitefly / Thrips)",
      ml: "നീരൂറ്റിക്കുടിക്കുന്ന കീടങ്ങളും ഇല ചുരുളലും",
      pa: "ਚਿੱਟੀ ਮੱਖੀ / ਤੇਲਾ ਅਤੇ ਪੱਤਾ ਮਰੋੜ",
      or: "ରସ ଶୋଷକ ପୋକ ଓ ପତ୍ର ମୋଡ଼ି ହେବା",
      en: "Sucking Pests (Whitefly / Thrips / Aphids) & Leaf Curl",
    },
    causes: {
      hi: "सफेद मक्खी, माहू या थ्रिप्स पत्तों के नीचे बैठकर रस चूसते हैं, जिससे पत्ते मुड़ते हैं और विषाणु (वायरस) रोग भी फैलता है।",
      mr: "पांढरी माशी, मावा व फुलकिडे पानांमधील रस शोषतात, त्यामुळे पाने वर किंवा खाली मुरडतात आणि विषाणूजन्य रोग पसरतो.",
      bn: "সাদা মাছি ও থ্রিপস পাতার নিচ থেকে রস চুষে নেয়, ফলে পাতা কুঁকড়ে যায় এবং ভাইরাস ছড়ায়।",
      ta: "வெள்ளை ஈ மற்றும் இலைப்பேன் இலைகளின் அடியில் சாற்றை உறிஞ்சுவதால் இலைகள் சுருண்டு வைரஸ் நோய் பரவுகிறது.",
      te: "తెల్ల దోమ మరియు తామర పురుగులు ఆకుల కింద నుండి రసం పీల్చడం వల్ల ఆకులు ముడుచుకుపోయి వైరస్ వ్యాపిస్తుంది.",
      en: "Tiny whiteflies, aphids, or thrips feed under leaves, causing leaf curling, honeydew, and viral spread.",
    },
    steps: {
      hi: [
        { type: "organic", text: "खेत में पीले और नीले चिपचिपे ट्रैप (Sticky Traps) लगाएं और अत्यधिक मुड़े वायरस वाले पौधे उखाड़कर दबा दें।", timing: "तुरंत लगाएं" },
        { type: "biological", text: "पत्तों की निचली सतह पर नीम तेल (1500 PPM) का अच्छी तरह छिड़काव करें; लेबल पर लिखी मात्रा देखें।", timing: "शाम के समय, 5-7 दिन बाद दोहराएं" },
        { type: "chemical", text: "कीट अधिक होने पर इमिडाक्लोप्रिड या थियामेथोक्सम का छिड़काव करें; हमेशा उत्पाद के लेबल पर लिखी मात्रा का पालन करें।", timing: "शांत शाम को स्प्रे करें, 10 दिन बाद जरूरत पर दोहराएं" },
      ],
      en: [
        { type: "organic", text: "Place Yellow & Blue Sticky Traps around the crop and uproot severely virus-curled plants early.", timing: "Place immediately" },
        { type: "biological", text: "Spray Neem Oil (1500 PPM) thoroughly on the underside of leaves following the product label.", timing: "Evening spray; repeat every 5-7 days" },
        { type: "chemical", text: "If pests remain high, spray Imidacloprid or Thiamethoxam; always follow the dose on the product label.", timing: "Calm evening spray; repeat after 10 days if needed" },
      ],
    },
  },
  {
    id: "mildew",
    keywords: [
      "white powder", "powdery", "mildew", "ash", "सफेद चूर्ण", "पाउडरी", "भूरी", "सांबल", "சாம்பல் நோய்", "బూడిద", "পাউডারি",
    ],
    costRangeINR: "Rs 150 - Rs 340",
    productKeywords: ["sulphur", "neem oil", "azoxystrobin"],
    severity: "Medium",
    names: {
      hi: "चूर्णिल आसिता / भभूतिया (Powdery Mildew)",
      mr: "भुरी रोग (Powdery Mildew)",
      bn: "পাউডারি মিলডিউ (সাদা গুঁড়ো রোগ)",
      ta: "சாம்பல் நோய் (Powdery Mildew)",
      te: "బూడిద తెగులు (Powdery Mildew)",
      en: "Powdery Mildew (White flour-like coating)",
    },
    causes: {
      hi: "पत्तों के ऊपर सफेद आटे जैसा पाउडर फफूंद के कारण बनता है, जो सूखे और हल्के गर्म मौसम में फैलता है।",
      en: "White flour-like patches on leaf surfaces are caused by powdery mildew fungus in dry, mild weather.",
    },
    steps: {
      hi: [
        { type: "organic", text: "घने पत्तों की हल्की छंटाई करें ताकि हवा व धूप अंदर जा सके।", timing: "सुबह के समय" },
        { type: "biological", text: "नीम तेल या घुलनशील सल्फर (Wettable Sulphur) का छिड़काव लेबल के अनुसार करें।", timing: "ठंडी शाम में, 7 दिन बाद दोहराएं" },
      ],
      en: [
        { type: "organic", text: "Prune overcrowded lower shoots to improve airflow and sunlight.", timing: "Morning" },
        { type: "biological", text: "Spray Wettable Sulphur 80% WDG or Neem oil following the product label.", timing: "Cool evening; avoid spraying in hot noon sun" },
      ],
    },
  },
  {
    id: "wilt",
    keywords: [
      "wilt", "droop", "rot", "root", "dying", "मुरझा", "सड़न", "गलन", "मर रहा", "मरने", "வாடல்", "ఎండు", "ঢলে পড়া", "સૂકારો",
    ],
    costRangeINR: "Rs 160 - Rs 420",
    productKeywords: ["trichoderma", "pseudomonas", "copper oxychloride"],
    severity: "High",
    names: {
      hi: "उकठा / जड़ सड़न रोग (Wilt / Root Rot)",
      mr: "मर रोग / मूळकुज (Wilt / Root Rot)",
      bn: "ঢলে পড়া / গোড়া পচা রোগ (Wilt / Root Rot)",
      ta: "வாடல் / வேர் அழுகல் நோய் (Wilt / Root Rot)",
      te: "ఎండు తెగులు / వేరు కుళ్ళు (Wilt / Root Rot)",
      en: "Root Rot / Vascular Wilt",
    },
    causes: {
      hi: "खेत में पानी जमा रहने और मिट्टी की फफूंद या बैक्टीरिया से जड़ें सड़ जाती हैं और हरा पौधा अचानक मुरझा जाता है।",
      en: "Waterlogging and soil-borne fungi/bacteria block water flow in roots, causing sudden wilting.",
    },
    steps: {
      hi: [
        { type: "organic", text: "खेत से अतिरिक्त पानी तुरंत निकालें और क्यारियों में जल निकासी सुधारें।", timing: "तुरंत करें" },
        { type: "biological", text: "ट्राइकोडर्मा विरिडी और स्यूडोमोनास फ्लोरेसेंस को गोबर की खाद या पानी के साथ जड़ों के पास दें (लेबल के अनुसार)।", timing: "सुबह या शाम जड़ क्षेत्र में दें, 10 दिन बाद दोहराएं" },
        { type: "chemical", text: "जरूरत होने पर कॉपर ऑक्सीक्लोराइड से जड़ों के पास ड्रेचिंग करें; हमेशा लेबल पर लिखी मात्रा ही रखें।", timing: "सिंचाई के बाद शाम को" },
      ],
      en: [
        { type: "organic", text: "Drain standing water immediately and avoid flood irrigation around stems.", timing: "Immediately" },
        { type: "biological", text: "Drench Trichoderma viride or Pseudomonas fluorescens around the root zone per product label.", timing: "Morning or evening; repeat after 10 days" },
        { type: "chemical", text: "If wilting spreads, drench Copper Oxychloride around root bases; always follow the dose on the product label.", timing: "Evening after light moisture" },
      ],
    },
  },
  {
    id: "deficiency",
    keywords: [
      "yellow", "yellowing", "pale", "stunted", "nutrient", "zinc", "khaira", "पीला", "पीलापन", "कमजोर", "मஞ்சள்", "పసుపు", "হলুদ", "પીળું",
    ],
    costRangeINR: "Rs 160 - Rs 380",
    productKeywords: ["zinc", "npk", "seaweed", "humic acid"],
    severity: "Low",
    names: {
      hi: "पोषक तत्व की कमी (जिंक / नाइट्रोजन कमी - Nutrient Deficiency)",
      mr: "अन्नद्रव्यांची कमतरता (Nutrient Deficiency)",
      bn: "পুষ্টি উপাদানের ঘাটতি (Nutrient Deficiency)",
      ta: "ஊட்டச்சத்து குறைபாடு (Nutrient Deficiency)",
      te: "పోషక లోపం (Nutrient Deficiency)",
      en: "Nutrient / Micronutrient Deficiency (Nitrogen or Zinc)",
    },
    causes: {
      hi: "पत्तों का एक समान पीला पड़ना या पौधे की बढ़वार रुकना मिट्टी में नाइट्रोजन, जिंक या सूक्ष्म पोषक तत्वों की कमी से होता है।",
      en: "Uniform yellowing or stunted growth often points to Nitrogen, Zinc (Khaira in rice), or micronutrient deficiency.",
    },
    steps: {
      hi: [
        { type: "organic", text: "जड़ों के पास सड़ी गोबर खाद या ह्यूमिक एसिड व समुद्री शैवाल (Seaweed) अर्क दें।", timing: "सुबह के समय, 10-14 दिन बाद दोहराएं" },
        { type: "biological", text: "जिंक + बोरॉन सूक्ष्म पोषक तत्व या NPK 19:19:19 का पत्तियों पर छिड़काव पैकेट लेबल के अनुसार करें।", timing: "शाम को करें, 10 दिन बाद दोहराएं" },
      ],
      en: [
        { type: "organic", text: "Apply well-rotted compost or Humic Acid / Seaweed bio-stimulant to boost root uptake.", timing: "Morning; repeat after 14 days" },
        { type: "biological", text: "Foliar spray Chelated Zinc + Boron or NPK 19:19:19 following the product label.", timing: "Cool evening; repeat after 10 days" },
      ],
    },
  },
];

const OFF_TOPIC_RE = /\b(cricket|ipl|movie|song|poem|joke|code|python|javascript|bitcoin|stock market|homework|essay|recipe)\b/i;

export function buildSmartFallbackDiagnosis(req: DiagnoseRequest, mode: "no_api_key" | "error"): DiagnoseResponse {
  const lang = getLanguageConfig(req.language);
  const labels = LABELS[lang.code] || LABELS["en"];
  const textLower = (req.text || "").toLowerCase().trim();

  if (textLower && OFF_TOPIC_RE.test(textLower) && !req.crop && !req.imageBase64) {
    return {
      status: "diagnosed",
      detectedLanguage: lang.code,
      diagnosis: {
        name: labels.offTopicName,
        confidence: "High",
        severity: "Low",
        cause: labels.offTopicCause,
      },
      plan: { steps: [] },
      safety: [],
      costRangeINR: "Rs 0",
      productKeywords: [],
      escalate: false,
      isOffTopic: true,
      isFallback: true,
    };
  }

  // Ask follow-up questions if input is very vague and no follow-up answers exist yet
  const isVague =
    (!req.history || req.history.length === 0) &&
    !req.imageBase64 &&
    textLower.length > 0 &&
    textLower.split(/\s+/).length <= 3 &&
    !PATTERNS.some((p) => p.keywords.some((kw) => textLower.includes(kw)));

  if (isVague) {
    return {
      status: "needs_followup",
      detectedLanguage: lang.code,
      followups: [
        { id: "q1", question: labels.followupQ1, options: labels.followupQ1Opts },
        { id: "q2", question: labels.followupQ2, options: labels.followupQ2Opts },
      ],
      plan: { steps: [] },
      safety: labels.safety,
      costRangeINR: "Rs 150 - Rs 450",
      productKeywords: ["neem oil", "trichoderma"],
      escalate: false,
      isFallback: true,
    };
  }

  const combinedText = [
    textLower,
    ...(req.history || []).map((h) => `${h.question} ${h.answer}`.toLowerCase()),
  ].join(" ");

  let bestPattern: DiseasePattern | null = null;
  let bestScore = 0;

  for (const pattern of PATTERNS) {
    let score = 0;
    for (const kw of pattern.keywords) {
      if (combinedText.includes(kw.toLowerCase())) {
        score += 4;
      }
    }
    if (req.crop && pattern.crops?.includes(req.crop.toLowerCase())) {
      score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestPattern = pattern;
    }
  }

  if (!bestPattern || bestScore <= 1) {
    // Photo-only or generic fallback
    bestPattern = req.crop === "wheat" ? PATTERNS[0] : PATTERNS[1];
  }

  const name = bestPattern.names[lang.code] || bestPattern.names["en"];
  const cause = bestPattern.causes[lang.code] || bestPattern.causes["en"];
  const steps = bestPattern.steps[lang.code] || bestPattern.steps["en"];

  const isLowConfidence = bestScore < 4 || mode === "error";
  const confidence: "High" | "Medium" | "Low" = bestScore >= 6 ? "Medium" : "Low";

  return {
    status: "diagnosed",
    detectedLanguage: lang.code,
    diagnosis: {
      name: isLowConfidence ? `${labels.unsurePrefix}${name}` : name,
      confidence,
      severity: bestPattern.severity,
      cause: isLowConfidence ? `${cause} ${labels.kvkAdvice}` : cause,
    },
    plan: { steps },
    safety: labels.safety,
    costRangeINR: bestPattern.costRangeINR,
    productKeywords: bestPattern.productKeywords,
    escalate: isLowConfidence || bestPattern.severity === "High",
    photoTip: labels.photoTip,
    isOffTopic: false,
    isFallback: true,
  };
}
