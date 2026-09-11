import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Monitor, Tv, Cpu, Plug, Battery, Zap, Recycle, MapPin, Plus, Minus, User, 
  ShieldCheck, Truck, LogOut, CheckCircle2, Languages, Loader2, Volume2, VolumeX, 
  AlertTriangle, ArrowLeft, Navigation, Camera, ImagePlus, X, Phone, Lock, 
  ChevronRight, History, IndianRupee, Clock, Map, Target, Banknote, CreditCard, 
  XCircle, Building2, Factory, Trash2, Ban, Save, Edit3, Trophy, Medal, Award, Star, Share2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

// Global Fallback Database
const INITIAL_RECYCLERS = [
  { id: 'r1', name: "EcoRecycle Hub", phone: "+91 9831098310", address: "Sector V, Salt Lake, Kolkata", lat: 22.5726, lon: 88.4339, workingHours: "9:00 AM - 6:00 PM", authorized: true },
  { id: 'r2', name: "GreenTech E-Waste", phone: "+91 8765432109", address: "New Town, Action Area 1, Kolkata", lat: 22.5800, lon: 88.4800, workingHours: "10:00 AM - 7:00 PM", authorized: true },
  { id: 'r3', name: "Kolkata Scrap Solutions", phone: "+91 7654321098", address: "Ballygunge, Kolkata", lat: 22.5280, lon: 88.3650, workingHours: "8:00 AM - 5:00 PM", authorized: true },
  { id: 'r4', name: "TechScrap Kolkata", phone: "+91 9123456780", address: "Park Street, Kolkata", lat: 22.5529, lon: 88.3527, workingHours: "9:30 AM - 8:00 PM", authorized: true },
  { id: 'r5', name: "Bengal E-Waste Recyclers", phone: "+91 9988776655", address: "Kasba Industrial Estate, Kolkata", lat: 22.5135, lon: 88.3995, workingHours: "10:00 AM - 6:30 PM", authorized: true },
  { id: 'r6', name: "Hooghly River Recycling", phone: "+91 8877665544", address: "Howrah Industrial Area", lat: 22.5804, lon: 88.3299, workingHours: "8:30 AM - 4:30 PM", authorized: true },
  { id: 'r7', name: "Kolkata E-Bin Hub", phone: "+91 7766554433", address: "Dum Dum Cantonment, Kolkata", lat: 22.6300, lon: 88.4200, workingHours: "9:00 AM - 5:30 PM", authorized: true }
];

const DEFAULT_RATES = { crt: 10, lcd: 40, pcb: 150, cables: 80, batteries: 60, motors: 45, plastics: 15 };

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const toggle = () => {
    const langs = ['en', 'hi', 'bn', 'mr'];
    const nextLang = langs[(langs.indexOf(i18n.language) + 1) % langs.length];
    i18n.changeLanguage(nextLang);
  };
  return (
    <button onClick={toggle} className="flex items-center gap-2 bg-white/25 text-white px-3 py-1.5 rounded-md font-semibold text-sm hover:bg-white/35 transition-colors shadow-sm">
      <Languages className="w-4 h-4" />
      {(i18n?.language || 'EN').toUpperCase()}
    </button>
  );
};

