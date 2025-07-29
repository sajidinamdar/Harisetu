import React, { useState } from 'react';
import OTPLoginModal from './OTPLoginModal';
import OTPRegisterModal from './OTPRegisterModal';

interface OTPAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  language: string;
}

const OTPAuthModal: React.FC<OTPAuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'login',
  language 
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  const handleSwitchToLogin = () => {
    setMode('login');
  };

  const handleSwitchToRegister = () => {
    setMode('register');
  };

  if (!isOpen) return null;

  return (
    <>
      {mode === 'login' ? (
        <OTPLoginModal
          isOpen={isOpen}
          onClose={onClose}
          onSwitchToRegister={handleSwitchToRegister}
          language={language}
        />
      ) : (
        <OTPRegisterModal
          isOpen={isOpen}
          onClose={onClose}
          onSwitchToLogin={handleSwitchToLogin}
          language={language}
        />
      )}
    </>
  );
};

export default OTPAuthModal;