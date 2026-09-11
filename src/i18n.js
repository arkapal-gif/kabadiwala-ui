import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "appTitle": "ScrapUp", "logout": "Logout", "backHome": "Back",
      "selectRole": "Select your role to continue",
      "roleCollector": "Informal Collector", "roleCollectorDesc": "Log and sell collected e-waste",
      "roleRecycler": "Authorized Recycler", "roleRecyclerDesc": "Receive formalized e-waste lots",
      "roleAdmin": "EPR Admin", "roleAdminDesc": "Track formalization and traceability",
      "loginTitle": "Account Login", "demoUserId": "Enter demo User ID", "demoPhone": "Enter demo Mobile No.", "demoPass": "Enter demo Password", "loginBtn": "Login Securely", "selectRecyclerProfile": "Select Recycler Profile",
      "citizenTitle": "Collector Portal", "recyclerTitle": "ScrapUp Recycler", "adminTitle": "ScrapUp Admin Dashboard",
      "priceSpeech": "Price is", "rupeesPerKg": "rupees per kg", "noValue": "has no value",
      "cat_crt": "CRTs", "cat_lcd": "LCD Panels", "cat_pcb": "Circuit Boards", "cat_cables": "Cables", "cat_batteries": "Batteries", "cat_motors": "Motors", "cat_plastics": "Mixed Plastics",
      "cat_nonBiodegradable": "Plastics", "cat_specialized": "E-Waste Items",
      "safetyWarningFull": "Safety Warning: Do not burn cables or break open batteries. Hand them safely to authorized recyclers to protect your health.",
      "bookPickup": "Log E-Waste", "selectScrap": "Select materials to estimate value", "estWeight": "Estimated Weight (kg)", "totalValue": "Total Value:", "nextStep": "Next Step", "selectScrapBtn": "Select Materials",
      "personalDetails": "Lot Details", "fullName": "Name", "mobileNumber": "Phone", "addPhoto": "Upload Photo", "btnCamera": "Camera", "btnGallery": "Gallery", "schedulePickup": "Submit Lot", "fillDetailsBtn": "Fill Details & Photo", 
      "tabNew": "New Lot", "tabPending": "Pending", "tabSells": "My Sells", "tabDirectory": "Recyclers", "tabRecyclerPending": "Pending",
      "waitingRecycler": "Waiting for a recycler to accept...", "deliverTo": "Accepted! Please deliver to:", "call": "Call",
      "tabLive": "Live Lots", "tabBuys": "My Buys", "tabPrices": "Price Board", "liveRequests": "Live Lots Near You", "noRequests": "No pending lots.", "decline": "Decline", "accept": "Accept Lot", "activeRoute": "Active Handover", "markBought": "Mark as Bought",
      "statFormalized": "Formalized E-Waste", "statCollectors": "Registered Collectors", "statPending": "Pending Traceability", "statValue": "Value Disbursed", "chartTitle": "Weekly EPR Category Tracking (kg)", "logsTitle": "Live Verification Logs", "mapTitle": "Live Recycler Fleet Routing",
      "paymentMethod": "Payment Method", "cash": "Cash", "upi": "UPI", "upiIdPlaceholder": "Enter UPI ID", "selectRecyclers": "Select Target Recyclers", "selectAll": "Select All", "findNearest": "Find Nearest (GPS)", "markDelivered": "Mark as Delivered", "paymentPref": "Payment Pref",
      "cancelRequest": "Cancel Request", "workingHours": "Working Hours"
    }
  },
  hi: {
    translation: {
      "appTitle": "स्क्रैप-अप", "logout": "लॉग आउट", "backHome": "वापस जाएं",
      "selectRole": "जारी रखने के लिए अपनी भूमिका चुनें",
      "roleCollector": "अनौपचारिक संग्रहकर्ता", "roleCollectorDesc": "ई-कचरा लॉग करें और बेचें",
      "roleRecycler": "अधिकृत रीसाइक्लर", "roleRecyclerDesc": "औपचारिक ई-कचरा प्राप्त करें",
      "roleAdmin": "ईपीआर व्यवस्थापक", "roleAdminDesc": "ट्रेसबिलिटी ट्रैक करें",
      "loginTitle": "खाता लॉगिन", "demoUserId": "डेमो यूजर आईडी दर्ज करें", "demoPhone": "डेमो मोबाइल नंबर दर्ज करें", "demoPass": "डेमो पासवर्ड दर्ज करें", "loginBtn": "लॉगिन करें", "selectRecyclerProfile": "रीसाइक्लर प्रोफ़ाइल चुनें",
      "citizenTitle": "संग्रहकर्ता पोर्टल", "recyclerTitle": "अधिकृत रीसाइक्लर", "adminTitle": "व्यवस्थापक डैशबोर्ड",
      "priceSpeech": "का दाम है", "rupeesPerKg": "रुपये प्रति किलो", "noValue": "का कोई मोल नहीं है",
      "cat_crt": "पुराने टीवी (CRT)", "cat_lcd": "एलसीडी पैनल", "cat_pcb": "सर्किट बोर्ड", "cat_cables": "केबल", "cat_batteries": "बैटरी", "cat_motors": "मोटर", "cat_plastics": "प्लास्टिक",
      "cat_nonBiodegradable": "प्लास्टिक", "cat_specialized": "ई-कचरा सामग्री",
      "safetyWarningFull": "सुरक्षा चेतावनी: केबल न जलाएं या बैटरी न तोड़ें। अपने स्वास्थ्य की रक्षा के लिए इन्हें अधिकृत रीसाइक्लर्स को ही सौंपें।",
      "bookPickup": "ई-कचरा दर्ज करें", "selectScrap": "मूल्य का अनुमान लगाने के लिए सामग्री चुनें", "estWeight": "अनुमानित वजन (किलो)", "totalValue": "कुल मूल्य:", "nextStep": "अगला कदम", "selectScrapBtn": "सामग्री चुनें",
      "personalDetails": "लॉट विवरण", "fullName": "नाम", "mobileNumber": "फोन नंबर", "addPhoto": "फोटो अपलोड करें", "btnCamera": "कैमरा", "btnGallery": "गैलरी", "schedulePickup": "लॉट जमा करें", "fillDetailsBtn": "विवरण और फोटो भरें", 
      "tabNew": "नया लॉट", "tabPending": "लंबित", "tabSells": "मेरी बिक्री", "tabDirectory": "रीसाइक्लर", "tabRecyclerPending": "लंबित",
      "waitingRecycler": "रीसाइक्लर के स्वीकार करने की प्रतीक्षा है...", "deliverTo": "स्वीकृत! कृपया यहां पहुंचाएं:", "call": "कॉल करें",
      "tabLive": "लाइव लॉट", "tabBuys": "मेरी खरीदारी", "tabPrices": "मूल्य बोर्ड", "liveRequests": "आपके आस-पास लाइव लॉट", "noRequests": "कोई लंबित लॉट नहीं।", "decline": "अस्वीकार करें", "accept": "लॉट स्वीकार करें", "activeRoute": "सक्रिय हैंडओवर", "markBought": "खरीदा हुआ चिह्नित करें",
      "statFormalized": "औपचारिक ई-कचरा", "statCollectors": "पंजीकृत संग्रहकर्ता", "statPending": "लंबित ट्रैसेबिलिटी", "statValue": "वितरित मूल्य", "chartTitle": "साप्ताहिक ईपीआर श्रेणी ट्रैकिंग", "logsTitle": "लाइव सत्यापन लॉग", "mapTitle": "लाइव रीसाइक्लर फ्लीट रूटिंग",
      "paymentMethod": "भुगतान विधि", "cash": "नकद", "upi": "यूपीआई", "upiIdPlaceholder": "यूपीआई आईडी दर्ज करें", "selectRecyclers": "रीसाइक्लर चुनें", "selectAll": "सभी चुनें", "findNearest": "निकटतम खोजें (GPS)", "markDelivered": "डिलीवर के रूप में चिह्नित करें", "paymentPref": "भुगतान:",
      "cancelRequest": "अनुरोध रद्द करें", "workingHours": "काम करने का समय"
    }
  },
  bn: {
    translation: {
      "appTitle": "স্ক্র্যাপ-আপ", "logout": "লগআউট", "backHome": "ফিরে যান",
      "selectRole": "এগিয়ে যেতে আপনার ভূমিকা নির্বাচন করুন",
      "roleCollector": "সংগ্রাহক", "roleCollectorDesc": "সংগৃহীত ই-বর্জ্য লগ এবং বিক্রি করুন",
      "roleRecycler": "অনুমোদিত রিসাইক্লার", "roleRecyclerDesc": "আনুষ্ঠানিক ই-বর্জ্য গ্রহণ করুন",
      "roleAdmin": "ইপিআর অ্যাডমিন", "roleAdminDesc": "ট্রেসেবিলিটি ট্র্যাক করুন",
      "loginTitle": "লগইন করুন", "demoUserId": "ডেমো ইউজার আইডি দিন", "demoPhone": "ডেমো মোবাইল নং দিন", "demoPass": "ডেমো পাসওয়ার্ড দিন", "loginBtn": "লগইন করুন", "selectRecyclerProfile": "রিসাইক্লার প্রোফাইল নির্বাচন করুন",
      "citizenTitle": "সংগ্রাহক পোর্টাল", "recyclerTitle": "অনুমোদিত রিসাইক্লার", "adminTitle": "অ্যাডমিন ড্যাশবোর্ড",
      "priceSpeech": "এর দাম", "rupeesPerKg": "টাকা প্রতি কেজি", "noValue": "এর কোনো মূল্য নেই",
      "cat_crt": "পুরানো টিভি (CRT)", "cat_lcd": "এলसीডি প্যানেল", "cat_pcb": "সার্কিট বোর্ড", "cat_cables": "তার", "cat_batteries": "ব্যাটারি", "cat_motors": "মোটর", "cat_plastics": "প্লাস্টিক",
      "cat_nonBiodegradable": "প্লাস্টিক", "cat_specialized": "ই-বর্জ্য সামগ্রী",
      "safetyWarningFull": "নিরাপত্তা সতর্কতা: তার পোড়াবেন না বা ব্যাটারি ভাঙবেন না। আপনার স্বাস্থ্য রক্ষায় এগুলি নিরাপদে অনুমোদিত রিসাইক্লারদের কাছে দিন।",
      "bookPickup": "ই-বর্জ্য লগ করুন", "selectScrap": "মূল্য অনুমান করতে সামগ্রী নির্বাচন করুন", "estWeight": "আনুমানিক ওজন (কেজি)", "totalValue": "মোট মূল্য:", "nextStep": "পরবর্তী ধাপ", "selectScrapBtn": "সামগ্রী নির্বাচন করুন",
      "personalDetails": "লটের বিবরণ", "fullName": "নাম", "mobileNumber": "ফোন নম্বর", "addPhoto": "ছবি আপলোড করুন", "btnCamera": "ক্যামেরা", "btnGallery": "গ্যালারি", "schedulePickup": "লট জমা দিন", "fillDetailsBtn": "বিবরণ এবং ছবি দিন", 
      "tabNew": "নতুন লট", "tabPending": "অপেক্ষমাণ", "tabSells": "আমার বিক্রি", "tabDirectory": "রিসাইক্লার", "tabRecyclerPending": "অপেক্ষমাণ",
      "waitingRecycler": "রিসাইক্লারের অনুমোদনের অপেক্ষায়...", "deliverTo": "গৃহীত! অনুগ্রহ করে এখানে ডেলিভারি দিন:", "call": "কল করুন",
      "tabLive": "লাইভ লট", "tabBuys": "আমার কেনাকাটা", "tabPrices": "মূল্য বোর্ড", "liveRequests": "আপনার কাছাকাছি লাইভ লট", "noRequests": "কোনো পেন্ডিং লট নেই।", "decline": "প্রত্যাখ্যান করুন", "accept": "লট গ্রহণ করুন", "activeRoute": "সক্রিয় হ্যান্ডওভার", "markBought": "কেনা হয়েছে হিসেবে মার্ক করুন",
      "statFormalized": "আনুষ্ঠানিক ই-বর্জ্য", "statCollectors": "নিবন্ধিত সংগ্রাহক", "statPending": "পেন্ডিং ট্রেসেবিলিটি", "statValue": "বিতরণকৃত মূল্য", "chartTitle": "সাপ্তাহিক ইপিআর ট্র্যাকিং", "logsTitle": "লাইভ ভেরিফিকেশন লগ", "mapTitle": "লাইভ রিসাইক্লার ফ্লিট রুটিং",
      "paymentMethod": "পেমেন্ট পদ্ধতি", "cash": "নগদ", "upi": "ইউপিআই", "upiIdPlaceholder": "ইউপিআই আইডি লিখুন", "selectRecyclers": "রিসাইক্লার নির্বাচন করুন", "selectAll": "সব নির্বাচন করুন", "findNearest": "নিকটতম খুঁজুন (GPS)", "markDelivered": "ডেলিভারি সম্পন্ন মার্ক করুন", "paymentPref": "পেমেন্ট:",
      "cancelRequest": "অনুরोध বাতিল করুন", "workingHours": "কাজের সময়"
    }
  },
  mr: {
    translation: {
      "appTitle": "स्क्रॅप-अप", "logout": "लॉगआउट", "backHome": "मागे जा",
      "selectRole": "पुढे जाण्यासाठी तुमची भूमिका निवडा",
      "roleCollector": "अनौपचारिक संकलक", "roleCollectorDesc": "ई-कचरा नोंदवा आणि विका",
      "roleRecycler": "अधिकृत रिसायकलर", "roleRecyclerDesc": "ई-कचरा लॉट्स प्राप्त करा",
      "roleAdmin": "प्रशासन", "roleAdminDesc": "ट्रेसेबिलिटी ट्रॅक करा",
      "loginTitle": "लॉगिन करा", "demoUserId": "डेमो यूजर आयडी प्रविष्ट करा", "demoPhone": "डेमो मोबाईल नंबर प्रविष्ट करा", "demoPass": "डेमो पासवर्ड प्रविष्ट करा", "loginBtn": "लॉगिन करा", "selectRecyclerProfile": "रिसायकलर प्रोफाइल निवडा",
      "citizenTitle": "संकलक पोर्टल", "recyclerTitle": "अधिकृत रिसायकलर", "adminTitle": "प्रशासन डॅशबोर्ड",
      "priceSpeech": "ची किंमत आहे", "rupeesPerKg": "रुपये प्रति किलो", "noValue": "ला कोणतीही किंमत नाही",
      "cat_crt": "जुने टीव्ही (CRT)", "cat_lcd": "एलसीडी पॅनेल", "cat_pcb": "सर्किट बोर्ड", "cat_cables": "केबल्स", "cat_batteries": "बॅटरी", "cat_motors": "मोटर्स", "cat_plastics": "प्लास्टिक",
      "cat_nonBiodegradable": "प्लास्टिक", "cat_specialized": "ई-कचरा साहित्य",
      "safetyWarningFull": "सुरक्षा चेतावणी: केबल्स जाळू नका किंवा बॅटरी फोडू नका. तुमच्या आरोग्याचे रक्षण करण्यासाठी ते अधिकृत रिसायकलर्सकडे सुरक्षितपणे सोपवा.",
      "bookPickup": "ई-कचरा नोंदवा", "selectScrap": "किंमतीचा अंदाज घेण्यासाठी साहित्य निवडा", "estWeight": "अंदाजित वजन (किलो)", "totalValue": "एकूण मूल्य:", "nextStep": "पुढील पायरी", "selectScrapBtn": "साहित्य निवडा",
      "personalDetails": "लॉट तपशील", "fullName": "नाव", "mobileNumber": "फोन नंबर", "addPhoto": "फोटो अपलोड करा", "btnCamera": "कॅमेरा", "btnGallery": "गॅलरी", "schedulePickup": "लॉट सबमिट करा", "fillDetailsBtn": "तपशील आणि फोटो भरा", 
      "tabNew": "नवीन लॉट", "tabPending": "प्रलंबित", "tabSells": "माझी विक्री", "tabDirectory": "रिसायकलर्स", "tabRecyclerPending": "प्रलंबित",
      "waitingRecycler": "रिसायकलरच्या मान्यतेची वाट पाहत आहे...", "deliverTo": "स्वीकारले! कृपया येथे वितरित करा:", "call": "कॉल करा",
      "tabLive": "थेट लॉट", "tabBuys": "माझी खरेदी", "tabPrices": "किंमत बोर्ड", "liveRequests": "तुमच्या जवळील लाईव्ह लॉट्स", "noRequests": "कोणतेही प्रलंबित लॉट्स नाहीत.", "decline": "नकार द्या", "accept": "लॉट स्वीकारा", "activeRoute": "सक्रिय हस्तांतरण", "markBought": "खरेदी केल्याचे चिन्हांकित करा",
      "statFormalized": "औपचारिक ई-कचरा", "statCollectors": "नोंदणीकृत संकलक", "statPending": "प्रलंबित ट्रेसेबिलिटी", "statValue": "वितरीत मूल्य", "chartTitle": "साप्ताहिक ईपीआर ट्रॅकिंग", "logsTitle": "थेट पडताळणी नोंदी", "mapTitle": "थेट रिसायकलर फ्लीट राउटिंग",
      "paymentMethod": "पेमेंट पद्धत", "cash": "रोख", "upi": "यूपीआय", "upiIdPlaceholder": "यूपीआय आयडी प्रविष्ट करा", "selectRecyclers": "रिसायकलर निवडा", "selectAll": "सर्व निवडा", "findNearest": "जवळचे शोधा (GPS)", "markDelivered": "वितरित म्हणून चिन्हांकित करा", "paymentPref": "पेमेंट:",
      "cancelRequest": "विनंती रद्द करा", "workingHours": "कामाचे तास"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({ resources, lng: "en", fallbackLng: "en", interpolation: { escapeValue: false } });

export default i18n;