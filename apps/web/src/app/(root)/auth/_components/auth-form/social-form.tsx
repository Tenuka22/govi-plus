'use client';
import { useAtomSet } from '@effect-atom/atom-react';
import { socialProvidersConstant } from '@repo/shared/lib/constants/auth';
import { socialLoginFormSchema } from '@repo/shared/lib/schemas/auth';
import { useForm } from '@tanstack/react-form';
import { Button } from '@workspace/ui/components/button';
import { Label } from '@workspace/ui/components/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Separator } from '@workspace/ui/components/separator';
import { Flex, Grid } from '@workspace/ui/design-system/spacing';
import Spinner from '@workspace/ui/design-system/spinner';
import { Muted, XSmall } from '@workspace/ui/design-system/typography';
import FormMessage from '@workspace/ui/global/form/form-message';
import { Schema } from 'effect';
import { Globe } from 'lucide-react';
import { socialLoginFnAtom } from '@/atoms/auth';
import type { AuthFormModes } from '../auth-form';

type SocialForm = typeof socialLoginFormSchema.Type;

const SocialForm = ({ mode }: { mode: AuthFormModes }) => {
  const socialLoginFn = useAtomSet(socialLoginFnAtom);

  const form = useForm({
    defaultValues: { provider: 'google' } satisfies SocialForm as SocialForm,
    validators: {
      onSubmit: Schema.standardSchemaV1(socialLoginFormSchema),
      onChange: Schema.standardSchemaV1(socialLoginFormSchema),
    },
    onSubmit: async ({ value }) => await socialLoginFn(value),
  });

  return (
    <form
      className="size-full"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <Flex direction="col" spacing="lg">
        <Flex
          align="center"
          className="w-full overflow-hidden"
          justify="center"
          spacing="sm"
        >
          <Separator className="w-full" />
          <Muted>
            <XSmall className="whitespace-nowrap">
              {mode === 'sign-in' ? 'Or sign in with' : 'Or sign up with'}
            </XSmall>
          </Muted>
          <Separator className="w-full" />
        </Flex>

        <Grid className="w-full" spacing="sm">
          <Flex direction="col" spacing="sm">
            <Label htmlFor="provider">Provider</Label>
            <form.Field name="provider">
              {(field) => (
                <>
                  <Select
                    defaultValue={field.state.value}
                    onValueChange={(
                      e: (typeof socialProvidersConstant)[number]
                    ) => field.handleChange(e)}
                  >
                    <SelectTrigger className="w-full capitalize" id="provider">
                      <SelectValue placeholder="Select a provider to continue" />
                    </SelectTrigger>
                    <SelectContent>
                      {socialProvidersConstant.map((provider) => (
                        <SelectItem
                          className="capitalize"
                          key={provider}
                          value={provider}
                        >
                          {provider}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                variant="outline"
              >
                <span>Continue with Provider</span>
                {isSubmitting ? <Spinner /> : <Globe className="size-4" />}
              </Button>
            )}
          </form.Subscribe>
        </Grid>
      </Flex>
    </form>
  );
};

export default SocialForm;
