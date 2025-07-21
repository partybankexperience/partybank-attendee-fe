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
  }
};
