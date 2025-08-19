'use client';
import { useAtomSet } from '@effect-atom/atom-react';
import { emailLoginFormSchema } from '@repo/shared/lib/schemas/auth';
import { WebConfig } from '@repo/shared/services/config';
import { useForm } from '@tanstack/react-form';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Flex, Grid } from '@workspace/ui/design-system/spacing';
import Spinner from '@workspace/ui/design-system/spinner';
import { LinkCode, Muted } from '@workspace/ui/design-system/typography';
import FormMessage from '@workspace/ui/global/form/form-message';
import { Effect } from 'effect';
import { standardSchemaV1 } from 'effect/Schema';
import { ChevronsRight } from 'lucide-react';
import Link from 'next/link';
import { signInFnAtom, signUpFnAtom } from '@/atoms/auth';
import { webRuntime } from '@/runtimes/web-runtime';
import type { AuthFormModes } from '../auth-form';

const program = Effect.gen(function* () {
  const webConfig = yield* WebConfig;
  const appConfig = yield* webConfig.getAppConfig;
  return { appConfig };
});

type EmailForm = typeof emailLoginFormSchema.Type;

const EmailForm = ({ mode }: { mode: AuthFormModes }) => {
  const { appConfig } = webRuntime.runSync(program);
  const signInFn = useAtomSet(signInFnAtom);
  const signUpFn = useAtomSet(signUpFnAtom);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
      name: '',
    } satisfies EmailForm as EmailForm,
    validators: { onSubmit: standardSchemaV1(emailLoginFormSchema) },
    onSubmit: async ({ value }) => {
      if (mode === 'sign-in') {
        await signInFn(value);
      } else {
        await signUpFn(value);
      }
    },
  });

  return (
    <form
      className="size-full"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <Flex align="center" direction="col" spacing="lg" wrap="nowrap">
        <Grid className="w-full" cols={1} spacing="md">
          {mode === 'sign-up' && (
            <Flex direction="col" spacing="sm">
              <Label htmlFor="name">Full Name</Label>
              <form.Field name="name">
                {(field) => (
                  <>
                    <Input
                      className={
                        field.state.meta.errors[0] ? 'bg-destructive' : ''
                      }
                      id="name"
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter your full name"
                      value={field.state.value || ''}
                    />
                    <FormMessage field={field} />
                  </>
                )}
              </form.Field>
            </Flex>
          )}

          <Flex direction="col" spacing="sm">
            <Label htmlFor="email">Email Address</Label>
            <form.Field name="email">
              {(field) => (
                <>
                  <Input
                    id="email"
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your email address"
                    value={field.state.value}
                  />
                  <FormMessage field={field} />
                </>
              )}
            </form.Field>
          </Flex>

          <Flex direction="col" spacing="sm">
            <Flex className="w-full" justify="between">
              <Label htmlFor="password">Password</Label>
              {mode === 'sign-in' && (
                <Link href={appConfig.ClientRoutes.ForgetPassword}>
                  <Muted>
                    <LinkCode>Forgot your password?</LinkCode>
                  </Muted>
                </Link>
              )}
            </Flex>
            <form.Field name="password">
              {(field) => (
                <>
                  <Input
                    id="password"
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={
                      mode === 'sign-in'
                        ? 'Enter your password'
                        : 'Create a strong password'
                    }
                    type="password"
                    value={field.state.value}
                  />
                  <FormMessage field={field} />
                </>
              )}
            </form.Field>
          </Flex>

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                disabled={!canSubmit || isSubmitting}
                type="submit"
                variant="default"
              >
                {mode === 'sign-in' ? 'Sign In' : 'Create Account'}
                {isSubmitting ? (
                  <Spinner />
                ) : (
                  <ChevronsRight className="size-4" />
                )}
              </Button>
            )}
          </form.Subscribe>
        </Grid>
      </Flex>
    </form>
  );
};

export default EmailForm;
