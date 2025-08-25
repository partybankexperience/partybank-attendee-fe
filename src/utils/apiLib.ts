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
  forgotPassword: {
    url: '/reset-password/initiate',
    method: 'POST',
    headers,
    auth: false,
  },
  forgotPasswordOTP: {
    url: '/reset-password/verify',
    method: 'POST',
    headers,
    auth: false,
  },
  resetPassword: {
    url: '/reset-password/submit',
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
  //tickets
  checkTicketAvailability: {
    url: '/tickets',
    method: 'POST',
    headers,
    auth: false,
  },
  //checkout
  initiateCheckout: {
    url: '/checkout/initiate',
    method: 'POST',
    headers,
    auth: true,
  },
 cancelCheckout: {
    url: '/checkout/cancel',
    method: 'POST',
    headers,
    auth: true,
  },
  checkoutStatus: {
    url: '/checkout',
    method: 'GET',
    headers,
    auth: true,
  },
  getReservation:{
    url: '/reservations',
    method: 'GET',
    headers,
    // auth: true,
  },
  createReservation: {
    url: '/reservations',
    method: 'POST',
    headers,
    // auth: true,
  },
  cancelReservation: {
    url: '/reservations',
    method: 'PUT',
    headers,
    // auth: true,
  },
};
