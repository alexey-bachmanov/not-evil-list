/**
 * Next.js only supports having one middleware (boo), so we have to
 * create a custom solution to stack multiple middlewares together.
 * Unfortunately, this breaks things like custom path matchers, so we'll
 * have to use things like regex to match paths
 */
import { stackMiddlewares } from './middlewares/stackMiddlewares';
import { withDelay } from './middlewares/withDelay';
import { withAuthentication } from './middlewares/withAuthentication';

const middlewares = [withDelay, withAuthentication];
export default stackMiddlewares(middlewares);

export const config = {
  matcher: '/:path*',
};
