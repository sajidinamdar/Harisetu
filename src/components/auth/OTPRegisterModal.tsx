import React, { useState } from 'react';
import { X, AlertCircle, ArrowRight, User, Mail, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface OTPRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  language: string;
}

const OTPRegisterModal: React.FC<OTPRegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin, language }) => {
  const { isLoading, setUser, sendOTP, verifyOTP, registerWithOTP } = useAuth();
  const [step, setStep] = useState<'email' | 'otp' | 'details'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    district: '',
    taluka: '',
    village: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const translations = {
    en: {
      title: 'Create Account',
      subtitle: 'Enter your email address to receive an OTP',
      otpTitle: 'Enter OTP',
      otpSubtitle: 'We sent a verification code to your email',
      detailsTitle: 'Complete Registration',
      detailsSubtitle: 'Please provide your information',
      otp: 'Verification Code',
      name: 'Full Name',
      email: 'Email Address',
      district: 'District',
      taluka: 'Taluka',
      village: 'Village',
      sendOTP: 'Send OTP',
      verify: 'Verify',
      register: 'Complete Registration',
      resendOTP: 'Resend OTP',
      back: 'Back',
      haveAccount: 'Already have an account?',
      signIn: 'Sign In',
      sending: 'Sending...',
      verifying: 'Verifying...',
      registering: 'Registering...',
      invalidEmail: 'Please enter a valid email address',
      invalidOTP: 'Invalid OTP. Please try again.',
      emailExists: 'Email already registered',
      loginInstead: 'Login Instead'
    },
    mr: {
      title: 'खाते तयार करा',
      subtitle: 'OTP प्राप्त करण्यासाठी आपला ईमेल पत्ता प्रविष्ट करा',
      otpTitle: 'OTP प्रविष्ट करा',
      otpSubtitle: 'आम्ही आपल्या ईमेलवर एक सत्यापन कोड पाठवला आहे',
      detailsTitle: 'नोंदणी पूर्ण करा',
      detailsSubtitle: 'कृपया आपली माहिती प्रदान करा',
      otp: 'सत्यापन कोड',
      name: 'पूर्ण नाव',
      email: 'ईमेल पत्ता',
      district: 'जिल्हा',
      taluka: 'तालुका',
      village: 'गाव',
      sendOTP: 'OTP पाठवा',
      verify: 'सत्यापित करा',
      register: 'नोंदणी पूर्ण करा',
      resendOTP: 'OTP पुन्हा पाठवा',
      back: 'मागे',
      haveAccount: 'आधीच खाते आहे?',
      signIn: 'साइन इन',
      sending: 'पाठवत आहे...',
      verifying: 'सत्यापित करत आहे...',
      registering: 'नोंदणी करत आहे...',
      invalidEmail: 'कृपया वैध ईमेल पत्ता प्रविष्ट करा',
      invalidOTP: 'अवैध OTP. कृपया पुन्हा प्रयत्न करा.',
      emailExists: 'ईमेल आधीच नोंदणीकृत आहे',
      loginInstead: 'त्याऐवजी लॉगिन करा'
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError(t.invalidEmail);
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await sendOTP(email, 'signup');
      if (response.success) {
        setStep('otp');
      }
    } catch (err: any) {
      if (err.response?.data?.userExists) {
        setError(t.emailExists);
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
      const response = await verifyOTP(email, otp, 'signup');
      if (response.success) {
        setStep('details');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t.invalidOTP);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.name) {
      setError('Name is required');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await registerWithOTP({
        ...formData,
        email
      });
      if (response.success && response.user) {
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
      await sendOTP(email, 'signup');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {step === 'email' ? t.title : step === 'otp' ? t.otpTitle : t.detailsTitle}
              </h2>
              <p className="text-gray-600 mt-1">
                {step === 'email' ? t.subtitle : step === 'otp' ? t.otpSubtitle : t.detailsSubtitle}
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
                {error.includes('already registered') && (
                  <div className="mt-2">
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

          {step === 'email' && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.email}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="your@email.com"
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
                  onClick={() => setStep('email')}
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  {t.back}
                </button>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isSubmitting}
                  className="text-green-600 hover:text-green-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.resendOTP}
                </button>
              </div>
            </form>
          )}

          {step === 'details' && (
            <form onSubmit={handleRegister} className="space-y-4">
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

              {/* Email is already collected in the first step, so we remove the duplicate email field here */}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.district}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Your district"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.taluka}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.taluka}
                      onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Your taluka"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.village}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your village"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? t.registering : t.register}
              </button>

              <div className="flex justify-start items-center mt-4">
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

export default OTPRegisterModal;