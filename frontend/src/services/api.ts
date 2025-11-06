const API_BASE_URL = 'http://localhost:8000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
};

// Auth API
export const authAPI = {
  register: (userData: any) => 
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials: { email: string; password: string }) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getProfile: () => apiRequest('/auth/me'),

  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
};

// Users API
export const usersAPI = {
  getDoctors: (params?: { specialty?: string; search?: string; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.specialty) queryParams.append('specialty', params.specialty);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    
    return apiRequest(`/users/doctors?${queryParams}`);
  },

  getDoctor: (id: string) => apiRequest(`/users/doctor/${id}`),

  updateProfile: (profileData: any) =>
    apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  getProfile: () => apiRequest('/users/profile'),
};

// Appointments API
export const appointmentsAPI = {
  create: (appointmentData: any) =>
    apiRequest('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    }),

  getAll: (params?: { status?: string; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    
    return apiRequest(`/appointments?${queryParams}`);
  },

  getById: (id: string) => apiRequest(`/appointments/${id}`),

  updateStatus: (id: string, status: string) =>
    apiRequest(`/appointments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  addPrescription: (id: string, prescriptionData: any) =>
    apiRequest(`/appointments/${id}/prescription`, {
      method: 'POST',
      body: JSON.stringify(prescriptionData),
    }),

  addRating: (id: string, rating: { score: number; review?: string }) =>
    apiRequest(`/appointments/${id}/rating`, {
      method: 'POST',
      body: JSON.stringify(rating),
    }),
};

// Consultations API
export const consultationsAPI = {
  start: (appointmentId: string) =>
    apiRequest(`/consultations/start/${appointmentId}`, {
      method: 'POST',
    }),

  get: (id: string) => apiRequest(`/consultations/${id}`),

  end: (id: string) =>
    apiRequest(`/consultations/${id}/end`, {
      method: 'POST',
    }),

  sendMessage: (id: string, message: string) =>
    apiRequest(`/consultations/${id}/message`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),

  recordVitals: (id: string, vitals: any) =>
    apiRequest(`/consultations/${id}/vitals`, {
      method: 'POST',
      body: JSON.stringify(vitals),
    }),

  reportIssue: (id: string, issue: any) =>
    apiRequest(`/consultations/${id}/technical-issue`, {
      method: 'POST',
      body: JSON.stringify(issue),
    }),

  getMessages: (id: string) => apiRequest(`/consultations/${id}/messages`),
};

// Upload API
export const uploadAPI = {
  documents: (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('documents', file);
    });

    return apiRequest('/upload/documents', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  },

  avatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    return apiRequest('/upload/avatar', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  },
};

export default {
  auth: authAPI,
  users: usersAPI,
  appointments: appointmentsAPI,
  consultations: consultationsAPI,
  upload: uploadAPI,
};