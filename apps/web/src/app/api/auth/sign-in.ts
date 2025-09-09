'use server';
import { emailLogInFormSchema } from '@workspace/shared/lib/schemas/auth';
import { serverTokenPairReturnSchema } from '@workspace/shared/lib/schemas/server/auth';
import { WebConfig } from '@workspace/shared/services/config';
import { Data, Effect, Either, Schema } from 'effect';
import { type NextRequest, NextResponse } from 'next/server';
import { setRefreshToken, setToken } from '@/app/(root)/actions/auth';
import { webRuntime } from '@/runtimes/web-runtime';

const handlePOSTRequest = (request: NextRequest) =>
  Effect.gen(function* () {
    const requestData = yield* Effect.promise(() => request.json());
    const { getAppConfig } = yield* WebConfig;
    const { ServerRoutes } = yield* getAppConfig;

    const validatedData =
      Schema.decodeUnknownEither(emailLogInFormSchema)(requestData);

    if (Either.isLeft(validatedData)) {
      return NextResponse.json(
        { message: `Request data failed: ${validatedData.left.message}` },
        { status: 400 }
      );
    }

    const requestOptions = Data.struct({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedData.right),
    });

    const response = yield* Effect.promise(() =>
      fetch(ServerRoutes.TokenPair, requestOptions)
    );

    const responseData = yield* Effect.promise(() => response.json());

    if (!response.ok) {
      return NextResponse.json(
        { loggedIn: false, ...responseData },
        { status: 400 }
      );
    }

    const parsedResponse = Schema.decodeUnknownEither(
      serverTokenPairReturnSchema
    )(responseData);

    if (Either.isLeft(parsedResponse)) {
      return NextResponse.json(
        {
          message: `Server response failed schema validation: ${parsedResponse.left.message}`,
        },
        { status: 400 }
      );
    }

    const { access, refresh, username } = parsedResponse.right;

    if (!(access && refresh)) {
      return NextResponse.json(
        {
          message: 'Server response missing tokens',
          raw: responseData,
        },
        { status: 500 }
      );
    }

    yield* Effect.promise(() => setToken(access));
    yield* Effect.promise(() => setRefreshToken(refresh));

    return NextResponse.json({ loggedIn: true, username }, { status: 200 });
  });

export const POST = (request: NextRequest) =>
  webRuntime.runPromise(handlePOSTRequest(request));
