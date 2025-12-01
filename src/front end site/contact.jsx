import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { submitContactForm } from "../store/landing";
import { useDispatch, } from 'react-redux';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const dispatch = useDispatch();


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    // Dispatch the submitContactForm action
    try {
      // If using Redux Toolkit asyncThunk, use unwrap() to get the fulfilled payload or throw on rejected
      const response = await dispatch(submitContactForm(formData)).unwrap();
      toast.success('Your message has been sent successfully!');
      console.log('Contact submit response:', response);

      // Clear form after successful send
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again later.');
      console.error('Error submitting contact form:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100 to-purple-100 py-16 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <ToastContainer position="top-right" autoClose={3000} />
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Contact <span className="text-blue-600">Us</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have questions or need help? We’re here to assist you. Fill out the form below and we’ll get back to you shortly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Contact Information Cards */}
          <div className="md:col-span-1 space-y-6">
            {/* Info Cards */}
            {[
              { icon: Mail, title: 'Email', color: 'bg-blue-500', lines: ['Wonder Stack Library', 'info@company.com'] },
              { icon: Phone, title: 'Phone', color: 'bg-green-500', lines: ['+92 316143685', '+92 3160143685'] },
              { icon: MapPin, title: 'Address', color: 'bg-purple-500', lines: ['punjab university lahore ', 'Lahore, Punjab', 'Pakistan'] },
              { icon: Clock, title: 'Business Hours', color: 'bg-orange-500', lines: ['Mon - Fri: 9 AM - 6 PM', 'Sat: 10 AM - 4 PM', 'Sun: Closed'] },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-md rounded-2xl shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 p-6 border border-gray-100"
              >
                <div className="flex items-start">
                  <div className={`flex items-center justify-center h-12 w-12 rounded-xl ${item.color} text-white shadow-md`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <div className="mt-2 space-y-1 text-gray-600 text-sm">
                      {item.lines.map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-10 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField label="Full Name *" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
                  <InputField label="Email Address *" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" />
                  <InputField label="Subject *" name="subject" value={formData.subject} onChange={handleChange} placeholder="How can we help?" />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none placeholder-gray-400"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-xl"
                >
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </button>

                <p className="text-sm text-gray-500 text-center">
                  * Required fields. We'll get back to you within 24-48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-10 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How to Reach Us</h2>
          <div className="grid md:grid-cols-3 gap-8 text-gray-600">
            <InfoBox title="For General Inquiries" text="Email us at support@company.com or call our main line during business hours." />
            <InfoBox title="For Sales" text="Contact our sales team at ehtshamhaq@gmail.com or call +92 316143685 ext. 101" />
            <InfoBox title="For Support" text="Technical support available 24/7 via ehtshamhaq@gmail.com or our online chat." />
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponents for cleaner code
const InputField = ({ label, name, type = 'text', value, onChange, placeholder }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-400"
      placeholder={placeholder}
    />
  </div>
);

const InfoBox = ({ title, text }) => (
  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-all duration-300">
    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm leading-relaxed">{text}</p>
  </div>
);
