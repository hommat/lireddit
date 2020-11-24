import { Heading, Stack } from '@chakra-ui/core';

import Layout from '@components/layout/Layout';
import PostList from '@components/post/PostList';
import PostFetchMore from '@components/post/PostFetchMore';
import { usePostsQuery } from '@generated/graphql';
import { withApollo } from '@utils/apollo/withApollo';

const POST_LIMIT = 3;

export const Index = () => {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      limit: POST_LIMIT,
      cursor: null as string | null,
    },
  });

  const handleFetchMore = () => {
    fetchMore({
      variables: {
        ...variables,
        cursor: data?.posts.posts[data?.posts.posts.length - 1].createdAt,
      },
    });
  };

  if (!data && !loading) {
    return (
      <Layout>
        <Heading textAlign="center">Something went wrong...</Heading>
      </Layout>
    );
  }

  return (
    <Layout>
      <Stack p={8}>{data && <PostList posts={data.posts.posts} />}</Stack>

      {data && data.posts.hasMore && (
        <PostFetchMore loading={loading} onFetchMore={handleFetchMore} />
      )}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
