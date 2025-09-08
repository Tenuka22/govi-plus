import type {
  emailLoginFormSchema,
  socialLoginFormSchema,
} from '@repo/shared/lib/schemas/auth';
import { withToast } from '@repo/shared/lib/toasted-atoms';
import { BetterAuth } from '@repo/shared/services/auth-client';
import { Effect, Option } from 'effect';
import { webRuntimeAtom } from '@/runtimes/web-runtime';

const defaultAuthFailMessage =
  'Authentication failed. Please try again or contact support.';

const isBetterAuthApiError = (
  error: unknown
): error is { _tag: 'BetterAuthApiError'; message: string } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    '_tag' in error &&
    error._tag === 'BetterAuthApiError'
  );
};

const getBetterAuthErrorMessage = (
  err: Option.Option<unknown>
): string | null => {
  return Option.match(err, {
    onNone: () => null,
    onSome: (e) => (isBetterAuthApiError(e) ? e.message : null),
  });
};

export const signInFnAtom = webRuntimeAtom.fn(
  Effect.fn(
    function* (args: typeof emailLoginFormSchema.Type) {
      const betterAuth = yield* BetterAuth;
      const caller = yield* betterAuth.caller;

      yield* Effect.logDebug('Attempting sign in with args:', args);

      const data = yield* caller((c) => c.signIn.email(args));

      yield* Effect.logDebug('Sign in successful for user:', args.email);

      return data;
    },
    withToast({
      onFailure: (err, args) => {
        const email = args[0].email ?? 'unknown user';
        const defaultError = `Sign-in failed for ${email}. ${defaultAuthFailMessage}`;
        const betterAuthMessage = getBetterAuthErrorMessage(err);
        return betterAuthMessage ?? defaultError;
      },

      onSuccess: (res, args) => {
        const userEmail = (res?.user.email ?? args.email).split('@')[0];
        return `Successfully signed in! Welcome back ${userEmail}`;
      },

      onWaiting: (args) => `Signing in with ${args.email}...`,
    })
  )
);

export const signUpFnAtom = webRuntimeAtom.fn(
  Effect.fnUntraced(
    function* (args: typeof emailLoginFormSchema.Type) {
      const betterAuth = yield* BetterAuth;
      const caller = yield* betterAuth.caller;

      return yield* caller((c) =>
        c.signUp.email({ ...args, callbackURL: '/client/redirect' })
      );
    },
    withToast({
      onFailure: (err, args) => {
        const email = args[0].email ?? 'unknown user';
        const defaultError = `Sign-up failed for ${email}. ${defaultAuthFailMessage}`;
        const betterAuthMessage = getBetterAuthErrorMessage(err);
        return betterAuthMessage ?? defaultError;
      },

      onSuccess: (res, args) => {
        const userEmail = (res?.user.email ?? args.email).split('@')[0];
        return `Successfully signed up ${userEmail}! You will be redirected to proceed with account creation.`;
      },

      onWaiting: (args) => `Creating your account with ${args.email}...`,
    })
  )
);

export const socialLoginFnAtom = webRuntimeAtom.fn(
  Effect.fnUntraced(
    function* (args: typeof socialLoginFormSchema.Type) {
      const betterAuth = yield* BetterAuth;
      const caller = yield* betterAuth.caller;

      yield* Effect.logDebug(
        'Attempting social sign in with provider:',
        args.provider
      );

      const data = yield* caller((c) => c.signIn.social(args));

      yield* Effect.logDebug(
        'Social connection successful, User will be redirected'
      );

      return data;
    },
    withToast({
      onFailure: (err, args) => {
        const provider = args[0].provider ?? 'unknown provider';
        const defaultError = `Sign-in with ${provider} failed. ${defaultAuthFailMessage}`;
        const betterAuthMessage = getBetterAuthErrorMessage(err);
        return betterAuthMessage ?? defaultError;
      },

      onSuccess: (_, args) =>
        `Successfully connected with ${args.provider}! Proceed with the instructions at the social page to connect.`,

      onWaiting: (args) => `Connecting the site with ${args.provider}...`,
    })
  )
);

export const authUserSessionAtom = webRuntimeAtom.atom(
  Effect.gen(function* () {
    const betterAuth = yield* BetterAuth;
    const caller = yield* betterAuth.caller;

    yield* Effect.logDebug('Attempting to fetch user.');

    const userSession = yield* caller((c) => c.getSession());

    yield* Effect.logDebug('User fetched successfully');

    return userSession;
  })
);
