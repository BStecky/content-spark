export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID; // Replace with your tracking ID
// gtag.d.ts
interface GTag {
  (command: string, ...args: any[]): void;
}

declare global {
  interface Window {
    gtag: GTag;
    dataLayer: any[];
  }
}

export const pageview = (url: string): void => {
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

export const event = ({
  action,
  params,
}: {
  action: string;
  params: any;
}): void => {
  window.gtag("event", action, params);
};
