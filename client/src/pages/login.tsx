import React, { useState } from 'react';
import NextLink from 'next/link';
import { Formik, Form } from 'formik';
import { Button, FormErrorMessage, FormControl, Link } from '@chakra-ui/core';
import { useRouter } from 'next/router';

import Layout from '../components/Layout';
import InputField from '../components/InputField';
import {
  useLoginMutation,
  CurrentUserQuery,
  CurrentUserDocument,
} from '../generated/graphql';
import { toErrorMap } from '../utils/errors';
import { withApollo } from '../utils/withApollo';

const Login = ({}) => {
  const [credentialsError, setCredentialsError] = useState('');
  const router = useRouter();
  const [login] = useLoginMutation();

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values) => {
          const { data } = await login({
            variables: { loginInput: values },
            update: (cache, { data }) => {
              cache.writeQuery<CurrentUserQuery>({
                query: CurrentUserDocument,
                data: {
                  __typename: 'Query',
                  currentUser: data?.login.user,
                },
              });
            },
          });

          if (!data) return;

          const { errors, user } = data.login;

          if (errors) {
            const errorsMap = toErrorMap(errors);
            return setCredentialsError(errorsMap.credentials || '');
          }

          if (user) {
            const { next } = router.query;
            const nextRoute = typeof next === 'string' ? next : '/';

            router.push(nextRoute);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              label="Enter username"
              placeholder="Enter username..."
              autoComplete="true"
            />
            <InputField
              name="password"
              label="Enter password"
              placeholder="Enter password..."
              type="password"
              autoComplete="true"
            />
            <FormControl isInvalid={!!credentialsError}>
              <FormErrorMessage>{credentialsError}</FormErrorMessage>
            </FormControl>

            <Button type="submit" mt={4} isLoading={isSubmitting}>
              Login
            </Button>
          </Form>
        )}
      </Formik>
      <Link>
        <NextLink href="/forgot-password">Forgot password?</NextLink>
      </Link>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Login);
