import axios from 'axios';

export class SnovioClient {
  private apiKey: string;
  private baseURL = 'https://api.snov.io/v2';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Snov.io API key is required');
    }
    this.apiKey = apiKey;
  }

  async emailFinder(domain: string, fullName: string) {
    try {
      const response = await axios.post(`${this.baseURL}/email-finder`, {
        api_key: this.apiKey,
        domain,
        full_name: fullName
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'emailFinder');
      throw error;
    }
  }

  async emailVerifier(email: string) {
    try {
      const response = await axios.post(`${this.baseURL}/email-verifier`, {
        api_key: this.apiKey,
        email
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'emailVerifier');
      throw error;
    }
  }

  async domainSearch(domain: string, limit = 100) {
    try {
      const response = await axios.post(`${this.baseURL}/domain-emails`, {
        api_key: this.apiKey,
        domain,
        limit
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'domainSearch');
      throw error;
    }
  }

  async linkedinSearch(linkedinUrl: string) {
    try {
      const response = await axios.post(`${this.baseURL}/linkedin-email`, {
        api_key: this.apiKey,
        linkedin_url: linkedinUrl
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'linkedinSearch');
      throw error;
    }
  }

  private handleError(error: unknown, method: string) {
    if (axios.isAxiosError(error)) {
      console.error(`Snov.io API Error in ${method}:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    } else {
      console.error(`Error in ${method}:`, error);
    }
  }
}
