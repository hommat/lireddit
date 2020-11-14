import React, { FC } from 'react';
import { Box, Link, Flex, Heading } from '@chakra-ui/core';
import NextLink from 'next/link';

interface NavBarProps {}

const NavBar: FC<NavBarProps> = ({}) => {
  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
      <Flex flex={1} m="auto" align="center" maxW={800}>
        <NextLink href="/">
          <Link>
            <Heading>LiReddit</Heading>
          </Link>
        </NextLink>
        <Box ml={'auto'}>
          <NextLink href="/login">
            <Link mr={2}>login</Link>
          </NextLink>
          <NextLink href="/register">
            <Link>register</Link>
          </NextLink>
        </Box>
      </Flex>
    </Flex>
  );
};

export default NavBar;
