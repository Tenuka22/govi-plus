import { withToast } from '@workspace/shared/lib/helpers/with-toast';
import type { emailLogInFormSchema } from '@workspace/shared/lib/schemas/auth';
import { Effect } from 'effect';
import { webRuntimeAtom } from '@/runtimes/web-runtime';

export const signInFnAtom = webRuntimeAtom.fn(
  Effect.fn(
    function* (args: typeof emailLogInFormSchema.Type) {
      yield* Effect.logDebug('Attempting sign in with args:', args);

      const data = {};

      yield* Effect.logDebug('Sign in successful for user:', args.email);

      return data;
    },
    withToast({
      onFailure: (_, args) => {
        const email = args[0].email ?? 'unknown user';
        const errMessage = `Sign-in failed for ${email}.`;
        return errMessage;
      },

      onSuccess: (_, args) => {
        const userEmail = args.email.split('@')[0];
        return `Successfully signed in! Welcome back ${userEmail}`;
      },

      onWaiting: (args) => `Signing in with ${args.email}...`,
    })
  )
);

export const signUpFnAtom = webRuntimeAtom.fn(
  Effect.fnUntraced(
    function* (args: typeof emailLogInFormSchema.Type) {
      yield* Effect.logDebug('Attempting sign up with args:', args);

      const data = {};

      yield* Effect.logDebug('Sign up successful for user:', args.email);

      return data;
    },
    withToast({
      onFailure: (_, args) => {
        const email = args[0].email ?? 'unknown user';
        const errorMessage = `Sign-up failed for ${email}.`;
        return errorMessage;
      },

      onSuccess: (_, args) => {
        const userEmail = args.email.split('@')[0];
        return `Successfully signed up ${userEmail}! You will be redirected to proceed with account creation.`;
      },

      onWaiting: (args) => `Creating your account with ${args.email}...`,
    })
  )
);

export const authUserSessionAtom = webRuntimeAtom.atom(
  Effect.gen(function* () {
    yield* Effect.logDebug('Attempting to fetch user.');

    const userSession = { user: null };

    yield* Effect.logDebug('User fetched successfully');

    return userSession;
  })
);
