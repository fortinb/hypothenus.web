import NextAuth from "next-auth";
import AzureAD from "next-auth/providers/microsoft-entra-id";
import { jwtDecode } from "jwt-decode";

type AzureAccessToken = {
    roles?: string[];
    groups?: string[];
    exp?: number;
};

export const { auth,  handlers: { GET, POST }, signIn, signOut } = NextAuth({
    providers: [
        AzureAD({
            id: "entra",
            name: "Microsoft Entra External ID",

            clientId: process.env.AZURE_CLIENT_ID!,
            clientSecret: process.env.AZURE_CLIENT_SECRET!,
            issuer: `https://${process.env.AZURE_TENANT_ID}.ciamlogin.com/${process.env.AZURE_TENANT_ID}/v2.0`,

            authorization: {
                url: `https://${process.env.AZURE_TENANT_NAME}.ciamlogin.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/authorize`,

                params: {
                    prompt: "login",// forces Azure to always show username/password
                    scope: `openid profile email api://${process.env.AZURE_API_SCOPE_USER_ROLES}`
                },
            },
            token: {
                url: `https://${process.env.AZURE_TENANT_NAME}.ciamlogin.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
            },
            userinfo: {
                url: "https://graph.microsoft.com/oidc/userinfo",
            },
            checks: ["pkce", "state"],
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, account }) {
            // First login only
            if (account?.access_token) {
                const decoded = jwtDecode<AzureAccessToken>(account.access_token);

                token.accessToken = account.access_token;
                token.roles = decoded.roles ?? [];
                token.expiresAt = decoded.exp
                    ? decoded.exp * 1000
                    : Date.now() + 60 * 60 * 1000;
            }

            console.log("JWT callback token:", token);
            return token;
        },

        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.user.roles = token.roles as string[];

            // Extract the user's name from the given_name claim in the access token
            const decoded = jwtDecode<{ name?: string, email?: string }>(token.accessToken as string);
            session.user.name = decoded.name || "";
            session.user.email = decoded.email || "";

            console.log("Session callback session:", session);
            return session;
        },
    },
});