import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Monitor, Tv, Cpu, Plug, Battery, Zap, Recycle, MapPin, Plus, Minus, User, ShieldCheck, Truck, LogOut, Power, Phone, CheckCircle, XCircle, Navigation, TrendingUp, Users, AlertCircle, IndianRupee, Camera, CheckCircle2, Languages, Loader2, Volume2, VolumeX, AlertTriangle, ArrowLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

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
  
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4 font-sans relative">
      <div className="absolute top-4 right-4 bg-green-600 rounded-md shadow-sm"><LanguageToggle /></div>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-green-100">
        <div className="text-center">
          <h1 className="text-4xl font-black text-green-700 mb-2">♻️ {t('appTitle', 'ScrapUp')}</h1>
          <p className="text-gray-500 font-medium text-sm">{t('selectRole', 'Select your role to continue')}</p>
        </div>
        <div className="space-y-4">
          <button onClick={() => navigate('/citizen')} className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group">
            <div className="bg-green-100 p-3 rounded-lg text-green-600 group-hover:bg-green-200 transition-colors"><User className="w-6 h-6" /></div>
            <div className="ml-4 text-left"><h3 className="font-bold text-gray-800">{t('roleCollector', 'Informal Collector')}</h3><p className="text-xs text-gray-500">{t('roleCollectorDesc', 'Log and sell collected e-waste')}</p></div>
          </button>
          <button onClick={() => navigate('/kabadiwala')} className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group">
            <div className="bg-orange-100 p-3 rounded-lg text-orange-600 group-hover:bg-orange-200 transition-colors"><Truck className="w-6 h-6" /></div>
            <div className="ml-4 text-left"><h3 className="font-bold text-gray-800">{t('roleRecycler', 'Authorized Recycler')}</h3><p className="text-xs text-gray-500">{t('roleRecyclerDesc', 'Receive formalized e-waste lots')}</p></div>
          </button>
          <button onClick={() => navigate('/admin')} className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors"><ShieldCheck className="w-6 h-6" /></div>
            <div className="ml-4 text-left"><h3 className="font-bold text-gray-800">{t('roleAdmin', 'EPR Admin')}</h3><p className="text-xs text-gray-500">{t('roleAdminDesc', 'Track formalization and traceability')}</p></div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. COLLECTOR PORTAL
