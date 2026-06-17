import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Info } from 'lucide-react';

export default function PriceEstimator({ services, onBookClick }) {
  const [selectedBaseService, setSelectedBaseService] = useState(null);
  const [addons, setAddons] = useState({
    hairDo: false,
    bridesmaids: 0,
    transport: 'none',
  });

  const baseServiceList = services.map(s => ({
    id: s.id,
    title: s.title,
    // Extract numbers from "Rp 2.500.000" using regex
    price: parseInt(s.price.replace(/[^0-9]/g, ''), 10) || 0,
    formattedPrice: s.price
  }));

  const ADDON_PRICES = {
    hairDo: 500000,
    bridesmaid: 850000
  };

  const TRANSPORT_PRICES = {
    'none': 0,
    '1-5km': 50000,
    '5-10km': 100000,
    '>10km': 150000
  };

  const calculateTotal = () => {
    let total = 0;
    if (selectedBaseService) {
      total += selectedBaseService.price;
    }
    if (addons.hairDo) total += ADDON_PRICES.hairDo;
    if (addons.transport !== 'none') total += TRANSPORT_PRICES[addons.transport];
    if (addons.bridesmaids > 0) total += (ADDON_PRICES.bridesmaid * addons.bridesmaids);
    
    return total;
  };

  const formatIDR = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', padding: '2.5rem', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>Build Your Package</h3>
        <p style={{ color: 'var(--color-secondary)' }}>Get an instant estimate for your makeup needs.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        {/* Left Column: Selections */}
        <div>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-surface)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>1</span>
            Select Base Service
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
            {baseServiceList.map(service => (
              <label key={service.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: `2px solid ${selectedBaseService?.id === service.id ? 'var(--color-accent)' : 'var(--color-border)'}`, borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: selectedBaseService?.id === service.id ? 'var(--color-accent-light)' : 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${selectedBaseService?.id === service.id ? 'var(--color-accent)' : 'var(--color-secondary)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedBaseService?.id === service.id && <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-accent)', borderRadius: '50%' }}></div>}
                  </div>
                  <span style={{ fontWeight: '500' }}>{service.title}</span>
                </div>
                <span style={{ color: 'var(--color-secondary)', fontSize: '0.9rem' }}>{service.formattedPrice}</span>
                <input type="radio" name="baseService" value={service.id} style={{ display: 'none' }} onChange={() => setSelectedBaseService(service)} />
              </label>
            ))}
          </div>

          <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-surface)', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>2</span>
            Add-ons
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${addons.hairDo ? 'var(--color-accent)' : 'var(--color-secondary)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: addons.hairDo ? 'var(--color-accent)' : 'transparent' }}>
                  {addons.hairDo && <Check size={14} color="white" />}
                </div>
                <span>Hair Do Styling</span>
              </div>
              <span style={{ color: 'var(--color-secondary)' }}>+ {formatIDR(ADDON_PRICES.hairDo)}</span>
              <input type="checkbox" style={{ display: 'none' }} checked={addons.hairDo} onChange={(e) => setAddons({...addons, hairDo: e.target.checked})} />
            </label>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Additional Bridesmaids / Family</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setAddons({...addons, bridesmaids: Math.max(0, addons.bridesmaids - 1)})}>-</button>
                <span style={{ width: '20px', textAlign: 'center', fontWeight: '600' }}>{addons.bridesmaids}</span>
                <button style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setAddons({...addons, bridesmaids: addons.bridesmaids + 1})}>+</button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Transportation Fee</span>
              <select 
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', outline: 'none' }}
                value={addons.transport}
                onChange={(e) => setAddons({...addons, transport: e.target.value})}
              >
                <option value="none">None (In-Studio)</option>
                <option value="1-5km">1 - 5 km (+ {formatIDR(TRANSPORT_PRICES['1-5km'])})</option>
                <option value="5-10km">5 - 10 km (+ {formatIDR(TRANSPORT_PRICES['5-10km'])})</option>
                <option value=">10km">{'> 10'} km (+ {formatIDR(TRANSPORT_PRICES['>10km'])})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Total */}
        <div style={{ backgroundColor: 'var(--color-bg)', padding: '2rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>Estimated Summary</h4>
            
            {selectedBaseService ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>{selectedBaseService.title}</span>
                <span>{formatIDR(selectedBaseService.price)}</span>
              </div>
            ) : (
              <div style={{ color: 'var(--color-secondary)', fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>No base service selected.</div>
            )}

            {addons.hairDo && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--color-secondary)', fontSize: '0.9rem' }}>
                <span>+ Hair Do Styling</span>
                <span>{formatIDR(ADDON_PRICES.hairDo)}</span>
              </div>
            )}
            
            {addons.bridesmaids > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--color-secondary)', fontSize: '0.9rem' }}>
                <span>+ {addons.bridesmaids}x Bridesmaid/Family</span>
                <span>{formatIDR(ADDON_PRICES.bridesmaid * addons.bridesmaids)}</span>
              </div>
            )}

            {addons.transport !== 'none' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--color-secondary)', fontSize: '0.9rem' }}>
                <span>+ Transport ({addons.transport})</span>
                <span>{formatIDR(TRANSPORT_PRICES[addons.transport])}</span>
              </div>
            )}
          </div>

          <div style={{ marginTop: '2rem', borderTop: '2px dashed var(--color-border)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>Estimated Total</span>
              <span style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-accent)', lineHeight: 1 }}>{formatIDR(calculateTotal())}</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} onClick={() => onBookClick ? onBookClick() : document.getElementById('btn-book-now')?.click()}>
              Book This Package
            </button>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-secondary)', fontSize: '0.75rem', marginTop: '1rem', justifyContent: 'center' }}>
              <Info size={12} /> This is an estimate. Final price may vary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
