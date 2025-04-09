import { sendGAEvent as sendGAEventNext } from '@next/third-parties/google';

interface EventArgs {
  [key: string]: any;
}

export const sendGAEvent = (event: string, args?: EventArgs) => {
  // Only send events in production or if explicitly enabled for development
  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_ENABLE_DEV_ANALYTICS === 'true') {
    sendGAEventNext(event, args || {});
  }
}; 