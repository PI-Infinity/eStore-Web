import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "./fbPixel"; // Adjust the import path as necessary

const RouteChangeTracker = () => {
  const location = useLocation(); // This hook returns the location object that represents the current URL

  useEffect(() => {
    // Call trackPageView every time the location (route) changes
    trackPageView();
  }, [location]); // React re-runs the effect when the location changes

  return null; // This component doesn't need to render anything
};

export default RouteChangeTracker;
