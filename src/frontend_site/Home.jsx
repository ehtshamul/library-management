import React, { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  User,
  MapPin,
  Phone,
  Calendar,
  Zap,
  Star,
  ShieldCheck,
  Award,
  Users,
  ChevronRight,
  Clock,
  Globe,
  Menu,
  X,
  ArrowRight,
  TrendingUp,
  Download,
  PlayCircle,
  Mail,
} from "lucide-react";
import Nav from "../components/Nav.jsx";
import { Link } from "react-router-dom";

// -------------------- DATA --------------------

const libraryHighlights = [
  {
    icon: ShieldCheck,
    title: "Secure Digital Access",
    description: "24/7 access to ebooks, audiobooks, and journals from anywhere.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Award,
    title: "Vast Collection",
    description: "Over 5000 titles spanning fiction, academic, and professional fields.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Dedicated Study Zones",
    description: "Quiet rooms and collaborative spaces available for booking.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: BookOpen,
    title: "Expert Staff",
    description: "Librarians and researchers ready to assist with your inquiries.",
    color: "from-green-500 to-teal-500",
  },
  {
    icon: Star,
    title: "Community Programs",
    description: "Workshops, book clubs, and events for all ages.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: TrendingUp,
    title: "Latest Resources",
    description: "Stay updated with newest releases and trending publications.",
    color: "from-pink-500 to-rose-500",
  },
];

const upcomingEvents = [
  { id: 1, title: "Creative Writing Workshop", date: "Dec 10th", time: "6:00 PM", location: "Meeting Room A", spots: 12 },
  { id: 2, title: "Digital Literacy for Seniors", date: "Dec 15th", time: "10:00 AM", location: "Computer Lab", spots: 8 },
  { id: 3, title: "Book Club: Sci-Fi Edition", date: "Dec 18th", time: "7:30 PM", location: "The Atrium", spots: 15 },
];

const libraryServices = [
  { icon: Zap, title: "3D Printing & Makerspace", description: "Access to high-tech tools for creative projects.", color: "bg-yellow-500" },
  { icon: Globe, title: "Digital Archives", description: "Explore rare historical documents and local history records.", color: "bg-blue-500" },
  { icon: BookOpen, title: "Interlibrary Loan", description: "Request books not currently in our collection from partner libraries.", color: "bg-purple-500" },
  { icon: Mail, title: "Research Assistance", description: "Get help from expert librarians for your academic projects.", color: "bg-green-500" },
  { icon: Download, title: "Digital Downloads", description: "Download ebooks, audiobooks, and magazines instantly.", color: "bg-pink-500" },
  { icon: Calendar, title: "Event Hosting", description: "Book spaces for your community meetings and events.", color: "bg-indigo-500" },
];

const mockTestimonials = [
  { name: "Ehtsham ul haq", quote: "The digital access is seamless and the staff are incredibly helpful.", rating: 5, role: "Student" },
  { name: "Haider Ali", quote: "The quiet study zones are perfect for academic work.", rating: 5, role: "Researcher" },
  { name: "Ayesha Khan", quote: "The community programs connected me with fellow book lovers.", rating: 4, role: "Book Enthusiast" },
];

const stats = [
  { value: "5000+", label: "Books Available" },
  { value: "2000+", label: "Active Members" },
  { value: "150+", label: "Events Annually" },
  { value: "24/7", label: "Digital Access" },
];

