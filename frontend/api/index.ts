import { request } from './apiClient.js';

export const authApi = {
  login: async (username = 'officer_sharma', password?: string) => {
    return request<{ success: boolean; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },
  getCurrentUser: async () => {
    return request<{ success: boolean; user: any }>('/auth/me');
  }
};

export const detectionApi = {
  runLiveStream: async (cameraId: string, seed?: number) => {
    return request<{ success: boolean; data: any }>('/live-detection', {
      method: 'POST',
      body: JSON.stringify({ cameraId, seed })
    });
  },
  runImageDetection: async (cameraId: string, width?: number, height?: number, seed?: number) => {
    return request<{ success: boolean; data: any }>('/image-detection', {
      method: 'POST',
      body: JSON.stringify({ cameraId, width, height, seed })
    });
  },
  runVideoDetection: async (cameraId: string, videoUrl?: string, seed?: number) => {
    return request<{ success: boolean; videoUrl: string; data: any }>('/video-detection', {
      method: 'POST',
      body: JSON.stringify({ cameraId, videoUrl, seed })
    });
  },
  runAnpr: async (plateHint?: string) => {
    return request<{ success: boolean; data: any }>('/anpr', {
      method: 'POST',
      body: JSON.stringify({ plateHint })
    });
  }
};

export const violationApi = {
  getAll: async () => {
    return request<{ success: boolean; data: any[] }>('/violations');
  },
  getById: async (id: string) => {
    return request<{ success: boolean; data: any }>(`/violations/${id}`);
  },
  updateStatus: async (id: string, status: string, reviewer?: string) => {
    return request<{ success: boolean; data: any }>(`/violations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reviewer })
    });
  }
};

export const challanApi = {
  getAll: async () => {
    return request<{ success: boolean; data: any[] }>('/challans');
  },
  getById: async (id: string) => {
    return request<{ success: boolean; data: any }>(`/challans/${id}`);
  },
  pay: async (id: string, paymentMethod = 'DEMO_UPI') => {
    return request<{ success: boolean; data: any; message: string }>(`/challans/${id}/pay`, {
      method: 'POST',
      body: JSON.stringify({ paymentMethod })
    });
  }
};

export const cameraApi = {
  getAll: async () => {
    return request<{ success: boolean; data: any[] }>('/cameras');
  },
  getById: async (id: string) => {
    return request<{ success: boolean; data: any }>(`/cameras/${id}`);
  },
  setStatus: async (id: string, status: string) => {
    return request<{ success: boolean; data: any }>(`/cameras/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }
};

export const dashboardApi = {
  getStats: async () => {
    return request<{ success: boolean; data: any }>('/dashboard/stats');
  }
};

export const reportApi = {
  generate: async () => {
    return request<{ success: boolean; data: any }>('/reports/generate', {
      method: 'POST'
    });
  }
};

export const vehicleApi = {
  getAll: async () => {
    return request<{ success: boolean; data: any[] }>('/vehicles');
  },
  getByPlate: async (plate: string) => {
    return request<{ success: boolean; data: any }>(`/vehicles/${encodeURIComponent(plate)}`);
  }
};
