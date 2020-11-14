import React from 'react';
import { Formik, Form } from 'formik';
import { Button } from '@chakra-ui/core';
import { useMutation } from 'urql';

import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';

interface RegisterProps {}

const REGISTER_MUT = `mutation Register($username: String!, $password: String!){
  register(credentials: { username: $username, password: $password }) {
    errors {
      field
      message
    }
    user {
      id
    }
  }
}
`;

const Register: React.FC<RegisterProps> = ({}) => {
  const [, register] = useMutation(REGISTER_MUT);

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
