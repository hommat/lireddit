export const errorMessages: Record<string, Record<string, string>> = {
  auth: {
    NOT_LOGGED_IN: 'You must be logged in to perform this action',
    WRONG_USERNAME_OR_PASSWORD: 'Wrong username or password',
  },
  user: {
    EMAIL_TAKEN: 'This email is already in use',
    TOKEN_NOT_VALID: 'Token is not valid',
    USER_NO_LONGER_EXISTS: 'User no longer exists',
    USERNAME_TAKEN: 'This username is already in use',
  },
};

export const errorFields: Record<string, string> = {
  CREDENTIALS: 'credentials',
  EMAIL: 'email',
  TOKEN: 'token',
  USERNAME: 'username',
};
