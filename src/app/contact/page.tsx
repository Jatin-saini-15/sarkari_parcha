'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ContactPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-4 py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse-glow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft border border-blue-200/50 mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-gray-700">We&apos;re Here to Help</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8">
            <span className="gradient-text-primary">Get in Touch</span>
            <br />
            <span className="text-gray-800">With Our Team</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have questions about our courses? Need technical support? Or want to share feedback? We&apos;d love to hear from you and help you succeed.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <span>📞</span>
              <span>Ways to Reach Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Choose Your <span className="gradient-text-primary">Preferred</span> Contact Method
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            {[
              {
                icon: "📧",
                title: "Email Support",
                description: "Get detailed responses within 24 hours",
                contact: "support@sarkariparcha.com",
                color: "from-blue-500 to-blue-600",
                bgColor: "from-blue-50 to-blue-100"
              },
              {
                icon: "💬",
                title: "Live Chat",
                description: "Instant help during business hours",
                contact: "Available 9 AM - 9 PM",
                color: "from-purple-500 to-purple-600",
                bgColor: "from-purple-50 to-purple-100"
              },
            ].map((method, index) => (
              <div key={index} className="group">
                <div className={`bg-gradient-to-br ${method.bgColor} rounded-2xl p-8 border border-gray-200/50 hover:border-blue-300/50 transition-all duration-500 hover:shadow-strong transform hover:scale-105 text-center`}>
                  <div className={`w-20 h-20 bg-gradient-to-br ${method.color} rounded-2xl flex items-center justify-center mb-6 shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110 mx-auto`}>
                    <span className="text-3xl">{method.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {method.description}
                  </p>
                  <p className="text-lg font-semibold text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                    {method.contact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-strong border border-gray-200/50 relative overflow-hidden">
                <div className="absolute top-4 right-4 w-20 h-20 bg-blue-500/5 rounded-full blur-xl"></div>
                
                <div className="relative z-10">
                  <div className="mb-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                      Send Us a <span className="gradient-text-primary">Message</span>
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Fill out the form below and we&apos;ll get back to you as soon as possible. All fields marked with * are required.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="technical">Technical Support</option>
                          <option value="billing">Billing & Payments</option>
                          <option value="course">Course Information</option>
                          <option value="feedback">Feedback & Suggestions</option>
                          <option value="partnership">Partnership</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        placeholder="Brief subject of your message"
                      />
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
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
                        placeholder="Please describe your inquiry in detail..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-medium hover:shadow-strong hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 text-lg relative overflow-hidden group"
                    >
                      <span className="relative z-10">Send Message</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* Business Hours */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 border border-green-200/50">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Business Hours</h3>
                <div className="space-y-4">
                  {[
                    { day: "Monday - Friday", hours: "9:00 AM - 9:00 PM" },
                    { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
                    { day: "Sunday", hours: "10:00 AM - 4:00 PM" },
                  ].map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                      <span className="font-semibold text-gray-800">{schedule.day}</span>
                      <span className="text-green-600 font-medium">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-yellow-100 rounded-xl border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Live chat support is available during business hours. Email support is available 24/7 with responses within 24 hours.
                  </p>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 border border-blue-200/50">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Response Times</h3>
                <div className="space-y-4">
                  {[
                    { method: "Email Support", time: "Within 24 hours", icon: "📧" },
                    { method: "Live Chat", time: "Instant response", icon: "💬" },
                    { method: "General Inquiries", time: "Same business day", icon: "❓" },
                    { method: "Technical Issues", time: "Within 4 hours", icon: "🔧" },
                  ].map((response, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{response.icon}</span>
                        <span className="font-semibold text-gray-800">{response.method}</span>
                      </div>
                      <span className="text-blue-600 font-medium">{response.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Tips */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl p-8 border border-purple-200/50">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Get Faster Help</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-1">💡</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Be Specific</h4>
                      <p className="text-sm text-gray-600">Include details about your issue, course name, and any error messages you see.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-1">📱</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Include Screenshots</h4>
                      <p className="text-sm text-gray-600">Visual information helps us understand and resolve your issue faster.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-1">🕒</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Check Our FAQ</h4>
                      <p className="text-sm text-gray-600">Many common questions are answered in our FAQ section below.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-6">
              <span>❓</span>
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Quick <span className="gradient-text-primary">Answers</span> to Common Questions
            </h2>
            <p className="text-lg text-gray-600">
              Find instant answers to the most common questions our students ask.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How can I access my course materials?",
                answer: "Once you enroll in a course, you'll receive login credentials via email. You can access all materials through our student portal 24/7."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets. We also offer EMI options for premium courses."
              },
              {
                question: "Can I get a refund if I'm not satisfied?",
                answer: "Yes, we offer a 7-day money-back guarantee for all our courses. If you're not satisfied, contact us within 7 days of purchase."
              },
              {
                question: "Do you provide certificates upon completion?",
                answer: "Yes, we provide verified certificates for all completed courses. These certificates are recognized by various government organizations."
              },
              {
                question: "How often are the study materials updated?",
                answer: "Our content team updates study materials regularly based on the latest exam patterns and syllabus changes. Updates are automatically available to all enrolled students."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 border border-gray-200/50">
                <h3 className="text-lg font-bold text-gray-800 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold shadow-medium hover:shadow-strong hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200">
              View All FAQs
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your <span className="text-yellow-300">Preparation Journey?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Don&apos;t wait any longer. Join thousands of successful candidates and start preparing for your dream government job today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-medium hover:shadow-strong hover:scale-105 transition-all duration-200 text-lg">
              Browse Courses
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200 text-lg">
              Take Free Test
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 