import React, { FC } from 'react';
import { Box, Link, Flex, Heading, Button } from '@chakra-ui/core';
import NextLink from 'next/link';
import { useCurrentUserQuery, useLogoutMutation } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavBarProps {}

const NavBar: FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFething }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useCurrentUserQuery({ pause: isServer() });

  let body = null;

  // data is loading
  if (fetching) {
    // user not logged in
  } else if (!data?.currentUser) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    );
    // user is logged in
  } else {
    body = (
      <Flex align="center">
        <Box mr={2}>{data.currentUser.username}</Box>
        <Button
          variant="link"
          onClick={() => logout()}
          isLoading={logoutFething}
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Link>
            <Heading>LiReddit</Heading>
          </Link>
        </NextLink>
        <Box ml={'auto'}>{body}</Box>
      </Flex>
    </Flex>
  );
};

export default NavBar;
