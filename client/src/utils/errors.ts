import { FieldError } from '../generated/graphql';

export const toErrorMap = (errors: FieldError[]) =>
  errors.reduce((acc: Record<string, string>, { field, message }) => {
    acc[field] = message;

    return acc;
  }, {});
