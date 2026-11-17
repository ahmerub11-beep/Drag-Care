const normalizeRole = (role) => String(role || '')
  .trim()
  .toLowerCase()
  .replace(/[\s_]+/g, '-');

export const hasDashboardAccess = (role) => {
  const normalizedRole = normalizeRole(role);
  return ['admin', 'administrator', 'super-admin', 'superadmin'].includes(normalizedRole);
};

export const isSuperAdminRole = (role) => {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === 'super-admin' || normalizedRole === 'superadmin';
};
