import { Schema } from 'effect';

export const ConfigSchema = Schema.Struct({
  ApplicationInfo: Schema.Struct({
    Name: Schema.String,
    ShortName: Schema.String,
    Id: Schema.String,
    WebOrigin: Schema.String,
  }),
  ClientRoutes: Schema.Struct({
    Home: Schema.String,
    SignIn: Schema.String,
    SignUp: Schema.String,
    ForgetPassword: Schema.String,
  }),
});
