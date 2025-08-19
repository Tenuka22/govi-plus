'use client';
import { WebConfig } from '@repo/shared/services/config';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Flex } from '@workspace/ui/design-system/spacing';
import { LinkCode, Muted, Small } from '@workspace/ui/design-system/typography';
import { Effect } from 'effect';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { webRuntime } from '@/runtimes/web-runtime';

type AuthAction = 'sign-in' | 'sign-up';

const program = Effect.gen(function* () {
  const webConfig = yield* WebConfig;
  const appConfig = yield* webConfig.getAppConfig;
  return { appConfig };
});

const { appConfig: config } = webRuntime.runSync(program);

const actionContent: Record<
  AuthAction,
  {
    title: string;
    description: string;
    fallbackLabel: string;
    fallbackHref: string;
  }
> = {
  'sign-in': {
    title: 'Sign in to your account',
    description: 'Enter your credentials to access your account.',
    fallbackLabel: "Don't have an account? Sign up",
    fallbackHref: config.ClientRoutes.SignUp,
  },
  'sign-up': {
    title: 'Create a new account',
    description: 'Fill in the details to register a new account.',
    fallbackLabel: 'Already have an account? Sign in',
    fallbackHref: config.ClientRoutes.SignIn,
  },
};

const AuthModel = ({
  action,
  children,
}: {
  action: AuthAction;
  children: ReactNode;
}) => {
  const { title, description, fallbackLabel, fallbackHref } =
    actionContent[action];

  const router = useRouter();

  return (
    <Dialog onOpenChange={(o) => o === false && router.back()} open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <Flex className="w-full" direction="row" justify="start" spacing="sm">
            <Small>
              <Link href={fallbackHref}>
                <Muted>
                  <LinkCode>{fallbackLabel}</LinkCode>
                </Muted>
              </Link>
            </Small>
          </Flex>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModel;