// ==========================================
// 1. LOGIN SCREEN
// ==========================================
function LoginScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedRecyclerId, setSelectedRecyclerId] = useState('r1');
  const [adminType, setAdminType] = useState('regulator');

  const [activeRecyclers, setActiveRecyclers] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('scrapup_recyclers');
      const list = saved ? JSON.parse(saved) : INITIAL_RECYCLERS;
      setActiveRecyclers(Array.isArray(list) ? list.filter(r => r?.authorized !== false) : INITIAL_RECYCLERS);
    } catch (e) {
      setActiveRecyclers(INITIAL_RECYCLERS);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (selectedRole === 'kabadiwala') {
      localStorage.setItem('logged_in_recycler', selectedRecyclerId);
    }
    if (selectedRole === 'admin') {
      localStorage.setItem('logged_in_admin_type', adminType);
    }
    navigate(`/${selectedRole}`);
  };
  
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4 font-sans relative">
      <div className="absolute top-4 right-4 bg-green-600 rounded-md shadow-sm"><LanguageToggle /></div>
      
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
        {!selectedRole ? (
          <div className="p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-black text-green-700 mb-2">♻️ {t('appTitle', 'ScrapUp')}</h1>
              <p className="text-gray-500 font-medium text-sm">{t('selectRole', 'Select your role to continue')}</p>
            </div>
            <div className="space-y-4">
              <button onClick={() => setSelectedRole('citizen')} className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group">
                <div className="bg-green-100 p-3 rounded-lg text-green-600 group-hover:bg-green-200"><User className="w-6 h-6" /></div>
                <div className="ml-4 text-left flex-1"><h3 className="font-bold text-gray-800">{t('roleCollector', 'Informal Collector')}</h3><p className="text-xs text-gray-500">{t('roleCollectorDesc', 'Log and sell collected e-waste')}</p></div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-green-500" />
              </button>
              <button onClick={() => setSelectedRole('kabadiwala')} className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group">
                <div className="bg-orange-100 p-3 rounded-lg text-orange-600 group-hover:bg-orange-200"><Truck className="w-6 h-6" /></div>
                <div className="ml-4 text-left flex-1"><h3 className="font-bold text-gray-800">{t('roleRecycler', 'Authorized Recycler')}</h3><p className="text-xs text-gray-500">{t('roleRecyclerDesc', 'Receive formalized e-waste lots')}</p></div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-orange-500" />
              </button>
              <button onClick={() => setSelectedRole('admin')} className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600 group-hover:bg-blue-200"><ShieldCheck className="w-6 h-6" /></div>
                <div className="ml-4 text-left flex-1"><h3 className="font-bold text-gray-800">{t('roleAdmin', 'EPR Admin')}</h3><p className="text-xs text-gray-500">{t('roleAdminDesc', 'Track formalization and traceability')}</p></div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <button onClick={() => setSelectedRole(null)} className="flex items-center text-sm font-bold text-gray-500 hover:text-gray-800 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> {t('backHome', 'Back')}
            </button>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-700 mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{t('loginTitle', 'Account Login')}</h2>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              
              {selectedRole === 'kabadiwala' && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Active Facility</label>
                  <select 
                    value={selectedRecyclerId} 
                    onChange={(e) => setSelectedRecyclerId(e.target.value)} 
                    className="w-full p-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-orange-500 outline-none transition-all font-semibold text-sm cursor-pointer"
                  >
                    {activeRecyclers.map(r => (
                      <option key={r.id} value={r.id}>{r.name} - {(r.address || "").split(',')[0]}</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedRole === 'admin' && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Select Admin Authority Entity</label>
                  <select 
                    value={adminType} 
                    onChange={(e) => setAdminType(e.target.value)} 
                    className="w-full p-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition-all font-semibold text-sm cursor-pointer"
                  >
                    <option value="regulator">🏛️ Government Regulator (CPCB / WBPCB)</option>
                    <option value="producer">🏢 Electronics Manufacturer & Brand (Producer)</option>
                    <option value="pro">🤝 Producer Responsibility Organization (PRO)</option>
                  </select>
                </div>
              )}

              {selectedRole !== 'kabadiwala' && (
                <div>
                  <input 
                    type={selectedRole === 'admin' ? "text" : "tel"} 
                    required 
                    placeholder={selectedRole === 'admin' ? t('demoUserId', 'Enter demo User ID') : t('demoPhone', 'Enter demo Mobile No.')} 
                    className="w-full p-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-green-500 outline-none transition-all font-semibold text-sm" 
                  />
                </div>
              )}

              <div>
                <input 
                  type="password" 
                  required 
                  placeholder={t('demoPass', 'Enter demo Password')} 
                  className="w-full p-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-green-500 outline-none transition-all font-semibold text-sm" 
                />
              </div>
              <button type="submit" className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-colors shadow-md mt-4">
                {t('loginBtn', 'Login Securely')}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 2. COLLECTOR PORTAL (With Eco Warrior!)
// ==========================================
function CitizenPortal() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [activeTab, setActiveTab] = useState('new'); 
  const [step, setStep] = useState(1);
  const [weights, setWeights] = useState({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [name, setName] = useState("Arka Pal"); 
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState('cash'); 
  const [upiId, setUpiId] = useState("");
  const [selectedRecyclers, setSelectedRecyclers] = useState([]);
  const [photos, setPhotos] = useState([]); 
  const [selectedImage, setSelectedImage] = useState(null); 
  const [isLocating, setIsLocating] = useState(false);

  const [dynamicRates, setDynamicRates] = useState(DEFAULT_RATES);
  const [directory, setDirectory] = useState(INITIAL_RECYCLERS);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [mySells, setMySells] = useState([]);

  // Eco-Warrior State
  const [myPoints, setMyPoints] = useState(() => parseInt(localStorage.getItem('scrapup_points')) || 1250);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => window.speechSynthesis.getVoices();
      loadVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  useEffect(() => {
    const loadData = () => {
      try {
        const savedRates = localStorage.getItem('scrapup_rates');
        if (savedRates) setDynamicRates(JSON.parse(savedRates) || DEFAULT_RATES);

        const savedRecyclers = localStorage.getItem('scrapup_recyclers');
        const list = savedRecyclers ? JSON.parse(savedRecyclers) : INITIAL_RECYCLERS;
        setDirectory(Array.isArray(list) ? list.filter(r => r?.authorized !== false) : INITIAL_RECYCLERS);

        const pReqs = JSON.parse(localStorage.getItem('scrapup_requests') || '[]');
        setPendingRequests(Array.isArray(pReqs) ? pReqs : []);

        const sReqs = JSON.parse(localStorage.getItem('scrapup_history') || '[]');
        setMySells(Array.isArray(sReqs) ? sReqs : []);
      } catch (e) {
        console.error("Storage corrupted. Resetting memory.", e);
        setPendingRequests([]);
        setMySells([]);
        setDirectory(INITIAL_RECYCLERS);
      }
    };
    loadData();
    const interval = setInterval(loadData, 1500); 
    return () => clearInterval(interval); 
  }, []);

  const categories = [
    { id: 'crt', name: t('cat_crt', 'CRTs'), icon: Monitor, pricePerKg: dynamicRates?.crt || 10, group: 'specialized' },
    { id: 'lcd', name: t('cat_lcd', 'LCD Panels'), icon: Tv, pricePerKg: dynamicRates?.lcd || 40, group: 'specialized' },
    { id: 'pcb', name: t('cat_pcb', 'Circuit Boards'), icon: Cpu, pricePerKg: dynamicRates?.pcb || 150, group: 'specialized' },
    { id: 'cables', name: t('cat_cables', 'Cables'), icon: Plug, pricePerKg: dynamicRates?.cables || 80, group: 'specialized' },
    { id: 'batteries', name: t('cat_batteries', 'Batteries'), icon: Battery, pricePerKg: dynamicRates?.batteries || 60, group: 'specialized' },
    { id: 'motors', name: t('cat_motors', 'Motors'), icon: Zap, pricePerKg: dynamicRates?.motors || 45, group: 'specialized' },
    { id: 'plastics', name: t('cat_plastics', 'Mixed Plastics'), icon: Recycle, pricePerKg: dynamicRates?.plastics || 15, group: 'nonBiodegradable' },
  ];

  const speakAudio = (e, text) => {
    e.stopPropagation(); 
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeaking) { setIsSpeaking(false); return; }
    const cleanText = text.replace(/[.,/#!$%^&*;:{}=\-_`~()।]/g, " ");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langMap = { en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', mr: 'mr-IN' };
    utterance.lang = langMap[i18n.language] || 'en-IN';
    utterance.rate = 0.85; 
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang === utterance.lang) || voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0]));
    if (voice) utterance.voice = voice;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const toggleScrap = (id) => setWeights(prev => { const newW = { ...prev }; if (newW[id]) delete newW[id]; else newW[id] = 1; return newW; });
  const updateWeight = (id, delta) => setWeights(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 0) + delta) }));
  const totalEstimatedValue = Object.entries(weights).reduce((total, [id, weight]) => { const cat = categories.find(c => c.id === id); return total + (cat ? cat.pricePerKg * weight : 0); }, 0);
  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  const hasSelection = Object.keys(weights).length > 0;
  
  const isFormComplete = name.trim() !== "" && phone.trim() !== "" && photos.length > 0 && selectedRecyclers.length > 0 && (paymentMethod === 'cash' || upiId.trim() !== "");

  const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  const handleFindNearest = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        let nearestId = null;
        let minDistance = Infinity;
        directory.forEach(r => {
          const dist = getDistance(pos.coords.latitude, pos.coords.longitude, r.lat, r.lon);
          if (dist < minDistance) { minDistance = dist; nearestId = r.id; }
        });
        if (nearestId) setSelectedRecyclers([nearestId]);
        setIsLocating(false);
      },
      () => setIsLocating(false), { enableHighAccuracy: true }
    );
  };

  const handlePhotoUpload = (e) => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const scale = 400 / img.width;
          canvas.width = 400; canvas.height = img.height * scale;
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          setPhotos(prev => [...prev, canvas.toDataURL('image/jpeg', 0.5)]);
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (e, index) => { e.stopPropagation(); setPhotos(prev => prev.filter((_, i) => i !== index)); };

  const handleSchedulePickup = () => {
    const generatedId = Math.floor(Math.random() * 9000) + 1000;
    const scrapList = Object.keys(weights).map(id => `${categories.find(c => c.id === id)?.name} (${weights[id]}kg)`).join(', ');

    const newBooking = {
      id: generatedId, name, phone, 
      paymentMethod, upiId: paymentMethod === 'upi' ? upiId : null,
      targetRecyclers: selectedRecyclers,
      scrap: scrapList, estValue: `₹${totalEstimatedValue}`, 
      rawValue: totalEstimatedValue, rawWeight: totalWeight,
      status: "Pending", 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
      hasPhoto: photos.length > 0, photos 
    };

    try {
      const existing = JSON.parse(localStorage.getItem('scrapup_requests') || '[]');
      localStorage.setItem('scrapup_requests', JSON.stringify([newBooking, ...(Array.isArray(existing) ? existing : [])]));
    } catch (e) {
      localStorage.setItem('scrapup_requests', JSON.stringify([newBooking]));
    }
    
    // Eco-Warrior Points Update
    const earnedPts = Math.floor((totalWeight * 1.5) * 10);
    const newTotal = myPoints + earnedPts;
    setMyPoints(newTotal);
    localStorage.setItem('scrapup_points', newTotal.toString());

    setWeights({}); setPhotos([]); setStep(1); setSelectedRecyclers([]); setPaymentMethod('cash'); setUpiId("");
    setActiveTab('pending');
  };

  const handleCancelRequest = (id) => {
    try {
      const existing = JSON.parse(localStorage.getItem('scrapup_requests') || '[]');
      const filtered = Array.isArray(existing) ? existing.filter(req => req.id !== id) : [];
      localStorage.setItem('scrapup_requests', JSON.stringify(filtered));
      setPendingRequests(filtered);
    } catch(e) {}
  };

  const handleMarkDelivered = (req) => {
    try {
      const requests = JSON.parse(localStorage.getItem('scrapup_requests') || '[]');
      const history = JSON.parse(localStorage.getItem('scrapup_history') || '[]');
      
      const completedLot = { ...req, status: 'Verified', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
      localStorage.setItem('scrapup_history', JSON.stringify([completedLot, ...(Array.isArray(history) ? history : [])]));
      localStorage.setItem('scrapup_requests', JSON.stringify(Array.isArray(requests) ? requests.filter(r => r.id !== req.id) : []));
      
      setActiveTab('sells');
    } catch (e) {}
  };

  // Eco-Warrior Logic
  const lifetimeCO2 = (myPoints / 10).toFixed(1);
  const getTier = () => {
    if (myPoints >= 5000) return { name: "Platinum", color: "bg-slate-800", text: "text-slate-200" };
    if (myPoints >= 3000) return { name: "Gold", color: "bg-yellow-500", text: "text-yellow-100" };
    if (myPoints >= 1000) return { name: "Silver", color: "bg-gray-400", text: "text-gray-100" };
    return { name: "Bronze", color: "bg-amber-700", text: "text-amber-100" };
  };
  const tier = getTier();
  const nextTierPts = myPoints >= 5000 ? 5000 : myPoints >= 3000 ? 5000 : myPoints >= 1000 ? 3000 : 1000;
  const progressPercent = Math.min(100, (myPoints / nextTierPts) * 100);

  const mockLeaderboard = [
    { name: "Priyadarshini Mazumder", pts: 8450 },
    { name: "Tathagata Das", pts: 6200 },
    { name: name || "Arka Pal", pts: myPoints },
    { name: "Anup Kumar Majhi", pts: 3400 },
    { name: "Aniket Ghosh", pts: 1700 },
    { name: "Niloy Banik", pts: 850 }
  ].sort((a, b) => b.pts - a.pts);

  const renderCategoryGroup = (groupKey, groupTitleKey, fallbackTitle) => {
    const groupItems = categories.filter(c => c.group === groupKey);
    if (groupItems.length === 0) return null;
    return (
      <div key={groupKey} className="mb-6">
        <h3 className="text-left font-bold text-gray-700 text-sm mb-3 border-b border-gray-100 pb-2">{t(groupTitleKey, fallbackTitle)}</h3>
        <div className="grid grid-cols-2 gap-4">
          {groupItems.map((cat) => {
            const Icon = cat.icon;
            const isSelected = !!weights[cat.id];
            const audioString = cat.pricePerKg > 0 ? `${cat.name} ${t('priceSpeech')} ${cat.pricePerKg} ${t('rupeesPerKg')}` : `${cat.name} ${t('noValue')}`;
            return (
              <button key={cat.id} onClick={() => toggleScrap(cat.id)} className={`relative p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${isSelected ? 'border-green-500 bg-green-50 text-green-700 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-green-200'}`}>
                <div onClick={(e) => speakAudio(e, audioString)} className="absolute top-2 right-2 p-1.5 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-600 text-gray-400 transition-colors z-10 shadow-sm"><Volume2 className="w-3.5 h-3.5" /></div>
                <Icon className="w-8 h-8 mb-2" />
                <span className="font-semibold text-sm text-center">{cat.name}</span>
                <span className="text-xs mt-1 opacity-70">{cat.pricePerKg > 0 ? `₹${cat.pricePerKg}/kg` : 'No Value'}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-10">
      <nav className="bg-green-600 p-4 shadow-md flex justify-between items-center text-white">
        <h1 className="text-xl font-bold flex items-center gap-2">♻️ {t('citizenTitle', 'Collector Portal')}</h1>
        <div className="flex gap-2">
          <LanguageToggle />
          <button onClick={() => navigate('/')} className="flex items-center gap-1 bg-green-700 px-3 py-1.5 rounded-md hover:bg-green-800 text-sm font-semibold"><LogOut className="w-4 h-4" /> {t('logout', 'Logout')}</button>
        </div>
      </nav>

      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm overflow-x-auto">
        <div className="max-w-md mx-auto flex w-[600px] sm:w-full">
          <button onClick={() => setActiveTab('new')} className={`flex-1 py-4 text-xs font-bold text-center border-b-2 transition-colors ${activeTab === 'new' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <Plus className="w-4 h-4 mx-auto mb-1" /> {t('tabNew', 'New Lot')}
          </button>
          <button onClick={() => setActiveTab('pending')} className={`flex-1 py-4 text-xs font-bold text-center border-b-2 transition-colors ${activeTab === 'pending' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <Clock className="w-4 h-4 mx-auto mb-1" /> {t('tabPending', 'Pending')}
          </button>
          <button onClick={() => setActiveTab('sells')} className={`flex-1 py-4 text-xs font-bold text-center border-b-2 transition-colors ${activeTab === 'sells' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <History className="w-4 h-4 mx-auto mb-1" /> {t('tabSells', 'My Sells')}
          </button>
          <button onClick={() => setActiveTab('directory')} className={`flex-1 py-4 text-xs font-bold text-center border-b-2 transition-colors ${activeTab === 'directory' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <Map className="w-4 h-4 mx-auto mb-1" /> {t('tabDirectory', 'Recyclers')}
          </button>
          <button onClick={() => setActiveTab('eco')} className={`flex-1 py-4 text-xs font-bold text-center border-b-2 transition-colors ${activeTab === 'eco' ? 'border-yellow-500 text-yellow-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <Trophy className="w-4 h-4 mx-auto mb-1" /> {t('tabEcoWarrior', 'Rewards')}
          </button>
        </div>
      </div>
      
      <main className="max-w-md mx-auto mt-4 p-4">
        
        {/* NEW TAB: ECO-WARRIOR REWARDS */}
        {activeTab === 'eco' && (
          <div className="space-y-4">
            <div className={`p-6 rounded-xl shadow-lg border-2 border-white/20 ${tier.color} ${tier.text} relative overflow-hidden`}>
              <div className="absolute -right-4 -top-4 opacity-20"><Medal className="w-32 h-32" /></div>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-1 opacity-80">{t('ecoTitle', 'Eco-Warrior Dashboard')}</h2>
              <div className="flex items-end gap-3 mb-4">
                <h3 className="text-5xl font-black">{myPoints.toLocaleString()}</h3>
                <span className="text-lg font-semibold pb-1">pts</span>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-xs font-bold mb-1 opacity-90">
                  <span>{tier.name} Tier</span>
                  <span>{myPoints >= 5000 ? 'Max Level' : `${nextTierPts} pts`}</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-2.5">
                  <div className="bg-white h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/20 flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold uppercase opacity-80">{t('lifetimeImpact', 'Lifetime Impact')}</p>
                  <p className="text-xl font-bold flex items-center gap-1"><Recycle className="w-4 h-4"/> {lifetimeCO2} kg <span className="text-sm font-normal">{t('co2Prevented', 'CO₂ Prevented')}</span></p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center">
              <Award className={`w-12 h-12 mx-auto mb-2 ${myPoints >= 3000 ? 'text-green-600' : 'text-gray-300'}`} />
              <h3 className="font-bold text-gray-800">{t('unlockCertificate', 'Official EPR Certificate')}</h3>
              
              {myPoints >= 3000 ? (
                <>
                  <p className="text-xs text-gray-500 mt-1 mb-4">You have achieved verified sustainability status!</p>
                  <button onClick={() => setShowCertificate(true)} className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md transition-all flex items-center justify-center gap-2">
                    <Star className="w-4 h-4" /> {t('viewCert', 'View Certificate')}
                  </button>
                </>
              ) : (
                <div className="mt-3 py-2 bg-gray-100 rounded-lg text-gray-500 font-semibold text-sm border border-gray-200 flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> {t('certLocked', 'Unlock at 3000 pts')}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-yellow-50 p-4 border-b border-yellow-100 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <h3 className="font-bold text-yellow-800">{t('leaderboard', 'City Leaderboard')}</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {mockLeaderboard.map((user, idx) => {
                  const isMe = user.name === (name || "Arka Pal");
                  return (
                    <div key={idx} className={`p-4 flex items-center justify-between ${isMe ? 'bg-green-50/50' : ''}`}>
                      <div className="flex items-center gap-3">
                        <span className={`w-6 text-center font-black ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-700' : 'text-gray-300'}`}>
                          #{idx + 1}
                        </span>
                        <span className={`font-semibold ${isMe ? 'text-green-700' : 'text-gray-700'}`}>{user.name} {isMe && '(You)'}</span>
                      </div>
                      <span className="font-black text-gray-800">{user.pts.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB: NEW LOT */}
        {activeTab === 'new' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 relative overflow-hidden p-4">
            {step === 1 && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">{t('bookPickup', 'Log E-Waste')}</h2>
                <p className="text-gray-500 text-sm mt-1 mb-4 font-semibold text-green-700">{t('selectScrap', 'Select materials to estimate value')}</p>
                
                <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between text-left shadow-sm">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-800 font-medium leading-snug">{t('safetyWarningFull', 'Safety Warning: Do not burn cables or break open batteries. Hand them safely to authorized recyclers to protect your health.')}</p>
                  </div>
                  <button onClick={(e) => speakAudio(e, t('safetyWarningFull'))} className="p-2 bg-yellow-200 text-yellow-700 rounded-full hover:bg-yellow-300 shadow-sm shrink-0 ml-3 transition-colors">
                    {isSpeaking ? <VolumeX className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>

                {renderCategoryGroup('nonBiodegradable', 'cat_nonBiodegradable', 'Plastics')}
                {renderCategoryGroup('specialized', 'cat_specialized', 'E-Waste Items')}

                {hasSelection && (
                  <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                    <h3 className="font-bold text-green-800 mb-3 text-left text-sm">{t('estWeight', 'Estimated Weight (kg)')}</h3>
                    <div className="space-y-3 mb-4">
                      {Object.entries(weights).map(([id, weight]) => {
                        const cat = categories.find(c => c.id === id);
                        return (
                          <div key={id} className="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm border border-green-100">
                            <span className="text-sm font-semibold text-gray-700 flex-1">{cat?.name || "Item"}</span>
                            <div className="flex items-center gap-3">
                              <button onClick={() => updateWeight(id, -1)} className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 text-gray-600"><Minus className="w-4 h-4" /></button>
                              <span className="w-6 text-center font-bold text-sm text-gray-800">{weight}</span>
                              <button onClick={() => updateWeight(id, 1)} className="p-1.5 bg-green-100 rounded-md hover:bg-green-200 text-green-700"><Plus className="w-4 h-4" /></button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="pt-3 border-t border-green-200 flex justify-between items-center">
                      <span className="font-bold text-gray-600 text-sm">{t('totalValue', 'Total Value:')}</span>
                      <span className="text-2xl font-black text-green-700">₹{totalEstimatedValue}</span>
                    </div>
                  </div>
                )}
                <button onClick={() => { window.speechSynthesis.cancel(); setStep(2); }} disabled={!hasSelection} className={`w-full p-4 rounded-lg font-bold text-white transition-all ${hasSelection ? 'bg-green-600 hover:bg-green-700 shadow-md' : 'bg-gray-400 cursor-not-allowed'}`}>
                  {hasSelection ? t('nextStep', 'Next Step') : t('selectScrapBtn', 'Select Materials')}
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="flex items-center mb-6">
                  <button onClick={() => setStep(1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 mr-3"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
                  <h2 className="text-xl font-bold text-gray-800">{t('personalDetails', 'Lot Details')}</h2>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('fullName', 'Name')}</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">{t('mobileNumber', 'Phone')}</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50" placeholder="+91" />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">{t('paymentMethod', 'Payment Method')}</label>
                    <div className="flex gap-4 mb-3">
                      <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${paymentMethod === 'cash' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 bg-white text-gray-600'}`}>
                        <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="hidden" />
                        <Banknote className="w-5 h-5" /> <span className="font-bold">{t('cash', 'Cash')}</span>
                      </label>
                      <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${paymentMethod === 'upi' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-300 bg-white text-gray-600'}`}>
                        <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="hidden" />
                        <CreditCard className="w-5 h-5" /> <span className="font-bold">{t('upi', 'UPI')}</span>
                      </label>
                    </div>
                    {paymentMethod === 'upi' && (
                      <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder={t('upiIdPlaceholder', 'Enter UPI ID (e.g., name@okhdfc)')} className="w-full p-3 border border-gray-300 rounded-lg bg-white outline-none focus:border-green-500" />
                    )}
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-end mb-3">
                      <label className="block text-sm font-semibold text-gray-700">{t('selectRecyclers', 'Select Target Recyclers')}</label>
                      <div className="flex gap-2">
                        <button onClick={() => setSelectedRecyclers(directory.map(r => r.id))} className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded hover:bg-green-200">{t('selectAll', 'Select All')}</button>
                        <button onClick={handleFindNearest} className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded flex items-center gap-1 hover:bg-blue-200">
                          {isLocating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Target className="w-3 h-3" />} {t('findNearest', 'Find Nearest')}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {directory.map(r => (
                        <label key={r.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
                          <input type="checkbox" checked={selectedRecyclers.includes(r.id)} onChange={(e) => {
                            if (e.target.checked) setSelectedRecyclers([...selectedRecyclers, r.id]);
                            else setSelectedRecyclers(selectedRecyclers.filter(id => id !== r.id));
                          }} className="w-4 h-4 text-green-600 rounded focus:ring-green-500" />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-sm">{r.name}</h4>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3"/> {(r.address || "").split(',')[0]}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="block text-sm font-semibold text-gray-700">{t('addPhoto', 'Upload Photos')}</label>
                      <span className="text-xs text-gray-400 font-medium">{photos.length} uploaded</span>
                    </div>

                    {photos.length > 0 && (
                      <div className="flex gap-3 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                        {photos.map((src, i) => (
                          <div key={i} className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 border-green-200 shadow-sm group">
                            <img src={src} alt="Scrap" className="w-full h-full object-cover cursor-pointer" onClick={() => setSelectedImage(src)} />
                            <button onClick={(e) => removePhoto(e, i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"><X className="w-3 h-3" /></button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <label className="flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600 cursor-pointer hover:bg-green-50 hover:border-green-400 hover:text-green-600 transition-all">
                        <Camera className="w-6 h-6" />
                        <span className="text-xs font-bold">{t('btnCamera', 'Camera')}</span>
                        <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
                      </label>
                      <label className="flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600 cursor-pointer hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-all">
                        <ImagePlus className="w-6 h-6" />
                        <span className="text-xs font-bold">{t('btnGallery', 'Gallery')}</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                      </label>
                    </div>
                  </div>
                </div>
                <button onClick={handleSchedulePickup} disabled={!isFormComplete} className={`w-full p-4 rounded-lg font-bold text-white transition-all ${isFormComplete ? 'bg-green-600 hover:bg-green-700 shadow-md' : 'bg-gray-400 cursor-not-allowed'}`}>
                  {isFormComplete ? t('schedulePickup', 'Submit Lot') : t('fillDetailsBtn', 'Fill Details & Photo')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB: PENDING LOTS */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
             {pendingRequests.length === 0 ? (
               <div className="text-center py-12 px-6 bg-white rounded-xl border border-dashed border-gray-300">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No pending requests.</p>
               </div>
             ) : (
               pendingRequests.map((req, i) => (
                 <div key={i} className={`bg-white p-4 rounded-xl shadow-sm border-2 ${req.status === 'Accepted' ? 'border-green-400' : 'border-yellow-300'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-gray-800">Lot #{req.id}</h4>
                        <p className="text-xs text-gray-500 mt-1">{req.scrap}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-gray-800 block">{req.estValue}</span>
                        <span className="text-xs font-bold text-gray-400 uppercase">{req.paymentMethod}</span>
                      </div>
                    </div>

                    {req.status === 'Pending' ? (
                      <div>
                        <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg border border-yellow-200 flex items-center gap-2 mb-3">
                          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                          <span className="text-sm font-semibold">{t('waitingRecycler', 'Waiting for a recycler to accept...')}</span>
                        </div>
                        <button onClick={() => handleCancelRequest(req.id)} className="w-full py-2.5 bg-red-50 text-red-600 rounded-lg font-bold border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                          <XCircle className="w-4 h-4" /> {t('cancelRequest', 'Cancel Request')}
                        </button>
                      </div>
                    ) : (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                          <span className="text-sm font-bold text-green-800">{t('deliverTo', 'Accepted! Please deliver to:')}</span>
                        </div>
                        
                        {req.acceptedBy && (
                          <div className="bg-white p-3 rounded border border-green-100 mb-3 shadow-sm">
                            <h4 className="font-bold text-gray-800 text-lg">{req.acceptedBy.name}</h4>
                            <p className="text-sm text-gray-600 mt-1 flex items-start gap-1"><MapPin className="w-4 h-4 mt-0.5 shrink-0"/> {req.acceptedBy.address}</p>
                            <p className="text-sm text-gray-600 mt-1 flex items-start gap-1"><Clock className="w-4 h-4 mt-0.5 shrink-0"/> <span className="font-semibold">{t('workingHours', 'Working Hours')}:</span> {req.acceptedBy.workingHours}</p>
                            <a href={`tel:${req.acceptedBy.phone}`} className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-green-100 text-green-700 font-bold rounded-md hover:bg-green-200 transition-colors">
                              <Phone className="w-4 h-4" /> {t('call', 'Call')} {req.acceptedBy.phone}
                            </a>
                          </div>
                        )}
                        
                        {req.acceptedBy && req.acceptedBy.lat && req.acceptedBy.lon && (
                          <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border border-green-200 mb-4">
                            <iframe width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src={`https://www.openstreetmap.org/export/embed.html?bbox=${req.acceptedBy.lon-0.02}%2C${req.acceptedBy.lat-0.02}%2C${req.acceptedBy.lon+0.02}%2C${req.acceptedBy.lat+0.02}&layer=mapnik&marker=${req.acceptedBy.lat}%2C${req.acceptedBy.lon}`}></iframe>
                          </div>
                        )}

                        <button onClick={() => handleMarkDelivered(req)} className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-5 h-5" /> {t('markDelivered', 'Mark as Delivered')}
                        </button>
                      </div>
                    )}
                 </div>
               ))
             )}
          </div>
        )}

        {/* TAB: MY SELLS */}
        {activeTab === 'sells' && (
          <div className="space-y-4">
             {mySells.length === 0 ? (
               <div className="text-center py-12 px-6 bg-white rounded-xl border border-dashed border-gray-300">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No sales history yet.</p>
               </div>
             ) : (
               mySells.map((sell, i) => (
                 <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-md flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Completed</span>
                      <span className="text-xs font-semibold text-gray-400">{sell.time}</span>
                    </div>
                    <h4 className="font-bold text-gray-800">Lot #{sell.id}</h4>
                    <p className="text-xs text-gray-500 mt-1 truncate">{sell.scrap}</p>
                    <div className="mt-3 pt-3 border-t border-gray-100 text-right">
                      <span className="text-lg font-black text-green-700 block">{sell.estValue}</span>
                      <span className="text-xs font-bold text-gray-400 uppercase">{sell.paymentMethod}</span>
                    </div>
                 </div>
               ))
             )}
          </div>
        )}

        {/* TAB: RECYCLER DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 text-lg mb-2">Authorized Recyclers in Kolkata</h3>
            {directory.map((recycler, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <h4 className="font-black text-gray-800 text-lg">{recycler.name}</h4>
                <p className="text-sm text-gray-500 mt-1 flex items-start gap-1"><MapPin className="w-4 h-4 mt-0.5 shrink-0"/> {recycler.address}</p>
                <p className="text-sm text-gray-500 mt-1 flex items-start gap-1"><Clock className="w-4 h-4 mt-0.5 shrink-0"/> <span className="font-semibold">{t('workingHours', 'Working Hours')}:</span> {recycler.workingHours}</p>
                <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mt-3 mb-3">
                  <iframe width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src={`https://www.openstreetmap.org/export/embed.html?bbox=${recycler.lon-0.02}%2C${recycler.lat-0.02}%2C${recycler.lon+0.02}%2C${recycler.lat+0.02}&layer=mapnik&marker=${recycler.lat}%2C${recycler.lon}`}></iframe>
                </div>
                <a href={`tel:${recycler.phone}`} className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors">
                  <Phone className="w-4 h-4" /> {t('call', 'Call')} {recycler.phone}
                </a>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* FULL SCREEN OFFICIAL CERTIFICATE MODAL */}
      {showCertificate && (
        <div className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-none border-8 border-double border-yellow-600 p-8 text-center relative bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
            <button onClick={() => setShowCertificate(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><X className="w-6 h-6"/></button>
            
            <div className="w-20 h-20 mx-auto bg-green-50 border-2 border-green-700 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <ShieldCheck className="w-10 h-10 text-green-700" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-800 tracking-widest uppercase mb-1">Central Pollution Control Board</h2>
            <p className="text-sm font-semibold text-green-700 mb-6 uppercase tracking-wider">EPR Compliance & Sustainability Award</p>
            
            <p className="text-gray-500 italic mb-2">This certificate is proudly presented to</p>
            <h1 className="text-4xl font-black text-gray-900 font-serif mb-6 border-b border-gray-300 pb-2 inline-block px-8">{name || "Arka Pal"}</h1>
            
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto mb-8">
              In recognition of your exceptional dedication to environmental sustainability. By formalizing e-waste collection, you have officially prevented <b>{lifetimeCO2} kg of CO₂ emissions</b> and contributed to a greener India.
            </p>

            <div className="flex justify-between items-end px-4 mt-8">
              <div className="text-left border-t border-gray-400 pt-2 w-24">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</p>
                <p className="text-xs font-semibold text-gray-800">{new Date().toLocaleDateString()}</p>
              </div>
              <Award className="w-16 h-16 text-yellow-500 opacity-80" />
              <div className="text-right border-t border-gray-400 pt-2 w-24">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Auth ID</p>
                <p className="text-xs font-mono font-semibold text-gray-800">EPR-{Math.floor(Math.random()*9000)+1000}</p>
              </div>
            </div>

            <button className="mt-8 mx-auto flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors">
              <Share2 className="w-4 h-4" /> Share Achievement
            </button>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && !showCertificate && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-4 right-4 text-white hover:text-gray-300"><X className="w-8 h-8" /></button>
          <img src={selectedImage} alt="Expanded" className="max-w-full max-h-[90vh] object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. RECYCLER PORTAL
// ==========================================
function KabadiwalaPortal() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [activeTab, setActiveTab] = useState('live'); 
  const [feedRequests, setFeedRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]); 
  const [myBuys, setMyBuys] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); 
  const [myIdentity, setMyIdentity] = useState(null);
  const [dynamicRates, setDynamicRates] = useState(DEFAULT_RATES);

  useEffect(() => {
    try {
      const loggedInId = localStorage.getItem('logged_in_recycler') || 'r1';
      const savedRecyclers = localStorage.getItem('scrapup_recyclers');
      const directory = savedRecyclers ? JSON.parse(savedRecyclers) : INITIAL_RECYCLERS;
      const profile = directory.find(r => r.id === loggedInId) || INITIAL_RECYCLERS[0];
      setMyIdentity(profile);
    } catch (e) {
      setMyIdentity(INITIAL_RECYCLERS[0]);
    }
  }, []);

  const categories = [
    { id: 'crt', name: t('cat_crt', 'CRTs'), icon: Monitor, pricePerKg: dynamicRates?.crt || 10 },
    { id: 'lcd', name: t('cat_lcd', 'LCD Panels'), icon: Tv, pricePerKg: dynamicRates?.lcd || 40 },
    { id: 'pcb', name: t('cat_pcb', 'Circuit Boards'), icon: Cpu, pricePerKg: dynamicRates?.pcb || 150 },
    { id: 'cables', name: t('cat_cables', 'Cables'), icon: Plug, pricePerKg: dynamicRates?.cables || 80 },
    { id: 'batteries', name: t('cat_batteries', 'Batteries'), icon: Battery, pricePerKg: dynamicRates?.batteries || 60 },
    { id: 'motors', name: t('cat_motors', 'Motors'), icon: Zap, pricePerKg: dynamicRates?.motors || 45 },
    { id: 'plastics', name: t('cat_plastics', 'Mixed Plastics'), icon: Recycle, pricePerKg: dynamicRates?.plastics || 15 },
  ];

  useEffect(() => {
    if (!myIdentity) return;
    const loadData = () => {
      try {
        const savedRates = localStorage.getItem('scrapup_rates');
        if (savedRates) setDynamicRates(JSON.parse(savedRates) || DEFAULT_RATES);

        const allRequests = JSON.parse(localStorage.getItem('scrapup_requests') || '[]');
        if (Array.isArray(allRequests)) {
          const targetedLots = allRequests.filter(req => req.status === 'Pending' && req.targetRecyclers?.includes(myIdentity.id));
          const acceptedLots = allRequests.filter(req => req.status === 'Accepted' && req.acceptedBy?.id === myIdentity.id);
          setFeedRequests(targetedLots);
          setAcceptedRequests(acceptedLots);
        } else {
          setFeedRequests([]); setAcceptedRequests([]);
        }
        
        const historyData = JSON.parse(localStorage.getItem('scrapup_history') || '[]');
        if (Array.isArray(historyData)) {
          setMyBuys(historyData.filter(buy => buy.acceptedBy?.id === myIdentity.id));
        } else {
          setMyBuys([]);
        }
      } catch (e) {
        setFeedRequests([]); setAcceptedRequests([]); setMyBuys([]);
      }
    };
    loadData();
    const interval = setInterval(loadData, 1500); 
    return () => clearInterval(interval); 
  }, [myIdentity]);

  const handleDecline = (id) => {
    try {
      const existing = JSON.parse(localStorage.getItem('scrapup_requests') || '[]');
      if (Array.isArray(existing)) {
        localStorage.setItem('scrapup_requests', JSON.stringify(existing.filter(req => req.id !== id)));
        setFeedRequests(prev => prev.filter(req => req.id !== id));
      }
    } catch(e) {}
  };

  const handleAcceptLot = (req) => {
    try {
      const allRequests = JSON.parse(localStorage.getItem('scrapup_requests') || '[]');
      if (Array.isArray(allRequests)) {
        const updatedRequests = allRequests.map(r => {
          if (r.id === req.id) return { ...r, status: 'Accepted', acceptedBy: myIdentity };
          return r;
        });
        localStorage.setItem('scrapup_requests', JSON.stringify(updatedRequests));
        setActiveTab('pending');
      }
    } catch(e) {}
  };

  const handleConfirmHandover = (req) => {
    try {
      const history = JSON.parse(localStorage.getItem('scrapup_history') || '[]');
      const completedLot = { ...req, status: 'Verified', acceptedBy: myIdentity, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
      localStorage.setItem('scrapup_history', JSON.stringify([completedLot, ...(Array.isArray(history) ? history : [])]));

      const requests = JSON.parse(localStorage.getItem('scrapup_requests') || '[]');
      if (Array.isArray(requests)) {
        localStorage.setItem('scrapup_requests', JSON.stringify(requests.filter(r => r.id !== req.id)));
      }
    } catch(e) {}
  };

  if (!myIdentity) return null; 

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-10">
      <nav className="bg-orange-600 p-4 shadow-md flex justify-between items-center text-white">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">🏭 {t('recyclerTitle', 'ScrapUp Recycler')}</h1>
          <p className="text-xs font-semibold text-orange-200 mt-1">{myIdentity.name} - Logged In</p>
        </div>
        <div className="flex gap-2">
          <LanguageToggle />
          <button onClick={() => navigate('/')} className="flex items-center gap-1 bg-orange-700 px-3 py-1.5 rounded-md hover:bg-orange-800 text-sm font-semibold"><LogOut className="w-4 h-4" /> {t('logout', 'Logout')}</button>
        </div>
      </nav>

      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm overflow-x-auto">
        <div className="max-w-md mx-auto flex w-[500px] sm:w-full">
          <button onClick={() => setActiveTab('live')} className={`flex-1 py-4 text-xs font-bold text-center border-b-2 transition-colors ${activeTab === 'live' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <Navigation className="w-4 h-4 mx-auto mb-1" /> {t('tabLive', 'Live Lots')}
          </button>
          <button onClick={() => setActiveTab('pending')} className={`flex-1 py-4 text-xs font-bold text-center border-b-2 transition-colors ${activeTab === 'pending' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <Clock className="w-4 h-4 mx-auto mb-1" /> {t('tabRecyclerPending', 'Pending')}
          </button>
          <button onClick={() => setActiveTab('buys')} className={`flex-1 py-4 text-xs font-bold text-center border-b-2 transition-colors ${activeTab === 'buys' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <History className="w-4 h-4 mx-auto mb-1" /> {t('tabBuys', 'My Buys')}
          </button>
          <button onClick={() => setActiveTab('prices')} className={`flex-1 py-4 text-xs font-bold text-center border-b-2 transition-colors ${activeTab === 'prices' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <IndianRupee className="w-4 h-4 mx-auto mb-1" /> {t('tabPrices', 'Price Board')}
          </button>
        </div>
      </div>

      <main className="max-w-md mx-auto mt-4 p-4">
        
        {activeTab === 'live' && (
          <div className="space-y-4">
            <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden border border-orange-200 shadow-sm relative">
              <iframe width="100%" height="100%" frameBorder="0" scrolling="no" src={`https://www.openstreetmap.org/export/embed.html?bbox=${myIdentity.lon-0.05}%2C${myIdentity.lat-0.05}%2C${myIdentity.lon+0.05}%2C${myIdentity.lat+0.05}&layer=mapnik&marker=${myIdentity.lat}%2C${myIdentity.lon}`}></iframe>
            </div>

            {feedRequests.length === 0 ? <p className="text-center text-gray-500 py-8 bg-white rounded-xl border border-dashed border-gray-300">{t('noRequests', 'No pending lots.')}</p> : feedRequests.map(req => (
              <div key={req.id} className="bg-white p-5 rounded-xl shadow-sm border border-orange-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">Lot #{req.id}</h4>
                    <p className="text-sm font-medium text-gray-500 flex items-center gap-1 mt-1"><User className="w-4 h-4"/> {req.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-green-700 block">{req.estValue}</span>
                    <span className="text-xs font-bold text-gray-500 uppercase bg-gray-100 px-2 py-1 rounded mt-1 inline-block">{req.paymentMethod === 'upi' ? `UPI: ${req.upiId}` : 'CASH'}</span>
                  </div>
                </div>

                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 mb-3">
                  <p className="text-sm font-semibold text-gray-700">{req.scrap}</p>
                </div>

                {req.hasPhoto && req.photos && (
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
                    {req.photos.map((src, idx) => (
                      <img key={idx} src={src} className="w-16 h-16 object-cover rounded-lg border border-gray-200 cursor-pointer" onClick={() => setSelectedImage(src)} />
                    ))}
                  </div>
                )}

                <div className="flex gap-3 mt-2 pt-4 border-t border-gray-100">
                  <button onClick={() => handleDecline(req.id)} className="flex-1 py-2.5 text-gray-500 bg-gray-100 rounded-lg font-bold">{t('decline', 'Decline')}</button>
                  <button onClick={() => handleAcceptLot(req)} className="flex-1 py-2.5 text-white bg-orange-500 rounded-lg font-black">{t('accept', 'Accept Lot')}</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="space-y-4">
            {acceptedRequests.length === 0 ? (
              <div className="text-center py-12 px-6 bg-white rounded-xl border border-dashed border-gray-300">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No pending handovers.</p>
              </div>
            ) : (
              acceptedRequests.map(req => (
                <div key={req.id} className="bg-white rounded-xl shadow-sm border border-orange-200 p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md mb-2 inline-block">{t('activeRoute', 'Active Handover')}</span>
                      <h3 className="text-xl font-bold text-gray-800">Lot #{req.id}</h3>
                    </div>
                    {req.phone && (
                      <a href={`tel:${req.phone}`} className="flex items-center justify-center p-3 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition-colors">
                        <Phone className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                  
                  <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-gray-800 font-bold flex items-center gap-2"><User className="w-4 h-4 text-gray-500"/> {req.name}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">{t('paymentPref', 'Payment Pref')}</p>
                      <p className="text-sm font-bold text-gray-800 mt-1">
                        {req.paymentMethod === 'upi' ? `UPI: ${req.upiId}` : 'CASH'}
                      </p>
                    </div>
                    <span className="text-xl font-black text-green-700">{req.estValue}</span>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-100 mb-4">
                    <p className="text-xs font-bold text-orange-800 mb-1 uppercase tracking-wider">{t('personalDetails', 'Lot Details')}</p>
                    <p className="text-sm font-semibold text-gray-700">{req.scrap}</p>
                  </div>

                  {req.hasPhoto && req.photos && (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Attached Photos</p>
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {req.photos.map((src, i) => (
                          <img key={i} src={src} alt="E-Waste" className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200 shadow-sm shrink-0 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setSelectedImage(src)} />
                        ))}
                      </div>
                    </div>
                  )}

                  <button onClick={() => handleConfirmHandover(req)} className="w-full py-3 bg-green-600 text-white rounded-lg font-bold shadow-md flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> {t('markBought', 'Mark as Bought')}
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'buys' && (
          <div className="space-y-4">
             {myBuys.length === 0 ? (
               <div className="text-center py-12 px-6 bg-white rounded-xl border border-dashed border-gray-300">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No completed handovers yet.</p>
               </div>
             ) : (
               myBuys.map((buy, i) => (
                 <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-md flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Verified</span>
                      <span className="text-xs font-semibold text-gray-400">{buy.time}</span>
                    </div>
                    <h4 className="font-bold text-gray-800">Lot #{buy.id}</h4>
                    <p className="text-xs text-gray-500 mt-1 truncate">{buy.scrap}</p>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-end">
                      <span className="text-xs font-bold text-gray-400 uppercase">{buy.paymentMethod}</span>
                      <span className="text-lg font-black text-green-700">{buy.estValue}</span>
                    </div>
                 </div>
               ))
             )}
          </div>
        )}

        {activeTab === 'prices' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-orange-50 border-b border-orange-100 flex items-center justify-between">
              <h3 className="font-bold text-orange-800 uppercase tracking-wide text-sm">Official EPR Rates (CPCB Mandated)</h3>
              <span className="text-xs font-semibold text-orange-600 bg-orange-200 px-2 py-1 rounded-full">Live</span>
            </div>
            <div className="divide-y divide-gray-100">
              {categories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 text-gray-600 rounded-lg"><Icon className="w-5 h-5" /></div>
                      <span className="font-semibold text-gray-700">{cat.name}</span>
                    </div>
                    <span className="font-black text-green-700">₹{cat.pricePerKg} <span className="text-xs text-gray-400 font-medium">/kg</span></span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {selectedImage && (
          <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
            <button className="absolute top-4 right-4 text-white hover:text-gray-300"><X className="w-8 h-8" /></button>
            <img src={selectedImage} alt="Expanded" className="max-w-full max-h-[90vh] object-contain rounded-lg" />
          </div>
        )}
      </main>
    </div>
  );
}

// ==========================================
// 4. EPR ADMIN DASHBOARD
// ==========================================
function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [adminType, setAdminType] = useState('regulator');
  const [adminSection, setAdminSection] = useState('overview'); 

  const [recyclersList, setRecyclersList] = useState([]);
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [priceSavedNotice, setPriceSavedNotice] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newFacility, setNewFacility] = useState({
    name: "", phone: "", address: "", lat: "22.57", lon: "88.36", workingHours: "9:00 AM - 6:00 PM"
  });
  
  const [selectedImage, setSelectedImage] = useState(null);

  const [adminStats, setAdminStats] = useState({
    kg: 1240, collectors: 42, pending: 18, disbursed: 14500, logs: []
  });

  useEffect(() => {
    try {
      const savedType = localStorage.getItem('logged_in_admin_type') || 'regulator';
      setAdminType(savedType);

      const savedRecyclers = localStorage.getItem('scrapup_recyclers');
      setRecyclersList(savedRecyclers ? JSON.parse(savedRecyclers) : INITIAL_RECYCLERS);

      const savedRates = localStorage.getItem('scrapup_rates');
      setRates(savedRates ? JSON.parse(savedRates) : DEFAULT_RATES);
    } catch(e) {
      setRecyclersList(INITIAL_RECYCLERS);
      setRates(DEFAULT_RATES);
    }
  }, []);

  useEffect(() => {
    const calculateLiveStats = () => {
      try {
        const history = JSON.parse(localStorage.getItem('scrapup_history') || '[]');
        if(!Array.isArray(history)) return;

        const extraKg = history.reduce((sum, lot) => sum + (lot.rawWeight || 0), 0);
        const extraValue = history.reduce((sum, lot) => sum + (lot.rawValue || 0), 0);
        
        const newLogs = history.slice(0, 15).map(lot => ({
          id: `LOT-${lot.id}`,
          user: lot.name,
          phone: lot.phone,
          status: 'Verified',
          time: lot.time,
          scrap: lot.scrap,
          estValue: lot.estValue,
          paymentMethod: lot.paymentMethod,
          photos: lot.photos || [],
          recyclerName: lot.acceptedBy ? lot.acceptedBy.name : 'Unknown Recycler'
        }));

        setAdminStats({
          kg: 1240 + extraKg, collectors: 42 + history.length, 
          pending: Math.max(0, 18 - history.length), disbursed: 14500 + extraValue,
          logs: newLogs 
        });
      } catch (e) {}
    };

    calculateLiveStats();
    const interval = setInterval(calculateLiveStats, 1500); 
    return () => clearInterval(interval);
  }, []);

  const handleSaveRates = (e) => {
    e.preventDefault();
    localStorage.setItem('scrapup_rates', JSON.stringify(rates));
    setPriceSavedNotice(true);
    setTimeout(() => setPriceSavedNotice(false), 3000);
  };

  const toggleAuthorization = (id) => {
    const updated = recyclersList.map(r => {
      if (r.id === id) {
        return { ...r, authorized: r.authorized === false ? true : false };
      }
      return r;
    });
    setRecyclersList(updated);
    localStorage.setItem('scrapup_recyclers', JSON.stringify(updated));
  };

  const handleAddFacility = (e) => {
    e.preventDefault();
    const newEntry = {
      id: `r${Date.now()}`,
      name: newFacility.name,
      phone: newFacility.phone,
      address: newFacility.address,
      lat: parseFloat(newFacility.lat) || 22.57,
      lon: parseFloat(newFacility.lon) || 88.36,
      workingHours: newFacility.workingHours,
      authorized: true
    };
    const updated = [newEntry, ...recyclersList];
    setRecyclersList(updated);
    localStorage.setItem('scrapup_recyclers', JSON.stringify(updated));
    setShowAddModal(false);
    setNewFacility({ name: "", phone: "", address: "", lat: "22.57", lon: "88.36", workingHours: "9:00 AM - 6:00 PM" });
  };

  const generateMapHTML = (hubs) => `
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { width: 100vw; height: 100vh; }
        .custom-popup .leaflet-popup-content-wrapper { border-radius: 8px; }
        .custom-popup .leaflet-popup-content { font-family: sans-serif; font-size: 13px; font-weight: bold; color: #1e3a8a; text-align: center; margin: 10px; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([22.5726, 88.3639], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap',
          maxZoom: 19
        }).addTo(map);

        var hubs = ${JSON.stringify(hubs)};
        
        hubs.forEach(function(hub) {
          if (!hub.lat || !hub.lon) return;
          var marker = L.marker([hub.lat, hub.lon]).addTo(map);
          marker.bindPopup("<div style='text-align:center;'><b>" + hub.name + "</b><br/><span style='font-size:11px;color:#6b7280;'>" + (hub.address || "").split(',')[0] + "</span><br/><span style='font-size:10px;color:#16a34a;'>Working: " + (hub.workingHours || "9 AM - 6 PM") + "</span></div>", { className: 'custom-popup' });
        });
      </script>
    </body>
    </html>
  `;

  const eprData = [
    { name: 'Mon', CRTs: 120, PCBs: 80, Cables: 45, Plastics: 30 },
    { name: 'Tue', CRTs: 150, PCBs: 95, Cables: 60, Plastics: 40 },
    { name: 'Wed', CRTs: 180, PCBs: 110, Cables: 75, Plastics: 55 },
    { name: 'Thu', CRTs: 140, PCBs: 90, Cables: 55, Plastics: 35 },
    { name: 'Fri', CRTs: 200, PCBs: 130, Cables: 85, Plastics: 60 },
    { name: 'Sat', CRTs: 250, PCBs: 160, Cables: 110, Plastics: 80 },
    { name: 'Sun', CRTs: 190, PCBs: 120, Cables: 90, Plastics: 65 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      <nav className="bg-blue-900 p-4 shadow-md flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold flex items-center gap-2">📊 {t('adminTitle', 'ScrapUp Admin Dashboard')}</h1>
          <span className="hidden sm:inline-block text-xs font-bold px-2.5 py-1 rounded bg-blue-800 text-blue-200 border border-blue-700 uppercase">
            {adminType === 'regulator' ? '🏛️ CPCB / WBPCB Regulator' : adminType === 'producer' ? '🏢 Brand Producer' : '🤝 Registered PRO'}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/')} className="flex items-center gap-1 bg-blue-950 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-black"><LogOut className="w-4 h-4" /> {t('logout', 'Logout')}</button>
        </div>
      </nav>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex overflow-x-auto">
          <button onClick={() => setAdminSection('overview')} className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-colors shrink-0 ${adminSection === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
            Overview & Traceability
          </button>
          
          {adminType === 'regulator' ? (
            <>
              <button onClick={() => setAdminSection('pricing')} className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-colors shrink-0 ${adminSection === 'pricing' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                CPCB Scrap Price Fixing
              </button>
              <button onClick={() => setAdminSection('recyclers')} className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-colors shrink-0 ${adminSection === 'recyclers' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                Manage Recyclers ({recyclersList.filter(r => r?.authorized !== false).length})
              </button>
            </>
          ) : (
            <button onClick={() => setAdminSection('recyclers')} className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-colors shrink-0 ${adminSection === 'recyclers' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              Authorized Recyclers ({recyclersList.filter(r => r?.authorized !== false).length})
            </button>
          )}

          <button onClick={() => setAdminSection('map')} className={`py-3.5 px-6 font-bold text-sm border-b-2 transition-colors shrink-0 ${adminSection === 'map' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
            Kolkata Facility Map
          </button>
        </div>
      </div>
      
      <main className="max-w-6xl mx-auto mt-6 p-4">
        
        {/* SECTION 1: OVERVIEW & DETAILED LOGS */}
        {adminSection === 'overview' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><p className="text-gray-500 font-medium">{t('statFormalized', 'Formalized E-Waste')}</p><h3 className="text-3xl font-black text-gray-800 mt-2">{adminStats.kg.toLocaleString()} kg</h3></div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><p className="text-gray-500 font-medium">{t('statCollectors', 'Registered Collectors')}</p><h3 className="text-3xl font-black text-gray-800 mt-2">{adminStats.collectors}</h3></div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><p className="text-gray-500 font-medium">{t('statPending', 'Pending Traceability')}</p><h3 className="text-3xl font-black text-gray-800 mt-2">{adminStats.pending}</h3></div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><p className="text-gray-500 font-medium">{t('statValue', 'Value Disbursed')}</p><h3 className="text-3xl font-black text-gray-800 mt-2 text-green-600">₹{adminStats.disbursed.toLocaleString()}</h3></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t('chartTitle', 'Weekly EPR Category Tracking (kg)')}</h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={eprData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                      <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '10px'}} />
                      <Bar dataKey="CRTs" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                      <Bar dataKey="PCBs" stackId="a" fill="#10b981" />
                      <Bar dataKey="Cables" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="Plastics" stackId="a" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ENHANCED LIVE VERIFICATION LOGS */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t('logsTitle', 'Live Verification Logs')}</h3>
                
                {adminStats.logs.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No verified logs yet.</p>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                    {adminStats.logs.map((log, i) => (
                      <div key={i} className="p-4 border border-gray-200 shadow-sm bg-white rounded-xl hover:border-blue-300 transition-colors">
                        
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-bold text-blue-600">{log.id}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{log.time}</p>
                          </div>
                          <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> {log.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-blue-50 p-2 rounded border border-blue-100">
                            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wide">Collector</p>
                            <p className="text-xs font-semibold text-gray-800 flex items-center gap-1 mt-0.5"><User className="w-3 h-3 shrink-0"/> {log.user}</p>
                            {log.phone && <p className="text-[10px] text-gray-500 mt-0.5 ml-4">{log.phone}</p>}
                          </div>
                          <div className="bg-orange-50 p-2 rounded border border-orange-100">
                            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wide">Recycler</p>
                            <p className="text-xs font-semibold text-gray-800 flex items-center gap-1 mt-0.5"><Factory className="w-3 h-3 shrink-0"/> {log.recyclerName}</p>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
                          <p className="text-xs font-medium text-gray-700">{log.scrap}</p>
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                            <span className="text-sm font-black text-green-700">{log.estValue}</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase px-2 py-1 bg-gray-200 rounded">{log.paymentMethod}</span>
                          </div>
                        </div>

                        {log.photos && log.photos.length > 0 && (
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wide">Evidence Photos</p>
                            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                              {log.photos.map((src, idx) => (
                                <img 
                                  key={idx} 
                                  src={src} 
                                  alt="Evidence" 
                                  className="w-12 h-12 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80" 
                                  onClick={() => setSelectedImage(src)}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: DYNAMIC PRICING CONTROL (REGULATOR ONLY) */}
        {adminSection === 'pricing' && adminType === 'regulator' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-2xl mx-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800">State Environmental Scrap Pricing Policy</h3>
                <p className="text-xs text-gray-500 mt-1">Set mandatory minimum purchase rates per kg for authorized recyclers in West Bengal.</p>
              </div>
              <IndianRupee className="w-8 h-8 text-green-600" />
            </div>

            {priceSavedNotice && (
              <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Rates successfully updated and broadcast to all Collector and Recycler portals!
              </div>
            )}

            <form onSubmit={handleSaveRates} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(rates).map(key => (
                  <div key={key} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">{key} Rate (₹/kg)</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={rates[key]} 
                      onChange={(e) => setRates({ ...rates, [key]: parseFloat(e.target.value) || 0 })} 
                      className="w-full p-2.5 font-bold text-lg border border-gray-300 rounded bg-white text-gray-800 focus:border-blue-500 outline-none" 
                    />
                  </div>
                ))}
              </div>

              <button type="submit" className="w-full mt-4 py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition-colors flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> Save & Broadcast Mandated Rates
              </button>
            </form>
          </div>
        )}

        {/* SECTION 3: RECYCLER REGISTRY & AUTHORIZATION */}
        {adminSection === 'recyclers' && (
          adminType === 'regulator' ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">West Bengal Registered Recyclers</h3>
                  <p className="text-xs text-gray-500 mt-1">Grant or suspend EPR compliance certification licenses.</p>
                </div>
                <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-blue-600 text-white font-bold text-sm px-4 py-2.5 rounded-lg hover:bg-blue-700 shadow-sm transition-all">
                  <Plus className="w-4 h-4" /> Register New Facility
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recyclersList.map(r => {
                  const isAuth = r.authorized !== false;
                  return (
                    <div key={r.id} className={`bg-white p-5 rounded-xl shadow-sm border-2 transition-all ${isAuth ? 'border-gray-200' : 'border-red-300 bg-red-50/20'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{r.name}</h4>
                          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${isAuth ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {isAuth ? <CheckCircle2 className="w-3 h-3"/> : <Ban className="w-3 h-3"/>}
                            {isAuth ? 'Authorized Facility' : 'Suspended / Revoked'}
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">ID: {r.id}</span>
                      </div>

                      <div className="text-xs text-gray-600 space-y-1.5 my-3">
                        <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400"/> {r.phone}</p>
                        <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400"/> {r.address}</p>
                        <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-400"/> {r.workingHours || "9:00 AM - 6:00 PM"}</p>
                        <p className="flex items-center gap-1.5 text-gray-400 font-mono">GPS: {r.lat}, {r.lon}</p>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex gap-2">
                        <button 
                          onClick={() => toggleAuthorization(r.id)} 
                          className={`flex-1 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${isAuth ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'}`}
                        >
                          {isAuth ? <Ban className="w-3.5 h-3.5"/> : <CheckCircle2 className="w-3.5 h-3.5"/>}
                          {isAuth ? 'Revoke Authorization' : 'Restore Authorization'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">State Authorized Recyclers Directory</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Licensed partner facilities available for EPR fulfillment contracts.</p>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full">
                  {recyclersList.filter(r => r?.authorized !== false).length} Verified Facilities
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recyclersList.filter(r => r?.authorized !== false).map((recycler, i) => (
                  <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-black text-gray-800 text-lg">{recycler.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Certified
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 flex items-start gap-1">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400"/> {recycler.address}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 flex items-start gap-1">
                        <Clock className="w-4 h-4 mt-0.5 shrink-0 text-gray-400"/> 
                        <span className="font-semibold text-gray-700">Working Hours:</span> {recycler.workingHours || "9:00 AM - 6:00 PM"}
                      </p>
                      
                      {recycler.lat && recycler.lon && (
                        <div className="w-full h-36 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mt-3 mb-3">
                          <iframe 
                            width="100%" 
                            height="100%" 
                            frameBorder="0" 
                            scrolling="no" 
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${recycler.lon-0.02}%2C${recycler.lat-0.02}%2C${recycler.lon+0.02}%2C${recycler.lat+0.02}&layer=mapnik&marker=${recycler.lat}%2C${recycler.lon}`}
                          ></iframe>
                        </div>
                      )}
                    </div>

                    <a 
                      href={`tel:${recycler.phone}`} 
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Phone className="w-4 h-4 text-gray-600" /> Call {recycler.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* SECTION 4: CONSOLIDATED KOLKATA FACILITY MAP */}
        {adminSection === 'map' && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">State Recycler Geographic Network</h3>
                <p className="text-xs text-gray-500">Live monitoring of all licensed facilities across the Greater Kolkata Metropolitan Area.</p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                {recyclersList.filter(r => r?.authorized !== false).length} Active Hubs
              </span>
            </div>

            <div className="w-full h-[450px] bg-gray-100 rounded-xl overflow-hidden border border-gray-300 shadow-inner mb-6 relative">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                srcDoc={generateMapHTML(recyclersList.filter(r => r?.authorized !== false))}
              ></iframe>
            </div>

            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Facility Coordinates & Zone Status</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recyclersList.filter(r => r?.authorized !== false).map((r, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-sm text-gray-800">{r.name}</h5>
                    <p className="text-xs text-gray-500">{(r.address || "").split(',')[0]}</p>
                  </div>
                  <span className="text-xs font-bold font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                    {r.lat?.toFixed(2)}, {r.lon?.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MODAL: ADD RECYCLER (REGULATOR ONLY) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Register Authorized Facility</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleAddFacility} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Facility Name</label>
                <input required type="text" value={newFacility.name} onChange={(e) => setNewFacility({...newFacility, name: e.target.value})} placeholder="e.g. Apex Recycling Works" className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Phone Number</label>
                <input required type="tel" value={newFacility.phone} onChange={(e) => setNewFacility({...newFacility, phone: e.target.value})} placeholder="+91 9876543210" className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Facility Address & Zone</label>
                <input required type="text" value={newFacility.address} onChange={(e) => setNewFacility({...newFacility, address: e.target.value})} placeholder="e.g. Taratala Industrial Area, Kolkata" className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Latitude</label>
                  <input required type="text" value={newFacility.lat} onChange={(e) => setNewFacility({...newFacility, lat: e.target.value})} placeholder="22.57" className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Longitude</label>
                  <input required type="text" value={newFacility.lon} onChange={(e) => setNewFacility({...newFacility, lon: e.target.value})} placeholder="88.36" className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Operating Working Hours</label>
                <input required type="text" value={newFacility.workingHours} onChange={(e) => setNewFacility({...newFacility, workingHours: e.target.value})} placeholder="9:00 AM - 6:00 PM" className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50" />
              </div>

              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700">Add & Authorize</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Zoom Modal for Admin Logs */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button className="absolute top-4 right-4 text-white hover:text-gray-300"><X className="w-8 h-8" /></button>
          <img src={selectedImage} alt="Expanded Evidence" className="max-w-full max-h-[90vh] object-contain rounded-lg" />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/citizen" element={<CitizenPortal />} />
        <Route path="/kabadiwala" element={<KabadiwalaPortal />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}