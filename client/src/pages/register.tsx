import React from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { Button } from '@chakra-ui/core';
import { useRouter } from 'next/router';

import Layout from '@components/layout/Layout';
import InputField from '@components/form/InputField';
import { useRegisterMutation, RegisterInput } from '@generated/graphql';
import { toErrorMap } from '@utils/errors';
import { withApollo } from '@utils/apollo/withApollo';
import { setCacheCurrentUser, clearCachePosts } from '@utils/apollo/cache';

const initialFormValues: RegisterInput = {
  username: '',
  password: '',
  email: '',
};

const Register = ({}) => {
  const router = useRouter();
  const [register] = useRegisterMutation();

  const handleSubmit = async (
    registerInput: RegisterInput,
    { setErrors }: FormikHelpers<RegisterInput>
  ) => {
    const { data } = await register({
      variables: { registerInput },
      update: (cache, { data }) => {
        setCacheCurrentUser(cache, data?.register.user);
        clearCachePosts(cache);
      },
    });
    if (!data) return;

    const { errors } = data.register;
    if (errors) return setErrors(toErrorMap(errors));

    router.push('/');
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
