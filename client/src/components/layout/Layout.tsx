import React, { FC } from 'react';

import Header from './Header';
import Wrapper, { WrapperProps } from './Wrapper';

type LayoutProps = WrapperProps;

const Layout: FC<LayoutProps> = ({ children, ...wrapperProps }) => {
  return (
    <div>
      <Header />
      <Wrapper {...wrapperProps}>{children}</Wrapper>
    </div>
  );
};

export default Layout;
