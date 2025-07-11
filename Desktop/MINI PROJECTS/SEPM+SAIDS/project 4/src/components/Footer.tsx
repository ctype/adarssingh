import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Github, Linkedin, Mail, Heart, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: '#1f2937',
      color: '#ffffff',
      padding: '40px 0 20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '32px',
          marginBottom: '32px'
        }}>
          {/* Brand Section */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <BarChart3 size={28} color="#3b82f6" />
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                NoStatsSherlock
              </span>
            </div>
            <p style={{
              color: '#d1d5db',
              fontSize: '14px',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              Automated Exploratory Data Analysis tool that helps you understand your data 
              through instant statistical insights and beautiful visualizations.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <a
                href="https://github.com/ctype"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px',
                  backgroundColor: '#374151',
                  borderRadius: '6px',
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              >
                <Github size={20} />
              </a>
              <a
                href="https://instagram.com/adarshssn"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px',
                  backgroundColor: '#374151',
                  borderRadius: '6px',
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              >
                <Instagram size={20} />
              </a>
              <a
                href="mailto:bettercalladarsh@gmail.com"
                style={{
                  padding: '8px',
                  backgroundColor: '#374151',
                  borderRadius: '6px',
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#ffffff'
            }}>
              Quick Links
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About' },
                { to: '/contact', label: 'Contact' },
                { to: '/app', label: 'Launch App' }
              ].map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    color: '#d1d5db',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#d1d5db'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#ffffff'
            }}>
              Features
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Automated Statistics',
                'Data Visualizations',
                'Correlation Analysis',
                'Export Reports',
                'Privacy First',
                'No Registration Required'
              ].map(feature => (
                <span
                  key={feature}
                  style={{
                    color: '#d1d5db',
                    fontSize: '14px'
                  }}
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Developer Info */}
          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#ffffff'
            }}>
              Developer
            </h3>
            <div style={{
              padding: '16px',
              backgroundColor: '#374151',
              borderRadius: '8px',
              border: '1px solid #4b5563'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}>
                  A
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>
                    Adarsh
                  </div>
                  <div style={{ fontSize: '12px', color: '#d1d5db' }}>
                    Full Stack(Soap Maker)
                  </div>
                </div>
              </div>
              <p style={{
                fontSize: '12px',
                color: '#d1d5db',
                margin: 0,
                lineHeight: '1.4'
              }}>
                Dont Forget The Second Rule!!
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #374151',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#d1d5db'
          }}>
            <span>© 2024 NoStatsSherlock. Made with</span>
            <Heart size={16} color="#ef4444" fill="#ef4444" />
            <span>by Adarsh</span>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '24px',
            fontSize: '12px',
            color: '#9ca3af'
          }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Open Source</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;