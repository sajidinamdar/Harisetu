// Centralized translations for the application
// This file contains all translations for both English and Marathi

export type Language = 'en' | 'mr';

export interface TranslationObject {
  [key: string]: string | string[] | TranslationObject;
}

export interface Translations {
  en: TranslationObject;
  mr: TranslationObject;
}

// Common translations used across multiple components
const common: Translations = {
  en: {
    appName: 'HaritSetu',
    welcome: 'Welcome',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    profile: 'Profile',
    settings: 'Settings',
    dashboard: 'Dashboard',
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    back: 'Back',
    next: 'Next',
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
    farmer: 'Farmer',
    officer: 'Agricultural Officer',
    expert: 'Agricultural Expert',
    language: 'Language',
    english: 'English',
    marathi: 'मराठी',
    switchToMarathi: 'Switch to Marathi',
    switchToEnglish: 'Switch to English',
  },
  mr: {
    appName: 'हरितसेतू',
    welcome: 'स्वागत',
    login: 'लॉगिन',
    register: 'नोंदणी',
    logout: 'लॉगआउट',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्ज',
    dashboard: 'डॅशबोर्ड',
    save: 'जतन करा',
    cancel: 'रद्द करा',
    submit: 'सबमिट करा',
    back: 'मागे',
    next: 'पुढे',
    loading: 'लोड करत आहे...',
    error: 'एक त्रुटी आली',
    success: 'यशस्वी',
    farmer: 'शेतकरी',
    officer: 'कृषी अधिकारी',
    expert: 'कृषी तज्ञ',
    language: 'भाषा',
    english: 'इंग्रजी',
    marathi: 'मराठी',
    switchToMarathi: 'मराठी वर स्विच करा',
    switchToEnglish: 'इंग्रजी वर स्विच करा',
  }
};

// Welcome page translations
const welcomePage: Translations = {
  en: {
    title: 'Welcome to HaritSetu',
    subtitle: 'Smart Agricultural Platform for Farmers',
    description: 'HaritSetu connects farmers with experts, provides disease detection, weather forecasts, and more.',
    demoAccounts: 'Demo Accounts:',
    farmer: 'Farmer: farmer@demo.com',
    officer: 'Officer: officer@demo.com',
    expert: 'Expert: expert@demo.com',
    demoPassword: 'Password: demo123',
    features: 'Key Features',
    feature1Title: 'AI-Powered Disease Detection',
    feature1Desc: 'Upload photos of your crops to identify diseases and get treatment recommendations.',
    feature2Title: 'Expert Consultation',
    feature2Desc: 'Connect with agricultural experts for personalized advice and solutions.',
    feature3Title: 'Weather Forecasting',
    feature3Desc: 'Get accurate weather predictions to plan your farming activities effectively.',
    aboutTitle: 'About HaritSetu',
    aboutDesc: 'HaritSetu is a comprehensive agricultural platform designed to empower farmers with modern technology and expert knowledge. Our mission is to increase agricultural productivity and improve farmers\' livelihoods through innovative digital solutions.'
  },
  mr: {
    title: 'हरितसेतूमध्ये आपले स्वागत आहे',
    subtitle: 'शेतकऱ्यांसाठी स्मार्ट कृषी प्लॅटफॉर्म',
    description: 'हरितसेतू शेतकऱ्यांना तज्ञांशी जोडते, रोग शोधणे, हवामान अंदाज आणि बरेच काही प्रदान करते.',
    demoAccounts: 'डेमो खाती:',
    farmer: 'शेतकरी: farmer@demo.com',
    officer: 'अधिकारी: officer@demo.com',
    expert: 'तज्ञ: expert@demo.com',
    demoPassword: 'पासवर्ड: demo123',
    features: 'मुख्य वैशिष्ट्ये',
    feature1Title: 'AI-संचालित रोग शोध',
    feature1Desc: 'रोग ओळखण्यासाठी आणि उपचार शिफारसी मिळवण्यासाठी आपल्या पिकांचे फोटो अपलोड करा.',
    feature2Title: 'तज्ञ सल्लामसलत',
    feature2Desc: 'वैयक्तिकृत सल्ला आणि उपायांसाठी कृषी तज्ञांशी संपर्क साधा.',
    feature3Title: 'हवामान अंदाज',
    feature3Desc: 'आपल्या शेती क्रियाकलाप प्रभावीपणे नियोजित करण्यासाठी अचूक हवामान अंदाज मिळवा.',
    aboutTitle: 'हरितसेतू बद्दल',
    aboutDesc: 'हरितसेतू हे एक सर्वसमावेशक कृषी प्लॅटफॉर्म आहे जे शेतकऱ्यांना आधुनिक तंत्रज्ञान आणि तज्ञ ज्ञानासह सक्षम करण्यासाठी डिझाइन केलेले आहे. आमचे ध्येय नाविन्यपूर्ण डिजिटल समाधानांद्वारे कृषी उत्पादकता वाढवणे आणि शेतकऱ्यांची उपजीविका सुधारणे आहे.'
  }
};

