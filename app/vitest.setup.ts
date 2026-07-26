import '@testing-library/jest-dom/vitest';

// jsdom does not implement IntersectionObserver, which framer-motion's
// useInView requires. A no-op mock is enough for tests that never rely
// on an actual intersection callback firing.
if (typeof globalThis.IntersectionObserver === 'undefined') {
  class MockIntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = '';
    readonly scrollMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];

    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  globalThis.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
}
