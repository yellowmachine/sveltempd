import type { MPDState } from './mpdState.types';

export function createMPDState() {
  let state: Partial<MPDState> = $state({});

  const isPlaying = $derived(state.state === 'play');
  const stateLabel = $derived(
    state.state === 'play'
      ? 'Reproduciendo'
      : state.state === 'pause'
        ? 'Pausado'
        : 'Detenido'
  );

  return {
    update(newState: Partial<MPDState>) {
      state = { ...state, ...newState };
    },
    get value() {
      return state;
    },
    get isPlaying() {
      return isPlaying;
    },
    get stateLabel() {
      return stateLabel;
    }
  };
}

export const mpdState = createMPDState();
