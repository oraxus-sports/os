import axios from 'axios';

const DEFAULT_BASE = 'http://localhost:8090';

function baseUrl() {
  return (process.env.REACT_APP_AUTH_BASE || process.env.AUTH_BASE || DEFAULT_BASE);
}

export interface RegisterPayload {
  username: string;
  password: string;
  email?: string;
  phoneNumber?: string;
}

export interface LoginPayload {
  username: string;
  password?: string;
  platform?: 'web' | 'mobile';
}

export async function register(payload: RegisterPayload) {
  const url = `${baseUrl()}/auth/register`;
  const resp = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } });
  return resp.data;
}

export async function login(payload: LoginPayload) {
  const url = `${baseUrl()}/auth/login`;
  const resp = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } });
  return resp.data;
}

export default { register, login };
