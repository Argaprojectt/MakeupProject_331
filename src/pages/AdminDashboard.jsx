import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, CheckCircle, XCircle, LogOut, Edit, Trash2, Plus, Image as ImageIcon, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { services, updateService, addService, deleteService, portfolio, addPortfolioImage, deletePortfolioImage, heroImage, updateHeroImage } = useAppData();
  
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Mock bookings
  const [bookings, setBookings] = useState([
    { id: 'BK-1030', client: 'Jane Doe', service: 'Bridal Makeup', date: 'June 15, 2026', time: '08:00', status: 'Pending' },
    { id: 'BK-1029', client: 'Alice Smith', service: 'Party & Event', date: 'May 12, 2026', time: '14:30', status: 'Completed' },
    { id: 'BK-1028', client: 'Clara Bella', service: 'Photoshoot', date: 'May 10, 2026', time: '11:00', status: 'Completed' }
  ]);

  const [newImageUrl, setNewImageUrl] = useState('');
  const [editingService, setEditingService] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const handleStatusChange = (id, newStatus) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const handleAddImage = () => {
    if (newImageUrl) {
      addPortfolioImage(newImageUrl);
      setNewImageUrl('');
    }
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    if (editingService.id) {
      // update
      updateService(editingService.id, editingService);
    } else {
      // add
      addService({ ...editingService, id: `svc-${Date.now()}` });
    }
    setEditingService(null);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* Admin Nav */}
      <nav style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Putri Makeup Admin</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <span style={{ fontSize: '0.9rem', color: '#ccc' }}>Admin Panel</span>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontSize: '0.9rem', fontWeight: '500' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', display: 'flex', gap: '2rem' }}>
        {/* Sidebar */}
        <div style={{ width: '250px', flexShrink: 0 }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <button onClick={() => setActiveTab('bookings')} style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: activeTab === 'bookings' ? 'var(--color-accent-light)' : 'transparent', color: activeTab === 'bookings' ? 'var(--color-primary)' : 'var(--color-secondary)' }}>
                  <Calendar size={18} /> Appointments
                </button>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <button onClick={() => setActiveTab('services')} style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: activeTab === 'services' ? 'var(--color-accent-light)' : 'transparent', color: activeTab === 'services' ? 'var(--color-primary)' : 'var(--color-secondary)' }}>
                  <Settings size={18} /> Services & Pricing
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('portfolio')} style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: activeTab === 'portfolio' ? 'var(--color-accent-light)' : 'transparent', color: activeTab === 'portfolio' ? 'var(--color-primary)' : 'var(--color-secondary)' }}>
                  <ImageIcon size={18} /> Portfolio Images
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <AnimatePresence mode="wait">
            
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <motion.div key="bookings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1.5rem' }}>Manage Appointments</h2>
                <div style={{ backgroundColor: 'white', borderRadius: '4px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                      <tr>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: '500', color: 'var(--color-secondary)' }}>ID</th>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: '500', color: 'var(--color-secondary)' }}>Client</th>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: '500', color: 'var(--color-secondary)' }}>Service</th>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: '500', color: 'var(--color-secondary)' }}>Date & Time</th>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: '500', color: 'var(--color-secondary)' }}>Status</th>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: '500', color: 'var(--color-secondary)' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking, index) => (
                        <tr key={booking.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '1.5rem' }}><strong>{booking.id}</strong></td>
                          <td style={{ padding: '1.5rem' }}>{booking.client}</td>
                          <td style={{ padding: '1.5rem' }}>{booking.service}</td>
                          <td style={{ padding: '1.5rem' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> {booking.date}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {booking.time}</span>
                            </div>
                          </td>
                          <td style={{ padding: '1.5rem' }}>
                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '500', backgroundColor: booking.status === 'Completed' ? '#e6f4ea' : booking.status === 'Confirmed' ? '#e8f0fe' : booking.status === 'Cancelled' ? '#fce8e6' : '#fff3e0', color: booking.status === 'Completed' ? '#1e8e3e' : booking.status === 'Confirmed' ? '#1a73e8' : booking.status === 'Cancelled' ? '#d93025' : '#e65100' }}>
                              {booking.status}
                            </span>
                          </td>
                          <td style={{ padding: '1.5rem' }}>
                            {booking.status === 'Pending' && (
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleStatusChange(booking.id, 'Confirmed')} style={{ color: '#1a73e8', padding: '0.5rem', backgroundColor: '#e8f0fe', borderRadius: '4px' }} title="Confirm"><CheckCircle size={18} /></button>
                                <button onClick={() => handleStatusChange(booking.id, 'Cancelled')} style={{ color: '#d93025', padding: '0.5rem', backgroundColor: '#fce8e6', borderRadius: '4px' }} title="Cancel"><XCircle size={18} /></button>
                              </div>
                            )}
                            {booking.status === 'Confirmed' && (
                              <button onClick={() => handleStatusChange(booking.id, 'Completed')} style={{ color: '#1e8e3e', padding: '0.5rem', backgroundColor: '#e6f4ea', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '500' }}>Mark Completed</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <motion.div key="services" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>Services & Pricing</h2>
                  <button className="btn btn-primary" onClick={() => setEditingService({ title: '', desc: '', price: '', duration: '' })}><Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Service</button>
                </div>

                {editingService ? (
                  <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '4px', border: '1px solid var(--color-border)', marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>{editingService.id ? 'Edit Service' : 'New Service'}</h3>
                    <form onSubmit={handleSaveService}>
                      <div className="form-group">
                        <label className="form-label">Service Title</label>
                        <input required type="text" className="form-input" value={editingService.title} onChange={e => setEditingService({...editingService, title: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea required className="form-input" rows="3" value={editingService.desc} onChange={e => setEditingService({...editingService, desc: e.target.value})}></textarea>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Price</label>
                          <input required type="text" className="form-input" placeholder="Rp ..." value={editingService.price} onChange={e => setEditingService({...editingService, price: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Duration</label>
                          <input required type="text" className="form-input" placeholder="e.g. 120 min" value={editingService.duration} onChange={e => setEditingService({...editingService, duration: e.target.value})} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" className="btn btn-outline" onClick={() => setEditingService(null)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Service</button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {services.map(service => (
                      <div key={service.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{service.title}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', maxWidth: '500px', marginBottom: '0.5rem' }}>{service.desc}</p>
                          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', fontWeight: '500' }}>
                            <span style={{ color: 'var(--color-accent)' }}>{service.price}</span>
                            <span style={{ color: 'var(--color-secondary)' }}>• {service.duration}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => setEditingService(service)} style={{ padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'var(--color-primary)' }} title="Edit"><Edit size={16} /></button>
                          <button onClick={() => deleteService(service.id)} style={{ padding: '0.5rem', border: '1px solid #fce8e6', borderRadius: '4px', color: '#d93025', backgroundColor: '#fce8e6' }} title="Delete"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <motion.div key="portfolio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1.5rem' }}>Portfolio & Images</h2>
                
                {/* Hero Image Setting */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Hero Image (Gambar Paling Besar di Home)</h3>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ width: '200px', height: '120px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                      <img src={heroImage} alt="Current Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Ganti Gambar Utama</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="form-input" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              updateHeroImage(reader.result);
                              e.target.value = '';
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                      />
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', marginTop: '3rem' }}>Gallery Images</h3>
                
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '4px', border: '1px solid var(--color-border)', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Upload Photo dari Laptop/HP</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="form-input" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewImageUrl(reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                    />
                  </div>
                  <div style={{ alignSelf: 'flex-end' }}>
                    <button className="btn btn-primary" onClick={() => {
                      if (newImageUrl) {
                        addPortfolioImage(newImageUrl);
                        setNewImageUrl('');
                        // Clear the file input
                        document.querySelector('input[type="file"]').value = '';
                      }
                    }} disabled={!newImageUrl}>
                      Upload ke Galeri
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                  {portfolio.map((img, index) => (
                    <div key={index} style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden', aspectRatio: '4/5', border: '1px solid var(--color-border)' }}>
                      <img src={img} alt={`Portfolio ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        onClick={() => deletePortfolioImage(index)}
                        style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: '#d93025', color: 'white', padding: '0.5rem', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
