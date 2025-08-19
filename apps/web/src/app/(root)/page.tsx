'use client';
import Link from 'next/link';

const HOME_PAGE = () => {
  return (
    <div>
      <Link href="/auth/sign-in">Sign In</Link>
    </div>
  );
};

export default HOME_PAGE;
