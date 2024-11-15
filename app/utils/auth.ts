import { cookies } from "next/headers";

export async function handleCookies(authTokens: string) {
    // Setting a cookie
    (await cookies()).set('username', authTokens, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // one day 
    });
}

export async function cToken() {
    // Getting authTokens
    const token = (await cookies()).get('authTokens')?.value;

    return token;
}

