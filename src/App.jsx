import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import CoffeeScene from './CoffeeScene';
import CustomCursor from './CustomCursor';
import './App.css';

function HTMLOverlay() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isBrewing, setIsBrewing] = useState(false);

  const menuItems = [
    { id: 1, name: "Bengaluru Filter Kaapi", desc: "Traditional South Indian drip, frothed to absolute perfection.", price: "₹120", category: "Coffee" },
    { id: 2, name: "Vanilla Bean Latte", desc: "Espresso, steamed milk, and real Madagascar vanilla.", price: "₹220", category: "Coffee" },
    { id: 3, name: "Quantum Cold Brew", desc: "Hyper-caffeinated precision drip. Perfect for late-night problem solving.", price: "₹250", category: "Specials" },
    { id: 4, name: "Aurum's Signature Mocha", desc: "A perfectly sweet, velvet-smooth mocha crafted with love and rich cocoa.", price: "₹260", category: "Specials" },
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

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="html-container">

      <section className="hero full-page">
        <motion.div
          className="hero-content scroll-margin"
          initial="hidden"
          whileInView="visible"
          variants={staggerContainer}
        >
          <motion.p variants={fadeIn} className="subtitle glow-text">CRAFTED WITH PASSION</motion.p>
          <motion.h1 variants={fadeIn} className="title">Liquid Gold,<br />Brewed Daily.</motion.h1>
          <motion.div variants={fadeIn}>
            <p className="scroll-prompt">Scroll to Experience</p>
          </motion.div>
        </motion.div>
      </section>

      <section id="menu" className="menu-section full-page">
        <motion.div
          className="section-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          variants={fadeIn}
        >
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
        </motion.div>

        <div className="menu-display-area">
          <AnimatePresence mode="wait">
            {isBrewing ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="brewing-loader"
              >
                <div className="coffee-cup"></div>
                <p>Brewing your selection...</p>
              </motion.div>
            ) : (
              <motion.div
                key="menu-grid"
                className="menu-grid"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, margin: "-50px" }}
              >
                {filteredMenu.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={fadeIn}
                    className="menu-card glass-panel"
                    whileHover={{ y: -10, scale: 1.02, rotateX: 2, rotateY: 2, transition: { duration: 0.2 } }}
                  >
                    <div className="card-top">
                      <h3>{item.name}</h3>
                      <span className="price">{item.price}</span>
                    </div>
                    <p className="desc">{item.desc}</p>
                    <span className="category-tag">{item.category}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section id="visit" className="visit-section full-page">
        <motion.div
          className="visit-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeIn} className="visit-info glass-panel">
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
            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="cta-gold outline">Get Directions</a>
          </motion.div>

          <motion.div variants={fadeIn} className="map-container glass-panel">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.001696423075!2d77.6389!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE3LjgiTiA3N8KwMzgnMjAuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Aurum Coffee Location"
            ></iframe>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="canvas-root">
      <CustomCursor />

      {/* Fixed Navigation Outside of Canvas */}
      <nav className="navbar fixed-nav">
        <div className="logo">AURUM <span>COFFEE</span></div>
        <div className={`hamburger ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span></span><span></span><span></span>
        </div>
        <ul className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
          <li><a href="#menu" onClick={() => setMobileMenuOpen(false)}>Menu</a></li>
          <li><a href="#visit" className="book-btn" onClick={() => setMobileMenuOpen(false)}>Visit Us</a></li>
        </ul>
      </nav>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        {/* ScrollControls manages the scrolling of the HTML overlay and passes state to the 3D scene */}
        <ScrollControls pages={3.5} damping={0.25}>
          <CoffeeScene />
          <Scroll html style={{ width: '100%', height: '100%' }}>
            <HTMLOverlay />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}