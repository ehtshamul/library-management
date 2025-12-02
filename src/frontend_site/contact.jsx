import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { submitContactForm } from "../store/landing";
// Adjust the import based on your store structure
import { useDispatch } from 'react-redux';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // REPLACE THIS SECTION WITH YOUR REDUX DISPATCH
      // Example:
      // const response = await dispatch(submitContactForm(formData)).unwrap();

      // Simulating API call - remove this in production
      const resp = await dispatch(submitContactForm(formData)).unwrap();
      showNotification('success', 'Message sent successfully! We\'ll get back to you soon.');


      // Clear form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      showNotification('error', 'Failed to send message. Please try again.');
      console.error('Error submitting contact form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Notification Toast */}
      {notification ? (
        <div className="fixed top-6 right-6 z-50 transition-all duration-300 ease-out">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-lg ${notification?.type === 'success'
              ? 'bg-green-500/90 text-white'
              : 'bg-red-500/90 text-white'
            }`}>
            {notification?.type === 'success' ? (
              <CheckCircle className="h-6 w-6 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-6 w-6 flex-shrink-0" />
            )}
            <span className="font-medium">{notification?.message}</span>
          </div>
        </div>
      ) : null}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold tracking-wide uppercase">
              Get in Touch
            </span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tight">
            Let's Start a
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mt-2">
              Conversation
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have a question or feedback? We're here to help and would love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Contact Information Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Fill out the form and our team will get back to you within 24 hours.
              </p>

              <div className="space-y-6">
                <ContactInfoItem
                  icon={Mail}
                  label="Email"
                  value="info@company.com"
                  subValue="ehtshamhaq@gmail.com"
                  bgColor="bg-blue-500"
                />
                <ContactInfoItem
                  icon={Phone}
                  label="Phone"
                  value="+92 316143685"
                  subValue="+92 3160143685"
                  bgColor="bg-green-500"
                />
                <ContactInfoItem
                  icon={MapPin}
                  label="Location"
                  value="Punjab University"
                  subValue="Lahore, Punjab, Pakistan"
                  bgColor="bg-purple-500"
                />
                <ContactInfoItem
                  icon={Clock}
                  label="Working Hours"
                  value="Mon - Fri: 9 AM - 6 PM"
                  subValue="Sat: 10 AM - 4 PM"
                  bgColor="bg-orange-500"
                />
              </div>
            </div>

            {/* Quick Help Section */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl shadow-xl p-8 text-white hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-xl font-bold mb-4">Need Quick Help?</h3>
              <p className="text-blue-100 mb-6 leading-relaxed">
                Check out our FAQ section or start a live chat for immediate assistance.
              </p>
              <div className="space-y-3">
                <button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  Visit FAQ
                </button>
                <button className="w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:-translate-y-0.5">
                  Start Live Chat
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 lg:p-10 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormInput
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                  <FormInput
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormInput
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                  />
                  <FormInput
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-3">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none placeholder-gray-400 text-gray-900"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 transition-transform" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-500 text-center leading-relaxed">
                  By submitting this form, you agree to our privacy policy. We'll respond within 24-48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info Cards */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <InfoCard
            title="General Inquiries"
            description="For general questions and information about our services."
            contact="support@company.com"
          />
          <InfoCard
            title="Sales Team"
            description="Interested in our products? Our sales team is ready to help."
            contact="ehtshamhaq@gmail.com"
          />
          <InfoCard
            title="Technical Support"
            description="Need technical assistance? We're available 24/7 to help."
            contact="ehtshamhaq@gmail.com"
          />
        </div>
      </div>
    </div>
  );
}

// Subcomponents
const ContactInfoItem = ({ icon: Icon, label, value, subValue, bgColor }) => (
  <div className="flex items-start gap-4 group">
    <div className={`flex-shrink-0 w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
      {subValue && <p className="text-sm text-gray-600">{subValue}</p>}
    </div>
  </div>
);

const FormInput = ({ label, name, type = 'text', value, onChange, placeholder, required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-bold text-gray-900 mb-3">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder-gray-400 text-gray-900"
      placeholder={placeholder}
    />
  </div>
);

const InfoCard = ({ title, description, contact }) => (
  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{description}</p>
    <p className="text-sm font-semibold text-blue-600">{contact}</p>
  </div>
);