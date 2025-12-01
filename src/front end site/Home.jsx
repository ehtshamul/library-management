import React, { useState } from 'react';
import { 
  Search, BookOpen, User, MapPin, Phone, Mail, Calendar, Zap, Star, ShieldCheck, Award, Users, ChevronRight, Clock, Globe // Added Globe and Clock here
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- MOCK DATA ---


const libraryHighlights = [
  { icon: ShieldCheck, title: 'Secure Digital Access', description: '24/7 access to ebooks, audiobooks, and journals from anywhere.' },
  { icon: Award, title: 'Vast Collection', description: 'Over 500,000 titles spanning fiction, academic, and professional fields.' },
  { icon: Users, title: 'Dedicated Study Zones', description: 'Quiet rooms and collaborative spaces available for booking.' },
];

const upcomingEvents = [
  { id: 1, title: 'Creative Writing Workshop', date: 'Dec 10th', time: '6:00 PM', location: 'Meeting Room A' },
  { id: 2, title: 'Digital Literacy for Seniors', date: 'Dec 15th', time: '10:00 AM', location: 'Computer Lab' },
  { id: 3, title: 'Book Club: Sci-Fi Edition', date: 'Dec 18th', time: '7:30 PM', location: 'The Atrium' },
];

const libraryServices = [
  { icon: Zap, title: '3D Printing & Makerspace', description: 'Access to high-tech tools for creative projects.' },
  { icon: Globe, title: 'Digital Archives', description: 'Explore rare historical documents and local history records.' },
  { icon: BookOpen, title: 'Interlibrary Loan', description: 'Request books not currently in our collection from partner libraries.' },
];

const mockTestimonials = [
  { name: 'Sarah J.', quote: 'The digital access is seamless and the staff are incredibly helpful. A fantastic resource!', rating: 5 },
  { name: 'Mark D.', quote: 'I use the quiet study zones every week. They are perfect for focused academic work.', rating: 5 },
];

// --- REUSABLE COMPONENTS ---

// 1. Search Bar Component (Kept for user interaction)
// const SearchBar = () => {
//   const [query, setQuery] = useState('');

//   return (
//     <div className="flex items-center w-full max-w-4xl mx-auto bg-white p-2 rounded-full shadow-2xl border-2 border-indigo-100 transition-shadow">
//       <input
//         type="text"
//         placeholder="Search the catalogue (books, authors, topics)..."
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         className="flex-grow p-3 text-lg text-gray-700 bg-transparent focus:outline-none placeholder-gray-400"
//       />
//       <button 
//         className="flex items-center justify-center p-3 sm:p-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-lg ml-2"
//         onClick={() => console.log(`Searching for: ${query}`)}
//         aria-label="Execute Search"
//       >
//         <Search className="w-6 h-6" />
//       </button>
//     </div>
//   );
// };

// 2. Highlight/Feature Card
const HighlightCard = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-start p-6 bg-white rounded-xl shadow-lg border-t-4 border-indigo-500 hover:shadow-2xl transition-all duration-300">
    <Icon className="w-8 h-8 text-indigo-600 mb-4" />
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// 3. Event Card
const EventCard = ({ event }) => (
  <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex items-start space-x-4 hover:bg-indigo-50 transition-colors">
    <div className="flex-shrink-0 text-center p-3 rounded-lg bg-indigo-100 text-indigo-700 font-bold">
      <Calendar className="w-6 h-6" />
    </div>
    <div className="flex-grow">
      <h4 className="text-lg font-semibold text-gray-800">{event.title}</h4>
      <p className="text-sm text-gray-500">
        <span className="font-medium text-indigo-600 mr-2">{event.date}</span> at {event.time}
      </p>
      <p className="text-xs text-gray-400 mt-1">{event.location}</p>
    </div>
    <button className="flex-shrink-0 text-indigo-600 hover:text-indigo-800 self-center">
        <ChevronRight className="w-5 h-5" />
    </button>
  </div>
);

// 4. Testimonial Card
const TestimonialCard = ({ quote, name, rating }) => (
  <div className="bg-gray-800 p-6 rounded-xl text-white shadow-xl h-full flex flex-col justify-between">
    <p className="italic text-lg mb-4 leading-relaxed">"{quote}"</p>
    <div>
      <div className="flex text-amber-400 mb-1">
        {Array(rating).fill(0).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
      </div>
      <p className="font-semibold text-indigo-300">- {name}</p>
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---
export default function  Home  () {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* Top Bar for User Identity and Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          {/* Logo */}
          
          
          {/* User Profile and Actions */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-indigo-600 transition-colors p-2 rounded-full bg-gray-100 hover:bg-indigo-50" aria-label="Favorites">
              <Star className="w-5 h-5" />
            </button>
            <button className="flex items-center p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors" aria-label="User Profile">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        {/* 1. Hero Section / Banner */}
        <section className="bg-indigo-700 text-white p-8 sm:p-12 rounded-2xl shadow-2xl mb-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Unlock a World of Knowledge
            </h1>
            <p className="mt-3 text-xl opacity-90">
              Your gateway to physical, digital, and community resources.
            </p>
          </div>
          
          {/* Central Search Bar */}
     
        </section>

        {/* 2. Library Highlights / Features */}
        <section aria-labelledby="highlights-heading" className="mb-16">
          <h2 id="highlights-heading" className="text-3xl font-bold text-gray-900 text-center mb-8">
            Key Library Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {libraryHighlights.map((highlight, index) => (
              <HighlightCard key={index} {...highlight} />
            ))}
          </div>
        </section>
        
        {/* 3. Events & Workshops */}
        <section aria-labelledby="events-heading" className="mb-16">
          <h2 id="events-heading" className="text-3xl font-bold text-gray-900 text-center mb-8">
            Upcoming Events & Workshops
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <div className="text-center mt-8">
             <button className="px-6 py-3 text-lg font-medium bg-indigo-50 border border-indigo-600 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors shadow-md">
                View Full Calendar
            </button>
          </div>
        </section>

        {/* 4. Membership Information */}
        <section aria-labelledby="membership-heading" className="mb-16 bg-gray-100 p-10 rounded-2xl shadow-inner border border-gray-200">
            <div className="lg:flex justify-between items-center space-y-6 lg:space-y-0">
                <div>
                    <h2 id="membership-heading" className="text-3xl font-extrabold text-gray-900">
                        Join Our Community
                    </h2>
                    <p className="mt-2 text-xl text-gray-600 max-w-2xl">
                        A library card is your passport to endless resources, both physical and digital.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors">
                       
                        <Link
                        to="/login"
                        >  Get a Library Card</Link >
                    </button>
                    <button className="px-6 py-3 bg-white border border-indigo-600 text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-indigo-50 transition-colors">
                        Renew Membership
                    </button>
                </div>
            </div>
        </section>

        {/* 5. Library Services */}
        <section aria-labelledby="services-heading" className="mb-16">
          <h2 id="services-heading" className="text-3xl font-bold text-gray-900 text-center mb-8">
            Explore Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {libraryServices.map((service, index) => (
              <HighlightCard key={index} {...service} />
            ))}
          </div>
        </section>

        {/* 6. Testimonials */}
        <section aria-labelledby="testimonials-heading" className="mb-16">
          <h2 id="testimonials-heading" className="text-3xl font-bold text-gray-900 text-center mb-8">
            What Our Patrons Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mockTestimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </section>

        {/* 7. Contact Information */}
        <section aria-labelledby="contact-heading" className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-200">
          <h2 id="contact-heading" className="text-3xl font-bold text-gray-900 text-center mb-8">
            Visit Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <MapPin className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Address</h3>
              <p className="text-gray-600">Pujab university lahore ,information management </p>
            </div>
            <div className="p-4">
              <Clock className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Operating Hours</h3>
              <p className="text-gray-600">Mon-Fri: 9am - 8pm | Sat: 10am - 6pm</p>
            </div>
            <div className="p-4">
              <Phone className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Contact</h3>
              <p className="text-gray-600">03160143685 | info@library.org</p>
            </div>
          </div>
        </section>

      </main>
      

    </div>
  );
};
