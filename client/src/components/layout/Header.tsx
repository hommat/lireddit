import React, { FC } from 'react';
import NextLink from 'next/link';
import { Box, Link, Flex, Heading } from '@chakra-ui/core';

import NavLoggedIn from './NavLoggedIn';
import NavLoggedOut from './NavLoggedOut';
import { useCurrentUserQuery } from '@generated/graphql';

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  const { data } = useCurrentUserQuery();

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Link>
            <Heading>LiReddit</Heading>
          </Link>
        </NextLink>
        <Box ml={'auto'}>
          {data?.currentUser ? <NavLoggedIn /> : <NavLoggedOut />}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Header;
