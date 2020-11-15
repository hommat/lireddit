import Layout from '../components/Layout';
import { withUrqlClient } from '../utils/withUrqlClient';
import { usePostsQuery } from '../generated/graphql';

export const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <Layout>
      {data && data.posts.map((post) => <div key={post.id}>{post.title}</div>)}
    </Layout>
  );
};

export default withUrqlClient({ ssr: true })(Index);
