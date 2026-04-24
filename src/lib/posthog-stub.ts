// No-op replacement for @posthog/react in this frontend-only prototype.
// Teams that want analytics in their prototype can swap this out for the real
// PostHog provider later — every call site here uses usePostHog().

type CaptureProps = Record<string, unknown>;

const stub = {
  capture: (_event: string, _props?: CaptureProps) => {},
  captureException: (_error: unknown, _props?: CaptureProps) => {},
  identify: (_id: string, _props?: CaptureProps) => {},
  reset: () => {},
};

export type PostHogStub = typeof stub;

export function usePostHog(): PostHogStub {
  return stub;
}
