import { FieldError } from '../generated/graphql';

export function toErrorMap(errors: FieldError[]) {
  const errorRecord: Record<string, string> = {};

  errors.forEach(({ field, message }) => {
    errorRecord[field] = message;
  });

  return errorRecord;
}
