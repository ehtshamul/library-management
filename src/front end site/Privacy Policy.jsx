import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, Database, UserCheck, Bell, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    {
      id: 'collection',
      icon: Database,
      title: 'Information We Collect',
      content: 'We collect personal information including your name, email address, phone number, and library card details when you register. Additionally, we track your borrowing history, reading preferences, and library visit records to enhance your experience.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'usage',
      icon: Eye,
      title: 'How We Use Your Information',
      content: 'Your data helps us manage book loans, send due date reminders, recommend books based on your interests, and improve our services. We analyze usage patterns to optimize our collection and resources.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'security',
      icon: Lock,
      title: 'Data Security',
      content: 'We implement industry-standard security measures including encryption, secure servers, and regular security audits. Your payment information is processed through secure, PCI-compliant gateways.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 'sharing',
      icon: UserCheck,
      title: 'Information Sharing',
      content: 'We do not sell your personal information. Data may be shared with third-party services for payment processing and email notifications, but only as necessary to provide our services.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Communication Preferences',
      content: 'You can control notification settings for due dates, new arrivals, and library events. We respect your communication preferences and provide easy opt-out options.',
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      id: 'rights',
      icon: FileText,
      title: 'Your Rights',
      content: 'You have the right to access, update, or delete your personal information. You can request a copy of your data or ask us to remove your account at any time.',
      gradient: 'from-teal-500 to-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-75" />
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-150" />
      </div>

      {/* Header */}
      <header className={`relative pt-20 pb-12 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-2xl animate-bounce">
            <Shield className="w-12 h-12" />
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Your privacy is our priority. Learn how we protect and use your information.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Last Updated: November 2025
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto px-6 pb-20">
        {/* Introduction Card */}
        <div className={`mb-12 p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl transition-all duration-1000 delay-200 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <p className="text-lg text-slate-300 leading-relaxed">
            At Library Management System, we are committed to protecting your personal information and your right to privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services. 
            Please read this policy carefully to understand our practices regarding your data.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <div
                key={section.id}
                className={`transition-all duration-700 delay-${index * 100} transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
              >
                <div
                  className="group bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden hover:border-slate-600/50 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl"
                  onClick={() => setActiveSection(isActive ? null : section.id)}
                >
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-14 h-14 bg-gradient-to-br ${section.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                          {section.title}
                        </h2>
                      </div>
                    </div>
                    <div className={`transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}>
                      {isActive ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                    </div>
                  </div>
                  
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6 pt-2">
                      <div className={`w-full h-0.5 bg-gradient-to-r ${section.gradient} mb-4 rounded-full`} />
                      <p className="text-slate-300 leading-relaxed text-lg">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className={`mt-16 p-8 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl border border-blue-500/30 shadow-2xl transition-all duration-1000 delay-700 transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Questions About Privacy?
          </h2>
          <p className="text-slate-300 text-center text-lg mb-6">
            If you have any questions or concerns about this Privacy Policy, please contact our Data Protection Officer.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105">
                Contact Us
                </button>
                </Link>
           
          
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-slate-400 text-sm">
          <p>© 2025 Library Management System. All rights reserved.</p>
          <p className="mt-2">This policy is effective as of November 16, 2025</p>
        </div>
      </main>
    </div>
  );
}