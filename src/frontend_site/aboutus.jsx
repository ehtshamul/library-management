import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Award, TrendingUp, Heart, Clock, MapPin, Phone, Mail, Star, Quote, ChevronLeft, ChevronRight, Target, Eye, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState('story');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({ books: 0, members: 0, years: 0, events: 0 });
  const [hoveredMember, setHoveredMember] = useState(null);

  // Animated counters
  useEffect(() => {
    setIsVisible(true);
    const targets = { books: 500, members: 150, years: 25, events: 20 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCounters({
        books: Math.floor((targets.books / steps) * step),
        members: Math.floor((targets.members / steps) * step),
        years: Math.floor((targets.years / steps) * step),
        events: Math.floor((targets.events / steps) * step)
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { icon: BookOpen, label: 'Books Collection', value: counters.books, suffix: '+', gradient: 'from-blue-500 to-cyan-500' },
    { icon: Users, label: 'Active Members', value: counters.members, suffix: '+', gradient: 'from-purple-500 to-pink-500' },
    { icon: Award, label: 'Years of Service', value: counters.years, suffix: '', gradient: 'from-orange-500 to-red-500' },
    { icon: TrendingUp, label: 'Annual Events', value: counters.events, suffix: '+', gradient: 'from-green-500 to-emerald-500' }
  ];

  // const teamMembers = [
  //   {
  //     name: 'Dr. Sarah Mitchell',
  //     role: 'Chief Librarian',
  //     image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  //     bio: 'PhD in Library Science with 20+ years of experience. Passionate about digital transformation in libraries.',
  //     gradient: 'from-blue-500 to-purple-500'
  //   },
  //   {
  //     name: 'James Rodriguez',
  //     role: 'Head of Digital Resources',
  //     image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  //     bio: 'Technology enthusiast specializing in digital archives and e-learning platforms.',
  //     gradient: 'from-purple-500 to-pink-500'
  //   },
  //   {
  //     name: 'Emily Chen',
  //     role: 'Community Engagement Manager',
  //     image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  //     bio: 'Dedicated to creating inclusive programs that connect diverse communities through literature.',
  //     gradient: 'from-pink-500 to-red-500'
  //   },
  //   {
  //     name: 'Michael Thompson',
  //     role: 'Acquisitions Director',
  //     image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
  //     bio: 'Expert in collection development with a keen eye for emerging literary trends.',
  //     gradient: 'from-green-500 to-teal-500'
  //   },
  //   {
  //     name: 'Lisa Anderson',
  //     role: 'Youth Services Coordinator',
  //     image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
  //     bio: 'Creating magical reading experiences for children and young adults for over a decade.',
  //     gradient: 'from-orange-500 to-yellow-500'
  //   },
  //   {
  //     name: 'David Kumar',
  //     role: 'Archives Specialist',
  //     image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
  //     bio: 'Preserving historical documents and rare collections with cutting-edge conservation techniques.',
  //     gradient: 'from-indigo-500 to-blue-500'
  //   }
  // ];

  const testimonials = [
    {
      name: 'Rachel Green',
      role: 'Regular Member',
      text: 'This library transformed my reading habits. The staff recommendations are always spot-on, and the digital platform makes borrowing so convenient!',
      rating: 5
    },
    {
      name: 'John Davis',
      role: 'Student',
      text: 'The study spaces and research support have been invaluable during my academic journey. Best library I have ever been to!',
      rating: 5
    },
    {
      name: 'Maria Garcia',
      role: 'Parent',
      text: 'My kids love the children\'s section and story time sessions. It\'s become our favorite weekend destination as a family.',
      rating: 5
    }
  ];

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To provide universal access to knowledge and foster a love for reading in our community through innovative services and inclusive programs.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description: 'To be the leading community hub for learning, discovery, and cultural enrichment, adapting to the evolving needs of our diverse community.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Heart,
      title: 'Our Values',
      description: 'Excellence, Inclusivity, Innovation, Community, and Integrity guide everything we do. We believe in the transformative power of literature.',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      {/* Hero Section */}
      <section className={`relative pt-20 pb-16 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-2xl">
              <BookOpen className="w-10 h-10" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              About Our Library
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
              Connecting communities through the power of knowledge for over 25 years
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 delay-${index * 100} transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} hover:scale-105 shadow-xl`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                      {stat.value.toLocaleString()}{stat.suffix}
                    </div>
                    <div className="text-slate-400 text-sm">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className={`group p-8 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 delay-${index * 200} transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} hover:scale-105 shadow-xl`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 md:p-12 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <Sparkles className="w-8 h-8 text-yellow-400" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Our Story
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
                <p>
                  Founded in 2025, our library began as a small community initiative with just 5,000 books and a dream to make knowledge accessible to everyone. What started in a modest building has grown into a thriving hub of learning and culture.
                </p>
                <p>
                  Today, we proudly serve over 150 active members with a collection of more than 500 books, e-books, audiobooks, and digital resources. Our state-of-the-art facility includes dedicated spaces for children, teens, and adults, as well as modern study rooms and collaborative workspaces.
                </p>
                <p>
                  We've embraced digital innovation while preserving the timeless value of physical books. Our mobile app, online catalog, and virtual programs ensure that knowledge is available anytime, anywhere.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700/50">
                  <img 
                    src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&h=600&fit=crop" 
                    alt="Library Interior"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl opacity-50 blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Team Section */}
      {/* <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-xl text-slate-300">
              Passionate professionals dedicated to serving our community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className={`group relative transition-all duration-500 delay-${index * 100} transform ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onMouseEnter={() => setHoveredMember(index)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <div className="relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden hover:border-slate-600/50 transition-all duration-300 shadow-xl hover:shadow-2xl">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-t ${member.gradient} opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end p-6`}>
                    <p className="text-white text-sm leading-relaxed transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {member.bio}
                    </p>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                    <p className="text-purple-400 font-semibold">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Testimonials */}
      <section className="relative py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              What Our Members Say
            </h2>
          </div>

          <div className="relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-12 shadow-2xl">
            <Quote className="w-16 h-16 text-purple-500 opacity-50 mb-6" />
            
            <div className="min-h-48 relative">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 ${
                    currentTestimonial === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                  }`}
                >
                  <p className="text-2xl text-slate-200 mb-6 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div>
                    <div className="font-bold text-xl">{testimonial.name}</div>
                    <div className="text-purple-400">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length)}
                className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCurrentTestimonial((currentTestimonial + 1) % testimonials.length)}
                className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl border border-blue-500/30 p-12 shadow-2xl">
            <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Visit Us Today
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Location</h3>
                  <p className="text-slate-300">University of lahore <strong> department information management  </strong></p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Hours</h3>
                  <p className="text-slate-300">Mon-Fri: 8AM-9PM<br />Sat-Sun: 9AM-6PM</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Contact</h3>
                  <p className="text-slate-300">Phone: +923160143685<br />Email: ehtshamhaqnawaz@gmail.com</p>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
                <Link to="/discover">
              <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105">
               Visit Library digitally 
              </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
    
    </div>
  );
}