import { computed } from 'vue';
import { useQuasar } from 'quasar';
import {
  token,
  user,
  sessionReady,
  showImportDialog,
  showAuthDialog,
  restoreSession,
  register as registerApi,
  login as loginApi,
  setUsername as setUsernameApi,
  updatePassword as updatePasswordApi,
  logout,
  confirmImportLocalData,
  dismissImportPrompt,
} from 'src/auth/state';
import { scheduleDataSync } from 'src/auth/sync';

export type { AuthUser } from 'src/auth/state';

export function useAuth() {
  const $q = useQuasar();

  async function register(email: string, password: string, username: string) {
    await registerApi(email, password, username);
    $q.notify({ type: 'positive', message: 'Account creato' });
  }

  async function setUsername(username: string) {
    await setUsernameApi(username);
    scheduleDataSync(0);
    $q.notify({ type: 'positive', message: 'Nome utente salvato' });
  }

  async function updatePassword(currentPassword: string, newPassword: string) {
    await updatePasswordApi(currentPassword, newPassword);
    $q.notify({ type: 'positive', message: 'Password aggiornata' });
  }

  async function login(email: string, password: string) {
    await loginApi(email, password);
    $q.notify({ type: 'positive', message: 'Accesso effettuato' });
  }

  async function confirmImport() {
    await confirmImportLocalData();
  }

  async function dismissImport() {
    await dismissImportPrompt();
  }

  function openAuthDialog() {
    showAuthDialog.value = true;
  }

  const isLoggedIn = computed(() => !!token.value && !!user.value);
  const needsUsername = computed(
    () => !!token.value && !!user.value && user.value.username == null,
  );

  return {
    token,
    user,
    sessionReady,
    isLoggedIn,
    needsUsername,
    showImportDialog,
    showAuthDialog,
    openAuthDialog,
    restoreSession,
    register,
    setUsername,
    updatePassword,
    login,
    logout,
    confirmImportLocalData: confirmImport,
    dismissImportPrompt: dismissImport,
  };
}
