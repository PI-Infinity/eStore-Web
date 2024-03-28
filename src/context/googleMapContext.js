import { createContext, useContext, useEffect, useState } from "react";

const apiKey = "AIzaSyA61_a1cztE7_ygTRUdET6qN62cnYrOMvY";

const GoogleMapsContext = createContext();

export const GoogleMapsProvider = ({ children }) => {
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      // Check if the Google Maps script already exists
      const existingScript = document.querySelector(
        'script[src^="https://maps.googleapis.com/maps/api/js"]'
      );
      if (window.google && window.google.maps && existingScript) {
        setIsGoogleMapsLoaded(true);
        return;
      }

      if (!existingScript) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
        script.async = true; // Ensure the script is loaded asynchronously
        script.defer = true; // Defers loading of the script until after the document has parsed
        window.initMap = () => setIsGoogleMapsLoaded(true); // Callback function to set state when script is loaded

        document.head.appendChild(script);
      }
    };

    if (!window.google || !window.google.maps) {
      loadGoogleMapsScript();
    }
  }, [apiKey]);

  return (
    <GoogleMapsContext.Provider value={{ isGoogleMapsLoaded }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => useContext(GoogleMapsContext);
