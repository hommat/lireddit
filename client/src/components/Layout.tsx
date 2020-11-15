import React, { FC } from 'react';

import NavBar from './NavBar';
import Wrapper, { WrapperProps } from './Wrapper';

interface LayoutProps extends WrapperProps {}

const Layout: FC<LayoutProps> = ({ children, ...wrapperProps }) => {
  return (
    <div>
      <NavBar />
      <Wrapper {...wrapperProps}>{children}</Wrapper>
    </div>
  );
};

export default Layout;
