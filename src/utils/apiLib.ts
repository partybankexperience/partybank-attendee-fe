import type { endPointlistTypes } from './types';

// API ENDPOINT DOCUMENTATION
const headers = {
  'Content-Type': 'application/json',
  crossDomain: 'true',
};

// const FileHeaders = {
//     'Content-Type': 'multipart/form-data',
//     crossDomain: 'true',
// };

export const endPoints: endPointlistTypes = {
  // onboarding
  login: {
    url: '/auth/login',
    method: 'POST',
    headers,
    auth: false,
  },
  signUp:{
    url: '/auth/attendee-signup',
    method: 'POST',
    headers,
    auth: true,
  },
  sendOtp:{
    url: '/auth/initiate',
    method: 'POST',
    headers,
    auth: false,
  },
  verifyOtp:{
    url: '/auth/verify-otp',
    method: 'POST',
    headers,
    auth: false,
  },
  resendOtp:{
    url: '/auth/resend-otp',
    method: 'POST',
    headers,
    auth: false,
  },
  emailExists:{
    url: '/auth/check-email',
    method: 'POST',
    headers,
    auth: false,
  },
  // events
  getEvents: {
    url: '/events',
    method: 'GET',
    headers,
    // auth: true,
  },
  getEventBySlug: {
    url: '/events/slug',
    method: 'GET',
    headers,
    // auth: true,
  },
};
