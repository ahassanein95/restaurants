'use client';

import { useState, useEffect } from 'react';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true); // Default to true for SSR

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 736);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile menu button - only show on mobile */}
      <button
        className="fixed top-4 right-4 z-50 bg-purple-600 text-white p-3 rounded-lg shadow-lg block md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Mobile navigation menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black/80" onClick={() => setIsOpen(false)}></div>
          <nav className="fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-purple-800 to-purple-900 p-6 shadow-xl">
            <ul className="mt-16 space-y-6">
              <li>
                <a 
                  href="#intro" 
                  onClick={(e) => handleNavClick(e, '#intro')}
                  className="block text-white hover:text-cyan-300 transition-colors text-lg font-semibold py-2 border-b border-purple-600/50"
                >
                  Welcome
                </a>
              </li>
              <li>
                <a 
                  href="#menu" 
                  onClick={(e) => handleNavClick(e, '#menu')}
                  className="block text-white hover:text-cyan-300 transition-colors text-lg font-semibold py-2 border-b border-purple-600/50"
                >
                  Menu
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}