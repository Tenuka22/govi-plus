import type {
  emailLoginFormSchema,
  passkeyFormSchema,
  socialLoginFormSchema,
} from '@repo/shared/lib/schemas/auth';
import { withToast } from '@repo/shared/lib/toasted-atoms';
import { BetterAuth } from '@repo/shared/services/auth-client';
import { Effect } from 'effect';
import { webRuntimeAtom } from '@/runtimes/web-runtime';

const defaultAuthFailMessage =
  'Authentication failed. Please try again or contact support.';

export const signInFnAtom = webRuntimeAtom.fn(
  Effect.fnUntraced(
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
        return err?._tag === 'BetterAuthApiError'
          ? err.message
          : `Sign-in failed for ${args.email}. ${defaultAuthFailMessage}`;
      },

      onSuccess: (res, args) => {
        const userEmail = (res?.user.email ?? args.email).split('@')[0];
        return `Successfully signed in! Welcome back ${userEmail}`;
      },

      onWaiting: (args) => {
        const email = args.email;
        return `Signing in with ${email}...`;
      },
    })
  )
);

export const signUpFnAtom = webRuntimeAtom.fn(
  Effect.fnUntraced(
    function* (args: typeof emailLoginFormSchema.Type) {
      const betterAuth = yield* BetterAuth;
      const caller = yield* betterAuth.caller;

      return yield* caller((c) => c.signUp.email(args));
    },
    withToast({
      onFailure: (err) =>
        err?._tag === 'BetterAuthApiError'
          ? err.message
          : `Sign-up failed. ${defaultAuthFailMessage}`,

      onSuccess: (res, args) => {
        const userEmail = (res?.user.email ?? args.email).split('@')[0];
        return `Successfully signed up ${userEmail}! You will be redirected to proceed with account creation.`;
      },

      onWaiting: (args) => {
        const email = args.email;
        return `Creating your account with ${email}...`;
      },
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
      onFailure: (err, args) =>
        err?._tag === 'BetterAuthApiError'
          ? err.message
          : `Sign-in with ${args.provider} failed. ${defaultAuthFailMessage}`,

      onSuccess: (__, args) => {
        return `Successfully connected with ${args.provider}! Proceed with the instructions at the social page to connect.`;
      },

      onWaiting: (args) => `Connecting the site with ${args.provider}...`,
    })
  )
);

export const passkeyLoginFnAtom = webRuntimeAtom.fn(
  Effect.fnUntraced(
    function* (args: typeof passkeyFormSchema.Type) {
      const betterAuth = yield* BetterAuth;
      const caller = yield* betterAuth.caller;

      yield* Effect.logDebug('Attempting passkey sign in');

      const data = yield* caller((c) => c.signIn.passkey(args));

      yield* Effect.logDebug('Passkey authentication successful');
      return data;
    },
    withToast({
      onFailure: (err) =>
        err?._tag === 'BetterAuthApiError'
          ? err.message
          : `Passkey sign-in failed. ${defaultAuthFailMessage}`,
      onSuccess: () => 'Successfully signed in with passkey!',
      onWaiting: () => 'Authenticating with passkey...',
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
