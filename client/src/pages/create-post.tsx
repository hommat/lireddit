import { withUrqlClient } from '../utils/withUrqlClient';
import Layout from '../components/Layout';
import { Formik, Form } from 'formik';
import InputField from '../components/InputField';
import { Button } from '@chakra-ui/core';
import { useCreatePostMutation } from '../generated/graphql';
import { useRouter } from 'next/router';
import { useIsAuth } from '../hooks/useIsAuth';

const CreatePost = ({}) => {
  const router = useRouter();
  const [_, createPost] = useCreatePostMutation();

  useIsAuth();

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: '', text: '' }}
        onSubmit={async (values) => {
          await createPost({ createPostInput: values });
          router.push('/');
        }}
      >
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

export default withUrqlClient()(CreatePost);
