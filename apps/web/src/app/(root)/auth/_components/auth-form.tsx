'use client';
import { WebConfig } from '@repo/shared/services/config';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@workspace/ui/components/card';
import { Flex } from '@workspace/ui/design-system/spacing';
import {
  H3,
  LinkCode,
  Muted,
  Small,
} from '@workspace/ui/design-system/typography';
import { Effect } from 'effect';
import Link from 'next/link';
import { webRuntime } from '@/runtimes/web-runtime';
import EmailForm from './auth-form/email-form';

const program = Effect.gen(function* () {
  const webConfig = yield* WebConfig;
  const appConfig = yield* webConfig.getAppConfig;
  return { appConfig };
});

export type AuthFormModes = 'sign-in' | 'sign-up';

const AuthForm = ({ mode }: { mode: AuthFormModes }) => {
  const { appConfig } = webRuntime.runSync(program);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <Flex
          align="center"
          className="text-center"
          direction="col"
          spacing="xs"
        >
          <H3>{mode === 'sign-in' ? 'Welcome Back' : 'Create Your Account'}</H3>
          <Muted>
            {mode === 'sign-in'
              ? 'Sign in to your GOVI+ Connect account to continue'
              : 'Join GOVI+ Connect and start your journey with us today'}
          </Muted>
        </Flex>
      </CardHeader>

      <CardContent>
        <Flex direction="col" spacing="lg">
          <EmailForm mode={mode} />
          {/*  <SocialForm mode={mode} /> */}
        </Flex>
      </CardContent>

      <CardFooter>
        <Flex className="w-full" direction="row" justify="center" spacing="sm">
          <Small>
            {mode === 'sign-in'
              ? "Don't have an account?"
              : 'Already have an account?'}{' '}
            <Link
              href={
                mode === 'sign-in'
                  ? appConfig.ClientRoutes.SignUp
                  : appConfig.ClientRoutes.SignIn
              }
            >
              <Muted>
                <LinkCode>
                  {mode === 'sign-in' ? 'Create one here' : 'Sign in here'}
                </LinkCode>
              </Muted>
            </Link>
          </Small>
        </Flex>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
