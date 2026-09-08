import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appTitle: "Kabadiwala Connect",
      selectPortal: "Select your portal to continue",
      citizen: "Citizen",
      citizenDesc: "Book a scrap pickup",
      kabadiwala: "Kabadiwala",
      kabadiwalaDesc: "Accept nearby requests",
      admin: "Municipality Admin",
      adminDesc: "Manage rates & track data",
      citizenTitle: "Citizen Portal",
      bookPickup: "Book a Scrap Pickup",
      selectScrap: "Select scrap types to estimate value",
      estWeight: "Estimated Weight (kg)",
      totalValue: "Total Value:",
      location: "Location",
      addPhoto: "Add Photo",
      schedulePickup: "Schedule Pickup",
      selectScrapBtn: "Select Scrap to Continue",
      logout: "Logout",
      paper: "Paper",
      metal: "Metal",
      plastic: "Plastic",
      ewaste: "E-Waste",
      successTitle: "Pickup Scheduled!",
      successDesc: "Your local Kabadiwala is on the way.",
      backHome: "Back to Home",
    }
  },
  hi: {
    translation: {
      appTitle: "कबाड़ीवाला कनेक्ट",
      selectPortal: "जारी रखने के लिए अपना पोर्टल चुनें",
      citizen: "नागरिक",
      citizenDesc: "कबाड़ पिकअप बुक करें",
      kabadiwala: "कबाड़ीवाला",
      kabadiwalaDesc: "आसपास के अनुरोध स्वीकार करें",
      admin: "नगर पालिका प्रशासन",
      adminDesc: "दरें प्रबंधित करें और डेटा ट्रैक करें",
      citizenTitle: "नागरिक पोर्टल",
      bookPickup: "कबाड़ पिकअप बुक करें",
      selectScrap: "मूल्य का अनुमान लगाने के लिए कबाड़ चुनें",
      estWeight: "अनुमानित वजन (किग्रा)",
      totalValue: "कुल मूल्य:",
      location: "स्थान",
      addPhoto: "फोटो जोड़ें",
      schedulePickup: "पिकअप शेड्यूल करें",
      selectScrapBtn: "जारी रखने के लिए कबाड़ चुनें",
      logout: "लॉग आउट",
      paper: "कागज़",
      metal: "धातु",
      plastic: "प्लास्टिक",
      ewaste: "ई-कचरा",
      successTitle: "पिकअप शेड्यूल हो गया!",
      successDesc: "आपका स्थानीय कबाड़ीवाला रास्ते में है।",
      backHome: "होम पर वापस जाएं",
    }
  },
  bn: {
    translation: {
      appTitle: "কাবাড়িওয়ালা কানেক্ট",
      selectPortal: "এগিয়ে যেতে আপনার পোর্টাল নির্বাচন করুন",
      citizen: "নাগরিক",
      citizenDesc: "একটি স্ক্র্যাপ পিকআপ বুক করুন",
      kabadiwala: "কাবাড়িওয়ালা",
      kabadiwalaDesc: "কাছাকাছি অনুরোধ গ্রহণ করুন",
      admin: "পৌরসভা অ্যাডমিন",
      adminDesc: "রেট পরিচালনা করুন এবং ডেটা ট্র্যাক করুন",
      citizenTitle: "নাগরিক পোর্টাল",
      bookPickup: "স্ক্র্যাপ পিকআপ বুক করুন",
      selectScrap: "মূল্য অনুমান করতে স্ক্র্যাপ নির্বাচন করুন",
      estWeight: "আনুমানিক ওজন (কেজি)",
      totalValue: "মোট মূল্য:",
      location: "অবস্থান",
      addPhoto: "ছবি যোগ করুন",
      schedulePickup: "পিকআপ নির্ধারণ করুন",
      selectScrapBtn: "এগিয়ে যেতে স্ক্র্যাপ নির্বাচন করুন",
      logout: "লগআউট",
      paper: "কাগজ",
      metal: "ধাতু",
      plastic: "প্লাস্টিক",
      ewaste: "ই-বর্জ্য",
      successTitle: "পিকআপ নির্ধারিত হয়েছে!",
      successDesc: "আপনার স্থানীয় কাবাড়িওয়ালা পথে আছে।",
      backHome: "হোমে ফিরে যান",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Default language
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;