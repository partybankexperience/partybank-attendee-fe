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
  
};

export type urlPropTypes = {
  urlExtra?: string;
  name: string;
  data?: any;
  params?: any;
  action?: (data: any) => any;
  alert?: boolean;
};
