'use client';

import { RestaurantData } from '@/types/restaurant';
import { useState } from 'react';

interface ContactProps {
  data: RestaurantData;
}

export default function Contact({ data }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="wrapper style1 fade-up">
      <div className="inner max-w-6xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-light mb-4 text-center text-white">
          Get in Touch
        </h2>
        <p className="text-lg leading-relaxed mb-12 text-center text-white/80 max-w-2xl mx-auto">
          Ready to experience exceptional dining? Contact us for reservations or inquiries. 
          We look forward to welcoming you to {data.name}.
        </p>
        
        <div className="split style1 grid md:grid-cols-2 gap-8">
          <section>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="fields">
                <div className="field half">
                  <label htmlFor="name" className="block text-white mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full"
                    required
                  />
                </div>
                <div className="field half">
                  <label htmlFor="email" className="block text-white mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="message" className="block text-white mb-2">Message</label>
                  <textarea
                    name="message"
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full"
                    placeholder="I would like to make a reservation for..."
                    required
                  />
                </div>
              </div>
              <ul className="actions">
                <li>
                  <button type="submit" className="button">
                    Send Message
                  </button>
                </li>
              </ul>
            </form>
          </section>
          
          <section className="text-white space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <i className="fas fa-map-marker-alt mr-3 text-cyan-400"></i>
                Address
              </h3>
              <span className="text-white/80">
                {data.address}
              </span>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <i className="fas fa-envelope mr-3 text-cyan-400"></i>
                Email
              </h3>
              <a href={`mailto:${data.email}`} className="text-cyan-300 hover:text-cyan-200 transition-colors text-lg">
                {data.email}
              </a>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <i className="fas fa-phone mr-3 text-cyan-400"></i>
                Phone
              </h3>
              <a href={`tel:${data.phone}`} className="text-cyan-300 hover:text-cyan-200 transition-colors text-lg">
                {data.phone}
              </a>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <i className="fas fa-clock mr-3 text-cyan-400"></i>
                Hours
              </h3>
              <div className="text-white/80 space-y-1">
                <div>Monday - Thursday: 5:00 PM - 10:00 PM</div>
                <div>Friday - Saturday: 5:00 PM - 11:00 PM</div>
                <div>Sunday: 4:00 PM - 9:00 PM</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <i className="fas fa-share-alt mr-3 text-cyan-400"></i>
                Follow Us
              </h3>
              <ul className="icons flex space-x-4">
                <li>
                  <a href="#" className="icon brands fa-facebook-f text-cyan-300 hover:text-cyan-200 transition-colors text-xl">
                    <span className="label">Facebook</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="icon brands fa-instagram text-cyan-300 hover:text-cyan-200 transition-colors text-xl">
                    <span className="label">Instagram</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="icon brands fa-twitter text-cyan-300 hover:text-cyan-200 transition-colors text-xl">
                    <span className="label">Twitter</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="icon brands fa-yelp text-cyan-300 hover:text-cyan-200 transition-colors text-xl">
                    <span className="label">Yelp</span>
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}