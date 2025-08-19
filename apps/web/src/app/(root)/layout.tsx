import type { ReactNode } from 'react';

const ROOT_LAYOUT = ({
  children,
  authDialog,
}: {
  children: ReactNode;
  authDialog: ReactNode;
}) => {
  return (
    <>
      {children}
      {authDialog}
    </>
  );
};

export default ROOT_LAYOUT;
