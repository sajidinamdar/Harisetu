import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Briefcase, AlertCircle, ArrowRight, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getDistrictsList, getTalukasList, getVillagesList } from '../../data/maharashtraLocations';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { register, isLoading, sendOTP, verifyOTP, registerWithOTP, setUser } = useAuth();
  const { language } = useLanguage();
  const [registerMethod, setRegisterMethod] = useState<'email' | 'phone'>('phone');
  const [step, setStep] = useState<'phone' | 'otp' | 'details' | 'email'>('phone');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'farmer' as 'farmer' | 'officer' | 'expert',
    village: '',
    district: '',
    taluka: '',
    expertise: [] as string[],
    department: '',
  });
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpFormData, setOtpFormData] = useState({
    name: '',
    email: '',
    district: '',
    taluka: '',
    village: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Location dropdown data
  const [districts, setDistricts] = useState<{ value: string, label: string }[]>([]);
  const [talukas, setTalukas] = useState<{ value: string, label: string }[]>([]);
  const [villages, setVillages] = useState<{ value: string, label: string }[]>([]);

  // Load districts on component mount
  useEffect(() => {
    setDistricts(getDistrictsList(language as 'en' | 'mr'));
  }, [language]);

  // Load talukas when district changes
  useEffect(() => {
    if (otpFormData.district) {
      setTalukas(getTalukasList(otpFormData.district, language as 'en' | 'mr'));
      setOtpFormData(prev => ({ ...prev, taluka: '', village: '' }));
    } else {
      setTalukas([]);
    }
  }, [otpFormData.district, language]);

  // Load villages when taluka changes
  useEffect(() => {
    if (otpFormData.district && otpFormData.taluka) {
      setVillages(getVillagesList(otpFormData.district, otpFormData.taluka, language as 'en' | 'mr'));
      setOtpFormData(prev => ({ ...prev, village: '' }));
    } else {
      setVillages([]);
    }
  }, [otpFormData.district, otpFormData.taluka, language]);

  // Same effects for email registration form
  useEffect(() => {
    if (formData.district) {
      setTalukas(getTalukasList(formData.district, language as 'en' | 'mr'));
      setFormData(prev => ({ ...prev, taluka: '', village: '' }));
    }
  }, [formData.district, language]);

  useEffect(() => {
    if (formData.district && formData.taluka) {
      setVillages(getVillagesList(formData.district, formData.taluka, language as 'en' | 'mr'));
      setFormData(prev => ({ ...prev, village: '' }));
    }
  }, [formData.district, formData.taluka, language]);

  const translations = {
    en: {
      title: 'Join HaritSetu Community',
      subtitle: 'Create your account to access agricultural services',
      otpTitle: 'Enter OTP',
      otpSubtitle: 'We sent a verification code to your phone',
      detailsTitle: 'Complete Registration',
      detailsSubtitle: 'Please provide your information',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      otp: 'Verification Code',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      role: 'I am a',
      farmer: 'Farmer',
      officer: 'Agricultural Officer',
      expert: 'Agricultural Expert',
      village: 'Village',
      district: 'District',
      taluka: 'Taluka',
      department: 'Department',
      expertise: 'Areas of Expertise',
      expertisePlaceholder: 'e.g., Crop Disease, Soil Management',
      createAccount: 'Create Account',
      creating: 'Creating Account...',
      sendOTP: 'Send OTP',
      sending: 'Sending...',
      verify: 'Verify',
      verifying: 'Verifying...',
      register: 'Complete Registration',
      registering: 'Registering...',
      resendOTP: 'Resend OTP',
      back: 'Back',
      useEmail: 'Use Email Instead',
      usePhone: 'Use Phone Instead',
      haveAccount: 'Already have an account?',
      signIn: 'Sign In',
      terms: 'By creating an account, you agree to our Terms of Service and Privacy Policy.',
      accountExists: 'You already have an account with this email.',
      phoneExists: 'Phone number already registered',
      loginInstead: 'Login Instead',
      invalidPhone: 'Please enter a valid phone number',
      invalidOTP: 'Invalid OTP. Please try again.'
    },
    mr: {
      title: 'हरितसेतू समुदायात सामील व्हा',
      subtitle: 'कृषी सेवांमध्ये प्रवेश करण्यासाठी तुमचे खाते तयार करा',
      otpTitle: 'OTP प्रविष्ट करा',
      otpSubtitle: 'आम्ही आपल्या फोनवर एक सत्यापन कोड पाठवला आहे',
      detailsTitle: 'नोंदणी पूर्ण करा',
      detailsSubtitle: 'कृपया आपली माहिती प्रदान करा',
      name: 'पूर्ण नाव',
      email: 'ईमेल पत्ता',
      phone: 'फोन नंबर',
      otp: 'सत्यापन कोड',
      password: 'पासवर्ड',
      confirmPassword: 'पासवर्ड पुष्टी करा',
      role: 'मी आहे',
      farmer: 'शेतकरी',
      officer: 'कृषी अधिकारी',
      expert: 'कृषी तज्ञ',
      village: 'गाव',
      district: 'जिल्हा',
      taluka: 'तालुका',
      department: 'विभाग',
      expertise: 'तज्ञतेचे क्षेत्र',
      expertisePlaceholder: 'उदा., पीक रोग, मातीचे व्यवस्थापन',
      createAccount: 'खाते तयार करा',
      creating: 'खाते तयार करत आहे...',
      sendOTP: 'OTP पाठवा',
      sending: 'पाठवत आहे...',
      verify: 'सत्यापित करा',
      verifying: 'सत्यापित करत आहे...',
      register: 'नोंदणी पूर्ण करा',
      registering: 'नोंदणी करत आहे...',
      resendOTP: 'OTP पुन्हा पाठवा',
      back: 'मागे',
      useEmail: 'ईमेल वापरा',
      usePhone: 'फोन वापरा',
      haveAccount: 'आधीच खाते आहे?',
      signIn: 'साइन इन',
      terms: 'खाते तयार करून, तुम्ही आमच्या सेवा अटी आणि गोपनीयता धोरणाशी सहमत आहात.',
      accountExists: 'या ईमेलसह आपले आधीपासूनच खाते आहे.',
      phoneExists: 'फोन नंबर आधीच नोंदणीकृत आहे',
      loginInstead: 'त्याऐवजी लॉगिन करा',
      invalidPhone: 'कृपया वैध फोन नंबर प्रविष्ट करा',
      invalidOTP: 'अवैध OTP. कृपया पुन्हा प्रयत्न करा.'
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await register(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!phone || phone.length < 10) {
      setError(t.invalidPhone);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await sendOTP(phone, 'signup');

      if (response.success) {
        setStep('otp');
      }
    } catch (err: any) {
      if (err.response?.data?.userExists) {
        setError(t.phoneExists);
      } else {
        setError(err.response?.data?.message || 'Failed to send OTP');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length < 4) {
      setError(t.invalidOTP);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await verifyOTP(phone, otp, 'signup');

      if (response.success) {
        setStep('details');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t.invalidOTP);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterWithOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otpFormData.name) {
      setError('Name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await registerWithOTP({
        phone,
        ...otpFormData
      });

      if (response.success && response.user) {
        // Save user data and close modal
        localStorage.setItem('haritsetu_user', JSON.stringify(response.user));
        setUser(response.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      await sendOTP(phone, 'signup');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRegisterMethod = () => {
    if (registerMethod === 'email') {
      setRegisterMethod('phone');
      setStep('phone');
    } else {
      setRegisterMethod('email');
      setStep('email');
    }
    setError('');
  };

  const handleExpertiseChange = (value: string) => {
    const expertiseArray = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData({ ...formData, expertise: expertiseArray });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {step === 'phone' ? t.title :
                  step === 'otp' ? t.otpTitle :
                    step === 'details' ? t.detailsTitle :
                      t.title}
              </h2>
              <p className="text-gray-600 mt-1">
                {step === 'phone' ? t.subtitle :
                  step === 'otp' ? t.otpSubtitle :
                    step === 'details' ? t.detailsSubtitle :
                      t.subtitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-red-700 text-sm">{error}</span>
                {(error.includes('Email already registered') || error.includes('Phone number already registered')) && (
                  <div className="mt-2">
                    <p className="text-sm text-red-700">{error.includes('Email') ? t.accountExists : t.phoneExists}</p>
                    <button
                      type="button"
                      onClick={onSwitchToLogin}
                      className="mt-1 text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      {t.loginInstead} →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'phone' && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.phone}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isSubmitting ? t.sending : (
                  <>
                    {t.sendOTP}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleRegisterMethod}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  {t.useEmail}
                </button>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.otp}
                </label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-xl tracking-widest"
                  placeholder="• • • • • •"
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? t.verifying : t.verify}
              </button>

              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  {t.back}
                </button>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isSubmitting}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  {t.resendOTP}
                </button>
              </div>
            </form>
          )}

          {step === 'details' && (
            <form onSubmit={handleRegisterWithOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.name}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    value={otpFormData.name}
                    onChange={(e) => setOtpFormData({ ...otpFormData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.email} <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={otpFormData.email}
                    onChange={(e) => setOtpFormData({ ...otpFormData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.district} <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={otpFormData.district}
                      onChange={(e) => setOtpFormData({ ...otpFormData, district: e.target.value })}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                    >
                      <option value="">{language === 'en' ? 'Select District' : 'जिल्हा निवडा'}</option>
                      {districts.map(district => (
                        <option key={district.value} value={district.value}>
                          {district.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.taluka} <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={otpFormData.taluka}
                      onChange={(e) => setOtpFormData({ ...otpFormData, taluka: e.target.value })}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                      disabled={!otpFormData.district}
                    >
                      <option value="">{language === 'en' ? 'Select Taluka' : 'तालुका निवडा'}</option>
                      {talukas.map(taluka => (
                        <option key={taluka.value} value={taluka.value}>
                          {taluka.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.village} <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      value={otpFormData.village}
                      onChange={(e) => setOtpFormData({ ...otpFormData, village: e.target.value })}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                      disabled={!otpFormData.district || !otpFormData.taluka}
                    >
                      <option value="">{language === 'en' ? 'Select Village' : 'गाव निवडा'}</option>
                      {villages.map(village => (
                        <option key={village.value} value={village.value}>
                          {village.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? t.registering : t.register}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep('otp')}
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  {t.back}
                </button>
              </div>
            </form>
          )}

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.name}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.email}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.phone}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.password}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.confirmPassword}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.role}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'farmer' })}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border ${formData.role === 'farmer' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    <User className={`w-6 h-6 mb-1 ${formData.role === 'farmer' ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${formData.role === 'farmer' ? 'text-green-700' : 'text-gray-700'}`}>
                      {t.farmer}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'officer' })}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border ${formData.role === 'officer' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    <Briefcase className={`w-6 h-6 mb-1 ${formData.role === 'officer' ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${formData.role === 'officer' ? 'text-green-700' : 'text-gray-700'}`}>
                      {t.officer}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'expert' })}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border ${formData.role === 'expert' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    <Briefcase className={`w-6 h-6 mb-1 ${formData.role === 'expert' ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${formData.role === 'expert' ? 'text-green-700' : 'text-gray-700'}`}>
                      {t.expert}
                    </span>
                  </button>
                </div>
              </div>

              {formData.role === 'farmer' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.district}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                      >
                        <option value="">{language === 'en' ? 'Select District' : 'जिल्हा निवडा'}</option>
                        {districts.map(district => (
                          <option key={district.value} value={district.value}>
                            {district.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.taluka}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={formData.taluka}
                        onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                        disabled={!formData.district}
                      >
                        <option value="">{language === 'en' ? 'Select Taluka' : 'तालुका निवडा'}</option>
                        {talukas.map(taluka => (
                          <option key={taluka.value} value={taluka.value}>
                            {taluka.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.village}
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <select
                        value={formData.village}
                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                        disabled={!formData.district || !formData.taluka}
                      >
                        <option value="">{language === 'en' ? 'Select Village' : 'गाव निवडा'}</option>
                        {villages.map(village => (
                          <option key={village.value} value={village.value}>
                            {village.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}

              {formData.role === 'officer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.department}
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Agriculture Department"
                    />
                  </div>
                </div>
              )}

              {formData.role === 'expert' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.expertise}
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.expertise.join(', ')}
                      onChange={(e) => handleExpertiseChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={t.expertisePlaceholder}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? t.creating : t.createAccount}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={toggleRegisterMethod}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  {t.usePhone}
                </button>
              </div>

              <p className="mt-4 text-sm text-gray-600 text-center">
                {t.terms}
              </p>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              {t.haveAccount}{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                {t.signIn}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;