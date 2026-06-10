import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Camera, Mail, Phone, Star, Plus, Minus, Moon, Sun, Heart, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import PriceEstimator from '../components/PriceEstimator';
import BookingModal from '../components/BookingModal';

const testimonials = [
  { name: "Sarah L.", text: "Absolutely loved my bridal makeup! It stayed flawless throughout the whole day despite the tears and dancing.", rating: 5 },
  { name: "Amanda W.", text: "Very professional and understands exactly the look I wanted for my photoshoot. Highly recommend!", rating: 5 },
  { name: "Jessica T.", text: "The premium products used really make a difference. Felt so glamorous yet natural for my sister's wedding.", rating: 5 }
];

const faqs = [
  { q: "What brands of makeup do you use?", a: "We exclusively use premium and high-end brands like Charlotte Tilbury, NARS, Dior, MAC, and Armani Beauty to ensure longevity and a flawless finish." },
  { q: "Do you provide on-location services?", a: "Yes, we provide on-location services for bridal packages and group bookings (minimum 3 people) with an additional travel fee based on the location." },
  { q: "How far in advance should I book?", a: "For weddings, we recommend booking 3-6 months in advance. For regular events, 2-4 weeks is ideal to secure your preferred time slot." },
  { q: "Is a trial session necessary for brides?", a: "While not mandatory, we highly recommend a trial session. It allows us to perfect your desired look and ensures a stress-free experience on your big day." }
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [currentTesti, setCurrentTesti] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { services, portfolio, heroImage } = useAppData();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Auto-play testimonials
    const timer = setInterval(() => {
      setCurrentTesti((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  const handleBookClick = () => {
    setIsModalOpen(true);
  };

  const userRole = localStorage.getItem('userRole');
  const isLogged = !!userRole;

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <div className="logo-wrapper">
            <img src="/logo.jpg" alt="Putri Makeup" className="logo-img" />
          </div>
          <div className="nav-links">
            <a href="#home" className="nav-link">Home</a>
            <a href="#services" className="nav-link">Services</a>
            <a href="#portfolio" className="nav-link">Portfolio</a>
            <a href="#reviews" className="nav-link">Reviews</a>
            <a href="#faq" className="nav-link">FAQ</a>
          </div>
          <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
            <button onClick={() => setIsDark(!isDark)} style={{ background: 'none', border: 'none', color: 'var(--color-text)', cursor: 'pointer', display: 'flex' }} aria-label="Toggle Dark Mode">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {isLogged ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--color-border)', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {userRole === 'admin' ? 'Admin' : 'User'}
                </span>
                {userRole === 'admin' && (
                  <button className="btn btn-outline" onClick={() => navigate('/admin')} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                    Edit Website
                  </button>
                )}
                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={() => { localStorage.removeItem('userRole'); window.location.reload(); }}>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button className="btn btn-outline" onClick={() => navigate('/login')}>
                  Login
                </button>
                <button id="btn-book-now" className="btn btn-primary nav-book" onClick={handleBookClick}>
                  Book Appointment
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content">
            <motion.h1 className="hero-title" initial="hidden" animate="visible" variants={fadeIn}>
              Discover Your <i>Inner Radiance</i>
            </motion.h1>
            <motion.p className="hero-subtitle" initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.2 }}>
              Premium makeup artistry tailored to elevate your natural beauty for any occasion.
            </motion.p>
            <motion.button 
              className="btn btn-primary"
              initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.4 }}
              onClick={handleBookClick}
            >
              Reserve Your Session
            </motion.button>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <motion.img 
            style={{ y: yHero }}
            src={heroImage} 
            alt="Beautiful makeup model" 
            className="hero-image" 
          />
        </div>
      </section>

      {/* Services */}
      <section id="services" className="section bg-surface">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Our Expertise</span>
            <h2 className="section-title">Signature Services</h2>
          </div>
          <div className="services-grid">
            {services.map((service, index) => (
              <motion.div key={service.id} className="service-card"
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } } }}
              >
                <Star className="service-icon" />
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.desc}</p>
                <div className="service-price">{service.price}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Price Estimator */}
      <section className="section">
        <div className="container">
          <PriceEstimator services={services} />
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section id="portfolio" className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Lookbook</span>
            <h2 className="section-title">Recent Artistry</h2>
          </div>
          <div className="portfolio-grid">
            {portfolio.map((img, index) => (
              <motion.div key={index} className="portfolio-item"
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: index * 0.1 } } }}
              >
                <img src={img} alt={`Portfolio ${index + 1}`} className="portfolio-image" />
                <div className="portfolio-overlay">
                  <Camera color="white" size={32} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="section bg-surface">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Client Love</span>
            <h2 className="section-title">Words from Our Clients</h2>
          </div>
          <div className="testimonial-carousel">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentTesti}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="testimonial-card"
                style={{ margin: '0 auto', maxWidth: '800px', textAlign: 'center' }}
              >
                <div className="stars" style={{ justifyContent: 'center' }}>
                  {[...Array(testimonials[currentTesti].rating)].map((_, i) => <Star key={i} size={24} fill="currentColor" />)}
                </div>
                <p className="testimonial-text" style={{ fontSize: '1.25rem', lineHeight: '1.8' }}>"{testimonials[currentTesti].text}"</p>
                <p className="testimonial-author">- {testimonials[currentTesti].name}</p>
              </motion.div>
            </AnimatePresence>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '2.5rem' }}>
              {testimonials.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentTesti(i)}
                  style={{ 
                    width: '12px', height: '12px', borderRadius: '50%', 
                    backgroundColor: i === currentTesti ? 'var(--color-accent)' : 'var(--color-border)',
                    transition: 'all 0.3s', padding: 0
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Information</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  {faq.q}
                  {openFaq === index ? <Minus size={20} /> : <Plus size={20} />}
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p className="faq-answer">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Instagram Grid */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="section-header" style={{ marginBottom: '2rem' }}>
          <span className="section-subtitle">Follow Us on Instagram</span>
          <h2 className="section-title">
            <a href="https://www.instagram.com/putrimakeupsampit/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
              @putrimakeupsampit
            </a>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4px' }}>
          {portfolio.slice(0, 5).map((img, index) => (
            <a 
              href="https://www.instagram.com/putrimakeupsampit/" 
              target="_blank" 
              rel="noreferrer" 
              key={index} 
              className="ig-item" 
              style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', cursor: 'pointer', display: 'block' }}
            >
              <img src={img} alt="Instagram post" className="ig-img" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
              <div className="ig-overlay" style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', opacity: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', color: 'white', transition: 'opacity 0.3s' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}><Heart fill="white" size={20} /> {Math.floor(Math.random() * 500) + 100}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}><MessageCircle fill="white" size={20} /> {Math.floor(Math.random() * 50) + 5}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">Putri Makeup</div>
              <p className="footer-desc">Elevating natural beauty through sophisticated, personalized makeup artistry for modern individuals.</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <a href="#" style={{ color: 'var(--color-surface)' }}><Camera size={20} /></a>
                <a href="#" style={{ color: 'var(--color-surface)' }}><Mail size={20} /></a>
                <a href="#" style={{ color: 'var(--color-surface)' }}><Phone size={20} /></a>
              </div>
            </div>
            <div>
              <h4 className="footer-title">Explore</h4>
              <ul className="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-title">Legal</h4>
              <ul className="footer-links">
                <li><a href="#">Terms & Conditions</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Cancellation Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>&copy; 2026 Putri Makeup. All rights reserved.</span>
            <span>Made with precision.</span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Widget */}
      <a 
        href="https://wa.me/6281255840188" 
        target="_blank" 
        rel="noreferrer"
        className="wa-widget"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </a>

      {/* Booking Modal */}
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} services={services} />
    </div>
  );
}
