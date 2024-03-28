// Initialize Facebook Pixel
export const InitFacebookPixel = (id) => {
  if (window.fbq) return;
  window.fbq = function () {
    window.fbq.callMethod
      ? window.fbq.callMethod.apply(window.fbq, arguments)
      : window.fbq.queue.push(arguments);
  };
  if (!window._fbq) window._fbq = window.fbq;
  window.fbq.push = window.fbq;
  window.fbq.loaded = true;
  window.fbq.version = "2.0";
  window.fbq.queue = [];
  let script = document.createElement("script");
  script.async = true;
  script.src = `https://connect.facebook.net/en_US/fbevents.js`;
  document.getElementsByTagName("head")[0].appendChild(script);
  window.fbq("init", id);
};

// Track page views
export const trackPageView = () => {
  window.fbq && window.fbq("track", "PageView");
};