// -------------------- COMPONENTS --------------------

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-white"
      }`}
    >
      <Nav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Smart Library
            </h1>
          </div> */}

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Features</a>
            <a href="#events" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Events</a>
            <a href="#services" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Services</a>
            <a href="#contact" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
          
           
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium">Features</a>
              <a href="#events" className="text-gray-700 hover:text-indigo-600 font-medium">Events</a>
              <a href="#services" className="text-gray-700 hover:text-indigo-600 font-medium">Services</a>
              <a href="#contact" className="text-gray-700 hover:text-indigo-600 font-medium">Contact</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

const Hero = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 pt-20">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(168,85,247,0.1),transparent_50%)]"></div>
    
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 font-medium mb-8 animate-bounce">
        <Star className="w-4 h-4 fill-indigo-700" />
        <span>Welcome to Your Knowledge Hub</span>
      </div>

      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
        Discover, Learn &<br />
        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Grow Together
        </span>
      </h1>

      <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
        Your gateway to 5000+ books, digital resources, and a vibrant community of learners
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
        <button className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
          <BookOpen className="w-5 h-5" />
          <Link to="/discover" >
          Browse Collection
          </Link>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <button className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-xl border-2 border-gray-200 hover:border-indigo-600 hover:text-indigo-600 transition-all duration-300 flex items-center justify-center gap-2">
          <PlayCircle className="w-5 h-5" />
          Watch Tour
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {stat.value}
            </div>
            <div className="text-gray-600 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const HighlightCard = ({ icon: Icon, title, description, color }) => (
  <div className="group relative bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-2xl hover:border-transparent transition-all duration-500 overflow-hidden">
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
    
    <div className="relative z-10">
      <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
    
    <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full -mr-16 -mb-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
  </div>
);

const EventCard = ({ event }) => (
  <div className="group relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 overflow-hidden">
    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top"></div>
    
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
        <Calendar className="w-6 h-6 text-white" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{event.title}</h4>
        
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
            <Clock className="w-4 h-4" />
            {event.date} • {event.time}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            {event.location}
          </p>
          <span className="text-xs text-gray-400">{event.spots} spots left</span>
        </div>
      </div>
      
      <ChevronRight className="flex-shrink-0 w-5 h-5 text-indigo-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </div>
  </div>
);

const ServiceCard = ({ icon: Icon, title, description, color }) => (
  <div className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
    <div className="flex items-start gap-4">
      <div className={`flex-shrink-0 w-12 h-12 ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const TestimonialCard = ({ quote, name, rating, role }) => (
  <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 rounded-3xl text-white shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
    
    <div className="relative z-10">
      <div className="flex gap-1 mb-4">
        {Array(rating).fill(0).map((_, i) => (
          <Star key={i} className="w-5 h-5 text-amber-300 fill-amber-300" />
        ))}
      </div>
      
      <p className="text-lg leading-relaxed mb-6 font-medium">{quote}</p>
      
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <User className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-white">{name}</p>
          <p className="text-sm text-white/80">{role}</p>
        </div>
      </div>
    </div>
  </div>
);

const Section = ({ id, title, subtitle, children }) => (
  <section id={id} className="py-20">
    <div className="text-center mb-16">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">{title}</h2>
      {subtitle && <p className="text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
    {children}
  </section>
);

// -------------------- MAIN --------------------

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* HIGHLIGHTS */}
        <Section 
          id="features"
          title="Why Choose Our Library?" 
          subtitle="Explore the features that make us the premier learning destination"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {libraryHighlights.map((h, i) => (
              <HighlightCard key={i} {...h} />
            ))}
          </div>
        </Section>

        {/* EVENTS */}
        <Section 
          id="events"
          title="Upcoming Events" 
          subtitle="Join our vibrant community through workshops and meetups"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="text-center">
            <button className="group px-8 py-4 bg-indigo-50 border-2 border-indigo-600 text-indigo-700 font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300 flex items-center gap-2 mx-auto">
              View All Events
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </Section>

        {/* MEMBERSHIP CTA */}
        <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 md:p-16 mb-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-white">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-extrabold mb-4">Join Our Community Today</h2>
              <p className="text-xl opacity-90 max-w-xl">Get unlimited access to our entire collection and exclusive member benefits</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-white text-indigo-700 font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <Link to="/login">   Get Library Card</Link>
              
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <Section 
          id="services"
          title="Our Services" 
          subtitle="Comprehensive resources and support for every learning need"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {libraryServices.map((service, i) => (
              <ServiceCard key={i} {...service} />
            ))}
          </div>
        </Section>

        {/* TESTIMONIALS */}
        <Section title="What Our Members Say" subtitle="Join thousands of satisfied library members">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockTestimonials.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </Section>

        {/* CONTACT */}
        <Section 
          id="contact"
          title="Visit Us" 
          subtitle="We're here to help you on your learning journey"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Address</h3>
              <p className="text-gray-600">Punjab University Lahore</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hours</h3>
              <p className="text-gray-600">Mon–Fri: 9am–8pm<br/>Sat: 10am–6pm</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Contact</h3>
              <p className="text-gray-600">03160143685<br/>info@library.org</p>
            </div>
          </div>
        </Section>

      </main>

      {/* FOOTER */}
      
    </div>
  );
}