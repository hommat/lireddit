import { useState } from 'react';
import { Formik, Form } from 'formik';
import { Button, Box } from '@chakra-ui/core';

import Layout from '@components/layout/Layout';
import InputField from '@components/form/InputField';
import {
  useForgotPasswordMutation,
  MutationForgotPasswordArgs,
} from '@generated/graphql';
import { withApollo } from '@utils/apollo/withApollo';

const initialFormValues: MutationForgotPasswordArgs = {
  email: '',
};

const ForgotPassword = ({}) => {
  const [message, setMessage] = useState('');
  const [forgotPassword] = useForgotPasswordMutation();

  const handleSubmit = async (formValues: MutationForgotPasswordArgs) => {
    const { data } = await forgotPassword({ variables: formValues });
    if (!data) return;

    return setMessage(data.forgotPassword);
  };

  return (
    <Layout variant="small">
      {message ? (
        <Box>{message}</Box>
      ) : (
        <Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="email"
                label="Enter email"
                placeholder="Enter email..."
              />

              <Button type="submit" mt={4} isLoading={isSubmitting}>
                Reset password
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </Layout>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
