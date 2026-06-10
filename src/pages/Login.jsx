import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppData } from '../context/AppDataContext';
import { ArrowLeft } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { users, registerUser } = useAppData();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role) navigate('/', { replace: true });
  }, [navigate]);

  const handleAuth = (e) => {
    e.preventDefault();
    setError('');
    if (isLogin) {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userName', user.name);
        navigate('/', { replace: true });
      } else {
        setError('Invalid email or password');
      }
    } else {
      if (!name || !email || !password) return setError('Please fill all fields');
      if (users.find(u => u.email === email)) return setError('Email already exists');
      
      registerUser({ name, email, password });
      localStorage.setItem('userRole', 'user');
      localStorage.setItem('userName', name);
      navigate('/', { replace: true });
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-surface)' }}>
      {/* Left Panel - Image (Hidden on small screens) */}
      <div className="login-image-panel" style={{ 
        flex: 1, 
        position: 'relative', 
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '3rem'
      }}>
        <img 
          src="https://images.unsplash.com/photo-1512496015851-a1cae73c7e5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
          alt="Luxury Makeup" 
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
        <div style={{ position: 'relative', color: 'white', zIndex: 1, maxWidth: '400px' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>Discover Your True Radiance</h2>
          <p style={{ color: '#e0e0e0', fontSize: '1rem', lineHeight: '1.6' }}>Join our exclusive community and manage your personalized beauty appointments seamlessly.</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '2rem',
        position: 'relative'
      }}>
        <button 
          onClick={() => navigate('/')}
          style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-secondary)', fontSize: '0.875rem', cursor: 'pointer' }}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div style={{ width: '100%', maxWidth: '400px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div className="logo" style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Putri Makeup</div>
              <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>
                {isLogin ? 'Welcome Back' : 'Create an Account'}
              </h1>
              <p style={{ color: 'var(--color-secondary)', fontSize: '0.9rem' }}>
                {isLogin ? 'Please enter your details to sign in.' : 'Enter your details to register.'}
              </p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ backgroundColor: '#fce8e6', color: '#d93025', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center', border: '1px solid #fad2cf' }}>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleAuth}>
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                      <label className="form-label" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                      <input type="text" className="form-input" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} style={{ padding: '0.75rem 0', border: 'none', borderBottom: '1px solid var(--color-border)', borderRadius: 0, backgroundColor: 'transparent' }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
                <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '0.75rem 0', border: 'none', borderBottom: '1px solid var(--color-border)', borderRadius: 0, backgroundColor: 'transparent' }} />
              </div>
              
              <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                <input type="password" className="form-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '0.75rem 0', border: 'none', borderBottom: '1px solid var(--color-border)', borderRadius: 0, backgroundColor: 'transparent' }} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', letterSpacing: '0.15em' }}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {isLogin && (
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', padding: '0.5rem 1rem', backgroundColor: 'var(--color-bg)', borderRadius: '20px' }}>
                  Admin access: admin@putri.com / admin
                </span>
              </div>
            )}
            
            <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--color-secondary)' }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }} onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                {isLogin ? 'Sign up' : 'Log in'}
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
