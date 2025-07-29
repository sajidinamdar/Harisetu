
export interface OTPUser {
  id: string;
  email: string;
  name: string;
  district?: string | null;
  taluka?: string | null;
  village?: string | null;
  role: 'farmer' | 'officer' | 'expert';
  verified: boolean;
  createdAt: string;
}

export interface OTPRegisterData {
  email: string;
  name: string;
  district?: string;
  taluka?: string;
  village?: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  status?: string;
  user?: OTPUser;
  token?: string;
}

export interface OTPVerifyRequest {
  email: string;
  otp: string;
  purpose: 'login' | 'signup';
}

export interface OTPSendRequest {
  email: string;
  purpose: 'login' | 'signup';
}