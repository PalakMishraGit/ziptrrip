import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, Quote, Clock, Activity, Zap } from 'lucide-react';

const MOTIVATIONAL_QUOTES = [
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { quote: "Focus is a muscle. The more you practice it, the stronger it gets.", author: "Cal Newport" },
  { quote: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { quote: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { quote: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { quote: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" }
];

export function WelcomeBanner({ onOpenCreateModal }) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Live real-time clock updating every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Time-sensitive dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: '🌅', subtitle: 'Ready to accomplish your key focus targets today?' };
    if (hour < 18) return { text: 'Good Afternoon', icon: '☀️', subtitle: 'Keep the momentum going strong!' };
    return { text: 'Good Evening', icon: '🌙', subtitle: 'Review your achievements and plan ahead.' };
  };

  const greeting = getGreeting();

  // Auto-rotate motivational quote every 10s (unless hovered)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      handleNextQuote();
    }, 10000);
    return () => clearInterval(timer);
  }, [isPaused, quoteIndex]);

  const handleNextQuote = () => {
    setFade(false);
    setTimeout(() => {
      setQuoteIndex(prev => (prev + 1) % MOTIVATIONAL_QUOTES.length);
      setFade(true);
    }, 250);
  };

  const handleSelectQuote = (index) => {
    if (index === quoteIndex) return;
    setFade(false);
    setTimeout(() => {
      setQuoteIndex(index);
      setFade(true);
    }, 250);
  };

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <div 
      className="welcome-banner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Top Micro Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <span className="banner-badge banner-clock-badge">
            <Clock size={12} /> {currentTime || '00:00:00'}
          </span>
          <span className="banner-badge banner-status-badge">
            <span className="live-status-dot"></span> System Operational
          </span>
        </div>

        {/* Dynamic Title Greeting */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '1.4rem' }}>{greeting.icon}</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
            {greeting.text}, Developer!
          </h2>
        </div>

        {/* Rotating Motivational Quote Engine */}
        <div className={`quote-container ${fade ? 'fade-in' : 'fade-out'}`}>
          <div className="quote-text">
            <Quote size={13} style={{ transform: 'scaleX(-1)', marginRight: '5px', opacity: 0.85, flexShrink: 0 }} />
            <span>"{currentQuote.quote}" — <strong className="quote-author">{currentQuote.author}</strong></span>
          </div>

          <button 
            className="quote-refresh-btn" 
            onClick={handleNextQuote}
            title="Next Motivational Quote"
          >
            <RefreshCw size={12} />
          </button>
        </div>

        {/* Quote Pagination Dots */}
        <div className="quote-dots-bar">
          {MOTIVATIONAL_QUOTES.map((_, idx) => (
            <button
              key={idx}
              className={`quote-dot ${idx === quoteIndex ? 'active' : ''}`}
              onClick={() => handleSelectQuote(idx)}
              title={`Quote ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="banner-action-wrapper">
        <button className="btn btn-primary banner-action-btn" onClick={onOpenCreateModal}>
          <Plus size={18} /> Add New Task
        </button>
      </div>
    </div>
  );
}
