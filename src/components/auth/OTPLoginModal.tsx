import React, { useState } from 'react';
import { X, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface OTPLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  language: string;
}

const OTPLoginModal: React.FC<OTPLoginModalProps> = ({ isOpen, onClose, onSwitchToRegister, language }) => {
  const { isLoading, setUser, sendOTP, verifyOTP } = useAuth();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const translations = {
    en: {
      title: 'Login to HaritSetu',
      subtitle: 'Enter your email address to receive an OTP',
      otpTitle: 'Enter OTP',
      otpSubtitle: 'We sent a verification code to your email',
      email: 'Email Address',
      otp: 'Verification Code',
      sendOTP: 'Send OTP',
      verify: 'Verify & Login',
      resendOTP: 'Resend OTP',
      back: 'Back',
      noAccount: "Don't have an account?",
      signUp: 'Sign Up',
      sending: 'Sending...',
      verifying: 'Verifying...',
      invalidEmail: 'Please enter a valid email address',
      invalidOTP: 'Invalid OTP. Please try again.',
      userNotFound: 'User not found. Please register first.',
      registerNow: 'Register Now'
    },
    mr: {
      title: 'हरितसेतूमध्ये लॉगिन करा',
      subtitle: 'OTP प्राप्त करण्यासाठी आपला ईमेल पत्ता प्रविष्ट करा',
      otpTitle: 'OTP प्रविष्ट करा',
      otpSubtitle: 'आम्ही आपल्या ईमेलवर एक सत्यापन कोड पाठवला आहे',
      email: 'ईमेल पत्ता',
      otp: 'सत्यापन कोड',
      sendOTP: 'OTP पाठवा',
      verify: 'सत्यापित करा आणि लॉगिन करा',
      resendOTP: 'OTP पुन्हा पाठवा',
      back: 'मागे',
      noAccount: 'खाते नाही?',
      signUp: 'साइन अप',
      sending: 'पाठवत आहे...',
      verifying: 'सत्यापित करत आहे...',
      invalidEmail: 'कृपया वैध ईमेल पत्ता प्रविष्ट करा',
      invalidOTP: 'अवैध OTP. कृपया पुन्हा प्रयत्न करा.',
      userNotFound: 'वापरकर्ता आढळला नाही. कृपया प्रथम नोंदणी करा.',
      registerNow: 'आता नोंदणी करा'
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
      const response = await sendOTP(email, 'login');
      if (response.success) {
        setStep('otp');
      }
    } catch (err: any) {
      if (err.response?.data?.message?.includes('User not found')) {
        setError(t.userNotFound);
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
      const response = await verifyOTP(email, otp, 'login');
      if (response.success && response.user) {
        localStorage.setItem('haritsetu_user', JSON.stringify(response.user));
        setUser(response.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t.invalidOTP);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      await sendOTP(email, 'login');
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
                {step === 'email' ? t.title : t.otpTitle}
              </h2>
              <p className="text-gray-600 mt-1">
                {step === 'email' ? t.subtitle : t.otpSubtitle}
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
                {error.includes('User not found') && (
                  <div className="mt-2">
                    <p className="text-sm text-red-700">{t.userNotFound}</p>
                    <button
                      type="button"
                      onClick={onSwitchToRegister}
                      className="mt-1 text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      {t.registerNow} →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'email' ? (
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
          ) : (
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

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              {t.noAccount}{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                {t.signUp}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPLoginModal;