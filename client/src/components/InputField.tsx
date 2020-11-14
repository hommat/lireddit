import React, { InputHTMLAttributes, FC } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from '@chakra-ui/core';
import { useField } from 'formik';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  mt?: number;
}

const InputField: FC<InputFieldProps> = ({
  mt = 4,
  label,
  size: _,
  ...rest
}) => {
  const [field, { touched, error }] = useField(rest);

  return (
    <FormControl isInvalid={error && touched} mt={mt}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...rest} {...field} id={field.name} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default InputField;
