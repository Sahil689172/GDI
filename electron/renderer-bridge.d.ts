export {};

declare global {
  interface Window {
    gdiDesktop?: {
      notify: (payload: { title?: string; body?: string }) => Promise<{ ok: boolean; reason?: string }>;
      platform: string;
    };
  }
}

