const API_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
export const API_BASE_URL = `${API_ORIGIN}/api`;
export const resolveImageUrl = (image) => (
  image?.startsWith('/uploads/') ? `${API_ORIGIN}${image}` : image
);

export const apiFetch = (path, options = {}) => {
  const token = localStorage.getItem('dragcare_token');
  const headers = new Headers(options.headers || {});
  const allowBinaryResponse = options.responseType === 'blob' || path.endsWith('/file');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  }).then((response) => {
    const contentType = response.headers.get('content-type') || '';
    if (response.status >= 500 && !contentType.includes('application/json')) {
      throw new Error('Cannot reach the backend. Start the server on port 8000 and try again.');
    }
    if (!allowBinaryResponse && !contentType.includes('application/json') && !contentType.includes('+json')) {
      throw new Error('The API returned an unexpected response instead of JSON. Check that the backend is running and VITE_API_URL is configured correctly.');
    }
    return response;
  }).catch((error) => {
    if (error instanceof TypeError) {
      throw new Error('Cannot connect to the backend. Start the server on port 8000 and try again.');
    }
    throw error;
  });
};
