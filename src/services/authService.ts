export interface LoginResponse {
  message: string;
}

export async function login(name: string, email: string): Promise<LoginResponse> {
  const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return { message: 'Login successful' };
}

export async function logout(): Promise<void> {
  const response = await fetch('https://frontend-take-home-service.fetch.com/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }
}
