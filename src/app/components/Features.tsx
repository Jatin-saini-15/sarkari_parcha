'use client';

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { features } from "../constants";
import StartFreeTrialButton from './StartFreeTrialButton';

export default function Features() {
  const { data: session } = useSession();

  // @ts-expect-error - NextAuth session type
  const isPremium = session?.user?.isPremium;
  
  const getButtonConfig = () => {
    if (!session) {
      return { text: "Get Started", href: "/auth/signup" };
    }
    if (isPremium) {
      return { text: "Explore Now", href: "/dashboard" };
    }
    return { text: "Start Free Trial", isModal: true };
  };

  const buttonConfig = getButtonConfig();

  return (
    <section className="py-24 px-4 bg-white w-full relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-100/50 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
            </svg>
            Comprehensive Learning Platform
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Everything You Need to <span className="gradient-text-primary">Succeed</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our comprehensive suite of tools and resources is designed to give you the competitive edge you need to excel in government exams.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const gradients = [
              "from-blue-500 to-blue-600",
              "from-green-500 to-green-600", 
              "from-purple-500 to-purple-600",
              "from-orange-500 to-orange-600",
              "from-red-500 to-red-600",
              "from-indigo-500 to-indigo-600"
            ];
            
            const bgGradients = [
              "from-blue-50 to-blue-100",
              "from-green-50 to-green-100",
              "from-purple-50 to-purple-100", 
              "from-orange-50 to-orange-100",
              "from-red-50 to-red-100",
              "from-indigo-50 to-indigo-100"
            ];

            return (
              <a 
                key={index} 
                href={feature.link} 
                className="group relative bg-white rounded-2xl p-8 shadow-soft hover:shadow-strong transition-all duration-300 border border-gray-200/50 hover:border-blue-300 transform hover:scale-105 overflow-hidden"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${bgGradients[index % bgGradients.length]} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${gradients[index % gradients.length]} rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-110`}>
                      <Image 
                        src={feature.icon} 
                        alt={feature.title} 
                        width={32} 
                        height={32} 
                        className="filter brightness-0 invert"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-blue-700 transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-200">
                    {feature.desc}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-200">
                    <span className="mr-2">Explore Feature</span>
                    <svg 
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-300 transition-colors duration-300"></div>
              </a>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12 border border-blue-200/50">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of successful candidates who have achieved their dreams with our comprehensive preparation platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {buttonConfig.href ? (
                <Link href={buttonConfig.href} className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-medium hover:shadow-strong hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200">
                  {buttonConfig.text}
                </Link>
              ) : (
                <StartFreeTrialButton className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-medium hover:shadow-strong hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200">
                  {buttonConfig.text}
                </StartFreeTrialButton>
              )}
              <Link href="#" className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-semibold shadow-soft hover:shadow-medium hover:border-blue-300 hover:text-blue-600 transition-all duration-200">
                View Pricing
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "50,000+", label: "Active Students", icon: "👥" },
            { number: "5000+", label: "Mock Tests", icon: "📝" },
            { number: "95%", label: "Success Rate", icon: "🎯" },
            { number: "24/7", label: "Support", icon: "💬" },
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold gradient-text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 