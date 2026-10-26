import { AdminUser } from '../types';

const AUTH_STORAGE_KEY = 'glowhauz_admin_session';
const ADMIN_CREDENTIALS_KEY = 'glowhauz_admin_credentials';

export interface AdminSession {
  user: AdminUser;
  token: string;
  expiresAt: number;
}

// Initial owner credentials (safe, local default that owner can change in admin settings)
const DEFAULT_CREDENTIALS = {
  email: 'admin@glowhauz.ng',
  passwordHash: 'Herkan007', // Master admin password specified by user
  name: 'Store Administrator',
};

export function getAdminCredentials() {
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_CREDENTIALS;
    }
    return DEFAULT_CREDENTIALS;
  } catch {
    return DEFAULT_CREDENTIALS;
  }
}

export function updateAdminCredentials(email: string, newPassword?: string, name?: string) {
  const current = getAdminCredentials();
  const updated = {
    email: email.trim().toLowerCase(),
    passwordHash: newPassword && newPassword.trim().length >= 6 ? newPassword.trim() : current.passwordHash,
    name: name?.trim() || current.name,
  };
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(ADMIN_CREDENTIALS_KEY, JSON.stringify(updated));
  }
}

/**
 * Single-step password-only administrator authentication
 */
export function loginWithPasswordOnly(password: string): { success: boolean; error?: string; user?: AdminUser } {
  const creds = getAdminCredentials();
  const cleanPassword = password.trim();

  // Validate against configured password, master password Herkan007, or legacy default
  if (
    cleanPassword === 'Herkan007' ||
    cleanPassword === creds.passwordHash ||
    cleanPassword === 'GlowHauzAdmin2026!'
  ) {
    const user: AdminUser = {
      id: 'admin-001',
      email: creds.email || 'akanimohjohn11@gmail.com',
      name: creds.name || 'Store Administrator',
      role: 'super_admin',
    };

    const session: AdminSession = {
      user,
      token: 'ghz_adm_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('glowhauz_auth_change', { detail: { loggedIn: true } }));
    }
    return { success: true, user };
  }

  return { success: false, error: 'Incorrect administrator password.' };
}

export function loginAdmin(email: string, password: string): { success: boolean; error?: string; user?: AdminUser } {
  // Directly reuse password verification
  return loginWithPasswordOnly(password);
}

export function getAdminSession(): AdminSession | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session: AdminSession = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      logoutAdmin();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function isAuthenticatedAdmin(): boolean {
  return getAdminSession() !== null;
}

export function logoutAdmin(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('glowhauz_auth_change', { detail: { loggedIn: false } }));
  }
}
