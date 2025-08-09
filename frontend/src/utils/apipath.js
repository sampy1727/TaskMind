// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/getprofile',
  UPDATE_PROFILE: '/auth/updateprofile',
  UPLOAD_IMAGE: '/auth/upload-image',
};

// Task endpoints
export const TASK_ENDPOINTS = {
  GET_ALL: '/task',
  CREATE: '/task',
  GET_BY_ID: (id) => `/task/${id}`,
  UPDATE: (id) => `/task/${id}`,
  DELETE: (id) => `/task/${id}`,
  UPDATE_STATUS: (id) => `/task/${id}/status`,
  UPDATE_CHECKLIST: (id) => `/task/${id}/todo`,
  DASHBOARD_DATA: '/task/dashboard-data',
  USER_DASHBOARD_DATA: '/task/user-dashboard-data',
};

// User endpoints
export const USER_ENDPOINTS = {
  GET_ALL: '/users',
  GET_BY_ID: (id) => `/users/${id}`,
  UPDATE: (id) => `/users/${id}`,
  DELETE: (id) => `/users/${id}`,
};

// Report endpoints
export const REPORT_ENDPOINTS = {
  EXPORT_TASKS: '/report/export/tasks',
  EXPORT_USERS: '/report/export/users',
};