// Dashboard translations
const dashboard: Translations = {
  en: {
    welcome: 'Welcome',
    dashboard: 'Dashboard',
    notifications: 'Notifications',
    modules: 'Available Modules',
    cropAdvisory: 'Crop Advisory',
    weatherForecast: 'Weather Forecast',
    krushiBazaar: 'KrushiBazaar',
    subsidies: 'Subsidies',
    start: 'Start'
  },
  mr: {
    welcome: 'स्वागत',
    dashboard: 'डॅशबोर्ड',
    notifications: 'सूचना',
    modules: 'कृषी मॉड्यूल्स',
    cropAdvisory: 'पीक सल्ला',
    weatherForecast: 'हवामान अंदाज',
    krushiBazaar: 'कृषीबाज़ार',
    subsidies: 'अनुदान',
    start: 'स्टार्ट'
  }
};

// Auth translations
const auth: Translations = {
  en: {
    title: 'Welcome Back to HaritSetu',
    subtitle: 'Sign in to access your agricultural dashboard',
    otpTitle: 'Enter OTP',
    otpSubtitle: 'We sent a verification code to your phone',
    email: 'Email Address',
    password: 'Password',
    phone: 'Phone Number',
    otp: 'Verification Code',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    signIn: 'Sign In',
    signingIn: 'Signing In...',
    sendOTP: 'Send OTP',
    sending: 'Sending...',
    verify: 'Verify & Login',
    verifying: 'Verifying...',
    resendOTP: 'Resend OTP',
    useEmail: 'Use Email Instead',
    usePhone: 'Use Phone Instead',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    signUp: 'Sign Up',
    noAccountError: 'You do not have an account yet. Please register first.',
    registerNow: 'Register Now',
    invalidPhone: 'Please enter a valid phone number',
    invalidOTP: 'Invalid OTP. Please try again.',
    userNotFound: 'User not found. Please register first.',
    registerTitle: 'Join HaritSetu',
    registerSubtitle: 'Create your account to access agricultural services',
    name: 'Full Name',
    confirmPassword: 'Confirm Password',
    role: 'Role',
    alreadyHaveAccount: 'Already have an account?',
    passwordsDoNotMatch: 'Passwords do not match',
    registering: 'Registering...',
    registerSuccess: 'Registration successful! You can now sign in.'
  },
  mr: {
    title: 'हरितसेतूमध्ये परत स्वागत',
    subtitle: 'तुमच्या कृषी डॅशबोर्डमध्ये प्रवेश करण्यासाठी साइन इन करा',
    otpTitle: 'OTP प्रविष्ट करा',
    otpSubtitle: 'आम्ही आपल्या फोनवर एक सत्यापन कोड पाठवला आहे',
    email: 'ईमेल पत्ता',
    password: 'पासवर्ड',
    phone: 'फोन नंबर',
    otp: 'सत्यापन कोड',
    showPassword: 'पासवर्ड दाखवा',
    hidePassword: 'पासवर्ड लपवा',
    signIn: 'साइन इन',
    signingIn: 'साइन इन करत आहे...',
    sendOTP: 'OTP पाठवा',
    sending: 'पाठवत आहे...',
    verify: 'सत्यापित करा आणि लॉगिन करा',
    verifying: 'सत्यापित करत आहे...',
    resendOTP: 'OTP पुन्हा पाठवा',
    useEmail: 'ईमेल वापरा',
    usePhone: 'फोन वापरा',
    forgotPassword: 'पासवर्ड विसरलात?',
    noAccount: 'खाते नाही?',
    signUp: 'साइन अप',
    noAccountError: 'आपल्याकडे अद्याप खाते नाही. कृपया प्रथम नोंदणी करा.',
    registerNow: 'आता नोंदणी करा',
    invalidPhone: 'कृपया वैध फोन नंबर प्रविष्ट करा',
    invalidOTP: 'अवैध OTP. कृपया पुन्हा प्रयत्न करा.',
    userNotFound: 'वापरकर्ता आढळला नाही. कृपया प्रथम नोंदणी करा.',
    registerTitle: 'हरितसेतूमध्ये सामील व्हा',
    registerSubtitle: 'कृषी सेवांमध्ये प्रवेश करण्यासाठी आपले खाते तयार करा',
    name: 'पूर्ण नाव',
    confirmPassword: 'पासवर्डची पुष्टी करा',
    role: 'भूमिका',
    alreadyHaveAccount: 'आधीपासूनच खाते आहे?',
    passwordsDoNotMatch: 'पासवर्ड जुळत नाहीत',
    registering: 'नोंदणी करत आहे...',
    registerSuccess: 'नोंदणी यशस्वी! आता आपण साइन इन करू शकता.'
  }
};

