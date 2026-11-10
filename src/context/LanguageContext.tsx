'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    breaking: 'BREAKING NEWS',
    live: 'LIVE',
    home: 'Home',
    india: 'India',
    maharashtra: 'Maharashtra',
    mumbai: 'Mumbai',
    politics: 'Politics',
    crime: 'Crime',
    business: 'Business',
    technology: 'Technology',
    sports: 'Sports',
    entertainment: 'Entertainment',
    groundReports: 'Ground Reports',
    mbnSquad: 'MBN Squad',
    searchPlaceholder: 'Search news, topics, investigations...',
    joinSquad: 'Join MBN Squad',
    memberLogin: 'Member Login',
    adminLogin: 'Admin Panel',
    trending: 'Trending Stories',
    latestNews: 'Latest Updates',
    groundReality: 'Ground Reality & Public Issues',
    reportIssue: 'Report a Public Issue',
    videoNews: 'MBN Video & Special Investigations',
    newsletterTitle: 'Truth Without Compromise. Straight to Your Inbox.',
    newsletterDesc: 'Subscribe for daily morning briefings, citizen investigation alerts, and ground report updates.',
    subscribe: 'Subscribe Now',
    subscribeSuccess: 'Thank you for subscribing to MBN Daily Briefing!',
    readMore: 'Read Full Story',
    loadMore: 'Load More News',
    squadMission: 'Sirf News Dekhna Nahi, Badlav Ka Hissa Banna Hai!',
    squadDesc: 'Become a part of MBN Squad. Join our community of active citizens who highlight local problems, demand municipal accountability, and bring real change.',
    heroBadge: 'SPECIAL INVESTIGATION',
    verifiedCitizenReport: 'Verified Ground Report',
    views: 'reads',
  },
  hi: {
    breaking: 'ताज़ा खबर',
    live: 'लाइव',
    home: 'होम',
    india: 'भारत',
    maharashtra: 'महाराष्ट्र',
    mumbai: 'मुंबई',
    politics: 'राजनीति',
    crime: 'क्राइम',
    business: 'व्यापार',
    technology: 'टेक्नोलॉजी',
    sports: 'खेल',
    entertainment: 'मनोरंजन',
    groundReports: 'ग्राउंड रिपोर्ट',
    mbnSquad: 'MBN स्क्वाड',
    searchPlaceholder: 'खबरें, मुद्दे, रिपोर्ट खोजें...',
    joinSquad: 'MBN स्क्वाड से जुड़ें',
    memberLogin: 'सदस्य लॉगिन',
    adminLogin: 'एडमिन पैनल',
    trending: 'ट्रेंडिंग खबरें',
    latestNews: 'ताज़ा अपडेट',
    groundReality: 'ग्राउंड रियलिटी और जन समस्याएं',
    reportIssue: 'जन समस्या दर्ज करें',
    videoNews: 'MBN वीडियो और विशेष जांच',
    newsletterTitle: 'बिना समझौते का सच. सीधे आपके इनबॉक्स में.',
    newsletterDesc: 'दैनिक मॉर्निंग ब्रीफिंग और नागरिक जांच अलर्ट के लिए सदस्यता लें।',
    subscribe: 'सब्सक्राइब करें',
    subscribeSuccess: 'MBN दैनिक ब्रीफिंग से जुड़ने के लिए धन्यवाद!',
    readMore: 'पूरी खबर पढ़ें',
    loadMore: 'और खबरें देखें',
    squadMission: 'सिर्फ खबर देखना नहीं, बदलाव का हिस्सा बनना है!',
    squadDesc: 'MBN स्क्वाड का हिस्सा बनें। सक्रिय नागरिकों के समुदाय से जुड़ें जो स्थानीय समस्याओं को उठाते हैं और बदलाव लाते हैं।',
    heroBadge: 'विशेष जांच',
    verifiedCitizenReport: 'सत्यापित ग्राउंड रिपोर्ट',
    views: 'पढ़ा गया',
  },
  mr: {
    breaking: 'ताजी बातमी',
    live: 'थेट / लाईव्ह',
    home: 'मुख्यपृष्ठ',
    india: 'भारत',
    maharashtra: 'महाराष्ट्र',
    mumbai: 'मुंबई',
    politics: 'राजकारण',
    crime: 'गुन्हेगारी',
    business: 'उद्योग',
    technology: 'तंत्रज्ञान',
    sports: 'क्रीडा',
    entertainment: 'मनोरंजन',
    groundReports: 'ग्राउंड रिपोर्ट',
    mbnSquad: 'MBN स्क्वाड',
    searchPlaceholder: 'बातम्या, शोध पत्रकारिता शोधा...',
    joinSquad: 'MBN स्क्वाडमध्ये सामील व्हा',
    memberLogin: 'सदस्य लॉगिन',
    adminLogin: 'प्रशासक पॅनेल',
    trending: 'ट्रेंडिंग बातम्या',
    latestNews: 'ताज्या घडामोडी',
    groundReality: 'ग्राउंड रिॲलिटी आणि जनतेचे प्रश्न',
    reportIssue: 'नागरी समस्या नोंदवा',
    videoNews: 'MBN व्हिडिओ आणि विशेष तपास',
    newsletterTitle: 'तडजोड नसलेले सत्य. थेट तुमच्या इनबॉक्समध्ये.',
    newsletterDesc: 'दररोजच्या महत्त्वाच्या घडामोडी व नागरिक तपास अलर्ट्ससाठी सबस्क्राईब करा.',
    subscribe: 'सबस्क्राईब करा',
    subscribeSuccess: 'MBN विशेष वार्तांकनाशी जोडल्याबद्दल धन्यवाद!',
    readMore: 'संपूर्ण बातमी वाचा',
    loadMore: 'आणखी बातम्या पहा',
    squadMission: 'फक्त बातमी पाहायची नाही, बदलाचा भाग व्हायचंय!',
    squadDesc: 'MBN स्क्वाडचे सदस्य व्हा. स्थानिक अडचणी मांडणाऱ्या आणि प्रशासनाला जाब विचारणाऱ्या सक्रिय नागरिकांसोबत या.',
    heroBadge: 'विशेष तपासणी',
    verifiedCitizenReport: 'सत्यापित ग्राउंड रिपोर्ट',
    views: 'वाचले',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('mbn_pref_lang') as Language;
    if (saved && ['en', 'hi', 'mr'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mbn_pref_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
