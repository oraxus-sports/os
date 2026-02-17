const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8090';

class AuthService {
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  }

  async signup(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username || userData.email || userData.phoneNumber,
          password: userData.password,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Sign up failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Sign up service error:', error);
      throw error;
    }
  }

  async sendOTP(mobile) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: mobile, platform: 'web' }),
      });

      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  }

  async verifyOTP(mobile, otp) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: mobile, code: otp }),
      });

      if (!response.ok) {
        throw new Error('OTP verification failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  }

  async socialAuth(provider, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/social/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error(`${provider} authentication failed`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`${provider} auth error:`, error);
      throw error;
    }
  }

  async logout(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  async refreshToken(refreshToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }
}

export default new AuthService();
