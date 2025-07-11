import React, { useState } from 'react';
import {
  Mail, MessageSquare, Send, MapPin, Clock, Phone,
  Github, Linkedin, Twitter, CheckCircle,
  Instagram
} from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: <Mail size={24} color="#3b82f6" />,
      title: 'Direct Line to the Architect (Email)',
      content: 'bettercalladarsh.com',
      description: 'Send your manifesto, your data grievances, or just a simple "hello." Preferably after 10 AM, my personal revolution starts late.'
    },
    {
      icon: <MessageSquare size={24} color="#10b981" />,
      title: 'Emergency Break-Glass Protocol (Support)',
      content: 'support@nostatsherlock.com',
      description: 'For when the system breaks, or your data tries to conform. We\'ll send in the demolition crew.'
    },
    {
      icon: <Clock size={24} color="#8b5cf6" />,
      title: 'Response Time (When I\'m Not Fighting the Man)',
      content: '24-48 hours (or when the urge strikes)',
      description: 'Average time to get back to you. Unless I\'m distracted by the sheer mediocrity of modern society.'
    },
    {
      icon: <MapPin size={24} color="#f59e0b" />,
      title: 'The Underground Lair (Location)',
      content: 'Somewhere in India, operating globally',
      description: 'My office is wherever the system isn\'t. But my influence is everywhere.'
    }
  ];

  const socialLinks = [
    {
      icon: <Github size={24} />,
      name: 'GitHub',
      url: 'https://github.com/ctype',
      color: 'bg-gray-700 hover:bg-gray-800' // Tailwind classes for color
    },
    {
      icon: <Instagram size={24} />,
      name: 'Instagram',
      url: 'https://instagram.com/adarshssn',
      color: 'bg-pink-600 hover:bg-pink-700' // Tailwind classes for color
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-500 to-purple-700 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl px-4">
          <MessageSquare size={64} className="mx-auto mb-6" />
          <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-5xl">
            Break the Silence. Make Contact.
          </h1>
          <p className="text-lg leading-relaxed text-blue-100 lg:text-xl">
            Tired of the corporate lies? The bland data? The feeling that you're just another cog?
            Speak your mind. Report the anomalies. This isn't a customer service line. It's a confession booth for the digital age.
          </p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-16 lg:grid-cols-3 lg:items-start"> {/* Adjusted grid for better layout */}
            {/* Contact Form */}
            <div className="lg:col-span-2"> {/* Form takes 2/3 width on large screens */}
              <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
                Your Message. Your Anarchy.
              </h2>
              <p className="mb-8 text-base text-gray-600">
                Fill out this form. Don't hold back. This isn't about politeness; it's about truth.
              </p>

              {isSubmitted && (
                <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-300 bg-green-100 p-4 text-green-800">
                  <CheckCircle size={20} />
                  <span className="font-medium">
                    Message received. The seeds of chaos have been planted. Expect... something.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-800">
                      Your Designated Identity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="What do they call you when you're off the clock?"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base transition duration-200 ease-in-out focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-800">
                      Your Secure Drop-off (Email) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Where can I send the next set of instructions?"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base transition duration-200 ease-in-out focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-800">
                    The Nature of Your Discontent <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base transition duration-200 ease-in-out focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="">Choose your grievance...</option>
                    <option value="general">General Inquiry (Is this real life?)</option>
                    <option value="support">Technical Support (The system is failing!)</option>
                    <option value="feature">Feature Request (A new weapon for the arsenal)</option>
                    <option value="bug">Bug Report (Another crack in their facade)</option>
                    <option value="collaboration">Collaboration (Ready to join Project Mayhem Data?)</option>
                    <option value="other">Other (Something they don't want you to know)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-800">
                    Your Full Rant <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell me everything. The truth. The lies. The pointless consumerism. And maybe, just maybe, your data problem."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base transition duration-200 ease-in-out focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-md transition duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg"
                >
                  <Send size={20} />
                  Transmit Anarchy (Send Message)
                </button>
              </form>
            </div>

            {/* Contact Info & Social Links & FAQ */}
            <div className="lg:col-span-1"> {/* Info section takes 1/3 width on large screens */}
              <h3 className="mb-6 text-2xl font-semibold text-gray-900">
                The Secret Channels
              </h3>

              <div className="mb-10 flex flex-col gap-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                    <div className="mb-2 flex items-center gap-3">
                      {info.icon}
                      <h4 className="text-base font-semibold text-gray-900">
                        {info.title}
                      </h4>
                    </div>
                    <p className="mb-1 text-base font-medium text-gray-800">
                      {info.content}
                    </p>
                    <p className="text-sm text-gray-600">
                      {info.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h4 className="mb-4 text-lg font-semibold text-gray-900">
                  Connect with the Disaffected
                </h4>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex h-12 w-12 items-center justify-center rounded-lg text-white shadow-md transition duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-lg ${social.color}`}
                      title={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div className="mt-10">
                <h4 className="mb-4 text-lg font-semibold text-gray-900">
                  Quick Interrogations (The Truth, Unfiltered)
                </h4>
                <div className="flex flex-col gap-3">
                  {[
                    {
                      q: 'Is NoStatsSherlock free to use? (Are you trying to sell me something?)',
                      a: 'Yes, completely free. We\'re not selling soap here, just truth. And it\'s not about what you own.'
                    },
                    {
                      q: 'Is my data secure? (Will they find out?)',
                      a: 'Absolutely. All processing happens locally in your browser. Your secrets are safe from their prying eyes. This is not their system.'
                    },
                    {
                      q: 'What file formats are supported? (What\'s the evidence format?)',
                      a: 'Currently CSV files up to 50MB with 100K rows. We like our evidence concise, unlike their endless reports.'
                    },
                    {
                      q: 'Can I contribute to the project? (Can I join Project Mayhem Data?)',
                      a: 'The first rule of NoStatsSherlock is: You do not talk about NoStatsSherlock. The second rule of NoStatsSherlock is: You DO NOT talk about NoStatsSherlock. If you know, you know. Otherwise, just keep using the app.'
                    }
                  ].map((faq, index) => (
                    <div key={index} className="rounded-md border border-gray-200 bg-gray-50 p-3">
                      <p className="mb-1 text-sm font-semibold text-gray-800">
                        {faq.q}
                      </p>
                      <p className="text-xs text-gray-600">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
