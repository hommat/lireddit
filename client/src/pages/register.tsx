import React from 'react';
import { Formik, Form } from 'formik';
import { Button } from '@chakra-ui/core';

import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useRegisterMutation } from '../generated/graphql';

const Register = ({}) => {
  const [, register] = useRegisterMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={register}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              label="Enter username"
              placeholder="Enter username..."
            />
            <InputField
              name="password"
              label="Enter password"
              placeholder="Enter password..."
              type="password"
            />

            <Button type="submit" mt={4} isLoading={isSubmitting}>
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
