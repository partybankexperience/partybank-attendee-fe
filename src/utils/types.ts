import type { MouseEventHandler } from 'react';

export type DefaultButtonType = {
  handleClick?: MouseEventHandler<HTMLButtonElement> | undefined;
};

export type endpointTypes = {
  url: string;
  method: string;
  headers?: Record<string, string>;
  auth?: boolean;
  urlExtra?: string;
};

export type endPointlistTypes = {
 
  login: endpointTypes;
  getEvents: endpointTypes;
  signUp: endpointTypes;
  verifyOtp:endpointTypes;
  resendOtp:endpointTypes;
  emailExists:endpointTypes;
  getEventBySlug:endpointTypes;
  sendOtp:endpointTypes;
};

export type urlPropTypes = {
  urlExtra?: string;
  name: string;
  data?: any;
  params?: any;
  action?: (data: any) => any;
  alert?: boolean;
};
