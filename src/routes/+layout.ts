import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
  const res = await fetch('/api/mpd-status');
  const status = await res.json();
  return { status };
};
