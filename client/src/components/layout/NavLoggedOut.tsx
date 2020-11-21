import React, { FC } from 'react';
import NextLink from 'next/link';
import { Box, Link } from '@chakra-ui/core';

interface NavLoggedOutProps {}

const NavLoggedOut: FC<NavLoggedOutProps> = ({}) => {
  return (
    <Box ml={'auto'}>
      <NextLink href="/login">
        <Link mr={2}>login</Link>
      </NextLink>
      <NextLink href="/register">
        <Link>register</Link>
      </NextLink>
    </Box>
  );
};

export default NavLoggedOut;
