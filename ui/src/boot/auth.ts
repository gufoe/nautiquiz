import { boot } from 'quasar/wrappers';
import { restoreSession } from 'src/auth/state';
import { initClientStateSync } from 'src/auth/sync';

export default boot(async () => {
  await restoreSession();
  initClientStateSync();
});
