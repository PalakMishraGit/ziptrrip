import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, RefreshCw, Quote } from 'lucide-react';

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

  // Dynamic time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: '🌅' };
    if (hour < 18) return { text: 'Good Afternoon', icon: '☀️' };
    return { text: 'Good Evening', icon: '🌙' };
  };

  const greeting = getGreeting();

  // Auto-rotate motivational quote every 12 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNextQuote();
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  const handleNextQuote = () => {
    setFade(false);
    setTimeout(() => {
      setQuoteIndex(prev => (prev + 1) % MOTIVATIONAL_QUOTES.length);
      setFade(true);
    }, 300);
  };

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <div className="welcome-banner">
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '1.25rem' }}>{greeting.icon}</span>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
            {greeting.text}, Developer!
          </h2>
        </div>

        {/* Rotating Motivational Quote */}
        <div className={`quote-container ${fade ? 'fade-in' : 'fade-out'}`}>
          <div className="quote-text">
            <Quote size={13} style={{ transform: 'scaleX(-1)', marginRight: '4px', opacity: 0.8 }} />
            "{currentQuote.quote}" — <span className="quote-author">{currentQuote.author}</span>
          </div>

          <button 
            className="quote-refresh-btn" 
            onClick={handleNextQuote}
            title="Next Motivational Quote"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      <button className="btn btn-primary" onClick={onOpenCreateModal}>
        <Plus size={18} /> Add New Task
      </button>
    </div>
  );
}
