'use client';
import { useAtomSet } from '@effect-atom/atom-react';
import { passkeyFormSchema } from '@repo/shared/lib/schemas/auth';
import { useForm } from '@tanstack/react-form';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Flex, Grid } from '@workspace/ui/design-system/spacing';
import Spinner from '@workspace/ui/design-system/spinner';
import FormMessage from '@workspace/ui/global/form/form-message';
import { Schema } from 'effect';
import { FolderKey } from 'lucide-react';
import { passkeyLoginFnAtom } from '@/atoms/auth';
import type { AuthFormModes } from '../auth-form';

type PasskeyForm = typeof passkeyFormSchema.Type;

const PasskeyForm = ({ mode }: { mode: AuthFormModes }) => {
  const passkeyLoginFn = useAtomSet(passkeyLoginFnAtom);

  const form = useForm({
    defaultValues: { email: undefined } satisfies PasskeyForm as PasskeyForm,
    validators: {
      onSubmit: Schema.standardSchemaV1(passkeyFormSchema),
    },
    onSubmit: async ({ value }) => await passkeyLoginFn(value),
  });

  return (
    <form
      className="size-full"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <Grid className="w-full" spacing="sm">
        {mode === 'sign-up' && (
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
        )}
        <Flex direction="col" spacing="sm">
          <Label>Passkey</Label>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                className="w-full"
                disabled={!canSubmit || isSubmitting}
                type="submit"
                variant="outline"
              >
                <span>Continue with Provider</span>
                {isSubmitting ? <Spinner /> : <FolderKey className="size-4" />}
              </Button>
            )}
          </form.Subscribe>
        </Flex>
      </Grid>
    </form>
  );
};

export default PasskeyForm;
