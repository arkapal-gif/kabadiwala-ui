import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// ADDED MISSING ICONS: Lock, Radio, Clock, LocateFixed 
import { 
  Newspaper, MonitorSmartphone, Wrench, Recycle, MapPin, Plus, Minus, 
  User, ShieldCheck, Truck, LogOut, Power, Phone, CheckCircle, XCircle, 
  Navigation, TrendingUp, Users, AlertCircle, IndianRupee, Camera, 
  CheckCircle2, Languages, Loader2, Trophy, Leaf, Download, ArrowLeft, 
  Image as ImageIcon, Lock, Radio, Clock, LocateFixed 
} from 'lucide-react';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

// BULLETPROOF MEMORY PARSERS
const safeGetRequests = () => {
  try { const item = localStorage.getItem('sih_scrap_requests'); return item ? JSON.parse(item) : []; } 
  catch (e) { return []; }
};

const defaultPrices = { organic: 2, paper: 15, plastic: 12, metal: 30, ewaste: 50, bulky: 5, hazardous: 0, medical: 0 };
const safeGetPrices = () => {
  try { const item = localStorage.getItem('sih_scrap_prices'); return item ? { ...defaultPrices, ...JSON.parse(item) } : defaultPrices; } 
  catch (e) { return defaultPrices; }
};

// WEST BENGAL MUNICIPALITIES DATABASE
const wbMunicipalities = [
  { id: 'asansol', name: 'Asansol Municipal Corporation', lat: 23.6739, lng: 86.9524 },
  { id: 'berhampore', name: 'Berhampore Municipality', lat: 24.0988, lng: 88.2679 },
  { id: 'bidhannagar', name: 'Bidhannagar Municipal Corporation', lat: 22.5862, lng: 88.4115 },
  { id: 'durgapur', name: 'Durgapur Municipal Corporation', lat: 23.5204, lng: 87.3119 },
  { id: 'haldia', name: 'Haldia Municipality', lat: 22.0667, lng: 88.0698 },
  { id: 'howrah', name: 'Howrah Municipal Corporation', lat: 22.5958, lng: 88.3110 },
  { id: 'kharagpur', name: 'Kharagpur Municipality', lat: 22.3302, lng: 87.3237 },
  { id: 'kolkata', name: 'Kolkata Municipal Corporation', lat: 22.5726, lng: 88.3639 },
  { id: 'malda', name: 'Malda Municipality', lat: 25.0108, lng: 88.1411 },
  { id: 'nabadwip', name: 'Nabadwip Municipality', lat: 23.4033, lng: 88.3659 },
  { id: 'siliguri', name: 'Siliguri Municipal Corporation', lat: 26.7271, lng: 88.3953 }
].sort((a, b) => a.name.localeCompare(b.name));

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
      {(i18n.language || 'en').toUpperCase()}
    </button>
  );
};

