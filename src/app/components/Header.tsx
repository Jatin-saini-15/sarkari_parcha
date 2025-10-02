'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { examCategories } from "../constants";

const logo = "/images/Sarkari Parcha.png";

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

// Mapping exam categories to their respective routes
const categoryRoutes: { [key: string]: string } = {
  "SSC Exams": "/exam-categories/ssc",
  "Railways (RRB)": "/exam-categories/railways",
  "Banking": "/exam-categories/banking",
  "Defence": "/exam-categories/defence",
  "Teaching": "/exam-categories/teaching",
  "UPSC": "/exam-categories/upsc",
  "State-Level PSC Exams": "/exam-categories/state-psc",
  "Police Recruitment": "/exam-categories/police",
  "Other State Govt. Jobs": "#",
  "Insurance Exams": "#",
  "High Court & Judiciary Exams": "#",
  "Entrance Exams for Govt Colleges": "#"
};

export default function Header({ isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) {
  const [isExploreExamsDropdownOpen, setIsExploreExamsDropdownOpen] = useState(false);
  const [isPYQDropdownOpen, setIsPYQDropdownOpen] = useState(false);
  const [isTestsDropdownOpen, setIsTestsDropdownOpen] = useState(false);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // PYQ categories mapping
  const pyqCategories = [
    { name: "SSC Exams", slug: "ssc" },
    { name: "Railways (RRB)", slug: "railways" },
    { name: "Banking", slug: "banking" },
    { name: "Defence", slug: "defence" },
    { name: "Teaching", slug: "teaching" },
    { name: "UPSC", slug: "upsc" },
    { name: "State PSC", slug: "state-psc" },
    { name: "Police", slug: "police" }
  ];

  return (
    <>
      {/* Header */}
      <header className="w-full py-3 bg-white/95 backdrop-blur-xl sticky top-0 z-30 border-b border-gray-200/50 shadow-soft">
        <div className="max-w-7xl mx-auto flex items-center px-4 md:px-6 lg:px-8">
          {/* Left side: Hamburger (mobile) + Logo + Site Title */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image 
                  src={logo} 
                  alt="Sarkari Parcha Logo" 
                  width={40} 
                  height={40} 
                  className="md:w-12 md:h-12 rounded-xl shadow-medium group-hover:shadow-strong transition-all duration-300" 
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg md:text-2xl font-bold gradient-text-primary tracking-tight">
                  Sarkari Parcha
                </span>
                <span className="text-xs md:text-sm text-gray-500 font-medium">
                  Exam Preparation
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Navigation Links (desktop) */}
          <nav className="flex-grow hidden lg:flex justify-center gap-8 text-sm font-semibold text-gray-700">
            {/* Explore Exams Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsExploreExamsDropdownOpen(true)}
              onMouseLeave={() => setIsExploreExamsDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 focus:outline-none"
                onClick={() => setIsExploreExamsDropdownOpen(!isExploreExamsDropdownOpen)}
                aria-haspopup="true"
                aria-expanded={isExploreExamsDropdownOpen}
              >
                <span>Explore Exams</span>
                <svg
                  className={`w-4 h-4 transform transition-transform duration-200 ${
                    isExploreExamsDropdownOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isExploreExamsDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-strong py-2 z-20 border border-gray-200/50 animate-fadeInScale">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    Popular Categories
                  </div>
                  {examCategories.slice(0, 8).map((category, index) => (
                    <Link
                      key={index}
                      href={categoryRoutes[category] || "#"}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 border-l-2 border-transparent hover:border-blue-500"
                    >
                      {category}
                    </Link>
                  ))}
                  <div className="px-4 py-2 border-t border-gray-100">
                    <Link href="/exam-categories" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                      View All Categories →
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Tests Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsTestsDropdownOpen(true)}
              onMouseLeave={() => setIsTestsDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 focus:outline-none"
                onClick={() => setIsTestsDropdownOpen(!isTestsDropdownOpen)}
                aria-haspopup="true"
                aria-expanded={isTestsDropdownOpen}
              >
                <span>Tests</span>
                <svg
                  className={`w-4 h-4 transform transition-transform duration-200 ${
                    isTestsDropdownOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isTestsDropdownOpen && (
                <div className="absolute top-full left-0 w-48 bg-white rounded-xl shadow-strong py-2 z-20 border border-gray-200/50 animate-fadeInScale">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    Practice Tests
                  </div>
                  <Link
                    href="/mock-tests"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 border-l-2 border-transparent hover:border-blue-500"
                  >
                    Mock Tests
                  </Link>
                  <Link
                    href="/test-series"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 border-l-2 border-transparent hover:border-blue-500"
                  >
                    Test Series
                  </Link>
                </div>
              )}
            </div>
            
            <Link href="/live-tests" className="px-4 py-2 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">Live Tests</Link>
            
            {/* PYQ Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsPYQDropdownOpen(true)}
              onMouseLeave={() => setIsPYQDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 focus:outline-none"
                onClick={() => setIsPYQDropdownOpen(!isPYQDropdownOpen)}
                aria-haspopup="true"
                aria-expanded={isPYQDropdownOpen}
              >
                <span>PYQs</span>
                <svg
                  className={`w-4 h-4 transform transition-transform duration-200 ${
                    isPYQDropdownOpen ? 'rotate-180' : 'rotate-0'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isPYQDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-strong py-2 z-20 border border-gray-200/50 animate-fadeInScale">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    Previous Year Questions
                  </div>
                  {pyqCategories.map((category, index) => (
                    <Link
                      key={index}
                      href={`/pyq/${category.slug}`}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150 border-l-2 border-transparent hover:border-blue-500"
                    >
                      {category.name}
                    </Link>
                  ))}
                  <div className="px-4 py-2 border-t border-gray-100">
                    <Link href="/pyq" className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
                      View All PYQs →
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {/* <a href="#" className="px-4 py-2 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-all duration-200">Study Material</a> */}
          </nav>

          {/* Right side: Authentication (desktop) + Get App (mobile) */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="hidden md:flex items-center gap-3">
              {status === "loading" ? (
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : session ? (
                /* User is logged in */
                <div className="relative">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-gray-700 font-semibold">{session.user?.name}</span>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isUserDropdownOpen && (
                    <div className="absolute top-full right-0 w-48 bg-white rounded-xl shadow-strong py-2 z-20 border border-gray-200/50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{session.user?.name}</p>
                        <p className="text-xs text-gray-500">{session.user?.email}</p>
                      </div>
                      {/* @ts-expect-error - NextAuth session type */}
                      {session.user?.role === 'admin' || session.user?.role === 'owner' ? (
                        <Link href="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                          Admin Panel
                        </Link>
                      ) : (
                        <Link href="/exam-categories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                          Browse Exams
                        </Link>
                      )}
                      <Link href="/subscription" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                        My Subscription
                      </Link>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                        Profile
                      </Link>
                      <Link href="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700">
                        Help & Support
                      </Link>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* User is not logged in */
                <>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-1">
                    <Link 
                      href="/auth/signin" 
                      className="px-5 py-1 text-gray-700 hover:text-blue-600 font-semibold rounded-md hover:bg-white transition-all duration-200"
                    >
                      Login
                    </Link>
                  </div>
                  <Link 
                    href="/auth/signup" 
                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold shadow-medium hover:shadow-strong hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
            <a 
              href="https://play.google.com/store/apps/details?id=co.tarly.vewsy" 
              className="md:hidden px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow-medium hover:bg-blue-700 hover:shadow-strong transition-all duration-200 text-sm"
            >
              Get App
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {/* Mobile Menu */}
        <div
          className={`bg-white h-full w-80 max-w-[85vw] p-6 shadow-strong transform transition-transform ease-out duration-300 overflow-y-auto ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top section: User Info and Login Button */}
          <div className="pb-6 mb-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl px-4 py-5 -mx-2">
            <div className="flex justify-between items-center mb-6">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-medium">
                  {session ? (
                    <span className="text-white text-lg font-semibold">
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-6 h-6">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  )}
                </div>
                <div>
                  <span className="text-lg font-bold text-gray-800">
                    {session ? `Hi, ${session.user?.name?.split(' ')[0]}!` : 'Welcome!'}
                  </span>
                  <p className="text-sm text-gray-600">
                    {session ? 'Ready to practice?' : 'Start your exam prep journey'}
                  </p>
                </div>
              </div>
              <button
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-white/50 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Login/Register Buttons or User Actions */}
            {session ? (
              <div className="space-y-3">
                {/* @ts-expect-error - NextAuth session type */}
                {session.user?.role === 'admin' || session.user?.role === 'owner' ? (
                  <Link 
                    href="/admin/dashboard" 
                    className="block text-center px-4 py-3 bg-white text-blue-600 rounded-lg font-semibold shadow-soft hover:shadow-medium transition-all duration-200 border border-blue-200"
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <Link 
                    href="/exam-categories" 
                    className="block text-center px-4 py-3 bg-white text-blue-600 rounded-lg font-semibold shadow-soft hover:shadow-medium transition-all duration-200 border border-blue-200"
                  >
                    Browse Exams
                  </Link>
                )}
                <button 
                  onClick={handleSignOut}
                  className="w-full text-center px-4 py-3 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-all duration-200 border border-red-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link 
                  href="/auth/signin" 
                  className="flex-1 text-center px-4 py-3 bg-white text-blue-600 rounded-lg font-semibold shadow-soft hover:shadow-medium transition-all duration-200 border border-blue-200"
                >
                  Login
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="flex-1 text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold shadow-medium hover:shadow-strong transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <a href="#" className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-700">Free Test</span>
              </a>
              <a href="#" className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-200">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-700">Study Notes</span>
              </a>
            </div>
          </div>

          {/* All Categories Section */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200 cursor-pointer group"
              onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
            >
              <span className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">All Exam Categories</span>
              <button
                aria-label="Toggle categories"
                className="text-gray-500 hover:text-blue-600 p-1 rounded transition-colors duration-200"
              >
                <svg
                  className={`w-5 h-5 transform transition-transform duration-200 ${
                    isCategoriesExpanded ? 'rotate-180' : 'rotate-0'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div className={`space-y-2 transition-all duration-300 overflow-hidden ${
              isCategoriesExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              {examCategories.map((category, index) => (
                <Link
                  key={index}
                  href={categoryRoutes[category] || "#"}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-150 border-l-2 border-transparent hover:border-blue-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>

          {/* Additional Links */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">More</h3>
            {session && (
              <Link 
                href="/profile" 
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-150"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Profile
              </Link>
            )}
            <Link 
              href="/about" 
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-150"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-150"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Help & Support
            </Link>
          </div>
        </div>
      </div>
    </>
  );
} 