// Footer translations
const footer: Translations = {
  en: {
    tagline: 'Empowering farmers with smart technology and expert guidance',
    quickLinks: 'Quick Links',
    services: 'Services',
    contact: 'Contact Us',
    followUs: 'Follow Us',
    links: [
      'About Us',
      'Our Services',
      'Success Stories',
      'Expert Network',
      'Support Center',
      'Privacy Policy'
    ],
    servicesList: [
      'Crop Disease Detection',
      'Weather Forecasting', 
      'Market Intelligence',
      'Expert Consultation',
      'Digital Documentation',
      'Voice Assistant'
    ],
    contactInfo: {
      address: 'Agriculture Department, Government of Maharashtra',
      phone: '+91-22-1234-5678',
      email: 'support@haritsetu.gov.in'
    },
    copyright: '© 2024 HaritSetu. All rights reserved. Developed for the farmers of Maharashtra.'
  },
  mr: {
    tagline: 'स्मार्ट तंत्रज्ञान आणि तज्ञांच्या मार्गदर्शनाने शेतकऱ्यांना सशक्त करणे',
    quickLinks: 'द्रुत दुवे',
    services: 'सेवा',
    contact: 'आमच्याशी संपर्क',
    followUs: 'आमचे अनुसरण करा',
    links: [
      'आमच्याबद्दल',
      'आमच्या सेवा',
      'यशोगाथा',
      'तज्ञ नेटवर्क',
      'सहाय्य केंद्र',
      'गोपनीयता धोरण'
    ],
    servicesList: [
      'पीक रोग शोध',
      'हवामान अंदाज',
      'बाज़ार बुद्धिमत्ता',
      'तज्ञ सल्लामसलत',
      'डिजिटल दस्तऐवजीकरण',
      'आवाज सहाय्यक'
    ],
    contactInfo: {
      address: 'कृषी विभाग, महाराष्ट्र सरकार',
      phone: '+९१-२२-१२३४-५६७८',
      email: 'support@haritsetu.gov.in'
    },
    copyright: '© २०२४ हरितसेतू. सर्व हक्क राखीव. महाराष्ट्राच्या शेतकऱ्यांसाठी विकसित.'
  }
};

// Export all translations
export const translations = {
  common,
  welcomePage,
  dashboard,
  auth,
  footer
};

// Helper function to get translations
export const getTranslation = (
  language: Language,
  section: keyof typeof translations,
  key: string
): string | string[] | TranslationObject => {
  try {
    const sectionTranslations = translations[section][language];
    const keys = key.split('.');
    let result: any = sectionTranslations;
    
    for (const k of keys) {
      if (result[k] === undefined) {
        console.warn(`Translation missing for ${language}.${section}.${key}`);
        return key;
      }
      result = result[k];
    }
    
    return result;
  } catch (error) {
    console.error(`Error getting translation for ${language}.${section}.${key}:`, error);
    return key;
  }
};

// Create a simple translation function
export const createTranslator = (language: Language, section: keyof typeof translations) => {
  return (key: string): string => {
    const translation = getTranslation(language, section, key);
    if (typeof translation === 'string') {
      return translation;
    } else if (Array.isArray(translation)) {
      return JSON.stringify(translation);
    } else {
      return JSON.stringify(translation);
    }
  };
};