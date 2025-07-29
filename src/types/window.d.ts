import { OTPUser } from './otp-auth-types';

declare global {
  interface Window {
    ensureOTPUserExists: (phone: string) => boolean;
  }
}