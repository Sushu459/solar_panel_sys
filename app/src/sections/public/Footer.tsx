import { Link } from 'react-router-dom';
import { Sun, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, ArrowUpRight } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Projects', href: '/projects' },
    { label: 'Calculator', href: '/calculator' },
    { label: 'Contact', href: '/contact' },
  ],
  services: [
    { label: 'Residential Solar', href: '/contact' },
    { label: 'Commercial Solar', href: '/contact' },
    { label: 'Industrial Solutions', href: '/contact' },
    { label: 'Maintenance', href: '/contact' },
  ],
  resources: [
    { label: 'Solar Guide', href: '/calculator' },
    { label: 'FAQs', href: '/contact' },
    { label: 'Blog', href: '#' },
    { label: 'Case Studies', href: '/projects' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export default function Footer() {
  const { settings } = useData();

  return (
    <footer className="bg-[#080616] border-t border-white/10">
      <div className="border-b border-white/10 bg-gradient-to-r from-[#c4ff00]/10 via-transparent to-[#c4ff00]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-gray-200">Ready to reduce your energy costs with premium solar infrastructure?</p>
          <Link to="/contact" className="inline-flex items-center gap-2 text-[#055962] hover:text-[#a790ed] font-semibold text-sm transition-colors">
            Talk to our team
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#dac314] to-orange-400 flex items-center justify-center">
                <Sun className="w-6 h-6 text-black" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">




                  Ever Green Solar Systems
                </span>
                <span className="block text-xs text-gray-400">India</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Leading the solar revolution in India with cutting-edge installations 
              and sustainable energy solutions for homes and businesses.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {settings?.contact_email && (
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="flex items-center gap-3 text-gray-400 hover:text-[#c4ff00] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {settings.contact_email}
                </a>
              )}
              {settings?.contact_phone && (
                <a
                  href={`tel:${settings.contact_phone}`}
                  className="flex items-center gap-3 text-gray-400 hover:text-[#c4ff00] transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {settings.contact_phone}
                </a>
              )}
              {settings?.org_address && (
                <div className="flex items-start gap-3 text-gray-400">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span className="text-sm">{settings.org_address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-[#c4ff00] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-[#c4ff00] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-[#c4ff00] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-gray-500 text-sm text-center sm:text-left">
              &copy; {new Date().getFullYear()} {settings?.org_name || 'Solar Systems India'}. 
              All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#c4ff00]/20 hover:text-[#c4ff00] hover:border-[#c4ff00]/30 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>

            {/* Admin Link */}
            <Link
              to="/admin/login"
              className="flex items-center gap-1 text-gray-500 hover:text-[#c4ff00] text-sm transition-colors"
            >
              Admin
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
