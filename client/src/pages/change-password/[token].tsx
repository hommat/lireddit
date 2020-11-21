import NextLink from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, FormikHelpers } from 'formik';
import {
  FormControl,
  FormErrorMessage,
  Button,
  Box,
  Link,
} from '@chakra-ui/core';

import Layout from '@components/layout/Layout';
import InputField from '@components/form/InputField';
import { useChangePasswordMutation } from '@generated/graphql';
import { setCacheCurrentUser, clearCachePosts } from '@utils/apollo/cache';
import { withApollo } from '@utils/apollo/withApollo';
import { toErrorMap } from '@utils/errors';

interface ChangePasswordFormValues {
  password: string;
}

const initialFormValues: ChangePasswordFormValues = {
  password: '',
};

const ChangePassword = () => {
  const [tokenError, setTokenError] = useState('');
  const [changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const token = router.query.token as string;

  const handleSubmit = async (
    values: ChangePasswordFormValues,
    { setErrors }: FormikHelpers<ChangePasswordFormValues>
  ) => {
    const { data } = await changePassword({
      variables: { changePasswordInput: { ...values, token } },
      update: (cache, { data }) => {
        setCacheCurrentUser(cache, data?.changePassword.user);
        clearCachePosts(cache);
      },
    });

    if (!data) return;
    const { errors } = data.changePassword;

    if (errors) {
      const errorMap = toErrorMap(errors);

      setTokenError(tokenError || '');
      return setErrors(errorMap);
    }

    router.push('/');
  };

  return (
    <Layout variant="small">
      <Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="password"
              type="password"
              label="New password"
              placeholder="Enter New password..."
            />

            {tokenError && (
              <Box>
                <FormControl isInvalid>
                  <FormErrorMessage>{tokenError}</FormErrorMessage>
                </FormControl>
                <Link>
                  Get new link <NextLink href="/forgot-password">here</NextLink>
                </Link>
              </Box>
            )}

            <Button type="submit" mt={4} isLoading={isSubmitting}>
              Change password
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: false })(ChangePassword);
