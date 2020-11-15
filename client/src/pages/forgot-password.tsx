import { withUrqlClient } from '../utils/withUrqlClient';
import Layout from '../components/Layout';
import Wrapper from '../components/Wrapper';
import { Formik, Form } from 'formik';
import InputField from '../components/InputField';
import {
  FormControl,
  FormErrorMessage,
  Button,
  Link,
  Box,
} from '@chakra-ui/core';
import { useForgotPasswordMutation } from '../generated/graphql';
import { useState } from 'react';

const ForgotPassword = ({}) => {
  const [message, setMessage] = useState('');
  const [_, forgotPassword] = useForgotPasswordMutation();

  return (
    <Layout>
      <Wrapper variant="small">
        {message ? (
          <Box>{message}</Box>
        ) : (
          <Formik
            initialValues={{ email: '' }}
            onSubmit={async (values) => {
              const { data } = await forgotPassword(values);
              if (!data) return;

              return setMessage(data.forgotPassword);
            }}
          >
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
      </Wrapper>
    </Layout>
  );
};

export default withUrqlClient()(ForgotPassword);
