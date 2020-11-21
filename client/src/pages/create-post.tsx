import { Formik, Form, FormikHelpers } from 'formik';
import { Button } from '@chakra-ui/core';
import { useRouter } from 'next/router';

import Layout from '../components/layout/Layout';
import InputField from '../components/form/InputField';
import { useCreatePostMutation, CreatePostInput } from '../generated/graphql';
import { useIsAuth } from '../hooks/useIsAuth';
import { withApollo } from '../utils/apollo/withApollo';
import { clearCachePosts } from '../utils/apollo/cache';
import { toErrorMap } from '../utils/errors';

const initialFormValues: CreatePostInput = {
  text: '',
  title: '',
};

const CreatePost = ({}) => {
  useIsAuth();

  const router = useRouter();
  const [createPost] = useCreatePostMutation();

  const handleSubmit = async (
    createPostInput: CreatePostInput,
    { setErrors }: FormikHelpers<CreatePostInput>
  ) => {
    const { data } = await createPost({
      variables: { createPostInput },
      update: clearCachePosts,
    });

    if (!data) return;

    const { errors } = data.createPost;
    if (errors) return setErrors(toErrorMap(errors));

    router.push('/');
  };

  return (
    <Layout variant="small">
      <Formik initialValues={initialFormValues} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              label="Enter title"
              placeholder="Enter title..."
            />
            <InputField
              name="text"
              label="Enter Text"
              placeholder="Enter text..."
              textarea
            />

            <Button type="submit" mt={4} isLoading={isSubmitting}>
              Create
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withApollo({ ssr: true })(CreatePost);
