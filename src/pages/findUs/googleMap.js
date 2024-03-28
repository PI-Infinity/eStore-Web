// src/components/GoogleMap.js
import React, { useEffect, useRef } from "react";
import { useGoogleMaps } from "../../context/googleMapContext"; // Adjust the path as necessary

const GoogleMap = ({ activeAddress }) => {
  const mapContainerRef = useRef(null);
  const { isGoogleMapsLoaded } = useGoogleMaps();

  useEffect(() => {
    if (!isGoogleMapsLoaded || !activeAddress || !mapContainerRef.current)
      return;

    const { latitude, longitude } = activeAddress;
    const map = new window.google.maps.Map(mapContainerRef.current, {
      zoom: 14,
      center: new window.google.maps.LatLng(latitude, longitude),
    });

    new window.google.maps.Marker({
      position: new window.google.maps.LatLng(latitude, longitude),
      map,
    });
  }, [activeAddress, isGoogleMapsLoaded]);

  // Styling can be adjusted as needed
  return (
    <div ref={mapContainerRef} style={{ height: "700px", width: "100%" }} />
  );
};

export default GoogleMap;
