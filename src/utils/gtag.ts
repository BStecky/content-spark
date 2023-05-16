// gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string): void => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  } else {
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
interface EventParams {
  action: string;
  category: string;
  label: string;
  value: string;
}

export const event = ({
  action,
  category,
  label,
  value,
}: EventParams): void => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } else {
  }
};
