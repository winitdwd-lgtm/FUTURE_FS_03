import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isBrewing, setIsBrewing] = useState(false);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Magic Scroll Observers
  const observerRefs = useRef([]);

  useEffect(() => {
    // Custom Cursor & Nav Scroll
    const updateMousePosition = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    const handleScroll = () => setScrolled(window.scrollY > 50);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('scroll', handleScroll);

    // Scroll Reveal Animation Logic
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    observerRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !observerRefs.current.includes(el)) {
      observerRefs.current.push(el);
    }
  };

  // Upgraded Localized Menu
  const menuItems = [
    { id: 1, name: "Bengaluru Filter Kaapi", desc: "Traditional South Indian drip, frothed to absolute perfection.", price: "₹120", category: "Coffee" },
    { id: 2, name: "Vanilla Bean Latte", desc: "Espresso, steamed milk, and real Madagascar vanilla.", price: "₹220", category: "Coffee" },
    { id: 3, name: "Quantum Cold Brew", desc: "Hyper-caffeinated precision drip. Perfect for late-night problem solving.", price: "₹250", category: "Specials" },
    { id: 4, name: "Shona's Signature Mocha", desc: "A perfectly sweet, velvet-smooth mocha crafted with love and rich cocoa.", price: "₹260", category: "Specials" },
    { id: 5, name: "Butter Croissant", desc: "Flaky, golden, and baked fresh every morning.", price: "₹180", category: "Pastries" },
    { id: 6, name: "Zero-Sugar Matcha Scone", desc: "A guilt-free baked treat with premium matcha.", price: "₹150", category: "Pastries" },
  ];

  const handleCategoryChange = (category) => {
    if (category === activeCategory) return;
    setIsBrewing(true);
    setTimeout(() => {
      setActiveCategory(category);
      setIsBrewing(false);
    }, 800);
  };

  const filteredMenu = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  // 3D Tilt Effect for Cards
  const handleMouseMove = (e, card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (card) => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div className="premium-layout">
      {/* Desktop Custom Cursor (Hidden on Mobile automatically via CSS) */}
      <div className={`custom-cursor ${isHovering ? 'cursor-grow' : ''}`} style={{ left: `${mousePosition.x}px`, top: `${mousePosition.y}px` }} />
      <div className="cursor-dot" style={{ left: `${mousePosition.x}px`, top: `${mousePosition.y}px` }} />

      {/* Secret Dev Button */}
      <button 
        className="easter-egg-btn pulse-glow"
        onClick={() => setShowSecretModal(true)}
        onMouseEnter={() => setIsHovering(true)} 
        onMouseLeave={() => setIsHovering(false)}
      >&lt;/&gt;</button>

      {/* Responsive Navigation */}
      <nav className={`navbar ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="logo">AURUM <span>COFFEE</span></div>
        
        {/* Mobile Hamburger Icon */}
        <div className={`hamburger ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span><span></span><span></span>
        </div>

        {/* Nav Links */}
        <ul className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
          <li><a href="#about" onClick={() => setMobileMenuOpen(false)}>Experience</a></li>
          <li><a href="#menu" onClick={() => setMobileMenuOpen(false)}>Menu</a></li>
          <li><a href="#visit" className="book-btn" onClick={() => setMobileMenuOpen(false)}>Visit Us</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content scroll-reveal" ref={addToRefs}>
          <p className="subtitle glow-text">CRAFTED WITH PASSION</p>
          <h1 className="title">Liquid Gold,<br/>Brewed Daily.</h1>
          <a href="#menu" className="cta-gold magnetic-btn" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            Explore The Menu
          </a>
        </div>
      </header>

      {/* Menu Section */}
      <section id="menu" className="menu-section">
        <div className="section-header scroll-reveal" ref={addToRefs}>
          <h2>Our Offerings</h2>
          <div className="filter-tabs">
            {['All', 'Coffee', 'Specials', 'Pastries'].map(category => (
              <button 
                key={category}
                className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="menu-display-area">
          {isBrewing ? (
            <div className="brewing-loader">
              <div className="coffee-cup"></div>
              <p>Brewing your selection...</p>
            </div>
          ) : (
            <div className="menu-grid">
              {filteredMenu.map((item, index) => (
                <div 
                  key={item.id} 
                  className="menu-card glass-panel scroll-reveal"
                  ref={addToRefs}
                  style={{ transitionDelay: `${index * 0.1}s` }}
                  onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                  onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                  onMouseEnter={() => setIsHovering(true)} 
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className="card-top">
                    <h3>{item.name}</h3>
                    <span className="price">{item.price}</span>
                  </div>
                  <p className="desc">{item.desc}</p>
                  <span className="category-tag">{item.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* NEW: Interactive Map & Visit Section */}
      <section id="visit" className="visit-section">
        <div className="visit-container scroll-reveal" ref={addToRefs}>
          <div className="visit-info glass-panel">
            <h2>Find Us</h2>
            <div className="info-block">
              <h3>📍 Location</h3>
              <p>100 Feet Road, Indiranagar</p>
              <p>Bengaluru, Karnataka 560038</p>
            </div>
            <div className="info-block">
              <h3>🕒 Hours</h3>
              <p>Mon - Sun | 6:00 AM - 11:00 PM</p>
            </div>
            <a href="https://maps.google.com" target="_blank" className="cta-gold outline">Get Directions</a>
          </div>
          
          <div className="map-container glass-panel">
            {/* Real Google Maps Embed for Bengaluru */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.001696423075!2d77.6389!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE3LjgiTiA3N8KwMzgnMjAuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{border: 0}} 
              allowFullScreen="" 
              loading="lazy"
              title="Aurum Coffee Location"
            ></iframe>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p className="copyright">© 2026 Aurum Coffee. Built from scratch by Vineet Dharwad.</p>
      </footer>

      {/* Secret Modal */}
      {showSecretModal && (
        <div className="secret-modal-overlay">
          <div className="secret-modal-content glass-panel">
            <button className="close-btn" onClick={() => setShowSecretModal(false)}>✕</button>
            <h2 className="glitch-text">Developer Override Engaged</h2>
            <p>You found the secret menu! Show this code for 20% off.</p>
            <div className="discount-code"><code>FUTURE_INTERN_2026</code></div>
            <button className="cta-gold modal-btn" onClick={() => setShowSecretModal(false)}>Acknowledge</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;