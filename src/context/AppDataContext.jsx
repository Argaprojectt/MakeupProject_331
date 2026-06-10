import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

// Default Data
const initialServices = [
  { id: 'bridal', title: 'Bridal Makeup', desc: 'Bespoke makeup for your special day. Includes trial session, premium lashes, and touch-up kit.', price: 'Rp 2.500.000', duration: '180 min' },
  { id: 'party', title: 'Party & Event', desc: 'Glamorous or natural look tailored to your event. Includes premium faux lashes.', price: 'Rp 850.000', duration: '90 min' },
  { id: 'photoshoot', title: 'Photoshoot / Editorial', desc: 'High-definition makeup perfect for studio lighting and outdoor photography.', price: 'Rp 1.200.000', duration: '120 min' }
];

const initialPortfolio = [
  "https://images.unsplash.com/photo-1512496015851-a1cae73c7e5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1596704017254-9b121068fb31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1519699047748-de8e457a634e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
];

const initialUsers = [
  { email: 'admin@putri.com', password: 'admin', role: 'admin', name: 'Putri Admin' }
];

const AppDataContext = createContext();

export function AppDataProvider({ children }) {
  const [services, setServices] = useState(initialServices);
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [users, setUsers] = useState(initialUsers);
  const [heroImage, setHeroImage] = useState("https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80");
  
  // Flag to fallback to localStorage if Supabase isn't configured yet
  const [useLocalFallback, setUseLocalFallback] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Check if Supabase env vars are set
      const url = import.meta.env.VITE_SUPABASE_URL;
      if (!url || url === 'YOUR_SUPABASE_URL') {
        console.warn('Supabase URL is missing or default. Falling back to localStorage.');
        setUseLocalFallback(true);
        loadLocalData();
        return;
      }
      
      try {
        const { data: svcData, error: svcError } = await supabase.from('services').select('*');
        if (svcError) throw svcError;
        if (svcData && svcData.length > 0) setServices(svcData);

        const { data: portData, error: portError } = await supabase.from('portfolio').select('*');
        if (portError) throw portError;
        if (portData && portData.length > 0) setPortfolio(portData.map(p => p.url));

        const { data: heroData } = await supabase.from('settings').select('*').eq('key', 'heroImage').single();
        if (heroData) setHeroImage(heroData.value);
        
      } catch (err) {
        console.error("Error fetching from Supabase:", err);
        console.warn("Falling back to localStorage due to connection error.");
        setUseLocalFallback(true);
        loadLocalData();
      }
    };

    fetchData();
  }, []);

  const loadLocalData = () => {
    const savedSvc = localStorage.getItem('putri_services');
    if (savedSvc) setServices(JSON.parse(savedSvc));

    const savedPort = localStorage.getItem('putri_portfolio');
    if (savedPort) setPortfolio(JSON.parse(savedPort));

    const savedUsers = localStorage.getItem('putri_users');
    if (savedUsers) setUsers(JSON.parse(savedUsers));

    const savedHero = localStorage.getItem('putri_hero');
    if (savedHero) setHeroImage(savedHero);
  };

  // Local sync (only if fallback is active)
  useEffect(() => {
    if (useLocalFallback) {
      localStorage.setItem('putri_services', JSON.stringify(services));
      localStorage.setItem('putri_portfolio', JSON.stringify(portfolio));
      localStorage.setItem('putri_users', JSON.stringify(users));
      localStorage.setItem('putri_hero', heroImage);
    }
  }, [services, portfolio, users, heroImage, useLocalFallback]);

  // Actions
  const updateService = async (id, updatedService) => {
    if (!useLocalFallback) {
      await supabase.from('services').update(updatedService).eq('id', id);
    }
    setServices(services.map(s => s.id === id ? updatedService : s));
  };

  const addService = async (newService) => {
    if (!useLocalFallback) {
      await supabase.from('services').insert([newService]);
    }
    setServices([...services, newService]);
  };

  const deleteService = async (id) => {
    if (!useLocalFallback) {
      await supabase.from('services').delete().eq('id', id);
    }
    setServices(services.filter(s => s.id !== id));
  };

  const addPortfolioImage = async (url) => {
    if (!useLocalFallback) {
      await supabase.from('portfolio').insert([{ url }]);
    }
    setPortfolio([url, ...portfolio]);
  };

  const deletePortfolioImage = async (index) => {
    const urlToDelete = portfolio[index];
    if (!useLocalFallback) {
      await supabase.from('portfolio').delete().eq('url', urlToDelete);
    }
    setPortfolio(portfolio.filter((_, i) => i !== index));
  };

  const registerUser = async (userData) => {
    if (!useLocalFallback) {
      await supabase.from('users').insert([{ ...userData, role: 'user' }]);
    }
    setUsers([...users, { ...userData, role: 'user' }]);
  };

  const updateHeroImage = async (url) => {
    if (!useLocalFallback) {
      // Use upsert to handle both insert if missing, and update if exists
      const { error } = await supabase.from('settings').upsert({ key: 'heroImage', value: url });
      if (error) console.error("Error updating hero image:", error);
    }
    setHeroImage(url);
  };

  return (
    <AppDataContext.Provider value={{
      services, updateService, addService, deleteService,
      portfolio, addPortfolioImage, deletePortfolioImage,
      users, registerUser,
      heroImage, updateHeroImage
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}
