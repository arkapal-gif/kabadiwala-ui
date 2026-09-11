import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // General
      "appTitle": "ScrapUp",
      "logout": "Logout",
      "backHome": "Back",
      
      // Roles
      "selectRole": "Select your role to continue",
      "roleCollector": "Informal Collector",
      "roleCollectorDesc": "Log and sell collected e-waste",
      "roleRecycler": "Authorized Recycler",
      "roleRecyclerDesc": "Receive formalized e-waste lots",
      "roleAdmin": "EPR Admin",
      "roleAdminDesc": "Track formalization and traceability",

      // Portal Titles
      "citizenTitle": "Collector Portal",
      "recyclerTitle": "ScrapUp Recycler",
      "adminTitle": "ScrapUp Admin Dashboard",

      // Collector Portal - Audio & Materials
      "priceSpeech": "Price is",
      "rupeesPerKg": "rupees per kg",
      "noValue": "has no value",
      "cat_crt": "CRTs",
      "cat_lcd": "LCD Panels",
      "cat_pcb": "Circuit Boards",
      "cat_cables": "Cables",
      "cat_batteries": "Batteries",
      "cat_motors": "Motors",
      "cat_plastics": "Mixed Plastics",
      "cat_nonBiodegradable": "Plastics",
      "cat_specialized": "E-Waste Items",

      // Collector Portal - Safety & Form
      "safetyWarningFull": "Safety Warning: Do not burn cables or break open batteries. Hand them safely to authorized recyclers to protect your health.",
      "bookPickup": "Log E-Waste",
      "selectScrap": "Select materials to estimate value",
      "estWeight": "Estimated Weight (kg)",
      "totalValue": "Total Value:",
      "nextStep": "Next Step",
      "selectScrapBtn": "Select Materials",
      
      // Collector Portal - Step 2
      "personalDetails": "Lot Details",
      "fullName": "Name",
      "mobileNumber": "Phone",
      "exactAddress": "Location",
      "getGps": "Use GPS",
      "addPhoto": "Upload Photo",
      "photoAttached": "Photo Attached",
      "schedulePickup": "Submit Lot",
      "fillDetailsBtn": "Fill Details",
      "successTitle": "Lot Submitted!",
      "successDesc": "Recycler notified.",

      // Recycler Portal
      "dutyStatus": "Status",
      "onlineMsg": "Online",
      "offlineMsg": "Offline",
      "goOnlineMsg": "Go online to view lots.",
      "liveRequests": "Live Lots Near You",
      "noRequests": "No pending lots.",
      "decline": "Decline",
      "accept": "Accept Lot",
      "activeRoute": "Active Collection",
      "confirmCollection": "Confirm Handover",

      // Admin Portal
      "statFormalized": "Formalized E-Waste",
      "statCollectors": "Registered Collectors",
      "statPending": "Pending Traceability",
      "statValue": "Value Disbursed",
      "chartTitle": "Weekly EPR Category Tracking (kg)",
      "logsTitle": "Live Verification Logs",
      "mapTitle": "Live Recycler Fleet Routing"
    }
  },
  hi: {
    translation: {
      "appTitle": "स्क्रैप-अप (ScrapUp)",
      "logout": "लॉग आउट",
      "backHome": "वापस जाएं",

      "selectRole": "जारी रखने के लिए अपनी भूमिका चुनें",
      "roleCollector": "अनौपचारिक संग्रहकर्ता",
      "roleCollectorDesc": "ई-कचरा लॉग करें और बेचें",
      "roleRecycler": "अधिकृत रीसाइक्लर",
      "roleRecyclerDesc": "औपचारिक ई-कचरा प्राप्त करें",
      "roleAdmin": "ईपीआर व्यवस्थापक (Admin)",
      "roleAdminDesc": "ट्रेसबिलिटी ट्रैक करें",

      "citizenTitle": "संग्रहकर्ता पोर्टल",
      "recyclerTitle": "अधिकृत रीसाइक्लर",
      "adminTitle": "व्यवस्थापक डैशबोर्ड",

      "priceSpeech": "का दाम है",
      "rupeesPerKg": "रुपये प्रति किलो",
      "noValue": "का कोई मोल नहीं है",
      "cat_crt": "पुराने टीवी (CRT)",
      "cat_lcd": "एलसीडी पैनल",
      "cat_pcb": "सर्किट बोर्ड",
      "cat_cables": "केबल",
      "cat_batteries": "बैटरी",
      "cat_motors": "मोटर",
      "cat_plastics": "प्लास्टिक",
      "cat_nonBiodegradable": "प्लास्टिक",
      "cat_specialized": "ई-कचरा सामग्री",

      "safetyWarningFull": "सुरक्षा चेतावनी: केबल न जलाएं या बैटरी न तोड़ें। अपने स्वास्थ्य की रक्षा के लिए इन्हें अधिकृत रीसाइक्लर्स को ही सौंपें।",
      "bookPickup": "ई-कचरा दर्ज करें",
      "selectScrap": "मूल्य का अनुमान लगाने के लिए सामग्री चुनें",
      "estWeight": "अनुमानित वजन (किलो)",
      "totalValue": "कुल मूल्य:",
      "nextStep": "अगला कदम",
      "selectScrapBtn": "सामग्री चुनें",

      "personalDetails": "लॉट विवरण",
      "fullName": "नाम",
      "mobileNumber": "फोन नंबर",
      "exactAddress": "पता",
      "getGps": "जीपीएस का उपयोग करें",
      "addPhoto": "फोटो अपलोड करें",
      "photoAttached": "फोटो संलग्न",
      "schedulePickup": "लॉट जमा करें",
      "fillDetailsBtn": "विवरण भरें",
      "successTitle": "लॉट जमा किया गया!",
      "successDesc": "रीसाइक्लर को सूचित कर दिया गया है।",

      "dutyStatus": "ड्यूटी स्थिति",
      "onlineMsg": "ऑनलाइन",
      "offlineMsg": "ऑफ़लाइन",
      "goOnlineMsg": "लॉट देखने के लिए ऑनलाइन जाएं।",
      "liveRequests": "आपके आस-पास लाइव लॉट",
      "noRequests": "कोई लंबित लॉट नहीं।",
      "decline": "अस्वीकार करें",
      "accept": "लॉट स्वीकार करें",
      "activeRoute": "सक्रिय संग्रह",
      "confirmCollection": "हैंडओवर की पुष्टि करें",

      "statFormalized": "औपचारिक ई-कचरा",
      "statCollectors": "पंजीकृत संग्रहकर्ता",
      "statPending": "लंबित ट्रैसेबिलिटी",
      "statValue": "वितरित मूल्य",
      "chartTitle": "साप्ताहिक ईपीआर श्रेणी ट्रैकिंग (किग्रा)",
      "logsTitle": "लाइव सत्यापन लॉग",
      "mapTitle": "लाइव रीसाइक्लर फ्लीट रूटिंग"
    }
  },
  bn: {
    translation: {
      "appTitle": "স্ক্র্যাপ-আপ",
      "logout": "লগআউট",
      "backHome": "ফিরে যান",

      "selectRole": "এগিয়ে যেতে আপনার ভূমিকা নির্বাচন করুন",
      "roleCollector": "সংগ্রাহক (Collector)",
      "roleCollectorDesc": "সংগৃহীত ই-বর্জ্য লগ এবং বিক্রি করুন",
      "roleRecycler": "অনুমোদিত রিসাইক্লার",
      "roleRecyclerDesc": "আনুষ্ঠানিক ই-বর্জ্য গ্রহণ করুন",
      "roleAdmin": "ইপিআর অ্যাডমিন",
      "roleAdminDesc": "ট্রেসেবিলিটি ট্র্যাক করুন",

      "citizenTitle": "সংগ্রাহক পোর্টাল",
      "recyclerTitle": "অনুমোদিত রিসাইক্লার",
      "adminTitle": "অ্যাডমিন ড্যাশবোর্ড",

      "priceSpeech": "এর দাম",
      "rupeesPerKg": "টাকা প্রতি কেজি",
      "noValue": "এর কোনো মূল্য নেই",
      "cat_crt": "পুরানো টিভি (CRT)",
      "cat_lcd": "এলসিডি প্যানেল",
      "cat_pcb": "সার্কিট বোর্ড",
      "cat_cables": "তার (Cables)",
      "cat_batteries": "ব্যাটারি",
      "cat_motors": "মোটর",
      "cat_plastics": "প্লাস্টিক",
      "cat_nonBiodegradable": "প্লাস্টিক",
      "cat_specialized": "ই-বর্জ্য সামগ্রী",

      "safetyWarningFull": "নিরাপত্তা সতর্কতা: তার পোড়াবেন না বা ব্যাটারি ভাঙবেন না। আপনার স্বাস্থ্য রক্ষায় এগুলি নিরাপদে অনুমোদিত রিসাইক্লারদের কাছে দিন।",
      "bookPickup": "ই-বর্জ্য লগ করুন",
      "selectScrap": "মূল্য অনুমান করতে সামগ্রী নির্বাচন করুন",
      "estWeight": "আনুমানিক ওজন (কেজি)",
      "totalValue": "মোট মূল্য:",
      "nextStep": "পরবর্তী ধাপ",
      "selectScrapBtn": "সামগ্রী নির্বাচন করুন",

      "personalDetails": "লটের বিবরণ",
      "fullName": "নাম",
      "mobileNumber": "ফোন নম্বর",
      "exactAddress": "ঠিকানা",
      "getGps": "GPS ব্যবহার করুন",
      "addPhoto": "ছবি আপলোড করুন",
      "photoAttached": "ছবি সংযুক্ত",
      "schedulePickup": "লট জমা দিন",
      "fillDetailsBtn": "বিবরণ পূরণ করুন",
      "successTitle": "লট জমা দেওয়া হয়েছে!",
      "successDesc": "রিসাইক্লারকে জানানো হয়েছে।",

      "dutyStatus": "ডিউটি স্ট্যাটাস",
      "onlineMsg": "অনলাইন",
      "offlineMsg": "অফলাইন",
      "goOnlineMsg": "লট দেখতে অনলাইনে যান।",
      "liveRequests": "আপনার কাছাকাছি লাইভ লট",
      "noRequests": "কোনো পেন্ডিং লট নেই।",
      "decline": "প্রত্যাখ্যান করুন",
      "accept": "লট গ্রহণ করুন",
      "activeRoute": "সক্রিয় সংগ্রহ",
      "confirmCollection": "হস্তান্তর নিশ্চিত করুন",

      "statFormalized": "আনুষ্ঠানিক ই-বর্জ্য",
      "statCollectors": "নিবন্ধিত সংগ্রাহক",
      "statPending": "পেন্ডিং ট্রেসেবিলিটি",
      "statValue": "বিতরণকৃত মূল্য",
      "chartTitle": "সাপ্তাহিক ইপিআর ক্যাটাগরি ট্র্যাকিং (কেজি)",
      "logsTitle": "লাইভ ভেরিফিকেশন লগ",
      "mapTitle": "লাইভ রিসাইক্লার ফ্লিট রুটিং"
    }
  },
  mr: {
    translation: {
      "appTitle": "स्क्रॅप-अप",
      "logout": "लॉगआउट",
      "backHome": "मागे जा",

      "selectRole": "पुढे जाण्यासाठी तुमची भूमिका निवडा",
      "roleCollector": "अनौपचारिक संकलक",
      "roleCollectorDesc": "ई-कचरा नोंदवा आणि विका",
      "roleRecycler": "अधिकृत रिसायकलर",
      "roleRecyclerDesc": "ई-कचरा लॉट्स प्राप्त करा",
      "roleAdmin": "प्रशासन (Admin)",
      "roleAdminDesc": "ट्रेसेबिलिटी ट्रॅक करा",

      "citizenTitle": "संकलक पोर्टल",
      "recyclerTitle": "अधिकृत रिसायकलर",
      "adminTitle": "प्रशासन डॅशबोर्ड",

      "priceSpeech": "ची किंमत आहे",
      "rupeesPerKg": "रुपये प्रति किलो",
      "noValue": "ला कोणतीही किंमत नाही",
      "cat_crt": "जुने टीव्ही (CRT)",
      "cat_lcd": "एलसीडी पॅनेल",
      "cat_pcb": "सर्किट बोर्ड",
      "cat_cables": "केबल्स",
      "cat_batteries": "बॅटरी",
      "cat_motors": "मोटर्स",
      "cat_plastics": "प्लास्टिक",
      "cat_nonBiodegradable": "प्लास्टिक",
      "cat_specialized": "ई-कचरा साहित्य",

      "safetyWarningFull": "सुरक्षा चेतावणी: केबल्स जाळू नका किंवा बॅटरी फोडू नका. तुमच्या आरोग्याचे रक्षण करण्यासाठी ते अधिकृत रिसायकलर्सकडे सुरक्षितपणे सोपवा.",
      "bookPickup": "ई-कचरा नोंदवा",
      "selectScrap": "किंमतीचा अंदाज घेण्यासाठी साहित्य निवडा",
      "estWeight": "अंदाजित वजन (किलो)",
      "totalValue": "एकूण मूल्य:",
      "nextStep": "पुढील पायरी",
      "selectScrapBtn": "साहित्य निवडा",

      "personalDetails": "लॉट तपशील",
      "fullName": "नाव",
      "mobileNumber": "फोन नंबर",
      "exactAddress": "पत्ता",
      "getGps": "GPS वापरा",
      "addPhoto": "फोटो अपलोड करा",
      "photoAttached": "फोटो जोडला",
      "schedulePickup": "लॉट सबमिट करा",
      "fillDetailsBtn": "तपशील भरा",
      "successTitle": "लॉट सबमिट केला!",
      "successDesc": "रिसायकलरला सूचित केले आहे.",

      "dutyStatus": "ड्युटी स्थिती",
      "onlineMsg": "ऑनलाइन",
      "offlineMsg": "ऑफलाइन",
      "goOnlineMsg": "लॉट्स पाहण्यासाठी ऑनलाइन जा.",
      "liveRequests": "तुमच्या जवळील लाईव्ह लॉट्स",
      "noRequests": "कोणतेही प्रलंबित लॉट्स नाहीत.",
      "decline": "नकार द्या",
      "accept": "लॉट स्वीकारा",
      "activeRoute": "सक्रिय संकलन",
      "confirmCollection": "हस्तांतरणाची पुष्टी करा",

      "statFormalized": "औपचारिक ई-कचरा",
      "statCollectors": "नोंदणीकृत संकलक",
      "statPending": "प्रलंबित ट्रेसेबिलिटी",
      "statValue": "वितरीत मूल्य",
      "chartTitle": "साप्ताहिक ईपीआर श्रेणी ट्रॅकिंग (किलो)",
      "logsTitle": "थेट पडताळणी नोंदी",
      "mapTitle": "थेट रिसायकलर फ्लीट राउटिंग"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;