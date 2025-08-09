// Priority options
export const PRIORITY_OPTIONS = [
  { value: 'Low', label: 'Low', color: 'green' },
  { value: 'Medium', label: 'Medium', color: 'yellow' },
  { value: 'High', label: 'High', color: 'red' },
];

// Status options
export const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending', color: 'yellow' },
  { value: 'In Progress', label: 'In Progress', color: 'blue' },
  { value: 'Completed', label: 'Completed', color: 'green' },
];

// Role options
export const ROLE_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Administrator' },
];

// Navigation items for admin
export const ADMIN_NAV_ITEMS = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard' },
  { name: 'Create Task', path: '/admin/createtask', icon: 'Plus' },
  { name: 'Manage Tasks', path: '/admin/managetasks', icon: 'CheckSquare' },
  { name: 'Manage Users', path: '/admin/manageusers', icon: 'Users' },
];

// Navigation items for users
export const USER_NAV_ITEMS = [
  { name: 'Dashboard', path: '/user/dashboard', icon: 'LayoutDashboard' },
  { name: 'My Tasks', path: '/user/mystasks', icon: 'CheckSquare' },
];

// Chart colors
export const CHART_COLORS = {
  primary: '#1368EC',
  secondary: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  success: '#059669',
};

// Default avatar URL
export const DEFAULT_AVATAR = 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150';