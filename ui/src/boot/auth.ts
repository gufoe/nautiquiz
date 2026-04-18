import { boot } from 'quasar/wrappers';
import { restoreSession } from 'src/auth/state';

export default boot(async () => {
  await restoreSession();
});
