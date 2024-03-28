import { Autocomplete } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

import { TextField } from "@mui/material";
import styled, { createGlobalStyle } from "styled-components";
import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";
import { useGoogleMaps } from "../../../context/googleMapContext";

const MapAutoComplete = ({ setState, setShippingVariants, setOrder }) => {
  const { theme } = useTheme();

  // Inside your MapAutoComplete component or similar
  const { isGoogleMapsLoaded } = useGoogleMaps(); // Assuming this hook provides the loaded state

  const { storeInfo, activeLanguage } = useAppContext();

  const containerRef = useRef(null);
  const autocompleteRef = useRef(null);

  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      // Ensure the containerRef is current and accessible
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth; // Get the container width
        setContainerWidth(width); // Update state with the new width
      }
    };
    setTimeout(() => {
      updateWidth(); // Call once on mount to set initial width
    }, 100);
  }, [containerRef]);

  if (!isGoogleMapsLoaded) {
    return <div>Loading...</div>; // Or some loading indicator
  }

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    const components = {};

    for (const component of place.address_components) {
      if (component.types.includes("country")) {
        components.country = component.long_name;
      } else if (component.types.includes("administrative_area_level_1")) {
        components.region = component.long_name;
      } else if (component.types.includes("locality")) {
        components.city = component.long_name;
      } else if (component.types.includes("sublocality_level_1")) {
        components.district = component.long_name;
      } else if (component.types.includes("route")) {
        components.street = component.long_name;
      } else if (component.types.includes("street_number")) {
        components.streetNumber = component.long_name;
      }
    }

    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();

    if (setShippingVariants) {
      let shippings = storeInfo?.shipping?.filter(
        (i) => i.shippingArea.region === components.region
      );

      setShippingVariants(shippings);

      if (setOrder) {
        setOrder((prev) => ({
          ...prev,
          shipping: {
            ...prev.shipping,
            cost: shippings ? parseInt(shippings[0]?.shippingCost) : 0,
            shippingTitle: shippings ? shippings[0]?.title : "Pick Up",
            address: shippings
              ? {
                  country: components.country,
                  region: components.region,
                  city: components.city,
                  district: components.district,
                  street: components.street,
                  streetNumber: components.streetNumber,
                  latitude: latitude,
                  longitude: longitude,
                  address: place.formatted_address,
                }
              : {},
          },
        }));
      }
    }

    if (setState) {
      setState({
        country: components.country,
        region: components.region,
        city: components.city,
        district: components.district,
        street: components.street,
        streetNumber: components.streetNumber,
        latitude: latitude,
        longitude: longitude,
        address: place.formatted_address,
      });
    }
  };

  return (
    <>
      <GlobalStyles theme={theme} />
      <Container theme={theme} ref={containerRef}>
        <Autocomplete
          onLoad={(ref) => (autocompleteRef.current = ref)}
          onPlaceChanged={handlePlaceChanged}
        >
          <TextField
            id="outlined-basic"
            label={activeLanguage.enterLocation}
            variant="outlined"
            sx={{
              width: containerWidth > 0 ? `${containerWidth}px` : "auto",
              "& .MuiOutlinedInput-root": {
                height: "53px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.line,
                  borderRadius: "10px",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.primary,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.primary,
                },
              },
              "& .MuiOutlinedInput-input": {
                borderRadius: "15px",
                color: theme.primaryText,
              },
              "& label": {
                color: theme.secondaryText,
                fontSize: "14px",
                letterSpacing: "0.5px",
              },
              "& label.Mui-focused": {
                color: theme.primaryText,
                fontSize: "14px",
                letterSpacing: "0.5px",
              },
            }}
          />
        </Autocomplete>
      </Container>
    </>
  );
};

export default MapAutoComplete;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  border-radius: 15px;

  .input {
    width: 100%;
    border-radius: 15px;
    border: 1px solid ${(props) => props.theme.line};
    background: transparent;
    font-size: 16px;
    color: ${(props) => props.theme.primaryText};
    transition: ease-in 200ms;
    padding: 0 15px;

    &::placeholder {
      color: ${(props) => props.theme.secondaryText};
      font-size: 14px;
    }

    &:focus {
      outline: none;
      box-shadow: none;
    }

    &:hover {
      outline: none;
      border: 1.5px solid ${(props) => props.theme.primary};
    }
  }
`;

const GlobalStyles = createGlobalStyle`
  .pac-container {
    border: 1.5px solid ${(props) => props.theme.primary};
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    background-color: #fff;
    border-radius: 15px;
    margin-top: 8px;
    background: rgba(1, 2, 12, 0.8);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    position: absolute;
    z-index: 100009;
  }

  .pac-item {
    padding: 5px 10px;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: #ccc;
    font-weight: bold;
    border: none;
    letter-spacing: 0.5px;
  }

  .pac-item:hover {
    font-size: 14px;
    letter-spacing: 0.5px;
    background: none;
    opacity: 0.8;
  }

  .pac-item-query {
    font-weight: bold;
    color: ${(props) => props.theme.primaryText};
    font-size: 14px;
    letter-spacing: 0.5px;
  }

  .pac-matched {
    font-weight: bold;
    color: ${(props) => props.theme.primary};
    font-size: 14px;
    letter-spacing: 0.5px;
  }

  .pac-icon {
    width: 15px;
    height: 20px;
    /* You might adjust the icon styling here */
  }
`;
