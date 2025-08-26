'use client';
import { Result, useAtomValue } from '@effect-atom/atom-react';
import { userProfileSchema } from '@repo/shared/lib/schemas/auth';
import { useForm } from '@tanstack/react-form';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { Flex, Grid } from '@workspace/ui/design-system/spacing';
import { Muted } from '@workspace/ui/design-system/typography';
import FormMessage from '@workspace/ui/global/form/form-message';
import { Schema } from 'effect';
import { standardSchemaV1 } from 'effect/Schema';
import { KeyIcon, ShieldIcon } from 'lucide-react';
import Link from 'next/link';
import { useId } from 'react';
import { authUserSessionAtom } from '@/atoms/auth';

const customUserSchema = Schema.Struct({
  ...userProfileSchema.fields,
  id: Schema.String,
});

type UserProfileForm = typeof customUserSchema.Type;

const UserProfile = () => {
  const id = useId();
  const userSession = useAtomValue(authUserSessionAtom);

  const user = userSession._tag === 'Success' && userSession.value.user;

  const form = useForm({
    defaultValues: user
      ? user
      : ({
          banExpires: null,
          banned: null,
          banReason: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          email: '',
          emailVerified: false,
          id: '',
          image: null,
          name: '',
          role: 'user',
        } satisfies UserProfileForm as UserProfileForm),
    validators: { onSubmit: standardSchemaV1(customUserSchema) },
    onSubmit: ({ value }) => {
      console.log('Form submitted with values:', value);
    },
  });

  return Result.match(userSession, {
    onFailure: () => <Skeleton />,
    onInitial: () => <Skeleton />,
    onSuccess: ({ value }) => (
      <main className="size-full">
        <div className="relative">
          <div className="h-48 w-full bg-primary" />

          <Flex className="-mt-20 px-6" justify="center">
            <Avatar>
              <AvatarImage
                alt={value.user.name}
                src={value.user.image?.href ?? value.user.email}
              />
              <AvatarFallback>
                {value.user.email.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          </Flex>
        </div>

        <section className="mx-auto mt-6 max-w-2xl px-4">
          <form
            className="size-full"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <Flex align="center" direction="col" spacing="lg" wrap="nowrap">
              <Grid className="w-full" cols={1} spacing="md">
                <Flex direction="col" spacing="sm">
                  <Label htmlFor={`${id}-name`}>Full Name</Label>
                  <form.Field name="name">
                    {(field) => (
                      <>
                        <Input
                          id={`${id}-name`}
                          name={field.name}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Enter your full name"
                          value={field.state.value}
                        />
                        <FormMessage field={field} />
                      </>
                    )}
                  </form.Field>
                </Flex>

                <Flex direction="col" spacing="sm">
                  <Flex className="w-full" justify="between">
                    <Label htmlFor={`${id}-email`}>Email Address</Label>
                    <Flex align="center" spacing="xs">
                      {value.user.emailVerified ? (
                        <Badge variant="default">Verified</Badge>
                      ) : (
                        <Badge variant="destructive">Unverified</Badge>
                      )}
                    </Flex>
                  </Flex>
                  <form.Field name="email">
                    {(field) => (
                      <>
                        <Input
                          id={`${id}-email`}
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
                  <Label>Security</Label>
                  <Flex align="center" className="w-full" justify="between">
                    <Muted>Manage your password and security settings</Muted>
                    <Link href="/settings/password">
                      <Button size="sm" variant="outline">
                        <KeyIcon className="size-4" />
                        Change Password
                      </Button>
                    </Link>
                  </Flex>
                </Flex>

                <Flex direction="col" spacing="sm">
                  <Label>Account Status</Label>
                  <div className="rounded-lg border bg-muted/50 p-4">
                    <Flex direction="col" spacing="sm">
                      <Flex align="center" justify="between">
                        <Muted>Role</Muted>

                        {
                          <Badge
                            className="uppercase"
                            variant={
                              value.user.role === 'admin'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            <ShieldIcon className="size-3" />
                            {value.user.role || 'user'}
                          </Badge>
                        }
                      </Flex>

                      <Flex align="center" justify="between">
                        <Muted>Account Status</Muted>

                        {
                          <Badge
                            variant={
                              value.user.banned ? 'destructive' : 'default'
                            }
                          >
                            {value.user.banned ? 'Banned' : 'Active'}
                          </Badge>
                        }
                      </Flex>

                      <form.Subscribe
                        selector={(state) => [
                          state.values.banned,
                          state.values.banReason,
                          state.values.banExpires,
                        ]}
                      >
                        {
                          <Flex direction="col" spacing="xs">
                            <Muted>Ban Reason</Muted>
                            <p className="text-destructive text-sm">
                              {value.user.banReason}
                            </p>
                            {value.user.banExpires && (
                              <p className="text-muted-foreground text-xs">
                                Expires:{' '}
                                {value.user.banExpires.toLocaleDateString()}
                              </p>
                            )}
                          </Flex>
                        }
                      </form.Subscribe>

                      <Flex align="center" justify="between">
                        <Muted>Member Since</Muted>
                        <form.Subscribe
                          selector={(state) => [state.values.createdAt]}
                        >
                          {
                            <span className="text-sm">
                              {value.user.createdAt.toLocaleDateString()}
                            </span>
                          }
                        </form.Subscribe>
                      </Flex>

                      <Flex align="center" justify="between">
                        <Muted>Last Updated</Muted>
                        <form.Subscribe
                          selector={(state) => [state.values.updatedAt]}
                        >
                          {
                            <span className="text-sm">
                              {value.user.updatedAt.toLocaleDateString()}
                            </span>
                          }
                        </form.Subscribe>
                      </Flex>
                    </Flex>
                  </div>
                </Flex>

                <Flex direction="col" spacing="sm">
                  <Label>Account Actions</Label>
                  <Flex spacing="sm" wrap="wrap">
                    <Link href="/settings/security">
                      <Button size="sm" variant="outline">
                        Security Settings
                      </Button>
                    </Link>
                    <Link href="/settings/privacy">
                      <Button size="sm" variant="outline">
                        Privacy Settings
                      </Button>
                    </Link>
                    <Link href="/settings/two-factor">
                      <Button size="sm" variant="outline">
                        Two-Factor Auth
                      </Button>
                    </Link>
                  </Flex>
                </Flex>

                <form.Subscribe
                  selector={(state) => [
                    state.canSubmit,
                    state.isSubmitting,
                    state.values.banned,
                  ]}
                >
                  {([canSubmit, isSubmitting, banned]) => (
                    <>
                      <Button
                        disabled={!canSubmit || isSubmitting || !!banned}
                        type="submit"
                        variant="default"
                      >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                      </Button>
                      {banned && (
                        <p className="text-center text-destructive text-sm">
                          Account is banned and cannot be modified
                        </p>
                      )}
                    </>
                  )}
                </form.Subscribe>
              </Grid>
            </Flex>
          </form>
        </section>
      </main>
    ),
  });
};

export default UserProfile;
