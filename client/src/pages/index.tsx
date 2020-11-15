import Layout from '../components/Layout';
import { withUrqlClient } from '../utils/withUrqlClient';
import { usePostsQuery } from '../generated/graphql';
import { Stack, Box, Heading, Text, Flex, Button } from '@chakra-ui/core';
import { useState } from 'react';

const POST_LIMIT = 1;

export const Index = () => {
  const [variables, setVariables] = useState({
    limit: POST_LIMIT,
    cursor: null as string | null,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });

  if (!data && !fetching) {
    return <div>Something went wrong</div>;
  }

  return (
    <Layout>
      <Stack p={8}>
        {data &&
          data.posts.posts.map(({ id, title, textSnippet }) => (
            <Box key={id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{title}</Heading>
              <Text mt={4}>{textSnippet}</Text>
            </Box>
          ))}
      </Stack>
      {data && data.posts.hasMore && (
        <Flex justify="center">
          <Button
            onClick={() =>
              setVariables({
                ...variables,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              })
            }
            isLoading={fetching}
          >
            Load more
          </Button>
        </Flex>
      )}
    </Layout>
  );
};

export default withUrqlClient({ ssr: true })(Index);
