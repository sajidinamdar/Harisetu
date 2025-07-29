import React, { useState, useEffect } from 'react';
import { User, Settings, LogOut, Shield, MapPin, Phone, Mail, Edit2, Save, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getDistrictsList, getTalukasList, getVillagesList } from '../../data/maharashtraLocations';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose, language }) => {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    village: user?.village || '',
    district: user?.district || '',
    taluka: user?.taluka || '',
  });
  
  // Location dropdown data
  const [districts, setDistricts] = useState<{value: string, label: string}[]>([]);
  const [talukas, setTalukas] = useState<{value: string, label: string}[]>([]);
  const [villages, setVillages] = useState<{value: string, label: string}[]>([]);

  // Load districts on component mount
  useEffect(() => {
    setDistricts(getDistrictsList(language as 'en' | 'mr'));
  }, [language]);

  // Load talukas when district changes
  useEffect(() => {
    if (editData.district) {
      setTalukas(getTalukasList(editData.district, language as 'en' | 'mr'));
      if (!isEditing) {
        setEditData(prev => ({ ...prev, taluka: '', village: '' }));
      }
    } else {
      setTalukas([]);
    }
  }, [editData.district, language]);

  // Load villages when taluka changes
  useEffect(() => {
    if (editData.district && editData.taluka) {
      setVillages(getVillagesList(editData.district, editData.taluka, language as 'en' | 'mr'));
      if (!isEditing) {
        setEditData(prev => ({ ...prev, village: '' }));
      }
    } else {
      setVillages([]);
    }
  }, [editData.district, editData.taluka, language]);

  const translations = {
    en: {
      profile: 'Profile',
      editProfile: 'Edit Profile',
      saveChanges: 'Save Changes',
      cancel: 'Cancel',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      role: 'Role',
      village: 'Village',
      district: 'District',
      taluka: 'Taluka',
      department: 'Department',
      expertise: 'Expertise',
      verified: 'Verified Account',
      unverified: 'Unverified Account',
      memberSince: 'Member since',
      logout: 'Logout',
      roles: {
        farmer: 'Farmer',
        officer: 'Agricultural Officer',
        expert: 'Agricultural Expert'
      }
    },
    mr: {
      profile: 'प्रोफाइल',
      editProfile: 'प्रोफाइल संपादित करा',
      saveChanges: 'बदल जतन करा',
      cancel: 'रद्द करा',
      name: 'नाव',
      email: 'ईमेल',
      phone: 'फोन',
      role: 'भूमिका',
      village: 'गाव',
      district: 'जिल्हा',
      taluka: 'तालुका',
      department: 'विभाग',
      expertise: 'तज्ञता',
      verified: 'सत्यापित खाते',
      unverified: 'असत्यापित खाते',
      memberSince: 'सदस्य कधीपासून',
      logout: 'लॉगआउट',
      roles: {
        farmer: 'शेतकरी',
        officer: 'कृषी अधिकारी',
        expert: 'कृषी तज्ञ'
      }
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleSave = async () => {
    if (user) {
      await updateProfile(editData);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      phone: user?.phone || '',
      village: user?.village || '',
      district: user?.district || '',
      taluka: user?.taluka || '',
    });
    setIsEditing(false);
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t.profile}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex items-center justify-center space-x-2">
              <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
              {user.verified ? (
                <span title={t.verified}>
                  <Shield className="w-5 h-5 text-green-500" />
                </span>
              ) : (
                <span title={t.unverified}>
                  <Shield className="w-5 h-5 text-gray-400" />
                </span>
              )}
            </div>
            <p className="text-green-600 font-medium">
              {t.roles[user.role as keyof typeof t.roles]}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">{t.name}</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <span className="text-gray-900">{user.name}</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">{t.email}</span>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">{t.phone}</span>
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{user.phone}</span>
                </div>
              )}
            </div>

            {user.role === 'farmer' && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">{t.district}</span>
                  {isEditing ? (
                    <div className="relative w-1/2">
                      <select
                        value={editData.district}
                        onChange={(e) => setEditData({ ...editData, district: e.target.value })}
                        className="w-full pl-2 pr-8 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                      >
                        <option value="">{language === 'en' ? 'Select District' : 'जिल्हा निवडा'}</option>
                        {districts.map(district => (
                          <option key={district.value} value={district.value}>
                            {district.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{user.district}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">{t.taluka}</span>
                  {isEditing ? (
                    <div className="relative w-1/2">
                      <select
                        value={editData.taluka}
                        onChange={(e) => setEditData({ ...editData, taluka: e.target.value })}
                        className="w-full pl-2 pr-8 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                        disabled={!editData.district}
                      >
                        <option value="">{language === 'en' ? 'Select Taluka' : 'तालुका निवडा'}</option>
                        {talukas.map(taluka => (
                          <option key={taluka.value} value={taluka.value}>
                            {taluka.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{user.taluka}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">{t.village}</span>
                  {isEditing ? (
                    <div className="relative w-1/2">
                      <select
                        value={editData.village}
                        onChange={(e) => setEditData({ ...editData, village: e.target.value })}
                        className="w-full pl-2 pr-8 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
                        disabled={!editData.district || !editData.taluka}
                      >
                        <option value="">{language === 'en' ? 'Select Village' : 'गाव निवडा'}</option>
                        {villages.map(village => (
                          <option key={village.value} value={village.value}>
                            {village.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{user.village}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {user.role === 'officer' && user.department && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">{t.department}</span>
                <span className="text-gray-900">{user.department}</span>
              </div>
            )}

            {user.role === 'expert' && user.expertise && (
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium text-gray-500">{t.expertise}</span>
                <div className="text-right">
                  {user.expertise.map((skill, index) => (
                    <span key={index} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-500">{t.memberSince}</span>
              <span className="text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {isEditing ? (
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{t.saveChanges}</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  {t.cancel}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Edit2 className="w-4 h-4" />
                <span>{t.editProfile}</span>
              </button>
            )}

            <button
              onClick={logout}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.logout}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;