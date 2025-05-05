import axiosInstance from '../helpers/axiosInstance';

// Type for login payload
interface LoginPayload {
  email: string;
  password: string;
}

// Type for login response (customize as per your backend response)
interface LoginResponse {
  token: string;
  user: any; // Replace 'any' with your User type if available
}

// Login API function
export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axiosInstance.post('/auth/login', payload);
  return response.data;
};