import React, { FC } from 'react';

import NavBar from './NavBar';

interface LayoutProps {}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <NavBar />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
