import React from 'react';
import { Formik, Form } from 'formik';
import { Button } from '@chakra-ui/core';
import { useRouter } from 'next/router';

import Layout from '../components/Layout';
import InputField from '../components/InputField';
import {
  useRegisterMutation,
  RegisterInput,
  CurrentUserDocument,
  CurrentUserQuery,
} from '../generated/graphql';
import { toErrorMap } from '../utils/errors';
import { withApollo } from '../utils/withApollo';

const Register = ({}) => {
  const router = useRouter();
  const [register] = useRegisterMutation();
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
          const { data } = await register({
            variables: { registerInput: values },
            update: (cache, { data }) => {
              cache.writeQuery<CurrentUserQuery>({
                query: CurrentUserDocument,
                data: {
                  __typename: 'Query',
                  currentUser: data?.register.user,
                },
              });
            },
          });
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

export default withApollo({ ssr: true })(Register);
