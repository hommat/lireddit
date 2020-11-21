import { useRouter } from 'next/router';
import NextLink from 'next/link';
import Layout from '../../components/Layout';
import Wrapper from '../../components/Wrapper';
import { Formik, Form } from 'formik';
import { toErrorMap } from '../../utils/errors';
import InputField from '../../components/InputField';
import {
  FormControl,
  FormErrorMessage,
  Button,
  Box,
  Link,
} from '@chakra-ui/core';
import {
  useChangePasswordMutation,
  CurrentUserQuery,
  CurrentUserDocument,
} from '../../generated/graphql';
import { useState } from 'react';
import { withApollo } from '../../utils/withApollo';

const ChangePassword = () => {
  const [tokenError, setTokenError] = useState('');
  const [changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const token = router.query.token as string;

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const { data } = await changePassword({
            variables: { changePasswordInput: { ...values, token } },
            update: (cache, { data }) => {
              cache.writeQuery<CurrentUserQuery>({
                query: CurrentUserDocument,
                data: {
                  __typename: 'Query',
                  currentUser: data?.changePassword.user,
                },
              });
            },
          });
          if (!data) return;

          const { errors, user } = data.changePassword;

          if (errors) {
            const { token: tokenError, ...rest } = toErrorMap(errors);

            setTokenError(tokenError || '');
            return setErrors(rest);
          }

          if (user) {
            router.push('/');
          }
        }}
      >
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

export default withApollo({ ssr: true })(ChangePassword);
