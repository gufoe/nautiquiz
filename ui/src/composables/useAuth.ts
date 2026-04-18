import { computed } from 'vue';
import { useQuasar } from 'quasar';
import {
  token,
  user,
  sessionReady,
  showImportDialog,
  restoreSession,
  register as registerApi,
  login as loginApi,
  logout,
  confirmImportLocalData,
  dismissImportPrompt,
} from 'src/auth/state';

export type { AuthUser } from 'src/auth/state';

export function useAuth() {
  const $q = useQuasar();

  async function register(email: string, password: string) {
    await registerApi(email, password);
    $q.notify({ type: 'positive', message: 'Account creato' });
  }

  async function login(email: string, password: string) {
    await loginApi(email, password);
    $q.notify({ type: 'positive', message: 'Accesso effettuato' });
  }

  async function confirmImport() {
    await confirmImportLocalData();
  }

  function dismissImport() {
    dismissImportPrompt();
  }

  const isLoggedIn = computed(() => !!token.value && !!user.value);

  return {
    token,
    user,
    sessionReady,
    isLoggedIn,
    showImportDialog,
    restoreSession,
    register,
    login,
    logout,
    confirmImportLocalData: confirmImport,
    dismissImportPrompt: dismissImport,
  };
}
