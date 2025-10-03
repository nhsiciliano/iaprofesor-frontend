import { getAccessToken, getSession } from './auth';

export async function debugAuth() {
  console.log('=== DEBUG AUTH ===');
  
  try {
    // Verificar sesión
    const { session, user } = await getSession();
    console.log('Session:', session ? 'EXISTS' : 'NULL');
    console.log('User:', user ? user.email : 'NULL');
    
    if (session) {
      console.log('Session expires at:', new Date(session.expires_at! * 1000));
      console.log('Session is expired:', new Date(session.expires_at! * 1000) < new Date());
    }
    
    // Verificar token
    const token = await getAccessToken();
    console.log('Token:', token ? `${token.substring(0, 20)}...` : 'NULL');
    
    // Intentar decodificar token básico (sin verificar firma)
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', {
          sub: payload.sub,
          email: payload.email,
          exp: new Date(payload.exp * 1000),
          iat: new Date(payload.iat * 1000),
          isExpired: new Date(payload.exp * 1000) < new Date()
        });
      } catch {
        console.log('Could not decode token payload');
      }
    }
    
  } catch (error) {
    console.error('Debug auth error:', error);
  }
  
  console.log('=== END DEBUG ===');
}
