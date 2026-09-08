import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Newspaper, MonitorSmartphone, Wrench, Recycle, MapPin, Plus, Minus, User, ShieldCheck, Truck, LogOut, Power, Phone, CheckCircle, XCircle, Navigation, TrendingUp, Users, AlertCircle, IndianRupee, Camera, CheckCircle2, Languages, Loader2, Trophy, Leaf, Download, ArrowLeft, Image as ImageIcon, Package, AlertTriangle, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const toggle = () => {
    const langs = ['en', 'hi', 'bn'];
    const nextLang = langs[(langs.indexOf(i18n.language) + 1) % langs.length];
    i18n.changeLanguage(nextLang);
  };
  return (
    <button onClick={toggle} className="flex items-center gap-2 bg-white/20 text-white px-3 py-1.5 rounded-md font-semibold text-sm hover:bg-white/30 transition-colors">
      <Languages className="w-4 h-4" />
      {i18n.language.toUpperCase()}
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
      <div className="absolute top-4 right-4 bg-green-600 rounded-md"><LanguageToggle /></div>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-black text-green-700 mb-2">♻️ {t('appTitle')}</h1>
          <p className="text-gray-500">{t('selectPortal')}</p>
        </div>
        <div className="space-y-4">
          <button onClick={() => navigate('/citizen')} className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group">
            <div className="bg-green-100 p-3 rounded-lg text-green-600 group-hover:bg-green-200 transition-colors"><User className="w-6 h-6" /></div>
            <div className="ml-4 text-left"><h3 className="font-bold text-gray-800">{t('citizen')}</h3><p className="text-sm text-gray-500">{t('citizenDesc')}</p></div>
          </button>
          <button onClick={() => navigate('/kabadiwala')} className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group">
            <div className="bg-orange-100 p-3 rounded-lg text-orange-600 group-hover:bg-orange-200 transition-colors"><Truck className="w-6 h-6" /></div>
            <div className="ml-4 text-left"><h3 className="font-bold text-gray-800">{t('kabadiwala')}</h3><p className="text-sm text-gray-500">{t('kabadiwalaDesc')}</p></div>
          </button>
          <button onClick={() => navigate('/admin')} className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors"><ShieldCheck className="w-6 h-6" /></div>
            <div className="ml-4 text-left"><h3 className="font-bold text-gray-800">{t('admin')}</h3><p className="text-sm text-gray-500">{t('adminDesc')}</p></div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. CITIZEN PORTAL
// ==========================================
function CitizenPortal() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [step, setStep] = useState(1);
  const [weights, setWeights] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [pointsEarnedThisSession, setPointsEarnedThisSession] = useState(0);
  
  const [name, setName] = useState("Arka Pal");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [photoData, setPhotoData] = useState(null); 
  
  const [isLocating, setIsLocating] = useState(false);
  const [myPoints, setMyPoints] = useState(() => parseInt(localStorage.getItem('sih_green_points') || '1250'));

  // Extended Categories with Groups
  const categories = [
    { id: 'organic', name: t('organic'), icon: Leaf, pricePerKg: 2, group: 'biodegradable' },
    { id: 'paper', name: t('paper'), icon: Newspaper, pricePerKg: 15, group: 'nonBiodegradable' },
    { id: 'plastic', name: t('plastic'), icon: Recycle, pricePerKg: 12, group: 'nonBiodegradable' },
    { id: 'metal', name: t('metal'), icon: Wrench, pricePerKg: 30, group: 'nonBiodegradable' },
    { id: 'ewaste', name: t('ewaste'), icon: MonitorSmartphone, pricePerKg: 50, group: 'specialized' },
    { id: 'bulky', name: t('bulky'), icon: Package, pricePerKg: 5, group: 'specialized' },
    { id: 'hazardous', name: t('hazardous'), icon: AlertTriangle, pricePerKg: 0, group: 'specialized' },
    { id: 'medical', name: t('medical'), icon: Activity, pricePerKg: 0, group: 'specialized' },
  ];

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
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const preciseAddress = data.display_name || data.address.suburb || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setAddress(preciseAddress);
        } catch (error) {
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
    
    setPointsEarnedThisSession(earned);
    setMyPoints(newTotal);
    localStorage.setItem('sih_green_points', newTotal.toString());

    const newBooking = {
      id: generatedId,
      name: name,
      phone: phone,
      address: address,
      distance: "0.2 km",
      scrap: scrapList,
      estValue: `₹${totalEstimatedValue}`,
      time: "Just now",
      hasPhoto: photoUploaded,
      photoData: photoData 
    };

    try {
      const existingRequests = JSON.parse(localStorage.getItem('sih_scrap_requests') || '[]');
      localStorage.setItem('sih_scrap_requests', JSON.stringify([newBooking, ...existingRequests]));
    } catch (err) {
      console.error("Storage quota exceeded.");
    }

    setBookingSuccess(true);
  };

  const sortedLeaderboard = [
    { name: "Arka Pal (You)", points: myPoints, isUser: true },
    { name: "Priyadarshini Mazumder", points: 1380, isUser: false },
    { name: "Anup Kumar Majhi", points: 850, isUser: false },
    { name: "Tathagata Das", points: 720, isUser: false },
    { name: "Niloy Banik", points: 690, isUser: false },
    { name: "Aniket Ghosh", points: 210, isUser: false }
  ].sort((a, b) => b.points - a.points);

  // Helper to render category sections
  const renderCategoryGroup = (groupKey, groupTitleKey) => {
    const groupItems = categories.filter(c => c.group === groupKey);
    if (groupItems.length === 0) return null;
    
    return (
      <div key={groupKey} className="mb-6">
        <h3 className="text-left font-bold text-gray-700 text-sm mb-3 border-b border-gray-100 pb-2">{t(groupTitleKey)}</h3>
        <div className="grid grid-cols-2 gap-4">
          {groupItems.map((cat) => {
            const Icon = cat.icon;
            const isSelected = !!weights[cat.id];
            return (
              <button key={cat.id} onClick={() => toggleScrap(cat.id)} className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${isSelected ? 'border-green-500 bg-green-50 text-green-700 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-green-200'}`}>
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
        <h1 className="text-xl font-bold flex items-center gap-2">♻️ {t('citizenTitle')}</h1>
        <div className="flex gap-2">
          <LanguageToggle />
          <button onClick={() => navigate('/')} className="flex items-center gap-1 bg-green-700 px-3 py-1.5 rounded-md hover:bg-green-800 text-sm font-semibold"><LogOut className="w-4 h-4" /> {t('logout')}</button>
        </div>
      </nav>
      
      <main className="max-w-md mx-auto mt-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
        
        {/* STEP 1 */}
        <div className={`transition-all duration-300 ${step === 1 ? 'block opacity-100' : 'hidden opacity-0'}`}>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">{t('bookPickup')}</h2>
            <p className="text-gray-500 text-sm mt-1 mb-6 font-semibold text-green-700">{t('selectScrap')}</p>
            
            {renderCategoryGroup('biodegradable', 'cat_biodegradable')}
            {renderCategoryGroup('nonBiodegradable', 'cat_nonBiodegradable')}
            {renderCategoryGroup('specialized', 'cat_specialized')}

            {hasSelection && (
              <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200 animate-in fade-in zoom-in duration-300">
                <h3 className="font-bold text-green-800 mb-3 text-left text-sm">{t('estWeight')}</h3>
                <div className="space-y-3 mb-4">
                  {Object.entries(weights).map(([id, weight]) => {
                    const cat = categories.find(c => c.id === id);
                    return (
                      <div key={id} className="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm border border-green-100">
                        <span className="text-sm font-semibold text-gray-700 flex-1">{cat.name} <span className="text-xs text-gray-400 block">{cat.pricePerKg > 0 ? `₹${cat.pricePerKg}/kg` : '-'}</span></span>
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
                  <span className="font-bold text-gray-600 text-sm">{t('totalValue')}</span>
                  <span className="text-2xl font-black text-green-700">₹{totalEstimatedValue}</span>
                </div>
              </div>
            )}

            <button 
              onClick={() => setStep(2)}
              disabled={!hasSelection} 
              className={`w-full p-4 rounded-lg font-bold text-white transition-all ${hasSelection ? 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              {hasSelection ? t('nextStep') : t('selectScrapBtn')}
            </button>
          </div>
        </div>

        {/* STEP 2 */}
        <div className={`transition-all duration-300 ${step === 2 ? 'block opacity-100 animate-in slide-in-from-right-4' : 'hidden opacity-0'}`}>
          <div className="flex items-center mb-6">
            <button onClick={() => setStep(1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 mr-3"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
            <h2 className="text-xl font-bold text-gray-800">{t('personalDetails')}</h2>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('fullName')}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50" placeholder="E.g. Arka Pal" />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('mobileNumber')}</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50" placeholder="+91" />
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-sm font-semibold text-gray-700">{t('exactAddress')}</label>
                <button onClick={handleGetLocation} className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded hover:bg-green-100 flex items-center gap-1">
                  {isLocating ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />} {t('getGps')}
                </button>
              </div>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-sm min-h-[80px]" placeholder="Flat, Building, Street..."></textarea>
            </div>

            <div>
              <label className={`w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed font-bold transition-colors cursor-pointer ${photoUploaded ? 'bg-green-50 border-green-500 text-green-700' : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'}`}>
                {photoUploaded ? <CheckCircle2 className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                {photoUploaded ? 'Waste Photo Attached' : t('addPhoto')}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
          </div>

          <button 
            onClick={handleSchedulePickup}
            disabled={!isFormComplete} 
            className={`w-full p-4 rounded-lg font-bold text-white transition-all ${isFormComplete ? 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            {isFormComplete ? t('schedulePickup') : t('fillDetailsBtn')}
          </button>
        </div>
      </main>

      <div className="max-w-md mx-auto mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white flex justify-between items-center">
          <div>
            <h3 className="font-black flex items-center gap-2 text-lg"><Trophy className="w-5 h-5 text-yellow-300"/> {t('ecoWarriors')}</h3>
            <p className="text-xs text-green-100 mt-1">{t('topRecyclers')}</p>
          </div>
          <div className="text-right">
            <span className="block text-2xl font-black text-yellow-300">{myPoints}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">{t('myPoints')}</span>
          </div>
        </div>
        <div className="p-2 bg-gray-50">
          {sortedLeaderboard.map((user, index) => (
            <div key={index} className={`flex items-center justify-between p-3 rounded-lg mb-1 transition-all ${user.isUser ? 'bg-green-100 border border-green-200 shadow-sm scale-[1.02]' : 'hover:bg-white border border-transparent'}`}>
              <div className="flex items-center gap-3">
                <span className={`font-black w-6 text-center ${index === 0 ? 'text-yellow-500 text-lg' : index === 1 ? 'text-gray-400 text-base' : index === 2 ? 'text-amber-600 text-base' : 'text-gray-400 text-sm'}`}>
                  #{index + 1}
                </span>
                <span className={`font-bold text-sm ${user.isUser ? 'text-green-900' : 'text-gray-700'}`}>{user.name}</span>
              </div>
              <span className="font-black text-green-700 bg-white px-2 py-1 rounded-md text-xs shadow-sm flex items-center gap-1">
                {user.points} <Leaf className="w-3 h-3"/>
              </span>
            </div>
          ))}
        </div>
        
        {myPoints >= 1000 && (
          <div className="p-5 bg-gradient-to-b from-green-50 to-green-100 border-t border-green-200 text-center">
            <p className="text-sm text-green-800 font-bold mb-3">{t('goldTier')}</p>
            <button 
              onClick={() => alert(`Generating Official SIH Eco-Certificate for ${sortedLeaderboard.find(u => u.isUser).name}...\n\n(This would trigger a PDF download in production)`)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-black py-3 rounded-xl shadow-md hover:shadow-lg hover:from-yellow-500 hover:to-amber-600 transition-all"
            >
              <Download className="w-5 h-5" />
              {t('downloadCert')}
            </button>
          </div>
        )}
      </div>

      {bookingSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-800">{t('successTitle')}</h2>
            <p className="text-gray-500 mt-2 mb-6 text-sm">{t('successDesc')} <br/>Booking ID: <span className="font-bold text-gray-800">#BK-{bookingId}</span></p>
            
            <div className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100">
              <span className="text-sm font-bold text-blue-800 flex items-center justify-center gap-2 mb-1">
                🌍 You saved {co2Saved} kg of CO2!
              </span>
              <span className="text-sm font-bold text-green-700 flex items-center justify-center gap-2">
                🏆 +{pointsEarnedThisSession} Green Points
              </span>
            </div>

            <button 
              onClick={() => {
                setBookingSuccess(false);
                setWeights({});
                setPhotoUploaded(false);
                setPhotoData(null);
                setAddress("");
                setPhone("");
                setStep(1); 
              }} 
              className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors"
            >
              {t('backHome')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. KABADIWALA PORTAL
// ==========================================
function KabadiwalaPortal() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(false);
  const [activePickup, setActivePickup] = useState(null);
  const [feedRequests, setFeedRequests] = useState([]);
  const [viewingPhoto, setViewingPhoto] = useState(null); 

  useEffect(() => {
    if (isOnline) {
      const liveData = JSON.parse(localStorage.getItem('sih_scrap_requests') || '[]');
      const mockData = [
        { id: 9991, name: "Hostel Block C", phone: "+91 9876543210", address: "Near Heritage Institute", distance: `0.5 km ${t('away')}`, scrap: `${t('paper')}, ${t('plastic')}`, estValue: "₹180", time: "12 mins ago", hasPhoto: true, photoData: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=500&q=80" },
        { id: 9992, name: "Tech Park Offices", phone: "+91 8765432109", address: "Sector V, Salt Lake", distance: `4.2 km ${t('away')}`, scrap: `${t('ewaste')}, ${t('metal')}`, estValue: "₹650", time: "1 hour ago", hasPhoto: false },
      ];
      setFeedRequests([...liveData, ...mockData]);
    }
  }, [isOnline, t]);

  const handleDecline = (id) => {
    setFeedRequests(prev => prev.filter(req => req.id !== id));
    const existing = JSON.parse(localStorage.getItem('sih_scrap_requests') || '[]');
    const updated = existing.filter(req => req.id !== id);
    localStorage.setItem('sih_scrap_requests', JSON.stringify(updated));
  };

  const handleCompletePickup = () => {
    if (activePickup) handleDecline(activePickup.id);
    setActivePickup(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-10">
      <nav className="bg-orange-600 p-4 shadow-md flex justify-between items-center text-white">
        <h1 className="text-xl font-bold flex items-center gap-2">🚚 {t('kabadiwalaTitle')}</h1>
        <div className="flex gap-2">
          <LanguageToggle />
          <button onClick={() => navigate('/')} className="flex items-center gap-1 bg-orange-700 px-3 py-1.5 rounded-md hover:bg-orange-800 text-sm font-semibold"><LogOut className="w-4 h-4" /> {t('logout')}</button>
        </div>
      </nav>
      
      <main className="max-w-md mx-auto mt-6 p-4 relative">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">{t('dutyStatus')}</h2>
            <p className="text-sm text-gray-500">{isOnline ? t('onlineMsg') : t('offlineMsg')}</p>
          </div>
          <button onClick={() => setIsOnline(!isOnline)} className={`p-4 rounded-full text-white shadow-md transition-all ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}><Power className="w-6 h-6" /></button>
        </div>
        
        {!isOnline && !activePickup && (
          <div className="text-center py-12 px-6 bg-white rounded-xl border border-dashed border-gray-300">
            <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-500 font-medium">{t('goOnlineMsg')}</h3>
          </div>
        )}

        {isOnline && !activePickup && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">{t('liveRequests')}</h3>
            {feedRequests.length === 0 ? (
              <p className="text-center text-gray-500 py-4">{t('noRequests')}</p>
            ) : (
              feedRequests.map(req => (
                <div key={req.id} className="bg-white p-4 rounded-xl shadow-sm border border-orange-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-md">{req.distance || "Nearby"}</span>
                      <h4 className="font-bold text-gray-800 mt-2">{req.name}</h4>
                      {req.phone && <p className="text-xs font-bold text-gray-600 flex items-center gap-1 mt-1"><Phone className="w-3 h-3"/> {req.phone}</p>}
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3 min-w-[12px]"/> <span className="truncate max-w-[200px]">{req.address}</span></p>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">{req.scrap}</span>
                        {req.hasPhoto && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); setViewingPhoto(req.photoData || "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=500&q=80"); }}
                            className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded flex items-center gap-1 hover:bg-blue-100 transition-colors"
                          >
                            <ImageIcon className="w-3 h-3"/> Photo
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-lg font-black text-green-700">{req.estValue}</span>
                      <span className="text-xs text-gray-400">{t('estimated')}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                    <button onClick={() => handleDecline(req.id)} className="flex-1 py-2 text-gray-500 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors">{t('decline')}</button>
                    <button onClick={() => setActivePickup(req)} className="flex-1 py-2 text-white bg-orange-500 rounded-lg font-bold shadow-sm hover:bg-orange-600 transition-colors">{t('accept')}</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activePickup && (
          <div className="bg-white rounded-xl shadow-sm border border-orange-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-gray-200 h-48 w-full flex items-center justify-center relative">
              {activePickup.hasPhoto && (
                <button 
                  onClick={() => setViewingPhoto(activePickup.photoData || "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=500&q=80")}
                  className="absolute top-2 right-2 bg-black/70 text-white text-xs px-3 py-2 rounded-lg flex items-center gap-1 hover:bg-black/90 transition-colors shadow-lg z-10"
                >
                  <ImageIcon className="w-4 h-4"/> View Waste Photo
                </button>
              )}
              <Navigation className="w-8 h-8 text-blue-600 animate-bounce" />
            </div>
            <div className="p-5">
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md mb-3 inline-block">{t('activeRoute')}</span>
              <h3 className="text-xl font-bold text-gray-800">{activePickup.name}</h3>
              <p className="text-gray-500 flex items-center gap-1 mt-1 text-sm"><MapPin className="w-4 h-4"/> {activePickup.address}</p>
              
              <div className="grid grid-cols-2 gap-4 my-5 p-4 bg-orange-50 rounded-lg border border-orange-100">
                <div>
                  <span className="block text-xs text-gray-500 mb-1">{t('itemsToCollect')}</span>
                  <span className="font-semibold text-gray-800 text-sm">{activePickup.scrap}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 mb-1">{t('cashToPay')}</span>
                  <span className="font-bold text-green-700">{activePickup.estValue}</span>
                </div>
              </div>
              <div className="space-y-3">
                <a href={`tel:${activePickup.phone || ''}`} className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium flex justify-center gap-2 hover:bg-gray-200 transition-colors">
                  <Phone className="w-5 h-5"/> {t('callCustomer')}
                </a>
                <button onClick={handleCompletePickup} className="w-full py-4 bg-green-600 text-white rounded-lg font-bold shadow-md flex justify-center gap-2 hover:bg-green-700 transition-colors">
                  <CheckCircle className="w-6 h-6"/> {t('confirmCollection')}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {viewingPhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <button onClick={() => setViewingPhoto(null)} className="absolute top-4 right-4 text-white/70 hover:text-white p-2">
            <XCircle className="w-8 h-8" />
          </button>
          <img src={viewingPhoto} className="max-w-full max-h-[80vh] rounded-lg shadow-2xl object-contain border-2 border-white/10" alt="Waste Evidence" />
          <p className="text-white/80 mt-4 font-semibold text-sm">Waste Photo Evidence</p>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. ADMIN DASHBOARD
// ==========================================
function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const weeklyCollectionData = [
    { day: 'Mon', Paper: 120, Plastic: 80, Metal: 40, EWaste: 20 },
    { day: 'Tue', Paper: 132, Plastic: 90, Metal: 45, EWaste: 35 },
    { day: 'Wed', Paper: 101, Plastic: 70, Metal: 55, EWaste: 15 },
    { day: 'Thu', Paper: 143, Plastic: 110, Metal: 60, EWaste: 25 },
    { day: 'Fri', Paper: 90, Plastic: 60, Metal: 30, EWaste: 10 },
    { day: 'Sat', Paper: 210, Plastic: 150, Metal: 90, EWaste: 60 },
    { day: 'Sun', Paper: 180, Plastic: 130, Metal: 85, EWaste: 45 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      <nav className="bg-blue-800 p-4 shadow-md flex justify-between items-center text-white">
        <h1 className="text-xl font-bold flex items-center gap-2">📊 Municipality Command Center</h1>
        <div className="flex gap-2">
          <LanguageToggle />
          <button onClick={() => navigate('/')} className="flex items-center gap-1 bg-blue-900 px-3 py-1.5 rounded-md hover:bg-blue-950 text-sm font-semibold"><LogOut className="w-4 h-4" /> Logout</button>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto mt-8 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start"><p className="text-gray-500 font-medium">Total Scrap (Today)</p><TrendingUp className="w-5 h-5 text-green-500"/></div>
            <h3 className="text-3xl font-black text-gray-800 mt-2">1,240 <span className="text-lg font-medium text-gray-400">kg</span></h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start"><p className="text-gray-500 font-medium">Active Collectors</p><Users className="w-5 h-5 text-blue-500"/></div>
            <h3 className="text-3xl font-black text-gray-800 mt-2">42</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start"><p className="text-gray-500 font-medium">Pending Pickups</p><AlertCircle className="w-5 h-5 text-orange-500"/></div>
            <h3 className="text-3xl font-black text-gray-800 mt-2">18</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start"><p className="text-gray-500 font-medium">Value Disbursed</p><IndianRupee className="w-5 h-5 text-purple-500"/></div>
            <h3 className="text-3xl font-black text-gray-800 mt-2">₹14,500</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-6 text-lg">Weekly Collection Volume by Category</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyCollectionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Legend iconType="circle" />
                  <Bar dataKey="Paper" stackId="a" fill="#3B82F6" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="Plastic" stackId="a" fill="#10B981" />
                  <Bar dataKey="Metal" stackId="a" fill="#F59E0B" />
                  <Bar dataKey="EWaste" stackId="a" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">Live Dispatch Logs</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <div><p className="font-semibold text-gray-800 text-sm">#BK-9021</p><p className="text-xs text-gray-500">Hostel Block C</p></div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">Completed</span>
              </div>
              <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <div><p className="font-semibold text-gray-800 text-sm">#BK-9022</p><p className="text-xs text-gray-500">Salt Lake Sector V</p></div>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-md">En Route</span>
              </div>
              <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <div><p className="font-semibold text-gray-800 text-sm">#BK-9023</p><p className="text-xs text-gray-500">Tech Park Entry</p></div>
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-md">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// 5. MAIN ROUTER
// ==========================================
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