// ==========================================
function CitizenPortal() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [step, setStep] = useState(1);
  const [weights, setWeights] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [name, setName] = useState("Arka Pal");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [photoData, setPhotoData] = useState(null); 
  const [mapCoords, setMapCoords] = useState({ lat: 22.5726, lon: 88.3639 }); // Default Kolkata
  
  const [isLocating, setIsLocating] = useState(false);
  const [myPoints, setMyPoints] = useState(() => {
    const saved = parseInt(localStorage.getItem('scrapup_points'));
    return isNaN(saved) ? 1250 : saved;
  });

  useEffect(() => {
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const categories = [
    { id: 'crt', name: t('cat_crt', 'CRTs'), icon: Monitor, pricePerKg: 10, group: 'specialized' },
    { id: 'lcd', name: t('cat_lcd', 'LCD Panels'), icon: Tv, pricePerKg: 40, group: 'specialized' },
    { id: 'pcb', name: t('cat_pcb', 'Circuit Boards'), icon: Cpu, pricePerKg: 150, group: 'specialized' },
    { id: 'cables', name: t('cat_cables', 'Cables'), icon: Plug, pricePerKg: 80, group: 'specialized' },
    { id: 'batteries', name: t('cat_batteries', 'Batteries'), icon: Battery, pricePerKg: 60, group: 'specialized' },
    { id: 'motors', name: t('cat_motors', 'Motors'), icon: Zap, pricePerKg: 45, group: 'specialized' },
    { id: 'plastics', name: t('cat_plastics', 'Mixed Plastics'), icon: Recycle, pricePerKg: 15, group: 'nonBiodegradable' },
  ];

  const speakAudio = (e, text) => {
    e.stopPropagation(); 
    if (!('speechSynthesis' in window)) return alert("Audio not supported.");

    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return; 
    }

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

  const toggleScrap = (id) => {
    setWeights(prev => {
      const newWeights = { ...prev };
      if (newWeights[id]) delete newWeights[id];
      else newWeights[id] = 1;
      return newWeights;
    });
  };

  const updateWeight = (id, delta) => setWeights(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 0) + delta) }));

  const totalEstimatedValue = Object.entries(weights).reduce((total, [id, weight]) => {
    const cat = categories.find(c => c.id === id);
    return total + (cat ? cat.pricePerKg * weight : 0);
  }, 0);

  const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
  const co2Saved = (totalWeight * 1.5).toFixed(1); 
  const hasSelection = Object.keys(weights).length > 0;
  const isFormComplete = name.trim() !== "" && phone.trim() !== "" && address.trim() !== "" && photoUploaded;

  const handleGetLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setMapCoords({ lat: latitude, lon: longitude });
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          setAddress(data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } catch {
          setAddress("GPS Location Captured");
        } finally {
          setIsLocating(false);
        }
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true }
    );
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoData(reader.result);
        setPhotoUploaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSchedulePickup = () => {
    const generatedId = Math.floor(Math.random() * 9000) + 1000;
    setBookingId(generatedId);

    const scrapList = Object.keys(weights).map(id => categories.find(c => c.id === id)?.name).join(', ');
    const earned = Math.floor(parseFloat(co2Saved) * 10);
    const newTotal = myPoints + earned;
    
    setMyPoints(newTotal);
    localStorage.setItem('scrapup_points', newTotal.toString());

    const newBooking = {
      id: generatedId,
      name,
      phone,
      address,
      distance: "0.2 km",
      scrap: scrapList,
      estValue: `₹${totalEstimatedValue}`,
      time: "Just now",
      hasPhoto: photoUploaded,
      photoData
    };

    try {
      const existingRequests = JSON.parse(localStorage.getItem('scrapup_requests') || '[]');
      localStorage.setItem('scrapup_requests', JSON.stringify([newBooking, ...existingRequests]));
    } catch (err) {
      console.error(err);
    }

    setBookingSuccess(true);
  };

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
            const audioString = cat.pricePerKg > 0 
              ? `${cat.name} ${t('priceSpeech', 'Price is')} ${cat.pricePerKg} ${t('rupeesPerKg', 'rupees per kg')}`
              : `${cat.name} ${t('noValue', 'has no value')}`;

            return (
              <button key={cat.id} onClick={() => toggleScrap(cat.id)} className={`relative p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${isSelected ? 'border-green-500 bg-green-50 text-green-700 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-green-200'}`}>
                <div onClick={(e) => speakAudio(e, audioString)} className="absolute top-2 right-2 p-1.5 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-600 text-gray-400 transition-colors z-10 shadow-sm">
                   <Volume2 className="w-3.5 h-3.5" />
                </div>
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
      
      <main className="max-w-md mx-auto mt-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
        {step === 1 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">{t('bookPickup', 'Log E-Waste')}</h2>
            <p className="text-gray-500 text-sm mt-1 mb-4 font-semibold text-green-700">{t('selectScrap', 'Select materials to estimate value')}</p>
            
            <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between text-left shadow-sm">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0" />
                <p className="text-xs text-yellow-800 font-semibold">{t('safetyWarning', 'Safety Warning: Do not burn cables.')}</p>
              </div>
              <button onClick={(e) => speakAudio(e, t('safetyWarningFull', 'Safety Warning: Do not burn cables or break open batteries. Hand them safely to authorized recyclers to protect your health.'))} className="p-2 bg-yellow-200 text-yellow-700 rounded-full hover:bg-yellow-300 shadow-sm shrink-0 ml-2 transition-colors">
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
                        <span className="text-sm font-semibold text-gray-700 flex-1">{cat.name}</span>
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
              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-sm font-semibold text-gray-700">{t('exactAddress', 'Location')}</label>
                  <button onClick={handleGetLocation} className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded hover:bg-green-100 flex items-center gap-1 border border-green-200 shadow-sm">
                    {isLocating ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />} {t('getGps', 'Use GPS')}
                  </button>
                </div>
                <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-sm min-h-[60px]" />
                
                {/* Dynamic Location Map */}
                <div className="w-full h-32 mt-2 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 shadow-inner">
                  <iframe 
                    width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" 
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCoords.lon-0.02}%2C${mapCoords.lat-0.02}%2C${mapCoords.lon+0.02}%2C${mapCoords.lat+0.02}&layer=mapnik&marker=${mapCoords.lat}%2C${mapCoords.lon}`}>
                  </iframe>
                </div>

              </div>
              <div>
                <label className={`w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed font-bold cursor-pointer ${photoUploaded ? 'bg-green-50 border-green-500 text-green-700' : 'bg-gray-50 border-gray-300 text-gray-600'}`}>
                  {photoUploaded ? <CheckCircle2 className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                  {photoUploaded ? t('photoAttached', 'Photo Attached') : t('addPhoto', 'Upload Photo')}
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>
            </div>
            <button onClick={handleSchedulePickup} disabled={!isFormComplete} className={`w-full p-4 rounded-lg font-bold text-white transition-all ${isFormComplete ? 'bg-green-600 hover:bg-green-700 shadow-md' : 'bg-gray-400 cursor-not-allowed'}`}>
              {isFormComplete ? t('schedulePickup', 'Submit Lot') : t('fillDetailsBtn', 'Fill Details')}
            </button>
          </div>
        )}
      </main>

      {bookingSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"><CheckCircle2 className="w-10 h-10 text-green-600" /></div>
            <h2 className="text-2xl font-black text-gray-800">{t('successTitle', 'Lot Submitted!')}</h2>
            <p className="text-gray-500 mt-2 mb-6 text-sm">{t('successDesc', 'Recycler notified.')} <br/>Ref ID: <span className="font-bold text-gray-800">#LOT-{bookingId}</span></p>
            <button onClick={() => { setBookingSuccess(false); setWeights({}); setPhotoUploaded(false); setPhotoData(null); setAddress(""); setPhone(""); setStep(1); }} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700">
              {t('backHome', 'Back')}
            </button>
          </div>
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
  const [isOnline, setIsOnline] = useState(false);
  const [activePickup, setActivePickup] = useState(null);
  const [feedRequests, setFeedRequests] = useState([]);

  useEffect(() => {
    if (isOnline) {
      const liveData = JSON.parse(localStorage.getItem('scrapup_requests') || '[]');
      const mockData = [
        { id: 9991, name: "Suresh Das", phone: "+91 9876543210", address: "Sector V, Salt Lake", distance: `4.2 km`, scrap: `Circuit Boards, Cables`, estValue: "₹650", time: "1 hr ago", hasPhoto: false },
      ];
      setFeedRequests([...liveData, ...mockData]);
    }
  }, [isOnline]);

  const handleDecline = (id) => {
    setFeedRequests(prev => prev.filter(req => req.id !== id));
    const existing = JSON.parse(localStorage.getItem('scrapup_requests') || '[]');
    localStorage.setItem('scrapup_requests', JSON.stringify(existing.filter(req => req.id !== id)));
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-10">
      <nav className="bg-orange-600 p-4 shadow-md flex justify-between items-center text-white">
        <h1 className="text-xl font-bold flex items-center gap-2">🏭 {t('recyclerTitle', 'ScrapUp Recycler')}</h1>
        <div className="flex gap-2">
          <LanguageToggle />
          <button onClick={() => navigate('/')} className="flex items-center gap-1 bg-orange-700 px-3 py-1.5 rounded-md hover:bg-orange-800 text-sm font-semibold"><LogOut className="w-4 h-4" /> {t('logout', 'Logout')}</button>
        </div>
      </nav>
      <main className="max-w-md mx-auto mt-6 p-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">{t('dutyStatus', 'Status')}</h2>
            <p className="text-sm text-gray-500">{isOnline ? t('onlineMsg', 'Online') : t('offlineMsg', 'Offline')}</p>
          </div>
          <button onClick={() => setIsOnline(!isOnline)} className={`p-4 rounded-full text-white shadow-md transition-all ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}><Power className="w-6 h-6" /></button>
        </div>
        
        {!isOnline && !activePickup && (
          <div className="text-center py-12 px-6 bg-white rounded-xl border border-dashed border-gray-300">
            <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-500 font-medium">{t('goOnlineMsg', 'Go online to view lots.')}</h3>
          </div>
        )}

        {isOnline && !activePickup && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-orange-600" />
              <h3 className="font-bold text-gray-700">{t('liveRequests', 'Live Lots Near You')}</h3>
            </div>
            
            {/* Live Recycler Map */}
            <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden border border-orange-200 shadow-sm">
              <iframe 
                width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" 
                src="https://www.openstreetmap.org/export/embed.html?bbox=88.25%2C22.45%2C88.45%2C22.65&layer=mapnik&marker=22.57%2C88.43">
              </iframe>
            </div>

            {feedRequests.length === 0 ? <p className="text-center text-gray-500 py-4">{t('noRequests', 'No pending lots.')}</p> : feedRequests.map(req => (
              <div key={req.id} className="bg-white p-4 rounded-xl shadow-sm border border-orange-100">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-md">{req.distance}</span>
                    <h4 className="font-bold text-gray-800 mt-2">{req.name}</h4>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/> {req.address}</p>
                  </div>
                  <span className="text-lg font-black text-green-700">{req.estValue}</span>
                </div>
                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button onClick={() => handleDecline(req.id)} className="flex-1 py-2 text-gray-500 bg-gray-100 rounded-lg font-medium">{t('decline', 'Decline')}</button>
                  <button onClick={() => setActivePickup(req)} className="flex-1 py-2 text-white bg-orange-500 rounded-lg font-bold">{t('accept', 'Accept Lot')}</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activePickup && (
          <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-5">
            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md mb-3 inline-block">{t('activeRoute', 'Active Collection')}</span>
            <h3 className="text-xl font-bold text-gray-800">{activePickup.name}</h3>
            <p className="text-gray-500 flex items-center gap-1 mt-1 mb-4 text-sm"><MapPin className="w-4 h-4"/> {activePickup.address}</p>
            
            <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-4">
              <iframe 
                width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" 
                src="https://www.openstreetmap.org/export/embed.html?bbox=88.42%2C22.56%2C88.44%2C22.58&layer=mapnik&marker=22.57%2C88.43">
              </iframe>
            </div>

            <button onClick={() => setActivePickup(null)} className="w-full py-3 bg-green-600 text-white rounded-lg font-bold shadow-md">
              {t('confirmCollection', 'Confirm Handover')}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// ==========================================
// 4. ADMIN DASHBOARD
// ==========================================
function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const eprData = [
    { name: 'Mon', CRTs: 120, PCBs: 80, Cables: 45 },
    { name: 'Tue', CRTs: 150, PCBs: 95, Cables: 60 },
    { name: 'Wed', CRTs: 180, PCBs: 110, Cables: 75 },
    { name: 'Thu', CRTs: 140, PCBs: 90, Cables: 55 },
    { name: 'Fri', CRTs: 200, PCBs: 130, Cables: 85 },
    { name: 'Sat', CRTs: 250, PCBs: 160, Cables: 110 },
    { name: 'Sun', CRTs: 190, PCBs: 120, Cables: 90 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      <nav className="bg-blue-800 p-4 shadow-md flex justify-between items-center text-white">
        <h1 className="text-xl font-bold flex items-center gap-2">📊 {t('adminTitle', 'ScrapUp Admin Dashboard')}</h1>
        <div className="flex gap-2">
          <LanguageToggle />
          <button onClick={() => navigate('/')} className="flex items-center gap-1 bg-blue-900 px-3 py-1.5 rounded-md text-sm font-semibold"><LogOut className="w-4 h-4" /> {t('logout', 'Logout')}</button>
        </div>
      </nav>
      
      <main className="max-w-6xl mx-auto mt-8 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><p className="text-gray-500 font-medium">{t('statFormalized', 'Formalized E-Waste')}</p><h3 className="text-3xl font-black text-gray-800 mt-2">1,240 kg</h3></div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><p className="text-gray-500 font-medium">{t('statCollectors', 'Registered Collectors')}</p><h3 className="text-3xl font-black text-gray-800 mt-2">42</h3></div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><p className="text-gray-500 font-medium">{t('statPending', 'Pending Traceability')}</p><h3 className="text-3xl font-black text-gray-800 mt-2">18</h3></div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"><p className="text-gray-500 font-medium">{t('statValue', 'Value Disbursed')}</p><h3 className="text-3xl font-black text-gray-800 mt-2">₹14,500</h3></div>
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
                  <Bar dataKey="Cables" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('logsTitle', 'Live Verification Logs')}</h3>
            <div className="space-y-4">
              {[
                { id: 'LOT-8472', user: 'Arka Pal', status: 'Verified', time: '10 mins ago' },
                { id: 'LOT-9102', user: 'Suresh D.', status: 'Pending', time: '1 hr ago' },
                { id: 'LOT-3391', user: 'Amit K.', status: 'Verified', time: '2 hrs ago' },
                { id: 'LOT-7742', user: 'Rahul M.', status: 'Verified', time: '3 hrs ago' },
              ].map((log, i) => (
                <div key={i} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                  <div>
                    <p className="text-sm font-bold text-blue-600">#{log.id}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1"><User className="w-3 h-3"/> {log.user}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${log.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {log.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-600"/> {t('mapTitle', 'Live Recycler Fleet Routing')}
            </h3>
            <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight="0" 
                marginWidth="0" 
                src="https://www.openstreetmap.org/export/embed.html?bbox=88.25%2C22.45%2C88.45%2C22.65&layer=mapnik&marker=22.55%2C88.35">
              </iframe>
            </div>
        </div>
      </main>
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