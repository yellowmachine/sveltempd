import type { MPDState } from './mpdState.types';

export function createMPDState() {
  let state: MPDState | null = $state(null);

  return {
    update(newState: MPDState) {
      state = { ...newState };
    },
    get value() {
      return state;
    }
  };
}

export const mpdState = createMPDState();
