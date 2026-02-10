import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isPublicPage = nextUrl.pathname === '/' || nextUrl.pathname.startsWith('/diagnosis') || nextUrl.pathname === '/signup' || nextUrl.pathname === '/strategy' || nextUrl.pathname.startsWith('/schools');
            const isOnLogin = nextUrl.pathname.startsWith('/login');
            const isPublicAsset = nextUrl.pathname.includes('.') || nextUrl.pathname.startsWith('/api/auth');

            if (isPublicAsset) return true;

            if (isOnLogin || (isLoggedIn && nextUrl.pathname === '/')) {
                if (isLoggedIn) {
                    return Response.redirect(new URL('/dashboard', nextUrl));
                }
                // Allow login page for guests
                if (isOnLogin) return true;
            }

            if (isPublicPage) return true;

            // Protect everything else (Dashboard, etc.)
            if (!isLoggedIn) {
                return false; // Redirect to login
            }
            return true;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
                // Add custom fields if needed and properly typed
                // (session.user as any).role = token.role; 
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        }
    },
    providers: [], // Configured in auth.ts
    secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