// ==========================================
// ADMIN DASHBOARD LIVE MAP COMPONENT
// ==========================================
function AdminLiveMap({ onUpdateStats }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const loadLeaflet = () => {
      return new Promise((resolve) => {
        if (window.L) return resolve(window.L);
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link'); link.id = 'leaflet-css'; link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
        }
        if (!document.getElementById('leaflet-js')) {
          const script = document.createElement('script'); script.id = 'leaflet-js'; script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.onload = () => resolve(window.L); document.head.appendChild(script);
        } else {
          const interval = setInterval(() => { if (window.L) { clearInterval(interval); resolve(window.L); } }, 100);
        }
      });
    };

    loadLeaflet().then((L) => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const baseLat = parseFloat(localStorage.getItem('admin_municipality_lat')) || 23.4033;
      const baseLng = parseFloat(localStorage.getItem('admin_municipality_lng')) || 88.3659;

      const map = L.map(mapContainerRef.current, { zoomControl: false, attributionControl: false }).setView([baseLat, baseLng], 14);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);
      L.control.zoom({ position: 'topright' }).addTo(map);

      const kabadiwalaIcon = L.divIcon({
        className: 'admin-kaba-marker',
        html: `<div class="relative flex items-center justify-center"><span class="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-orange-400 opacity-75"></span><div class="relative bg-orange-600 p-1.5 rounded-full shadow-lg border-2 border-white z-10"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-4v10"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg></div></div>`,
        iconSize: [28, 28], iconAnchor: [14, 14]
      });

      const citizenIcon = L.divIcon({
        className: 'admin-citizen-marker',
        html: `<div class="bg-red-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
        iconSize: [28, 28], iconAnchor: [14, 14]
      });

      let liveRequests = safeGetRequests();
      if (liveRequests.length === 0) {
        liveRequests = [
          { name: "S. Banerjee", scrap: "Paper, Plastic", coords: [baseLat + 0.002, baseLng - 0.004] },
          { name: "R. Chatterjee", scrap: "Metal, E-Waste", coords: [baseLat - 0.003, baseLng - 0.006] },
          { name: "P. Das", scrap: "Organic", coords: [baseLat + 0.005, baseLng - 0.003] },
          { name: "A. Ghosh", scrap: "Bulky Waste", coords: [baseLat + 0.001, baseLng - 0.008] }
        ];
      }

      const totalKabadiwalas = 12;
      if (onUpdateStats) onUpdateStats(liveRequests.length, totalKabadiwalas);

      const bounds = [];
      const animatedFleet = [];
      
      liveRequests.forEach((req) => {
        const cLat = req.coords ? req.coords[0] : baseLat + (Math.random() - 0.5) * 0.04;
        const cLng = req.coords ? req.coords[1] : baseLng - (Math.random() * 0.03); 
        bounds.push([cLat, cLng]);
        L.marker([cLat, cLng], { icon: citizenIcon }).addTo(map).bindPopup(`<b>${req.name}</b><br/>${req.scrap}`);
        req.plottedCoords = [cLat, cLng];
      });

      for(let i=0; i<totalKabadiwalas; i++) {
        const startLat = baseLat + (Math.random() - 0.5) * 0.06;
        const startLng = baseLng - (Math.random() * 0.05); 
        bounds.push([startLat, startLng]);
        const kMarker = L.marker([startLat, startLng], { icon: kabadiwalaIcon }).addTo(map);

        if (i < liveRequests.length) {
          const destLat = liveRequests[i].plottedCoords[0];
          const destLng = liveRequests[i].plottedCoords[1];
          const routeLine = L.polyline([[startLat, startLng], [destLat, destLng]], {
            color: '#f97316', weight: 3, opacity: 0.8, dashArray: '6, 8', lineJoin: 'round'
          }).addTo(map);
          animatedFleet.push({ marker: kMarker, line: routeLine, start: [startLat, startLng], dest: [destLat, destLng], progress: Math.random() * 0.5, isAssigned: true });
        } else {
          animatedFleet.push({ marker: kMarker, lat: startLat, lng: startLng, isAssigned: false });
        }
      }

      if (bounds.length > 0) map.fitBounds(bounds, { padding: [40, 40] });

      const animationInterval = setInterval(() => {
        animatedFleet.forEach(fleet => {
          if (fleet.isAssigned) {
            fleet.progress += 0.002;
            if (fleet.progress >= 1) fleet.progress = 0;
            const currentLat = fleet.start[0] + (fleet.dest[0] - fleet.start[0]) * fleet.progress;
            const currentLng = fleet.start[1] + (fleet.dest[1] - fleet.start[1]) * fleet.progress;
            fleet.marker.setLatLng([currentLat, currentLng]);
            fleet.line.setLatLngs([[currentLat, currentLng], fleet.dest]);
          } else {
            fleet.lat += (Math.random() - 0.5) * 0.0004;
            fleet.lng += (Math.random() - 0.5) * 0.0004;
            fleet.marker.setLatLng([fleet.lat, fleet.lng]);
          }
        });
      }, 100);

      mapInstanceRef.current = map;
      return () => { clearInterval(animationInterval); map.remove(); mapInstanceRef.current = null; };
    });
  }, [onUpdateStats]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="font-bold text-gray-800 flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-600"/> {t('liveMapTitle', 'Live Area Map')}</h3>
        <div className="flex gap-4 text-xs font-bold">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-sm"></span> Citizens (Pending)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500 border-2 border-white shadow-sm animate-pulse"></span> Kabadiwalas (Active)</span>
        </div>
      </div>
      <div ref={mapContainerRef} className="h-[450px] w-full z-0 relative bg-gray-100" />
    </div>
  );
}

// ==========================================
// SWIGGY/ZOMATO LIVE TRACKING MAP COMPONENT
// ==========================================
function LiveTrackingMap({ pickup, role = 'kabadiwala', onComplete }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const { t } = useTranslation();

  const [eta, setEta] = useState(6);
  const [distanceKm, setDistanceKm] = useState(1.4);
  const [collectorPos, setCollectorPos] = useState(null);
  const [isGpsLocked, setIsGpsLocked] = useState(false);

  useEffect(() => {
    const loadLeaflet = () => {
      return new Promise((resolve) => {
        if (window.L) return resolve(window.L);
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link'); link.id = 'leaflet-css'; link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
        }
        if (!document.getElementById('leaflet-js')) {
          const script = document.createElement('script'); script.id = 'leaflet-js'; script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.onload = () => resolve(window.L); document.head.appendChild(script);
        } else {
          const interval = setInterval(() => { if (window.L) { clearInterval(interval); resolve(window.L); } }, 100);
        }
      });
    };

    loadLeaflet().then((L) => {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const initMapWithCoords = (lat, lng) => {
        const destPos = pickup.coords || [lat + 0.0065, lng + 0.0055]; 
        const startPos = [destPos[0] - 0.005, destPos[1] - 0.006]; 
        
        setCollectorPos(startPos);

        const map = L.map(mapContainerRef.current, { zoomControl: false, attributionControl: false }).setView(destPos, 15);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);
        L.control.zoom({ position: 'topright' }).addTo(map);

        const vehicleIcon = L.divIcon({
          className: 'custom-vehicle-marker',
          html: `<div class="relative flex items-center justify-center"><span class="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-orange-400 opacity-60"></span><div class="relative bg-orange-600 text-white p-2.5 rounded-full shadow-2xl border-2 border-white flex items-center justify-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-4v10"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg></div></div>`,
          iconSize: [40, 40], iconAnchor: [20, 20]
        });

        const destIcon = L.divIcon({
          className: 'custom-dest-marker',
          html: `<div class="relative flex flex-col items-center"><div class="bg-green-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold shadow-md whitespace-nowrap mb-1">${role === 'citizen' ? 'My Location' : 'Pickup Point'}</div><div class="bg-green-600 text-white p-2 rounded-full shadow-lg border-2 border-white"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div></div>`,
          iconSize: [30, 45], iconAnchor: [15, 42]
        });

        const collectorMarker = L.marker(startPos, { icon: vehicleIcon }).addTo(map);
        L.marker(destPos, { icon: destIcon }).addTo(map);

        const route = L.polyline([startPos, destPos], { color: '#f97316', weight: 5, opacity: 0.85, dashArray: '8, 8', lineJoin: 'round' }).addTo(map);
        map.fitBounds(route.getBounds(), { padding: [50, 50] });

        mapInstanceRef.current = map;

        let progress = 0;
        const movementInterval = setInterval(() => {
          progress += 0.05;
          if (progress <= 0.85) {
            const currentLat = startPos[0] + (destPos[0] - startPos[0]) * progress;
            const currentLng = startPos[1] + (destPos[1] - startPos[1]) * progress;
            const newPos = [currentLat, currentLng];
            collectorMarker.setLatLng(newPos);
            route.setLatLngs([newPos, destPos]);
            setDistanceKm(Math.max(0.1, (1.4 * (1 - progress)).toFixed(2)));
            setEta(Math.max(1, Math.round(6 * (1 - progress))));
          }
        }, 2500);
        return () => clearInterval(movementInterval);
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => { setIsGpsLocked(true); initMapWithCoords(pos.coords.latitude, pos.coords.longitude); },
          () => {
             const fbLat = parseFloat(localStorage.getItem('kaba_municipality_lat')) || 23.4033;
             const fbLng = parseFloat(localStorage.getItem('kaba_municipality_lng')) || 88.3659;
             initMapWithCoords(fbLat, fbLng);
          }, 
          { enableHighAccuracy: true }
        );
      } else {
        const fbLat = parseFloat(localStorage.getItem('kaba_municipality_lat')) || 23.4033;
        const fbLng = parseFloat(localStorage.getItem('kaba_municipality_lng')) || 88.3659;
        initMapWithCoords(fbLat, fbLng);
      }
    });

    return () => {
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
    };
  }, [role, pickup]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-orange-200 overflow-hidden animate-in zoom-in-95 duration-300 relative">
      <div className="absolute top-3 left-3 right-3 z-[400] flex justify-between items-center pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-orange-100 flex items-center gap-2 pointer-events-auto">
          <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>
          <div>
            <div className="text-[11px] font-black tracking-wider text-orange-600 uppercase flex items-center gap-1"><Radio className="w-3 h-3 text-orange-500 animate-pulse" /> Live Telemetry</div>
            <div className="text-xs font-bold text-gray-800 flex items-center gap-1"><Clock className="w-3 h-3 text-gray-500" /> Arriving in {eta} mins ({distanceKm} km)</div>
          </div>
        </div>
        <button onClick={() => mapInstanceRef.current && mapInstanceRef.current.setView(collectorPos, 16, { animate: true })} className="bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-lg border border-gray-200 text-gray-700 hover:text-orange-600 hover:bg-orange-50 pointer-events-auto transition-all active:scale-95"><LocateFixed className="w-5 h-5" /></button>
      </div>

      <div ref={mapContainerRef} className="h-72 w-full z-0 relative bg-gray-100" />

      <div className="p-5 bg-white border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-orange-100 text-orange-700 text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider">En Route</span>
            {isGpsLocked && <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Real GPS</span>}
          </div>
          <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">Cash: {pickup.estValue}</span>
        </div>

        <h3 className="text-lg font-black text-gray-800">{role === 'citizen' ? 'Assigned: Rajesh Kumar' : pickup.name}</h3>
        <p className="text-gray-500 flex items-start gap-1.5 mt-1 text-xs leading-relaxed">
          {role === 'citizen' ? <Truck className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" /> : <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />}
          <span>{role === 'citizen' ? 'Vehicle: E-Rickshaw (WB-24-AK-7890)' : pickup.address}</span>
        </p>

        <div className="grid grid-cols-2 gap-3 my-4 p-3.5 bg-orange-50/70 rounded-xl border border-orange-100/80 text-xs">
          <div><span className="text-gray-400 block font-semibold mb-0.5">Scrap Items</span><span className="font-bold text-gray-800 line-clamp-1">{pickup.scrap}</span></div>
          <div><span className="text-gray-400 block font-semibold mb-0.5">Contact</span><span className="font-bold text-gray-800">{role === 'citizen' ? '+91 98765 43210' : pickup.phone || '+91 98765 43210'}</span></div>
        </div>

        <div className="flex gap-2.5 pt-1">
          <a href={`tel:${role === 'citizen' ? '+919876543210' : pickup.phone || ''}`} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors active:scale-98">
            <Phone className="w-4 h-4 text-emerald-600" /> {role === 'citizen' ? t('callCollector', 'Call Kabadiwala') : t('callCustomer', 'Call Citizen')}
          </a>
          <button onClick={onComplete} className={`flex-1 py-3 text-white rounded-xl font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 ${role === 'citizen' ? 'bg-gray-800 hover:bg-gray-900' : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700'}`}>
            {role === 'citizen' ? <><ArrowLeft className="w-4 h-4" /> {t('backHome', 'Back to Home')}</> : <><CheckCircle className="w-4 h-4" /> {t('confirmCollection', 'Confirm')}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 1. MAIN MENU SCREEN
// ==========================================
function LoginScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4 font-sans relative">
      <div className="absolute top-4 right-4 bg-green-600 rounded-md"><LanguageToggle /></div>
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-black text-green-700 mb-2">♻️ {t('appTitle', 'Kabadiwala Connect')}</h1>
          <p className="text-gray-500">{t('selectPortal', 'Select your portal to continue')}</p>
        </div>
        <div className="space-y-4">
          <button onClick={() => navigate('/citizen')} className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group">
            <div className="bg-green-100 p-3 rounded-lg text-green-600 group-hover:bg-green-200 transition-colors"><User className="w-6 h-6" /></div>
            <div className="ml-4 text-left"><h3 className="font-bold text-gray-800">{t('citizen', 'Citizen')}</h3><p className="text-sm text-gray-500">{t('citizenDesc', 'Book a pickup')}</p></div>
          </button>
          <button onClick={() => navigate('/kabadiwala/login')} className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group">
            <div className="bg-orange-100 p-3 rounded-lg text-orange-600 group-hover:bg-orange-200 transition-colors"><Truck className="w-6 h-6" /></div>
            <div className="ml-4 text-left"><h3 className="font-bold text-gray-800">{t('kabadiwala', 'Kabadiwala')}</h3><p className="text-sm text-gray-500">{t('kabadiwalaDesc', 'Accept requests')}</p></div>
          </button>
          <button onClick={() => navigate('/admin/login')} className="w-full flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors"><ShieldCheck className="w-6 h-6" /></div>
            <div className="ml-4 text-left"><h3 className="font-bold text-gray-800">{t('admin', 'Admin')}</h3><p className="text-sm text-gray-500">{t('adminDesc', 'Manage Data')}</p></div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. KABADIWALA LOGIN SCREEN
// ==========================================
function KabadiwalaLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [selectedMuniStr, setSelectedMuniStr] = useState(JSON.stringify(wbMunicipalities.find(m => m.id === 'nabadwip') || wbMunicipalities[0])); 

  const handleLogin = (e) => {
    e.preventDefault();
    if (phone.length > 5 && pin.length >= 4) {
      const muniObj = JSON.parse(selectedMuniStr);
      localStorage.setItem('kaba_municipality_name', muniObj.name);
      localStorage.setItem('kaba_municipality_lat', muniObj.lat);
      localStorage.setItem('kaba_municipality_lng', muniObj.lng);
      navigate('/kabadiwala/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-4 font-sans relative">
      <div className="absolute top-4 right-4 bg-orange-600 rounded-md"><LanguageToggle /></div>
      <button onClick={() => navigate('/')} className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 text-gray-600"><ArrowLeft className="w-5 h-5" /></button>
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4"><Truck className="w-8 h-8" /></div>
          <h1 className="text-2xl font-black text-gray-800">{t('kabaLoginTitle', 'Collector Login')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('demoHint', 'Demo Login')}</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t('enterMunicipality', 'Select Municipality')}</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
              <select value={selectedMuniStr} onChange={(e) => setSelectedMuniStr(e.target.value)} className="w-full pl-10 pr-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 font-medium text-gray-800 text-sm appearance-none">
                {wbMunicipalities.map((muni) => <option key={muni.id} value={JSON.stringify(muni)}>{muni.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t('mobileNumber', 'Mobile')}</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" placeholder="+91" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">PIN</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input type="password" required maxLength="4" value={pin} onChange={(e) => setPin(e.target.value)} className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50" placeholder="****" />
            </div>
          </div>
          <button type="submit" disabled={phone.length < 6 || pin.length < 4} className={`w-full p-4 mt-4 rounded-xl font-bold text-white transition-all shadow-md ${phone.length >= 6 && pin.length >= 4 ? 'bg-orange-500 hover:bg-orange-600 hover:shadow-lg' : 'bg-gray-400 cursor-not-allowed'}`}>
            {t('loginBtn', 'Login')}
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 3. ADMIN LOGIN SCREEN
// ==========================================
function AdminLogin() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [selectedMuniStr, setSelectedMuniStr] = useState(JSON.stringify(wbMunicipalities.find(m => m.id === 'nabadwip') || wbMunicipalities[0])); 

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminId.length > 2 && password.length > 2) {
      const muniObj = JSON.parse(selectedMuniStr);
      localStorage.setItem('admin_municipality_name', muniObj.name);
      localStorage.setItem('admin_municipality_lat', muniObj.lat);
      localStorage.setItem('admin_municipality_lng', muniObj.lng);
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4 font-sans relative">
      <div className="absolute top-4 right-4 bg-blue-600 rounded-md"><LanguageToggle /></div>
      <button onClick={() => navigate('/')} className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 text-gray-600"><ArrowLeft className="w-5 h-5" /></button>
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"><ShieldCheck className="w-8 h-8" /></div>
          <h1 className="text-2xl font-black text-gray-800">{t('adminLoginTitle', 'Admin Login')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('demoAdminHint', 'Demo Login')}</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t('enterMunicipality', 'Select Municipality')}</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
              <select value={selectedMuniStr} onChange={(e) => setSelectedMuniStr(e.target.value)} className="w-full pl-10 pr-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 font-medium text-gray-800 text-sm appearance-none">
                {wbMunicipalities.map((muni) => <option key={muni.id} value={JSON.stringify(muni)}>{muni.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t('enterAdminId', 'Admin ID')}</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input type="text" required value={adminId} onChange={(e) => setAdminId(e.target.value)} className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" placeholder="admin123" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{t('enterPassword', 'Password')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50" placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" disabled={adminId.length < 3 || password.length < 3} className={`w-full p-4 mt-4 rounded-xl font-bold text-white transition-all shadow-md ${adminId.length >= 3 && password.length >= 3 ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg' : 'bg-gray-400 cursor-not-allowed'}`}>
            {t('loginBtn', 'Login')}
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 4. CITIZEN PORTAL 
// ==========================================
function CitizenPortal() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [step, setStep] = useState(1);
  const [isTracking, setIsTracking] = useState(false); 
  const [currentBooking, setCurrentBooking] = useState(null); 
  
  const [weights, setWeights] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [pointsEarnedThisSession, setPointsEarnedThisSession] = useState(0);
  
  const [name, setName] = useState("Arka Pal");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [photoData, setPhotoData] = useState(null); 
  const [selectedMuniStr, setSelectedMuniStr] = useState(JSON.stringify(wbMunicipalities.find(m => m.id === 'nabadwip') || wbMunicipalities[0])); 
  
  const [isLocating, setIsLocating] = useState(false);
  const [userCoords, setUserCoords] = useState(null); 
  
  const [myPoints, setMyPoints] = useState(() => parseInt(safeGetRequests('sih_green_points') || '1250'));
  const [prices] = useState(() => safeGetPrices());

  const categories = [
    { id: 'organic', name: t('organic', 'Organic'), icon: Leaf, pricePerKg: prices.organic, group: 'biodegradable' },
    { id: 'paper', name: t('paper', 'Paper'), icon: Newspaper, pricePerKg: prices.paper, group: 'nonBiodegradable' },
    { id: 'plastic', name: t('plastic', 'Plastic'), icon: Recycle, pricePerKg: prices.plastic, group: 'nonBiodegradable' },
    { id: 'metal', name: t('metal', 'Metal'), icon: Wrench, pricePerKg: prices.metal, group: 'nonBiodegradable' },
    { id: 'ewaste', name: t('ewaste', 'E-Waste'), icon: MonitorSmartphone, pricePerKg: prices.ewaste, group: 'specialized' },
    { id: 'bulky', name: t('bulky', 'Bulky'), icon: CheckCircle2, pricePerKg: prices.bulky, group: 'specialized' },
    { id: 'hazardous', name: t('hazardous', 'Hazardous'), icon: AlertCircle, pricePerKg: prices.hazardous, group: 'specialized' },
    { id: 'medical', name: t('medical', 'Medical'), icon: Plus, pricePerKg: prices.medical, group: 'specialized' },
  ];

  const toggleScrap = (id) => { setWeights(prev => { const newWeights = { ...prev }; if (newWeights[id]) delete newWeights[id]; else newWeights[id] = 1; return newWeights; }); };
  const updateWeight = (id, delta) => setWeights(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 0) + delta) }));
  
  const totalEstimatedValue = Object.entries(weights).reduce((total, [id, weight]) => { const cat = categories.find(c => c.id === id); return total + (cat ? cat.pricePerKg * weight : 0); }, 0);
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
        setUserCoords([latitude, longitude]); 
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const preciseAddress = data.display_name || data.address.suburb || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setAddress(preciseAddress);
        } catch (error) { setAddress("GPS Location Captured"); } finally { setIsLocating(false); }
      },
      () => setIsLocating(false), { enableHighAccuracy: true }
    );
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setPhotoData(reader.result); setPhotoUploaded(true); };
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

    const muniObj = JSON.parse(selectedMuniStr);
    const finalCoords = userCoords || [muniObj.lat, muniObj.lng];

    const newBooking = {
      id: generatedId, name: name, phone: phone, address: address, distance: "0.2 km",
      scrap: scrapList, estValue: `₹${totalEstimatedValue}`, time: "Just now",
      hasPhoto: photoUploaded, photoData: photoData, coords: finalCoords, municipality: muniObj.name
    };

    try {
      const existingRequests = safeGetRequests();
      localStorage.setItem('sih_scrap_requests', JSON.stringify([newBooking, ...existingRequests]));
    } catch (err) { console.error("Storage limit reached"); }

    setCurrentBooking(newBooking);
    setBookingSuccess(true);
  };

  const resetWizard = () => {
    setBookingSuccess(false);
    setIsTracking(false);
    setStep(1);
    setWeights({});
    setPhotoUploaded(false);
    setPhotoData(null);
    setAddress("");
    setPhone("");
    setCurrentBooking(null);
    setUserCoords(null);
  };

  const sortedLeaderboard = [
    { name: "Arka Pal (You)", points: myPoints, isUser: true },
    { name: "Priyadarshini Mazumder", points: 1380, isUser: false },
    { name: "Anup Kumar Majhi", points: 850, isUser: false },
    { name: "Tathagata Das", points: 720, isUser: false },
    { name: "Niloy Banik", points: 690, isUser: false },
    { name: "Aniket Ghosh", points: 210, isUser: false }
  ].sort((a, b) => b.points - a.points);

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
        <div className={`transition-all duration-300 ${!isTracking && step === 1 ? 'block opacity-100' : 'hidden opacity-0'}`}>
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
        <div className={`transition-all duration-300 ${!isTracking && step === 2 ? 'block opacity-100 animate-in slide-in-from-right-4' : 'hidden opacity-0'}`}>
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

            {/* MUNICIPALITY SELECTOR */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t('enterMunicipality')}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                <select value={selectedMuniStr} onChange={(e) => setSelectedMuniStr(e.target.value)} className="w-full pl-10 pr-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 appearance-none font-medium text-gray-800 text-sm">
                  {wbMunicipalities.map((muni) => (
                    <option key={muni.id} value={JSON.stringify(muni)}>{muni.name}</option>
                  ))}
                </select>
              </div>
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('addPhoto')}</label>
              {photoUploaded ? (
                <label className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-green-500 bg-green-50 text-green-700 font-bold cursor-pointer hover:bg-green-100 transition-colors shadow-sm">
                  <CheckCircle2 className="w-5 h-5" /> Photo Attached
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer text-center">
                    <Camera className="w-6 h-6 mb-1 text-gray-500" />
                    <span className="text-sm font-bold text-gray-700">{t('takePhoto')}</span>
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                  <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer text-center">
                    <ImageIcon className="w-6 h-6 mb-1 text-gray-500" />
                    <span className="text-sm font-bold text-gray-700">{t('uploadFile')}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                </div>
              )}
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

        {/* STEP 3: LIVE TRACKING VIEW */}
        {isTracking && currentBooking && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <LiveTrackingMap pickup={currentBooking} role="citizen" onComplete={resetWizard} />
          </div>
        )}
      </main>

      {!isTracking && (
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
                  <span className={`font-black w-6 text-center ${index === 0 ? 'text-yellow-500 text-lg' : index === 1 ? 'text-gray-400 text-base' : index === 2 ? 'text-amber-600 text-base' : 'text-gray-400 text-sm'}`}>#{index + 1}</span>
                  <span className={`font-bold text-sm ${user.isUser ? 'text-green-900' : 'text-gray-700'}`}>{user.name}</span>
                </div>
                <span className="font-black text-green-700 bg-white px-2 py-1 rounded-md text-xs shadow-sm flex items-center gap-1">{user.points} <Leaf className="w-3 h-3"/></span>
              </div>
            ))}
          </div>
          {myPoints >= 1000 && (
            <div className="p-5 bg-gradient-to-b from-green-50 to-green-100 border-t border-green-200 text-center">
              <p className="text-sm text-green-800 font-bold mb-3">{t('goldTier')}</p>
              <button onClick={() => alert(`Generating Official SIH Eco-Certificate...`)} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-black py-3 rounded-xl shadow-md hover:shadow-lg hover:from-yellow-500 hover:to-amber-600 transition-all">
                <Download className="w-5 h-5" /> {t('downloadCert')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUCCESS MODAL WITH TRACK BUTTON */}
      {bookingSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"><CheckCircle2 className="w-10 h-10 text-green-600" /></div>
            <h2 className="text-2xl font-black text-gray-800">{t('successTitle')}</h2>
            <p className="text-gray-500 mt-2 mb-6 text-sm">{t('successDesc')} <br/>ID: <span className="font-bold text-gray-800">#BK-{bookingId}</span></p>
            
            <div className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100">
              <span className="text-sm font-bold text-blue-800 flex items-center justify-center gap-2 mb-1">🌍 You saved {co2Saved} kg of CO2!</span>
              <span className="text-sm font-bold text-green-700 flex items-center justify-center gap-2">🏆 +{pointsEarnedThisSession} Green Points</span>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={() => { setBookingSuccess(false); setIsTracking(true); }} className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors shadow-md flex items-center justify-center gap-2">
                <Navigation className="w-5 h-5" /> Track Kabadiwala
              </button>
              <button onClick={resetWizard} className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">{t('backHome')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 5. KABADIWALA DASHBOARD
// ==========================================
function KabadiwalaPortal() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(false);
  const [activePickup, setActivePickup] = useState(null);
  const [feedRequests, setFeedRequests] = useState([]);
  const [viewingPhoto, setViewingPhoto] = useState(null); 
  const muniName = localStorage.getItem('kaba_municipality_name') || 'Nabadwip Municipality';

  useEffect(() => {
    if (isOnline) {
      const liveData = safeGetRequests();
      const baseLat = parseFloat(localStorage.getItem('kaba_municipality_lat')) || 23.4033;
      const baseLng = parseFloat(localStorage.getItem('kaba_municipality_lng')) || 88.3659;

      const mockData = [
        { id: 9991, name: "Hostel Block C", phone: "+91 9876543210", address: "Near Local School", distance: `0.5 km ${t('away', 'away')}`, scrap: `${t('paper', 'Paper')}, ${t('plastic', 'Plastic')}`, estValue: "₹180", time: "12 mins ago", hasPhoto: true, photoData: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=500&q=80", coords: [baseLat + 0.002, baseLng - 0.004] },
        { id: 9992, name: "Tech Park Offices", phone: "+91 8765432109", address: "Sector V / Central Area", distance: `4.2 km ${t('away', 'away')}`, scrap: `${t('ewaste', 'E-Waste')}, ${t('metal', 'Metal')}`, estValue: "₹650", time: "1 hour ago", hasPhoto: false, coords: [baseLat - 0.003, baseLng + 0.002] },
      ];
      setFeedRequests([...liveData, ...mockData]);
    }
  }, [isOnline, t]);

  const handleDecline = (id) => {
    setFeedRequests(prev => prev.filter(req => req.id !== id));
    const existing = safeGetRequests();
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
        <h1 className="text-xl font-bold flex items-center gap-2 truncate pr-2">🚚 {muniName}</h1>
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
                          <button onClick={(e) => { e.stopPropagation(); setViewingPhoto(req.photoData || "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?w=500&q=80"); }} className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded flex items-center gap-1 hover:bg-blue-100 transition-colors">
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

        {activePickup && <LiveTrackingMap pickup={activePickup} role="kabadiwala" onComplete={handleCompletePickup} />}
      </main>

      {viewingPhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <button onClick={() => setViewingPhoto(null)} className="absolute top-4 right-4 text-white/70 hover:text-white p-2"><XCircle className="w-8 h-8" /></button>
          <img src={viewingPhoto} className="max-w-full max-h-[80vh] rounded-lg shadow-2xl object-contain border-2 border-white/10" alt="Waste Evidence" />
          <p className="text-white/80 mt-4 font-semibold text-sm">Waste Photo Evidence</p>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. ADMIN DASHBOARD
// ==========================================
function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const municipalityName = localStorage.getItem('admin_municipality_name') || 'Nabadwip Municipality';
  const [mapStats, setMapStats] = useState({ pending: 0, activeCollectors: 0 });
  
  const [prices, setPrices] = useState(() => safeGetPrices());

  const handleSavePrices = () => {
    localStorage.setItem('sih_scrap_prices', JSON.stringify(prices));
    alert(t('pricesSaved', 'Prices saved successfully!'));
  };

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
        <h1 className="text-xl font-bold flex items-center gap-2 truncate pr-2">📊 {municipalityName}</h1>
        <div className="flex gap-2">
          <LanguageToggle />
          <button onClick={() => navigate('/')} className="flex items-center gap-1 bg-blue-900 px-3 py-1.5 rounded-md hover:bg-blue-950 text-sm font-semibold"><LogOut className="w-4 h-4" /> {t('logout')}</button>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto mt-8 p-4">
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-200 mb-8 animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-blue-600"/> {t('manageRates', 'Manage Rates')}
            </h3>
            <button onClick={handleSavePrices} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm flex items-center gap-2 transition-colors">
              <CheckCircle2 className="w-4 h-4" /> {t('updateRates', 'Save Rates')}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {Object.keys(prices).map(key => (
              <div key={key} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">{t(key, key)}</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-gray-400 font-bold">₹</span>
                  <input type="number" value={prices[key]} onChange={(e) => setPrices({...prices, [key]: Number(e.target.value)})} className="w-full pl-6 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-black text-gray-800" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <AdminLiveMap onUpdateStats={(pending, active) => setMapStats({ pending, activeCollectors: active })} />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start"><p className="text-gray-500 font-medium">Total Scrap (Today)</p><TrendingUp className="w-5 h-5 text-green-500"/></div>
            <h3 className="text-3xl font-black text-gray-800 mt-2">1,240 <span className="text-lg font-medium text-gray-400">kg</span></h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start"><p className="text-gray-500 font-medium">Active Collectors</p><Users className="w-5 h-5 text-blue-500"/></div>
            <h3 className="text-3xl font-black text-gray-800 mt-2">{mapStats.activeCollectors}</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start"><p className="text-gray-500 font-medium">Pending Pickups</p><AlertCircle className="w-5 h-5 text-orange-500"/></div>
            <h3 className="text-3xl font-black text-gray-800 mt-2">{mapStats.pending}</h3>
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/citizen" element={<CitizenPortal />} />
        <Route path="/kabadiwala/login" element={<KabadiwalaLogin />} />
        <Route path="/kabadiwala/dashboard" element={<KabadiwalaPortal />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}