import { User as UserClass } from 'src/users/user.schema';

/*
 This will change the type of req.user to our application `User` type instead of
 the default `User` interface in express.
 */
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends UserClass {}
  }
}
