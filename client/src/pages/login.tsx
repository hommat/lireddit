import React, { useState } from 'react';
import NextLink from 'next/link';
import { Formik, Form } from 'formik';
import { Button, FormErrorMessage, FormControl, Link } from '@chakra-ui/core';
import { useRouter } from 'next/router';

import Layout from '@components/layout/Layout';
import InputField from '@components/form/InputField';
import { useLoginMutation, LoginInput } from '@generated/graphql';
import { toErrorMap } from '@utils/errors';
import { withApollo } from '@utils/apollo/withApollo';
import { setCacheCurrentUser, clearCachePosts } from '@utils/apollo/cache';

const initialFormValues: LoginInput = {
  username: '',
  password: '',
};

const Login = ({}) => {
  const [credentialsError, setCredentialsError] = useState('');
  const router = useRouter();
  const [login] = useLoginMutation();

  const handleSubmit = async (loginInput: LoginInput) => {
    const { data } = await login({
      variables: { loginInput },
      update: (cache, { data }) => {
        setCacheCurrentUser(cache, data?.login.user);
        clearCachePosts(cache);
      },
    });

    if (!data) return;

    const { errors } = data.login;

    if (errors) {
      const errorsMap = toErrorMap(errors);
      return setCredentialsError(errorsMap.credentials || '');
    }

    const { next } = router.query;
    const nextRoute = typeof next === 'string' ? next : '/';

    router.push(nextRoute);
  };

  return (
    <Layout variant="small">
      <Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
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
