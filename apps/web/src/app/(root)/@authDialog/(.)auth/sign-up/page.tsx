import { Flex } from '@workspace/ui/design-system/spacing';
import EmailForm from '@/app/(root)/auth/_components/auth-form/email-form';
import PasskeyForm from '@/app/(root)/auth/_components/auth-form/passkey-form';
import SocialForm from '@/app/(root)/auth/_components/auth-form/social-form';
import AuthModel from '../../_components/auth-model';

const mode = 'sign-up';
const SIGNUP_UPTERCEPTER = () => {
  return (
    <AuthModel action={mode}>
      <Flex direction="col" spacing="lg">
        <EmailForm mode={mode} />
        <PasskeyForm mode={mode} />
        <SocialForm mode={mode} />
      </Flex>
    </AuthModel>
  );
};

export default SIGNUP_UPTERCEPTER;
