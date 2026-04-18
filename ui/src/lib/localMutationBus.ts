let mutationHandler: (() => void) | null = null;

export function setLocalMutationHandler(handler: (() => void) | null) {
  mutationHandler = handler;
}

export function notifyLocalMutation() {
  mutationHandler?.();
}
