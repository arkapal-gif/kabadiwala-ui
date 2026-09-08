import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Newspaper, MonitorSmartphone, Wrench, Recycle, MapPin, Plus, Minus, User, ShieldCheck, Truck, LogOut } from 'lucide-react';

// ==========================================
// 1. LOGIN SCREEN
// ==========================================
function LoginScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-black text-green-700 mb-2">♻️ Kabadiwala Connect</h1>
          <p className="text-gray-500">Select your portal to continue</p>
        </div>

        <div className="space-y-4">
          <button onClick={() => navigate('/citizen')} className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group">
            <div className="bg-green-100 p-3 rounded-lg text-green-600 group-hover:bg-green-200 transition-colors">
              <User className="w-6 h-6" />
            </div>
            <div className="ml-4 text-left">
              <h3 className="font-bold text-gray-800">Citizen</h3>
              <p className="text-sm text-gray-500">Book a scrap pickup</p>
            </div>
          </button>

          <button onClick={() => navigate('/kabadiwala')} className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group">
            <div className="bg-orange-100 p-3 rounded-lg text-orange-600 group-hover:bg-orange-200 transition-colors">
              <Truck className="w-6 h-6" />
            </div>
            <div className="ml-4 text-left">
              <h3 className="font-bold text-gray-800">Kabadiwala</h3>
              <p className="text-sm text-gray-500">Accept nearby requests</p>
            </div>
          </button>

          <button onClick={() => navigate('/admin')} className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="ml-4 text-left">
              <h3 className="font-bold text-gray-800">Municipality Admin</h3>
              <p className="text-sm text-gray-500">Manage rates & track data</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. CITIZEN PORTAL (The code you just built)
// ==========================================
function CitizenPortal() {
  const navigate = useNavigate();
  const [weights, setWeights] = useState({});

  const categories = [
    { id: 'paper', name: 'Paper', icon: Newspaper, pricePerKg: 15 },
    { id: 'metal', name: 'Metal', icon: Wrench, pricePerKg: 30 },
    { id: 'plastic', name: 'Plastic', icon: Recycle, pricePerKg: 12 },
    { id: 'ewaste', name: 'E-Waste', icon: MonitorSmartphone, pricePerKg: 50 },
  ];

  const toggleScrap = (id) => {
    setWeights(prev => {
      const newWeights = { ...prev };
      if (newWeights[id]) delete newWeights[id];
      else newWeights[id] = 1;
      return newWeights;
    });
  };

  const updateWeight = (id, delta) => {
    setWeights(prev => {
      const current = prev[id] || 0;
      return { ...prev, [id]: Math.max(1, current + delta) };
    });
  };

  const totalEstimatedValue = Object.entries(weights).reduce((total, [id, weight]) => {
    const cat = categories.find(c => c.id === id);
    return total + (cat ? cat.pricePerKg * weight : 0);
  }, 0);

  const hasSelection = Object.keys(weights).length > 0;

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-10">
      <nav className="bg-green-600 p-4 shadow-md flex justify-between items-center text-white">
        <h1 className="text-xl font-bold flex items-center gap-2">♻️ Citizen Portal</h1>
        <button onClick={() => navigate('/')} className="flex items-center gap-1 bg-green-700 px-3 py-1.5 rounded-md hover:bg-green-800 text-sm font-semibold">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </nav>

      <main className="max-w-md mx-auto mt-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Book a Scrap Pickup</h2>
          <p className="text-gray-500 text-sm mt-1 mb-6">Select scrap types to estimate value</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = !!weights[cat.id];
              return (
                <button key={cat.id} onClick={() => toggleScrap(cat.id)} className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${isSelected ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-600 hover:border-green-200'}`}>
                  <Icon className="w-8 h-8 mb-2" />
                  <span className="font-semibold text-sm">{cat.name}</span>
                  <span className="text-xs mt-1 opacity-70">₹{cat.pricePerKg}/kg</span>
                </button>
              );
            })}
          </div>

          {hasSelection && (
            <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
              <h3 className="font-bold text-green-800 mb-3 text-left text-sm">Estimated Weight (kg)</h3>
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
                <span className="font-bold text-gray-600 text-sm">Total Value:</span>
                <span className="text-2xl font-black text-green-700">₹{totalEstimatedValue}</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 p-3 rounded-lg border border-gray-300 hover:bg-gray-200 font-medium"><MapPin className="w-5 h-5" /> Use Current Location</button>
            <button disabled={!hasSelection} className={`w-full p-4 rounded-lg font-bold text-white ${hasSelection ? 'bg-green-600 hover:bg-green-700 shadow-md' : 'bg-gray-400 cursor-not-allowed'}`}>
              {hasSelection ? 'Schedule Pickup' : 'Select Scrap to Continue'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// ==========================================
// 3. KABADIWALA PORTAL (Placeholder)
// ==========================================
function KabadiwalaPortal() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-orange-50 p-6 flex flex-col items-center justify-center">
      <Truck className="w-16 h-16 text-orange-500 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800">Kabadiwala Dashboard</h1>
      <p className="text-gray-500 mb-6">Live tracking and request feed will go here.</p>
      <button onClick={() => navigate('/')} className="bg-orange-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-700">Return to Login</button>
    </div>
  );
}

// ==========================================
// 4. ADMIN DASHBOARD (Placeholder)
// ==========================================
function AdminDashboard() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-blue-50 p-6 flex flex-col items-center justify-center">
      <ShieldCheck className="w-16 h-16 text-blue-500 mb-4" />
      <h1 className="text-2xl font-bold text-gray-800">Municipality Admin</h1>
      <p className="text-gray-500 mb-6">Charts, heatmaps, and pricing controls will go here.</p>
      <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Return to Login</button>
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