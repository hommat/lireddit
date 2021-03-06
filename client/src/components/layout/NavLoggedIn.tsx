import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Flex, Button } from '@chakra-ui/core';
import { useApolloClient } from '@apollo/client';

import {
  useLogoutMutation,
  useCurrentUserQuery,
  CurrentUserQuery,
  CurrentUserDocument,
} from '@generated/graphql';

const NavLoggedIn = () => {
  const apolloClient = useApolloClient();
  const router = useRouter();
  const { data } = useCurrentUserQuery();
  const [logout, { loading: logoutLoading }] = useLogoutMutation();

  const handleLogout = () => {
    logout();

    apolloClient.cache.writeQuery<CurrentUserQuery>({
      query: CurrentUserDocument,
      data: {
        __typename: 'Query',
        currentUser: null,
      },
    });

    router.push('/login');

    apolloClient.cache.evict({ fieldName: 'posts:{}' });
  };

  return (
    <Box ml={'auto'}>
      <Flex align="center">
        <Box mr={2}>{data?.currentUser?.username}</Box>
        <NextLink href="/create-post">
          <Button>create post</Button>
        </NextLink>
        <Button variant="link" onClick={handleLogout} isLoading={logoutLoading}>
          logout
        </Button>
      </Flex>
    </Box>
  );
};

export default NavLoggedIn;
