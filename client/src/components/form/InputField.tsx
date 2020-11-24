import React, { InputHTMLAttributes, FC, ComponentType } from 'react';
import { useField } from 'formik';
import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from '@chakra-ui/core';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  mt?: number;
  textarea?: boolean;
}

const InputField: FC<InputFieldProps> = ({ mt = 4, textarea, label, ...rest }) => {
  const [field, { touched, error }] = useField(rest);
  const InputComponent: ComponentType<{ id?: string }> = textarea ? Textarea : Input;

  return (
    <FormControl isInvalid={!!error && touched} mt={mt}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputComponent {...rest} {...field} id={field.name} />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default InputField;
