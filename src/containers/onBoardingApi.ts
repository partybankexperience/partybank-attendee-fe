import { apiCall } from "../utils/axiosFormat";

const LoginUser = async (email: string, password: string): Promise<any> => {
    const response = await apiCall({
      name: 'login',
      data: { email, password },
    });
    return response;
  };

  const emailExists = async (email: string): Promise<any> => {
    const response = await apiCall({
      name: 'emailExists',
      data: { email },
    });
    return response;
  };
const SignUpUser = async (email: string, password: string,firstName:string,lastName:string,gender:'male'|'female'|'other'): Promise<any> => {
    const response = await apiCall({
      name: 'signUp',
      data: { email, password,firstName,lastName,gender },
    });
    return response;
  };

const verifyOtp=async(otp:any,email:string): Promise<any> => {
    const response = await apiCall({
      name: 'verifyOtp',
      data: {otp,email },
    });
    return response;
  };
const resendOTP=async(email:any,purpose:"signup"|"password"): Promise<any> => {
    const response = await apiCall({
      name: 'resendOtp',
      data: {email,purpose},
    });
    return response;
  };
export { LoginUser, SignUpUser,verifyOtp,resendOTP,emailExists };