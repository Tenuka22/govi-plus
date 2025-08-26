import { Result, useAtomValue } from '@effect-atom/atom-react';
import { WebConfig } from '@repo/shared/services/config';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@workspace/ui/components/sidebar';
import { Flex, Grid } from '@workspace/ui/design-system/spacing';
import Spinner from '@workspace/ui/design-system/spinner';
import {
  LinkCode,
  Muted,
  Small,
  XSmall,
} from '@workspace/ui/design-system/typography';
import { Effect } from 'effect';
import { BadgeCheck, ChevronsUpDown, LogOut } from 'lucide-react';
import Link from 'next/link';
import { authUserSessionAtom } from '@/atoms/auth';
import { webRuntime } from '@/runtimes/web-runtime';

const program = Effect.gen(function* () {
  const webConfig = yield* WebConfig;
  const appConfig = yield* webConfig.getAppConfig;
  return { appConfig };
});

const UserLayout = ({
  user,
}: {
  user: { name: string; email: string; image?: string | null };
}) => {
  return (
    <Flex align="center" direction="row" justify="start" spacing="sm">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage alt={user?.name} src={user?.image ?? undefined} />
        <AvatarFallback className="rounded-lg">
          {user?.email.substring(0, 2)}
        </AvatarFallback>
      </Avatar>
      <Grid rows={2} spacing="none">
        <Small>{user?.name}</Small>
        <Muted className="-mt-1">
          <XSmall>{user?.email}</XSmall>
        </Muted>
      </Grid>
    </Flex>
  );
};

const User = () => {
  const { appConfig } = webRuntime.runSync(program);

  const userSession = useAtomValue(authUserSessionAtom);
  return Result.match(userSession, {
    onSuccess: (result) => {
      const user = result.value?.user;
      return (
        <UserLayout
          user={
            user ?? { email: 'user@govi-plus.co', name: 'Govi User', image: '' }
          }
        />
      );
    },
    onFailure: () => {
      return (
        <Flex spacing="sm">
          Failed to load the User, If Error persists
          <Link href={appConfig.ClientRoutes.SignUp}>
            <Muted>
              <LinkCode>Sign In</LinkCode>
            </Muted>
          </Link>
          Sign Up
        </Flex>
      );
    },
    onInitial: () => (
      <Flex spacing="sm">
        Loading User <Spinner />
      </Flex>
    ),
  });
};

const NavUser = () => {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg"
            >
              <User />
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0.5 font-normal">
              <User />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/app/profile/user">
                  <BadgeCheck />
                  Profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavUser;
