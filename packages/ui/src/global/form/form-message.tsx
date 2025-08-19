import type { AnyFieldApi } from '@tanstack/react-form';
import { XSmall } from '@workspace/ui/design-system/typography';
import type { ReactNode } from 'react';

const FormMessage = ({
  children,
  field,
}: {
  field: AnyFieldApi;
  children?: ReactNode;
}) => {
  const error = field.state.meta.errors[0];
  const body = error ? String(error?.message ?? '') : children;

  if (!body) {
    return null;
  }

  return <XSmall className="pl-2 text-destructive/90">{body}</XSmall>;
};

export default FormMessage;
