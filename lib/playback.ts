export type Lesson = 'create' | 'signin' | 'phishing';
export function nextLesson(lesson: Lesson): Lesson {
  return lesson === 'create' ? 'signin' : lesson === 'signin' ? 'phishing' : 'create';
}
// Return immutable tick updates: React can apply them after the next tick starts.
// Elapsed is always media time, so changing speed never changes current progress.
export function createPlaybackClock(start: number, speed: number) {
  let previous = start;
  return (now: number) => {
    const delta = Math.max(0, now - previous) * speed;
    previous = now;
    return (elapsed: number) => elapsed + delta;
  };
}
