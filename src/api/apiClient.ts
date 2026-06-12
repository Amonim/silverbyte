export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const userStr = localStorage.getItem('sb_current_user');
  const headers = new Headers(options.headers || {});
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.email) {
        headers.set('x-user-email', user.email);
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }

  const response = await fetch(url, { ...options, headers });

  if (!url.includes('/api/admin/')) {
    if (response.status === 401 || response.status === 403) {
      const data = await response.clone().json().catch(() => ({}));
      const message = data.error || 'Ваш аккаунт заблокирован или удалён. Обратитесь к администратору.';
      
      localStorage.removeItem('sb_current_user');
      window.dispatchEvent(new CustomEvent('auth-error', { 
        detail: { message } 
      }));
    }
  }

  return response;
}
