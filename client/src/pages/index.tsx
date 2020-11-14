import Layout from '../components/Layout';
import { withUrqlClient } from '../utils/withUrqlClient';

export const Index = () => {
  return <Layout>Hi</Layout>;
};

export default withUrqlClient({ ssr: true })(Index);
