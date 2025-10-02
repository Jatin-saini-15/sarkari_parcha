'use client';

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { resources } from "../constants";
import StartFreeTrialButton from './StartFreeTrialButton';

const logo = "/images/Sarkari Parcha.png";

export default function Footer() {
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

  const socialLinks = [
    {
      name: "Instagram",
      href: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.16c3.2 0 3.584.012 4.85.07 1.17.056 1.97.24 2.43.41.59.22 1.01.48 1.45.92.44.44.7.86.92 1.45.17.46.354 1.26.41 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.41 2.43-.22.59-.48 1.01-.92 1.45-.44.44-.86.7-1.45.92-.46.17-1.26.354-2.43.41-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.43-.41-.59-.22-1.01-.48-1.45-.92-.44-.44-.7-.86-.92-1.45-.17-.46-.354-1.26-.41-2.43C2.172 15.634 2.16 15.25 2.16 12s.012-3.584.07-4.85c.056-1.17.24-1.97.41-2.43.22-.59.48-1.01.92-1.45.44-.44.86-.7 1.45-.92.46-.17 1.26-.354 2.43-.41C8.416 2.172 8.8 2.16 12 2.16zm0-2.16C8.736 0 8.332.012 7.052.07 5.77.128 4.87.31 4.13.54c-.77.24-1.42.56-2.07 1.21-.65.65-.97 1.3-1.21 2.07-.23.74-.41 1.64-.47 2.92C.012 8.332 0 8.736 0 12c0 3.264.012 3.668.07 4.948.058 1.28.24 2.18.47 2.92.24.77.56 1.42 1.21 2.07.65.65 1.3.97 2.07 1.21.74.23 1.64.41 2.92.47C8.332 23.988 8.736 24 12 24c3.264 0 3.668-.012 4.948-.07 1.28-.058 2.18-.24 2.92-.47.77-.24 1.42-.56 2.07-1.21.65-.65.97-1.3 1.21-2.07.23-.74.41-1.64.47-2.92.058-1.28.07-1.684.07-4.948 0-3.264-.012-3.668-.07-4.948-.058-1.28-.24-2.18-.47-2.92-.24-.77-.56-1.42-1.21-2.07-.65-.65-1.3-.97-2.07-1.21-.74-.23-1.64-.41-2.92-.47C15.668.012 15.264 0 12 0z" />
          <path d="M12 5.838A6.162 6.162 0 1 0 12 18.162 6.162 6.162 0 1 0 12 5.838zm0 10.162A3.999 3.999 0 1 1 12 8.001a3.999 3.999 0 0 1 0 7.999zm7.2-11.162a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.68 0H1.32C.59 0 0 .6 0 1.33v21.34C0 23.4.59 24 1.32 24h11.5v-9.29H9.69v-3.62h3.13V8.41c0-3.1 1.89-4.79 4.65-4.79 1.32 0 2.45.1 2.78.14v3.22h-1.91c-1.5 0-1.8.71-1.8 1.76v2.31h3.6l-.47 3.62h-3.13V24h6.13c.73 0 1.32-.6 1.32-1.33V1.33C24 .6 23.41 0 22.68 0" />
        </svg>
      ),
    },
    {
      name: "Telegram",
      href: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9.04 16.62l-.39 3.67c.56 0 .8-.24 1.09-.53l2.62-2.5 5.44 3.97c1 .55 1.72.26 1.97-.92l3.58-16.77c.36-1.66-.6-2.32-1.62-1.92L2.2 9.36c-1.62.65-1.6 1.57-.28 1.99l4.6 1.44 10.7-6.74c.5-.32.96-.14.58.2" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Success Stories Section */}
      <section className="w-full py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-40 h-40 bg-blue-200/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-purple-200/30 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Success Stories
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Your <span className="gradient-text-primary">Success</span> is Our Mission
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of successful candidates who have achieved their government job dreams with our comprehensive preparation platform.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: "🎓", value: "50,000+", label: "Students Enrolled", color: "from-blue-500 to-blue-600" },
                { icon: "📝", value: "10,000+", label: "Mock Tests Taken", color: "from-green-500 to-green-600" },
                { icon: "🏆", value: "5,000+", label: "Success Stories", color: "from-orange-500 to-orange-600" },
                { icon: "⭐", value: "4.8/5", label: "Average Rating", color: "from-purple-500 to-purple-600" },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 text-center border border-gray-200/50">
                  <div className="text-3xl mb-3">{stat.icon}</div>
                  <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-strong border border-gray-200/50">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Join Them?</h3>
              <p className="text-gray-600 mb-6">
                Start your preparation journey today with our comprehensive study materials, expert guidance, and proven strategies.
              </p>
              <div className="space-y-4">
                {buttonConfig.href ? (
                  <Link href={buttonConfig.href} className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-medium hover:shadow-strong hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 block text-center">
                    {buttonConfig.text}
                  </Link>
                ) : (
                  <StartFreeTrialButton className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-medium hover:shadow-strong hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 block text-center">
                    {buttonConfig.text}
                  </StartFreeTrialButton>
                )}
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Free Mock Tests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Expert Guidance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Promotion */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
                <span>📱</span>
                <span>Mobile App Available</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Study Anywhere, <span className="gradient-text-warm">Anytime</span>
              </h3>
              <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                Download our mobile app and take your preparation on the go. Access all features offline and never miss a study session.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <a href="https://play.google.com/store/apps/details?id=co.tarly.vewsy" className="group hover:scale-105 transition-transform duration-200">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-200 flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-blue-200">GET IT ON</span>
                      <span className="text-lg font-bold text-white">Google Play</span>
                    </div>
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                  </div>
                </a>
                <div className="group cursor-not-allowed opacity-75">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 transition-all duration-200 flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-blue-200">Coming Soon to</span>
                      <span className="text-lg font-bold text-white">App Store</span>
                    </div>
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm text-blue-200">
                <div className="flex items-center gap-2">
                  <span>⭐⭐⭐⭐⭐</span>
                  <span>4.8 Rating</span>
                </div>
                <div>50K+ Downloads</div>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-64 h-64 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-3xl blur-2xl absolute inset-0"></div>
                <Image 
                  src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80" 
                  alt="Mobile App Preview" 
                  width={280} 
                  height={280} 
                  className="relative z-10 rounded-3xl shadow-strong transform rotate-3 hover:rotate-0 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-white pt-20 pb-8 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <Image 
                    src={logo} 
                    alt="Sarkari Parcha Logo" 
                    width={48} 
                    height={48} 
                    className="rounded-xl shadow-medium" 
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                </div>
                <div>
                  <span className="text-2xl font-bold gradient-text-primary">Sarkari Parcha</span>
                  <p className="text-sm text-gray-400">Exam Preparation</p>
                </div>
              </div>
              <p className="mb-8 text-gray-300 text-sm leading-relaxed">
                Empowering government exam aspirants with comprehensive resources, expert guidance, and a supportive learning community.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.name}
                    className="bg-gray-800 hover:bg-blue-600 transition-all duration-200 rounded-xl p-3 flex items-center justify-center hover:scale-110 hover:shadow-medium border border-gray-700 hover:border-blue-500"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {Object.entries(resources).map(([section, items], i) => (
              <div key={i} className="min-w-0">
                <h4 className="font-bold mb-6 text-lg text-white tracking-wide">{section}</h4>
                <ul className="space-y-3 text-sm">
                  {items.slice(0, 6).map((item, j) => (
                    <li key={j}>
                      <Link 
                        href={getItemLink(item)} 
                        className="text-gray-300 hover:text-blue-400 transition-colors duration-200 hover:underline decoration-blue-400 block py-1"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                  {items.length > 6 && (
                    <li>
                      <Link href="/exam-categories" className="text-blue-400 hover:text-blue-300 font-semibold text-sm">
                        View All ({items.length - 6} more) →
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-12 mb-12">
            <div className="max-w-2xl mx-auto text-center">
              <h4 className="text-xl font-bold mb-4">Stay Updated</h4>
              <p className="text-gray-300 mb-6">Get the latest exam notifications, study tips, and exclusive content delivered to your inbox.</p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} <span className="font-semibold text-white">Sarkari Parcha</span>. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/about" className="hover:text-white transition-colors duration-200">About Us</Link>
              <Link href="/contact" className="hover:text-white transition-colors duration-200">Contact Us</Link>
              <Link href="/privacy" className="hover:text-white transition-colors duration-200">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors duration-200">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

// Helper function to get appropriate links for footer items
function getItemLink(item: string): string {
  const itemLower = item.toLowerCase();
  
  // SSC Exams
  if (itemLower.includes('ssc cgl')) return '/exam-categories/ssc/cgl';
  if (itemLower.includes('ssc chsl')) return '/exam-categories/ssc/chsl';
  if (itemLower.includes('ssc mts')) return '/exam-categories/ssc/mts';
  if (itemLower.includes('ssc je')) return '/exam-categories/ssc/je';
  if (itemLower.includes('ssc cpo')) return '/exam-categories/ssc/cpo';
  if (itemLower.includes('ssc gd')) return '/exam-categories/ssc/gd';
  if (itemLower.includes('ssc')) return '/exam-categories/ssc';
  
  // Banking
  if (itemLower.includes('ibps') || itemLower.includes('sbi') || itemLower.includes('banking')) return '/exam-categories/banking';
  
  // Railways
  if (itemLower.includes('rrb') || itemLower.includes('railway') || itemLower.includes('ntpc') || itemLower.includes('group d') || itemLower.includes('alp')) return '/exam-categories/railways';
  
  // UPSC
  if (itemLower.includes('upsc') || itemLower.includes('ias') || itemLower.includes('ips')) return '/exam-categories/upsc';
  
  // Defence
  if (itemLower.includes('nda') || itemLower.includes('cds') || itemLower.includes('afcat') || itemLower.includes('defence')) return '/exam-categories/defence';
  
  // Teaching
  if (itemLower.includes('ctet') || itemLower.includes('tet') || itemLower.includes('kvs') || itemLower.includes('teaching')) return '/exam-categories/teaching';
  
  // State PSC
  if (itemLower.includes('psc') || itemLower.includes('uppsc') || itemLower.includes('bpsc')) return '/exam-categories/state-psc';
  
  // Police
  if (itemLower.includes('police') || itemLower.includes('constable')) return '/exam-categories/police';
  
  // Default to exam categories
  return '/exam-categories';
} 