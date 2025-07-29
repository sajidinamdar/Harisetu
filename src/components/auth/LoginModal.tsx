import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, AlertCircle, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { login, isLoading, sendOTP, verifyOTP, setUser } = useAuth();
  const { language, t } = useLanguage();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('phone');
  const [step, setStep] = useState<'phone' | 'otp' | 'email'>('phone');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!phone || phone.length < 10) {
      setError(t('auth', 'invalidPhone'));
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await sendOTP(phone, 'login');
      
      if (response.success) {
        setStep('otp');
        // Add a development message
        if (process.env.NODE_ENV !== 'production') {
          // Show a message that OTP is in console
          setError('DEVELOPMENT MODE: Check browser console for OTP code. You can also use 123456 as a test OTP.');
        }
      }
    } catch (err: any) {
      if (err.response?.data?.message?.includes('User not found')) {
        setError(t('auth', 'userNotFound'));
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
      setError(t('auth', 'invalidOTP'));
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await verifyOTP(phone, otp, 'login');
      
      if (response.success && response.user) {
        // Save user data and close modal
        localStorage.setItem('haritsetu_user', JSON.stringify(response.user));
        setUser(response.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth', 'invalidOTP'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setIsSubmitting(true);
    
    try {
      await sendOTP(phone, 'login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (role: string) => {
    setLoginMethod('email');
    setStep('email');
    
    const demoData = {
      email: `${role}@demo.com`,
      password: 'demo123'
    };
    setFormData(demoData);
    
    // Auto-submit after a short delay
    setTimeout(() => {
      const submitButton = document.querySelector('form button[type="submit"]') as HTMLButtonElement;
      if (submitButton && !isLoading) {
        submitButton.click();
      }
    }, 500);
  };

  const toggleLoginMethod = () => {
    if (loginMethod === 'email') {
      setLoginMethod('phone');
      setStep('phone');
    } else {
      setLoginMethod('email');
      setStep('email');
    }
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {step === 'phone' ? t('auth', 'title') : step === 'otp' ? t('auth', 'otpTitle') : t('auth', 'title')}
              </h2>
              <p className="text-gray-600 mt-1">
                {step === 'phone' ? t('auth', 'subtitle') : step === 'otp' ? t('auth', 'otpSubtitle') : t('auth', 'subtitle')}
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
            <div className={`mb-4 p-3 ${error.includes('DEVELOPMENT MODE') ? 'bg-blue-50 border border-blue-200' : 'bg-red-50 border border-red-200'} rounded-lg flex items-start space-x-2`}>
              <AlertCircle className={`w-5 h-5 ${error.includes('DEVELOPMENT MODE') ? 'text-blue-500' : 'text-red-500'} mt-0.5 flex-shrink-0`} />
              <div>
                <span className={`${error.includes('DEVELOPMENT MODE') ? 'text-blue-700' : 'text-red-700'} text-sm`}>{error}</span>
                {(error.includes('Invalid email or password') || error.includes('User not found')) && (
                  <div className="mt-2">
                    <p className="text-sm text-red-700">{t('auth', 'noAccountError')}</p>
                    <button
                      type="button"
                      onClick={onSwitchToRegister}
                      className="mt-1 text-green-600 hover:text-green-700 font-medium text-sm"
                    >
                      {t('auth', 'registerNow')} →
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
                  {t('auth', 'phone')}
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
                {isSubmitting ? t('auth', 'sending') : (
                  <>
                    {t('auth', 'sendOTP')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleLoginMethod}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  {t('auth', 'useEmail')}
                </button>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth', 'otp')}
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
                {isSubmitting ? t('auth', 'verifying') : t('auth', 'verify')}
              </button>

              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                >
                  {t('auth', 'back')}
                </button>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isSubmitting}
                  className="text-green-600 hover:text-green-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('auth', 'resendOTP')}
                </button>
              </div>
            </form>
          )}

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth', 'email')}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth', 'password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? t('auth', 'signingIn') : t('auth', 'signIn')}
              </button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleLoginMethod}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  {t('auth', 'usePhone')}
                </button>
              </div>
            </form>
          )}

          {step === 'email' && (
            <div className="mt-4 text-center">
              <a href="#" className="text-green-600 hover:text-green-700 text-sm font-medium">
                {t('auth', 'forgotPassword')}
              </a>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            {step === 'email' && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">{t('auth', 'demoAccounts')}</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between items-center">
                    <span>{t('common', 'farmer')}</span>
                    <button
                      onClick={() => handleDemoLogin('farmer')}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Use
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t('common', 'officer')}</span>
                    <button
                      onClick={() => handleDemoLogin('officer')}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Use
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t('common', 'expert')}</span>
                    <button
                      onClick={() => handleDemoLogin('expert')}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Use
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{t('welcomePage', 'demoPassword')}</p>
                </div>
              </div>
            )}

            <p className="text-center text-gray-600">
              {t('auth', 'noAccount')}{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                {t('auth', 'signUp')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;