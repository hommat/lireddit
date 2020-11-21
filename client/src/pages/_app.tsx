import { AppProps } from 'next/app';
import { CSSReset, ThemeProvider } from '@chakra-ui/core';

import theme from '@chakra/theme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />

      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
