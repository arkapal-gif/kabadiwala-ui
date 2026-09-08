import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Newspaper, MonitorSmartphone, Wrench, Recycle, MapPin, Plus, Minus, User, ShieldCheck, Truck, LogOut, Power, Phone, CheckCircle, XCircle, Navigation, TrendingUp, Users, AlertCircle, IndianRupee, Camera, CheckCircle2, Languages, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

// Global Language Toggler Helper
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
  
  const [weights, setWeights] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [photoUploaded, setPhotoUploaded] = useState(false);
  
  // Real GPS Location State
  const [locationName, setLocationName] = useState(t('location'));
  const [isLocating, setIsLocating] = useState(false);
  const [locationFound, setLocationFound] = useState(false);

  const categories = [
    { id: 'paper', name: t('paper'), icon: Newspaper, pricePerKg: 15 },
    { id: 'metal', name: t('metal'), icon: Wrench, pricePerKg: 30 },
    { id: 'plastic', name: t('plastic'), icon: Recycle, pricePerKg: 12 },
    { id: 'ewaste', name: t('ewaste'), icon: MonitorSmartphone, pricePerKg: 50 },
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

  // REAL GPS LOCATION FUNCTION
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationName("Not Supported");
      return;
    }
    
    setIsLocating(true);
    setLocationName("Locating...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Free reverse geocoding API to turn coordinates into a real address
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          
          // Extracts the local neighborhood, suburb, or city name
          const shortAddress = data.address.suburb || data.address.neighbourhood || data.address.city || data.address.town || `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
          
          setLocationName(shortAddress);
          setLocationFound(true);
        } catch (error) {
          setLocationName("GPS Found");
          setLocationFound(true);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        setLocationName("GPS Blocked");
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSchedulePickup = () => {
    const generatedId = Math.floor(Math.random() * 9000) + 1000;
    setBookingId(generatedId);

    const scrapList = Object.keys(weights).map(id => categories.find(c => c.id === id)?.name).join(', ');
    
    // Save the real fetched address, or fallback to GPS Request
    const finalAddress = locationFound ? locationName : "Live GPS Request";

    const newBooking = {
      id: generatedId,
      name: "New Web Booking",
      address: finalAddress,
      distance: "0.2 km",
      scrap: scrapList,
      estValue: `₹${totalEstimatedValue}`,
      time: "Just now"
    };

    const existingRequests = JSON.parse(localStorage.getItem('sih_scrap_requests') || '[]');
    localStorage.setItem('sih_scrap_requests', JSON.stringify([newBooking, ...existingRequests]));

    setBookingSuccess(true);
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
      
      <main className="max-w-md mx-auto mt-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200 relative">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">{t('bookPickup')}</h2>
          <p className="text-gray-500 text-sm mt-1 mb-6">{t('selectScrap')}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = !!weights[cat.id];
              return (
                <button key={cat.id} onClick={() => toggleScrap(cat.id)} className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${isSelected ? 'border-green-500 bg-green-50 text-green-700 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-green-200'}`}>
                  <Icon className="w-8 h-8 mb-2" />
                  <span className="font-semibold text-sm">{cat.name}</span>
                  <span className="text-xs mt-1 opacity-70">₹{cat.pricePerKg}/kg</span>
                </button>
              );
            })}
          </div>

          {hasSelection && (
            <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200 animate-in fade-in zoom-in duration-300">
              <h3 className="font-bold text-green-800 mb-3 text-left text-sm">{t('estWeight')}</h3>
              <div className="space-y-3 mb-4">
                {Object.entries(weights).map(([id, weight]) => {
                  const cat = categories.find(c => c.id === id);
                  return (
                    <div key={id} className="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm border border-green-100">
                      <span className="text-sm font-semibold text-gray-700">{cat.name} <span className="text-xs text-gray-400 block">₹{cat.pricePerKg}/kg</span></span>
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

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              
              {/* Functional Live GPS Button */}
              <button 
                onClick={handleGetLocation}
                disabled={isLocating || locationFound}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border font-medium text-sm transition-colors ${locationFound ? 'bg-green-100 border-green-300 text-green-700' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}`}
              >
                {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : locationFound ? <CheckCircle2 className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                <span className="truncate max-w-[100px]">{locationName}</span>
              </button>
              
              <label className={`flex items-center justify-center gap-2 p-3 rounded-lg border font-medium text-sm transition-colors cursor-pointer ${photoUploaded ? 'bg-green-100 border-green-300 text-green-700' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'}`}>
                {photoUploaded ? <CheckCircle2 className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
                {photoUploaded ? 'Photo Added' : t('addPhoto')}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { if (e.target.files && e.target.files.length > 0) setPhotoUploaded(true); }} />
              </label>
            </div>
            
            <button 
              onClick={handleSchedulePickup}
              disabled={!hasSelection} 
              className={`w-full p-4 rounded-lg font-bold text-white transition-all ${hasSelection ? 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              {hasSelection ? t('schedulePickup') : t('selectScrapBtn')}
            </button>
          </div>
        </div>
      </main>

      {bookingSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-800">{t('successTitle')}</h2>
            <p className="text-gray-500 mt-2 mb-6 text-sm">{t('successDesc')} <br/>Booking ID: <span className="font-bold text-gray-800">#BK-{bookingId}</span></p>
            
            <div className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100">
              <span className="text-sm font-bold text-blue-800 flex items-center justify-center gap-2">
                🌍 You saved {co2Saved} kg of CO2!
              </span>
            </div>

            <button 
              onClick={() => {
                setBookingSuccess(false);
                setWeights({});
                setPhotoUploaded(false);
                setLocationFound(false);
                setLocationName(t('location'));
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
  const [isOnline, setIsOnline] = useState(false);
  const [activePickup, setActivePickup] = useState(null);
  const [feedRequests, setFeedRequests] = useState([]);

  useEffect(() => {
    if (isOnline) {
      const liveData = JSON.parse(localStorage.getItem('sih_scrap_requests') || '[]');
      const mockData = [
        { id: 9991, name: "Student Hostel Block", address: "Near Heritage Institute of Technology", distance: "0.5 km", scrap: "Paper, Plastic", estValue: "₹180", time: "12 mins ago" },
        { id: 9992, name: "Tech Park Offices", address: "Sector V, Salt Lake", distance: "4.2 km", scrap: "E-Waste, Metal", estValue: "₹650", time: "1 hour ago" },
      ];
      setFeedRequests([...liveData, ...mockData]);
    }
  }, [isOnline]);

  const handleCompletePickup = () => setActivePickup(null);

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-10">
      <nav className="bg-orange-600 p-4 shadow-md flex justify-between items-center text-white">
        <h1 className="text-xl font-bold flex items-center gap-2">🚚 Kabadiwala Portal</h1>
        <button onClick={() => navigate('/')} className="flex items-center gap-1 bg-orange-700 px-3 py-1.5 rounded-md hover:bg-orange-800 text-sm font-semibold"><LogOut className="w-4 h-4" /> Logout</button>
      </nav>
      <main className="max-w-md mx-auto mt-6 p-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex justify-between items-center">
          <div><h2 className="font-bold text-gray-800 text-lg">Duty Status</h2><p className="text-sm text-gray-500">{isOnline ? 'Receiving pickup requests' : 'You are currently offline'}</p></div>
          <button onClick={() => setIsOnline(!isOnline)} className={`p-4 rounded-full text-white shadow-md transition-all ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}><Power className="w-6 h-6" /></button>
        </div>
        
        {!isOnline && !activePickup && (
          <div className="text-center py-12 px-6 bg-white rounded-xl border border-dashed border-gray-300">
            <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-500 font-medium">Go online to view nearby scrap pickups in your area.</h3>
          </div>
        )}

        {isOnline && !activePickup && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">Live Requests Near You</h3>
            {feedRequests.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No pending requests.</p>
            ) : (
              feedRequests.map(req => (
                <div key={req.id} className="bg-white p-4 rounded-xl shadow-sm border border-orange-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-md">{req.distance} away</span>
                      <h4 className="font-bold text-gray-800 mt-2">{req.address}</h4>
                      <p className="text-sm text-gray-500">{req.scrap} • {req.time}</p>
                    </div>
                    <div className="text-right"><span className="block text-lg font-black text-green-700">{req.estValue}</span><span className="text-xs text-gray-400">Estimated</span></div>
                  </div>
                  <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                    <button className="flex-1 py-2 text-gray-500 bg-gray-100 rounded-lg font-medium">Decline</button>
                    <button onClick={() => setActivePickup(req)} className="flex-1 py-2 text-white bg-orange-500 rounded-lg font-bold shadow-sm">Accept</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activePickup && (
          <div className="bg-white rounded-xl shadow-sm border border-orange-200 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-gray-200 h-48 w-full flex items-center justify-center"><Navigation className="w-8 h-8 text-blue-600 animate-bounce" /></div>
            <div className="p-5">
              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md mb-3 inline-block">Active Route</span>
              <h3 className="text-xl font-bold text-gray-800">{activePickup.name}</h3>
              <p className="text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-4 h-4"/> {activePickup.address}</p>
              <div className="grid grid-cols-2 gap-4 my-5 p-4 bg-orange-50 rounded-lg border border-orange-100">
                <div><span className="block text-xs text-gray-500 mb-1">Items to Collect</span><span className="font-semibold text-gray-800 text-sm">{activePickup.scrap}</span></div>
                <div><span className="block text-xs text-gray-500 mb-1">Cash to Pay</span><span className="font-bold text-green-700">{activePickup.estValue}</span></div>
              </div>
              <div className="space-y-3">
                <button className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-medium flex justify-center gap-2"><Phone className="w-5 h-5"/> Call Customer</button>
                <button onClick={handleCompletePickup} className="w-full py-4 bg-green-600 text-white rounded-lg font-bold shadow-md flex justify-center gap-2"><CheckCircle className="w-6 h-6"/> Confirm Collection</button>
              </div>
            </div>
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
        <button onClick={() => navigate('/')} className="flex items-center gap-1 bg-blue-900 px-3 py-1.5 rounded-md hover:bg-blue-950 text-sm font-semibold"><LogOut className="w-4 h-4" /> Logout</button>
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