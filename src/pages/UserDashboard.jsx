import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ChevronRight, Check, LogOut, History, PlusSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';

const timeSlots = ['08:00', '09:30', '11:00', '13:00', '14:30', '16:00'];

export default function UserDashboard() {
  const navigate = useNavigate();
  const { services } = useAppData();
  
  const [activeTab, setActiveTab] = useState('book'); // 'book' or 'history'
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    service: null,
    date: null,
    time: null,
    notes: ''
  });
  
  // Mock history
  const [history, setHistory] = useState([
    { id: 'BK-1029', service: 'Party & Event', date: 'May 12, 2026', time: '14:30', status: 'Completed' }
  ]);

  const userName = localStorage.getItem('userName') || 'Client';

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const handleNextStep = () => {
    if (bookingStep < 3) setBookingStep(bookingStep + 1);
  };

  const submitBooking = () => {
    const newBooking = {
      id: `BK-${Math.floor(Math.random() * 9000) + 1000}`,
      service: services.find(s => s.id === bookingData.service).title,
      date: `June ${bookingData.date + 1}, 2026`,
      time: bookingData.time,
      status: 'Pending'
    };
    
    // In a real app, send to API. For now, add to mock history.
    setHistory([newBooking, ...history]);
    setBookingStep(4); // Confirmation step
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* Dashboard Nav */}
      <nav style={{ backgroundColor: 'white', padding: '1rem 2rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Putri Makeup</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--color-secondary)' }}>Welcome, {userName}</span>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: '500' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem', display: 'flex', gap: '2rem' }}>
        {/* Sidebar */}
        <div style={{ width: '250px', flexShrink: 0 }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <button 
                  onClick={() => {setActiveTab('book'); setBookingStep(1);}}
                  style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: activeTab === 'book' ? 'var(--color-accent-light)' : 'transparent', color: activeTab === 'book' ? 'var(--color-primary)' : 'var(--color-secondary)' }}
                >
                  <PlusSquare size={18} /> New Booking
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('history')}
                  style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: activeTab === 'history' ? 'var(--color-accent-light)' : 'transparent', color: activeTab === 'history' ? 'var(--color-primary)' : 'var(--color-secondary)' }}
                >
                  <History size={18} /> My Appointments
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, backgroundColor: 'white', padding: '3rem', borderRadius: '4px', border: '1px solid var(--color-border)', minHeight: '600px' }}>
          
          {activeTab === 'history' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '2rem' }}>My Appointments</h2>
              {history.length === 0 ? (
                <p style={{ color: 'var(--color-secondary)' }}>You have no booking history.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {history.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{item.service}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', display: 'flex', gap: '1rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> {item.date}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {item.time}</span>
                        </div>
                      </div>
                      <div style={{ padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '500', backgroundColor: item.status === 'Completed' ? '#e6f4ea' : item.status === 'Pending' ? '#e8f0fe' : '#fff3e0', color: item.status === 'Completed' ? '#1e8e3e' : item.status === 'Pending' ? '#1a73e8' : '#e65100' }}>
                        {item.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'book' && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '2rem' }}>Book a Session</h2>
              
              {bookingStep < 4 && (
                <div className="step-indicator" style={{ marginBottom: '3rem' }}>
                  {[1, 2, 3].map(step => (
                    <div key={step} className={`step ${bookingStep === step ? 'active' : ''} ${bookingStep > step ? 'completed' : ''}`}>
                      {step === 1 ? 'Service' : step === 2 ? 'Schedule' : 'Details'}
                    </div>
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                {bookingStep === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    {services.map(service => (
                      <div key={service.id} className={`service-option ${bookingData.service === service.id ? 'selected' : ''}`} onClick={() => setBookingData({...bookingData, service: service.id})}>
                        <div>
                          <strong>{service.title}</strong>
                          <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary)' }}>{service.duration}</div>
                        </div>
                        <div style={{ fontWeight: '500' }}>{service.price}</div>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                      <button className="btn btn-primary" onClick={handleNextStep} disabled={!bookingData.service}>
                        Next Step <ChevronRight size={18} style={{ marginLeft: '0.5rem' }} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {bookingStep === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div style={{ border: '1px solid var(--color-border)', padding: '1.5rem' }}>
                      <div className="calendar-header">
                        <span>June 2026</span>
                      </div>
                      <div className="calendar-grid">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-secondary)', paddingBottom: '0.5rem' }}>{d}</div>)}
                        {Array(30).fill(null).map((_, i) => (
                          <div key={i} className={`calendar-day ${i < 5 ? 'disabled' : ''} ${bookingData.date === i ? 'selected' : ''}`} onClick={() => i >= 5 && setBookingData({...bookingData, date: i})}>
                            {i + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                    {bookingData.date !== null && (
                      <div className="time-slots">
                        {timeSlots.map(time => (
                          <div key={time} className={`time-slot ${bookingData.time === time ? 'selected' : ''}`} onClick={() => setBookingData({...bookingData, time})}>{time}</div>
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                      <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setBookingStep(1)}>Back</button>
                      <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleNextStep} disabled={!bookingData.date || !bookingData.time}>
                        Next Step <ChevronRight size={18} style={{ marginLeft: '0.5rem' }} />
                      </button>
                    </div>
                  </motion.div>
                )}

                {bookingStep === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="form-group">
                      <label className="form-label">Any Special Requests?</label>
                      <textarea className="form-input" rows="4" placeholder="Specific look, allergies, etc." value={bookingData.notes} onChange={e => setBookingData({...bookingData, notes: e.target.value})}></textarea>
                    </div>
                    <div style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '4px', marginTop: '2rem' }}>
                      <h4 style={{ marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Booking Summary</h4>
                      <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Service:</span> <strong>{services.find(s => s.id === bookingData.service)?.title}</strong></p>
                      <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Date:</span> <strong>June {bookingData.date + 1}, 2026</strong></p>
                      <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Time:</span> <strong>{bookingData.time}</strong></p>
                      <p style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}><span>Total Price:</span> <strong>{services.find(s => s.id === bookingData.service)?.price}</strong></p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                      <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setBookingStep(2)}>Back</button>
                      <button className="btn btn-primary" style={{ flex: 2 }} onClick={submitBooking}>Confirm Booking</button>
                    </div>
                  </motion.div>
                )}

                {bookingStep === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                      <Check size={40} />
                    </div>
                    <h3 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Booking Confirmed!</h3>
                    <p style={{ color: 'var(--color-secondary)', marginBottom: '2rem' }}>Your appointment has been successfully scheduled.</p>
                    <button className="btn btn-outline" onClick={() => { setBookingStep(1); setBookingData({service: null, date: null, time: null, notes: ''}); setActiveTab('history'); }}>
                      View My Appointments
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
