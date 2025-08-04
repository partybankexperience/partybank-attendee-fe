import { apiCall } from "../utils/axiosFormat";

const LoginUser = async (email: string, password: string): Promise<any> => {
    const response = await apiCall({
      name: 'login',
      data: { email, password },
    });
    return response;
  };

export { LoginUser };