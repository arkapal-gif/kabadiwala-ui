import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Newspaper, MonitorSmartphone, Wrench, Recycle, MapPin } from 'lucide-react';

function App() {
  // This state tracks which scrap categories the user has clicked
  const [selectedScrap, setSelectedScrap] = useState([]);

  // Function to add or remove a category when clicked
  const toggleScrap = (id) => {
    if (selectedScrap.includes(id)) {
      setSelectedScrap(selectedScrap.filter(item => item !== id));
    } else {
      setSelectedScrap([...selectedScrap, id]);
    }
  };

  // Our scrap category data
  const categories = [
    { id: 'paper', name: 'Paper', icon: Newspaper, price: '₹15/kg' },
    { id: 'metal', name: 'Metal', icon: Wrench, price: '₹30/kg' },
    { id: 'plastic', name: 'Plastic', icon: Recycle, price: '₹12/kg' },
    { id: 'ewaste', name: 'E-Waste', icon: MonitorSmartphone, price: '₹50/kg' },
  ];

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 font-sans">
        
        <nav className="bg-green-600 p-4 shadow-md flex justify-between items-center text-white">
          <h1 className="text-xl font-bold flex items-center gap-2">
            ♻️ Kabadiwala Connect
          </h1>
          <button className="bg-white text-green-700 px-3 py-1 rounded-md font-semibold text-sm hover:bg-gray-100">
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
                    const isSelected = selectedScrap.includes(cat.id);
                    
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
                        <span className="text-xs text-gray-500 mt-1">{cat.price}</span>
                      </button>
                    );
                  })}
                </div>

                {/* GPS and Submit Section */}
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 p-3 rounded-lg border border-gray-300 hover:bg-gray-200 transition-colors font-medium">
                    <MapPin className="w-5 h-5" />
                    Use Current Location
                  </button>
                  
                  <button 
                    disabled={selectedScrap.length === 0}
                    className={`w-full p-4 rounded-lg font-bold text-white transition-colors ${
                      selectedScrap.length > 0 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {selectedScrap.length > 0 ? 'Schedule Pickup' : 'Select Scrap to Continue'}
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