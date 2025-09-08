import type { AuthErrorCodes } from '../../services/auth-client';

type ErrorTypes = Record<keyof AuthErrorCodes, { en: string }>;

export const authErrorCodeMessages = {
  USER_NOT_FOUND: { en: 'No account was found with the provided credentials.' },
  FAILED_TO_CREATE_USER: {
    en: 'We could not create your account. Please try again later.',
  },
  FAILED_TO_CREATE_SESSION: {
    en: 'Unable to start your session. Please log in again.',
  },
  FAILED_TO_UPDATE_USER: {
    en: 'Your profile could not be updated. Please try again.',
  },
  FAILED_TO_GET_SESSION: {
    en: 'Could not retrieve your session. Please log in again.',
  },
  INVALID_PASSWORD: { en: 'The password you entered is incorrect.' },
  INVALID_EMAIL: { en: 'The email address is not valid.' },
  INVALID_EMAIL_OR_PASSWORD: {
    en: 'Invalid email or password. Please try again.',
  },
  SOCIAL_ACCOUNT_ALREADY_LINKED: {
    en: 'This social account is already linked to another user.',
  },
  PROVIDER_NOT_FOUND: { en: 'The authentication provider was not recognized.' },
  INVALID_TOKEN: { en: 'Your authentication token is invalid or has expired.' },
  ID_TOKEN_NOT_SUPPORTED: { en: 'This ID token type is not supported.' },
  FAILED_TO_GET_USER_INFO: { en: 'Unable to fetch your account information.' },
  USER_EMAIL_NOT_FOUND: { en: 'No user found with this email address.' },
  EMAIL_NOT_VERIFIED: { en: 'You must verify your email before continuing.' },
  PASSWORD_TOO_SHORT: {
    en: 'Your password is too short. Please choose a longer one.',
  },
  PASSWORD_TOO_LONG: { en: 'Your password is too long. Please shorten it.' },
  USER_ALREADY_EXISTS: {
    en: 'An account with email already exists.',
  },
  EMAIL_CAN_NOT_BE_UPDATED: {
    en: 'Your email address cannot be updated once set.',
  },
  CREDENTIAL_ACCOUNT_NOT_FOUND: {
    en: 'No credentials found for this account.',
  },
  SESSION_EXPIRED: { en: 'Your session has expired. Please log in again.' },
  FAILED_TO_UNLINK_LAST_ACCOUNT: {
    en: 'You cannot unlink your last authentication method.',
  },
  ACCOUNT_NOT_FOUND: { en: 'The requested account could not be found.' },
  USER_ALREADY_HAS_PASSWORD: { en: 'This user already has a password set.' },
  YOU_CANNOT_BAN_YOURSELF: { en: 'You cannot ban your own account.' },
  YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: {
    en: 'You are not authorized to change user roles.',
  },
  YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: {
    en: 'You are not authorized to create new users.',
  },
  YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: {
    en: 'You are not authorized to view the user list.',
  },
  YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: {
    en: 'You are not authorized to view user sessions.',
  },
  YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: {
    en: 'You are not authorized to ban users.',
  },
  YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: {
    en: 'You are not authorized to impersonate users.',
  },
  YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: {
    en: 'You are not authorized to revoke user sessions.',
  },
  YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: {
    en: 'You are not authorized to delete users.',
  },
  YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: {
    en: 'You are not authorized to set user passwords.',
  },
  BANNED_USER: { en: 'Your account has been banned from this application.' },
  NO_DATA_TO_UPDATE: { en: 'There was no data provided to update.' },
  YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS: {
    en: 'You are not authorized to update user accounts.',
  },
  YOU_ARE_NOT_ALLOWED_TO_GET_USER: {
    en: 'You are not authorized to get user account.',
  },
  YOU_CANNOT_REMOVE_YOURSELF: {
    en: 'You are not authorized to remove yourself.',
  },
} satisfies ErrorTypes;
