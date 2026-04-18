export type LocalMutationChannel = 'client-state' | 'attempt-queue';

type MutationEvent = { channel: LocalMutationChannel };

let mutationHandler: ((event: MutationEvent) => void) | null = null;

export function setLocalMutationHandler(
  handler: ((event: MutationEvent) => void) | null,
) {
  mutationHandler = handler;
}

export function notifyLocalMutation(channel: LocalMutationChannel) {
  mutationHandler?.({ channel });
}
