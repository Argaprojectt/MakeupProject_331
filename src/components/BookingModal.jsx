import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BookingModal({ isOpen, onClose, services }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '10:00',
    notes: ''
  });
  const navigate = useNavigate();

  const handleBook = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone) return alert('Please fill personal details');
      setStep(2);
    } else {
      if (!formData.service || !formData.date) return alert('Please select service and date');
      
      // Simulating a successful booking submission to backend/localStorage
      // In a real app, this would call an API
      const bookings = JSON.parse(localStorage.getItem('putri_mock_bookings') || '[]');
      bookings.push({
        id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
        client: formData.name,
        service: formData.service,
        date: formData.date,
        time: formData.time,
        status: 'Pending'
      });
      localStorage.setItem('putri_mock_bookings', JSON.stringify(bookings));
      
      setStep(3);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setFormData({ name: '', email: '', phone: '', service: '', date: '', time: '10:00', notes: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={resetAndClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
          style={{ position: 'relative', width: '100%', maxWidth: '500px', backgroundColor: 'var(--color-surface)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}
        >
          {/* Header */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-bg)' }}>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', margin: 0 }}>
              {step === 3 ? 'Booking Confirmed!' : 'Request an Appointment'}
            </h3>
            <button onClick={resetAndClose} style={{ color: 'var(--color-secondary)' }}>
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '2rem' }}>
            {step === 3 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <Calendar size={32} />
                </div>
                <h4 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Thank You, {formData.name}!</h4>
                <p style={{ color: 'var(--color-secondary)', marginBottom: '2rem' }}>Your appointment request for {formData.date} has been received. Our team will contact you shortly to confirm.</p>
                <button className="btn btn-primary" onClick={resetAndClose} style={{ width: '100%' }}>Done</button>
              </div>
            ) : (
              <form onSubmit={handleBook}>
                {step === 1 ? (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Jane Doe" />
                    </div>
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label">Email Address</label>
                      <input type="email" className="form-input" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="jane@example.com" />
                    </div>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                      <label className="form-label">Phone Number (WhatsApp)</label>
                      <input type="tel" className="form-input" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+62 8..." />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Next Step</button>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                      <label className="form-label">Select Service</label>
                      <select className="form-input" required value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}>
                        <option value="">-- Choose a service --</option>
                        {services.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                      </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                      <div className="form-group">
                        <label className="form-label">Date</label>
                        <input type="date" className="form-input" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} min={new Date().toISOString().split('T')[0]} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Time</label>
                        <input type="time" className="form-input" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                      </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                      <label className="form-label">Special Requests (Optional)</label>
                      <textarea className="form-input" rows="2" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Any allergies, specific looks, etc."></textarea>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setStep(1)}>Back</button>
                      <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Confirm Booking</button>
                    </div>
                  </motion.div>
                )}
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
