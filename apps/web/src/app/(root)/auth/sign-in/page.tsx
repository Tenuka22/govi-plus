import { Flex, Grid } from '@workspace/ui/design-system/spacing';
import Image from 'next/image';
import PLACEHOLDER_IMAGE from '@/public/placeholder.svg';
import AuthForm from '../_components/auth-form';

const SIGN_IN_PAGE = () => {
  return (
    <Grid className="min-h-svh" cols={1} colsLg={2}>
      <Flex
        align="center"
        className="w-full p-4"
        direction="col"
        justify="center"
      >
        <AuthForm mode="sign-in" />
      </Flex>
      <Image
        alt="placeholder-image"
        className="hidden h-full w-full object-cover lg:block dark:brightness-[0.2] dark:grayscale"
        src={PLACEHOLDER_IMAGE}
      />
    </Grid>
  );
};

export default SIGN_IN_PAGE;
