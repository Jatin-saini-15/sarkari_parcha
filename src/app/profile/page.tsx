'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';

// Validation functions
const validateName = (name: string) => {
  const nameRegex = /^[a-zA-Z\s.'-]+$/;
  
  if (name.length < 2) {
    return 'Name must be at least 2 characters long';
  }
  
  if (name.length > 50) {
    return 'Name must be less than 50 characters';
  }
  
  if (!nameRegex.test(name)) {
    return 'Name can only contain letters, spaces, dots, hyphens, and apostrophes';
  }
  
  if (/^\s|\s$/.test(name)) {
    return 'Name cannot start or end with spaces';
  }
  
  if (/\s{2,}/.test(name)) {
    return 'Name cannot contain multiple consecutive spaces';
  }
  
  return null;
};

const validateLocation = (location: string) => {
  const locationRegex = /^[a-zA-Z\s.'-]+$/;
  
  if (location.length > 0 && location.length < 2) {
    return 'Must be at least 2 characters long';
  }
  
  if (location.length > 30) {
    return 'Must be less than 30 characters';
  }
  
  if (location && !locationRegex.test(location)) {
    return 'Can only contain letters, spaces, dots, hyphens, and apostrophes';
  }
  
  if (/^\s|\s$/.test(location)) {
    return 'Cannot start or end with spaces';
  }
  
  if (/\s{2,}/.test(location)) {
    return 'Cannot contain multiple consecutive spaces';
  }
  
  return null;
};

const validatePhone = (phone: string) => {
  if (!phone) return null; // Phone is optional
  
  const phoneRegex = /^[+]?[\d\s\-()]{10,15}$/;
  
  if (!phoneRegex.test(phone)) {
    return 'Please enter a valid phone number (10-15 digits)';
  }
  
  return null;
};

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  preferredExams?: string[];
  isPremium: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const examOptions = [
    'SSC CGL', 'SSC CHSL', 'SSC MTS', 'SSC JE', 'SSC CPO', 'SSC GD',
    'RRB NTPC', 'RRB Group D', 'RRB JE', 'RRB ALP',
    'IBPS PO', 'SBI PO', 'RBI Grade B', 'NABARD',
    'NDA', 'CDS', 'AFCAT', 'Indian Army',
    'CTET', 'TET', 'KVS', 'NVS',
    'UPSC Civil Services', 'UPSC Engineering Services',
    'State PSC', 'Police Recruitment'
  ];

  // Dynamic button logic (same as HeroSection)
  // @ts-expect-error - NextAuth session type
  const isPremium = session?.user?.isPremium;
  
  const getButtonConfig = () => {
    if (!session) {
      return { text: "Get Started", href: "/auth/signup" };
    }
    if (isPremium) {
      return { text: "Explore Now", href: "/dashboard" };
    }
    return { text: "Start Free Trial", href: "#" };
  };

  const buttonConfig = getButtonConfig();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    fetchProfile();
  }, [session, status, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
      } else {
        setMessage('Failed to load profile data');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('Error loading profile');
    } finally {
      setIsLoading(false);
    }
  };

  const validateField = (field: string, value: string) => {
    let error = '';
    
    switch (field) {
      case 'name':
        error = validateName(value) || '';
        break;
      case 'city':
        error = validateLocation(value) || '';
        break;
      case 'state':
        error = validateLocation(value) || '';
        break;
      case 'phone':
        error = validatePhone(value) || '';
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleInputChange = (field: string, value: string) => {
    if (profile) {
      setProfile(prev => prev ? { ...prev, [field]: value } : null);
      
      // Real-time validation
      if (value.trim() || field === 'phone') {
        validateField(field, value);
      } else {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    }
  };

  const handleExamToggle = (exam: string) => {
    if (profile) {
      const currentExams = profile.preferredExams || [];
      const updatedExams = currentExams.includes(exam)
        ? currentExams.filter(e => e !== exam)
        : [...currentExams, exam];
      
      setProfile(prev => prev ? { ...prev, preferredExams: updatedExams } : null);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    // Validate all fields
    const nameError = validateName(profile.name);
    const cityError = profile.city ? validateLocation(profile.city) : null;
    const stateError = profile.state ? validateLocation(profile.state) : null;
    const phoneError = profile.phone ? validatePhone(profile.phone) : null;

    const newErrors: {[key: string]: string} = {};
    if (nameError) newErrors.name = nameError;
    if (cityError) newErrors.city = cityError;
    if (stateError) newErrors.state = stateError;
    if (phoneError) newErrors.phone = phoneError;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setMessage('Please fix the errors before saving');
      return;
    }

    setIsSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profile.name.trim(),
          phone: profile.phone?.trim() || null,
          city: profile.city?.trim() || null,
          state: profile.state?.trim() || null,
          preferredExams: profile.preferredExams || [],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setProfile(data.user); // Update with fresh data from server
        // Update session if name changed
        if (session?.user?.name !== data.user.name) {
          await update({
            ...session,
            user: {
              ...session?.user,
              name: data.user.name,
            },
          });
        }
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!session || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Profile Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Overview Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl font-bold">
                  {profile.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
                <p className="text-gray-600">{profile.email}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    profile.isPremium 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {profile.isPremium ? '⭐ Premium' : '🆓 Free'}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Member since {new Date(profile.createdAt).getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            <p className="text-gray-600 text-sm mt-1">Update your personal details below</p>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Basic Information Section */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={profile.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={profile.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your city"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={profile.state || ''}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.state ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter your state"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Exam Preferences Section */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Exam Preferences</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Select the exams you&apos;re interested in to receive personalized content and updates
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {examOptions.map((exam) => (
                    <label key={exam} className="flex items-center p-3 rounded-md hover:bg-white transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.preferredExams?.includes(exam) || false}
                        onChange={() => handleExamToggle(exam)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">{exam}</span>
                    </label>
                  ))}
                </div>
                {profile.preferredExams && profile.preferredExams.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{profile.preferredExams.length}</span> exam{profile.preferredExams.length !== 1 ? 's' : ''} selected
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Save Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-gray-200 gap-4">
              <div>
                {message && (
                  <div className={`inline-flex items-center px-4 py-2 rounded-md text-sm ${
                    message.includes('successfully') 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {message.includes('successfully') ? (
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                    {message}
                  </div>
                )}
              </div>
              <button
                onClick={handleSave}
                disabled={isSaving || Object.keys(errors).some(key => errors[key])}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Ready to Start Your Journey?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of successful candidates who have achieved their dreams with our comprehensive preparation platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={buttonConfig.href} 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              {buttonConfig.text}
            </Link>
            <Link 
              href="#" 
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 