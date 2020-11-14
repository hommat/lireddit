import React, { FC } from 'react';
import { Box, Link, Flex, Heading, Button } from '@chakra-ui/core';
import NextLink from 'next/link';
import { useCurrentUserQuery } from '../generated/graphql';

interface NavBarProps {}

const NavBar: FC<NavBarProps> = ({}) => {
  const [{ data, fetching }] = useCurrentUserQuery();

  let body = null;
  console.log(data);
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
        <Button variant="link">logout</Button>
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
