import { CSSReset, ThemeProvider } from '@chakra-ui/core';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import theme from '../theme';
import { PaginatedPosts } from '../generated/graphql';

function MyApp({ Component, pageProps }: any) {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />

      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
