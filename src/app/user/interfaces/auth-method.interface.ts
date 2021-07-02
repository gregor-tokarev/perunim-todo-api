export type authMethodType = 'google' | 'facebook' | 'email';

export interface AuthMethod {
  type: authMethodType;
  googleAccessToken?: string;
  facebookAccessToken?: string;
}
