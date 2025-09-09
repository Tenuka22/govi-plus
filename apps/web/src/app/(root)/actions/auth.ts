const { cookies } = require('next/headers');

const TOKEN_AGE = 3600;
const TOKEN_NAME = 'auth-token';
const TOKEN_REFRESH_NAME = 'auth-refresh-token';

export const getToken = async () => {
  const myAuthToken = await cookies().get(TOKEN_NAME);
  return myAuthToken?.value;
};

export const getRefreshToken = async () => {
  const myAuthToken = await cookies().get(TOKEN_REFRESH_NAME);
  return myAuthToken?.value;
};

export const setToken = async (authToken: string) => {
  await cookies().set({
    name: TOKEN_NAME,
    value: authToken,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV !== 'development',
    maxAge: TOKEN_AGE,
  });
};

export const setRefreshToken = async (authRefreshToken: string) => {
  await cookies().set({
    name: TOKEN_REFRESH_NAME,
    value: authRefreshToken,
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV !== 'development',
    maxAge: TOKEN_AGE,
  });
};

export const deleteTokens = async () => {
  cookies().delete(TOKEN_REFRESH_NAME);
  await cookies().delete(TOKEN_NAME);
};
