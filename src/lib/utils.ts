export function formatTime(seconds?: number) {
    if (!seconds) return '';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

export function correctVolume(amount: number) {
    if(amount < 0) return 0
    if(amount > 100) return 100
    return Math.floor(amount)
}