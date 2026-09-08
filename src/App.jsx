import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Newspaper, MonitorSmartphone, Wrench, Recycle, MapPin, Plus, Minus } from 'lucide-react';

function App() {
  // State now tracks the weight in kg for each selected item. Example: { paper: 2, metal: 5 }
  const [weights, setWeights] = useState({});

  const categories = [
    { id: 'paper', name: 'Paper', icon: Newspaper, pricePerKg: 15 },
    { id: 'metal', name: 'Metal', icon: Wrench, pricePerKg: 30 },
    { id: 'plastic', name: 'Plastic', icon: Recycle, pricePerKg: 12 },
    { id: 'ewaste', name: 'E-Waste', icon: MonitorSmartphone, pricePerKg: 50 },
  ];

  // Toggles the category on (default 1kg) or completely removes it
  const toggleScrap = (id) => {
    setWeights(prev => {
      const newWeights = { ...prev };
      if (newWeights[id]) {
        delete newWeights[id]; 
      } else {
        newWeights[id] = 1; 
      }
      return newWeights;
    });
  };

  // Increases or decreases the weight of a selected category
  const updateWeight = (id, delta) => {
    setWeights(prev => {
      const current = prev[id] || 0;
      const newWeight = Math.max(1, current + delta); // Prevents weight from dropping below 1kg
      return { ...prev, [id]: newWeight };
    });
  };

  // Calculates the real-time total payout
  const totalEstimatedValue = Object.entries(weights).reduce((total, [id, weight]) => {
    const cat = categories.find(c => c.id === id);
    return total + (cat ? cat.pricePerKg * weight : 0);
  }, 0);

  const hasSelection = Object.keys(weights).length > 0;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 font-sans pb-10">
        
        <nav className="bg-green-600 p-4 shadow-md flex justify-between items-center text-white">
          <h1 className="text-xl font-bold flex items-center gap-2">
            ♻️ Kabadiwala Connect
          </h1>
          <button className="bg-white text-green-700 px-3 py-1 rounded-md font-semibold text-sm hover:bg-gray-100 transition-colors">
            A / अ
          </button>
        </nav>

        <main className="max-w-md mx-auto mt-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <Routes>
            <Route path="/" element={
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Book a Scrap Pickup</h2>
                <p className="text-gray-500 text-sm mt-1 mb-6">Select scrap types to estimate value</p>
                
                {/* Interactive Scrap Selection Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = !!weights[cat.id];
                    
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleScrap(cat.id)}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${
                          isSelected 
                            ? 'border-green-500 bg-green-50 text-green-700' 
                            : 'border-gray-200 bg-white text-gray-600 hover:border-green-200'
                        }`}
                      >
                        <Icon className="w-8 h-8 mb-2" />
                        <span className="font-semibold text-sm">{cat.name}</span>
                        <span className="text-xs mt-1 opacity-70">₹{cat.pricePerKg}/kg</span>
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Price Estimator (Only visible if a category is selected) */}
                {hasSelection && (
                  <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200 animate-in fade-in zoom-in duration-300">
                    <h3 className="font-bold text-green-800 mb-3 text-left text-sm">Estimated Weight (kg)</h3>
                    
                    <div className="space-y-3 mb-4">
                      {Object.entries(weights).map(([id, weight]) => {
                        const cat = categories.find(c => c.id === id);
                        return (
                          <div key={id} className="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm border border-green-100">
                            <span className="text-sm font-semibold text-gray-700">
                              {cat.name} <span className="text-xs text-gray-400 font-normal block">₹{cat.pricePerKg} per kg</span>
                            </span>
                            <div className="flex items-center gap-3">
                              <button onClick={() => updateWeight(id, -1)} className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 text-gray-600 transition-colors">
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-6 text-center font-bold text-sm text-gray-800">{weight}</span>
                              <button onClick={() => updateWeight(id, 1)} className="p-1.5 bg-green-100 rounded-md hover:bg-green-200 text-green-700 transition-colors">
                                <Plus className="w-4 h-4" />
                              </button>
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

                {/* GPS and Submit Section */}
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 p-3 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors font-medium">
                    <MapPin className="w-5 h-5" />
                    Use Current Location
                  </button>
                  
                  <button 
                    disabled={!hasSelection}
                    className={`w-full p-4 rounded-lg font-bold text-white transition-colors ${
                      hasSelection 
                        ? 'bg-green-600 hover:bg-green-700 shadow-md' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {hasSelection ? 'Schedule Pickup' : 'Select Scrap to Continue'}
                  </button>
                </div>

              </div>
            } />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;