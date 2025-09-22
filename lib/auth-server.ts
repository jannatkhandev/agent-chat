import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from './auth';

/**
 * Helper function to get the current session in a server component
 * @returns The session object or null if not authenticated
 */
export async function getServerSession() {
  try {
    // In server components, we don't need to pass headers 
    // as auth will use the request context automatically
    const session = await auth.api.getSession({ headers: await headers() });
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Helper function to require authentication in a server component
 * If user is not authenticated, redirects to login page
 * @param redirectTo Optional path to redirect to after login
 * @returns The session object
 */
export async function requireAuth(redirectTo?: string) {
  const session = await getServerSession();
  
  if (!session) {
    const loginPath = redirectTo ? `/login?callbackUrl=${encodeURIComponent(redirectTo)}` : '/login';
    redirect(loginPath);
  }
  
  return session;
}

/**
 * Helper function to check if user is authenticated in a server component
 * @returns Boolean indicating if user is authenticated
 */
export async function isAuthenticated() {
  const session = await getServerSession();
  return !!session;
} 