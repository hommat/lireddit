import Layout from '../components/Layout';
import { withUrqlClient } from '../utils/withUrqlClient';
import { usePostsQuery, useVoteMutation } from '../generated/graphql';
import { Stack, Box, Heading, Text, Flex, Button, Icon } from '@chakra-ui/core';
import { useState } from 'react';

const POST_LIMIT = 7;

export const Index = () => {
  const [variables, setVariables] = useState({
    limit: POST_LIMIT,
    cursor: null as string | null,
  });
  const [{}, vote] = useVoteMutation();
  const [{ data, fetching }] = usePostsQuery({ variables });

  if (!data && !fetching) {
    return <div>Something went wrong</div>;
  }

  return (
    <Layout>
      <Stack p={8}>
        {data &&
          data.posts.posts.map(
            ({ id, title, textSnippet, points, creator }) => (
              <Flex key={id} p={5} shadow="md" borderWidth="1px">
                <Flex align="center">
                  <Button
                    mr={2}
                    onClick={() =>
                      vote({ voteInput: { postId: id, value: 1 } })
                    }
                  >
                    +
                  </Button>
                  <Box mr={2}>{points}</Box>
                  <Button
                    mr={2}
                    onClick={() =>
                      vote({ voteInput: { postId: id, value: -1 } })
                    }
                  >
                    -
                  </Button>
                </Flex>

                <Box>
                  <Heading fontSize="xl">{title}</Heading>
                  <Text mt={2}>By {creator.username}</Text>
                  <Text mt={4}>{textSnippet}</Text>
                </Box>
              </Flex>
            )
          )}
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
