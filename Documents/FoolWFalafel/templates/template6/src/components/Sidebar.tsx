'use client';

import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['intro', 'menu'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="sidebar">
      <div className="inner">
        <nav>
          <ul>
            <li>
              <a 
                href="#intro" 
                onClick={(e) => handleNavClick(e, '#intro')}
                className={activeSection === 'intro' ? 'active' : ''}
              >
                Welcome
              </a>
            </li>
            {/* <li>
              <a 
                href="#about" 
                onClick={(e) => handleNavClick(e, '#about')}
                className={activeSection === 'about' ? 'active' : ''}
              >
                Our Story
              </a>
            </li>
            <li>
              <a 
                href="#featured" 
                onClick={(e) => handleNavClick(e, '#featured')}
                className={activeSection === 'featured' ? 'active' : ''}
              >
                Featured Dishes
              </a>
            </li> */}
            <li>
              <a 
                href="#menu" 
                onClick={(e) => handleNavClick(e, '#menu')}
                className={activeSection === 'menu' ? 'active' : ''}
              >
                Full Menu
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}