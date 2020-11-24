import NextLink from 'next/link';
import { Box, Link } from '@chakra-ui/core';

const NavLoggedOut = () => {
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
