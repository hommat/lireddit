export const createChangePasswordEmail = (host: string, token: string) =>
  `<a href="${host}/change-password/${token}">reset password</a>`;
