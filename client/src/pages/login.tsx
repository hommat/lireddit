import React, { useState } from 'react';
import NextLink from 'next/link';
import { Formik, Form } from 'formik';
import { Button, FormErrorMessage, FormControl, Link } from '@chakra-ui/core';
import { useRouter } from 'next/router';

import Layout from '../components/Layout';
import Wrapper from '../components/Wrapper';
import InputField from '../components/InputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/errors';
import { withUrqlClient } from '../utils/withUrqlClient';

const Login = ({}) => {
  const [credentialsError, setCredentialsError] = useState('');
  const router = useRouter();
  const [, login] = useLoginMutation();

  return (
    <Layout>
      <Wrapper variant="small">
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={async (values) => {
            const { data } = await login({ loginInput: values });
            if (!data) return;

            const { errors, user } = data.login;

            if (errors) {
              const errorsMap = toErrorMap(errors);
              return setCredentialsError(errorsMap.credentials || '');
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
                name="password"
                label="Enter password"
                placeholder="Enter password..."
                type="password"
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
      </Wrapper>
    </Layout>
  );
};

export default withUrqlClient()(Login);
