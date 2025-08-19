'use client';
import { Result, useAtomValue } from '@effect-atom/atom-react';
import { Flex } from '@workspace/ui/design-system/spacing';
import Spinner from '@workspace/ui/design-system/spinner';
import { Muted } from '@workspace/ui/design-system/typography';
import type { User } from 'better-auth';
import { Info } from 'lucide-react';
import type { ReactNode } from 'react';
import { authUserSessionAtom } from '@/atoms/auth';

const ShowToSpecificWrapper = ({
  checkUser,
  children,
}: {
  children: ReactNode;
  checkUser: (userSession?: User) => boolean;
}) => {
  const userSession = useAtomValue(authUserSessionAtom);

  return Result.match(userSession, {
    onInitial: () => (
      <Flex align="center" direction="row" justify="center" spacing="md">
        <Spinner />
        <Muted>Loading</Muted>
      </Flex>
    ),
    onFailure: () => (
      <Flex align="center" direction="row" justify="center" spacing="sm">
        <Info className="size-4" />
        <Muted>Failed to get the authorized user data</Muted>
      </Flex>
    ),
    onSuccess: (result) => {
      const conditionPassed = checkUser(result.value?.user);

      if (conditionPassed) {
        return children;
      }

      return (
        <Flex align="center" direction="row" justify="center" spacing="sm">
          <Info className="size-4" />
          <Muted>User failed to pass the permission check</Muted>
        </Flex>
      );
    },
  });
};

export default ShowToSpecificWrapper;
