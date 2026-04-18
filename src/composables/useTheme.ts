import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { Storage } from 'src/utils';

/**
 * Composable to manage theme (dark / light) and persist it in localStorage.
 *
 * Usage:
 * const { isDark, toggle, setDark, icon, btnClass } = useTheme();
 *
 * Note: The default export was removed so import using:
 *   import { useTheme } from 'src/composables/useTheme';
 */
export function useTheme() {
  const $q = useQuasar();

  // Key used in localStorage via the Storage helper
  const STORAGE_KEY = 'theme-dark';

  // Read persisted value (default to false = light)
  const persisted = Storage.get<boolean>(STORAGE_KEY, () => false);

  // Local reactive state
  const isDark = ref<boolean>(persisted);

  // Apply persisted value to Quasar on initialization
  // (Quasar theme is global, so setting it here affects the whole app)
  $q.dark.set(isDark.value);

  function setDark(val: boolean) {
    isDark.value = val;
    Storage.set<boolean>(STORAGE_KEY, val);
    $q.dark.set(val);
  }

  function toggle() {
    setDark(!isDark.value);
  }

  // - `icon`: sun when dark (switch to light), crescent when light (switch to dark)
  // - `btnClass`: align the toggle in the toolbar (e.g. `q-ml-auto`)
  const icon = computed(() => (isDark.value ? 'light_mode' : 'brightness_2'));
  const btnClass = computed(() => 'q-ml-auto');

  return {
    isDark: computed(() => isDark.value),
    setDark,
    toggle,
    icon,
    btnClass,
  };
}