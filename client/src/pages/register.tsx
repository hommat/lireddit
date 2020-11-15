import React from 'react';
import { Formik, Form } from 'formik';
import { Button } from '@chakra-ui/core';
import { useRouter } from 'next/router';

import Layout from '../components/Layout';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useRegisterMutation, RegisterInput } from '../generated/graphql';
import { toErrorMap } from '../utils/errors';
import { withUrqlClient } from '../utils/withUrqlClient';

const Register = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  const initialValues: RegisterInput = {
    username: '',
    password: '',
    email: '',
  };

  return (
    <Layout variant="small">
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, { setErrors }) => {
          const { data } = await register({ registerInput: values });
          if (!data) return;

          const { errors, user } = data.register;

          if (errors) {
            return setErrors(toErrorMap(errors));
          }

          if (user) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              label="Enter username"
              placeholder="Enter username..."
            />
            <InputField
              name="email"
              label="Enter email"
              placeholder="Enter email..."
              type="email"
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
    </Layout>
  );
};

export default withUrqlClient()(Register);
