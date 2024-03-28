import { TextField } from "@mui/material";
import { Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useAppContext } from "../context/app";
import { useShippingContext } from "../context/shipping";
import { useTheme } from "../context/theme";
import { useGoogleMaps } from "../context/googleMapContext";

const MapAutoComplete = ({ setState }) => {
  const { theme } = useTheme();

  const { order, setOrder } = useShippingContext();

  const { isGoogleMapsLoaded } = useGoogleMaps();

  const { isMobile } = useAppContext();

  let containerWidth = isMobile ? "85vw" : "57vw";

  const containerRef = useRef(null);

  const autocompleteRef = useRef(null);

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

    setOrder((prev) => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        address: {
          country: components.country,
          region: components.region,
          city: components.city,
          district: components.district,
          street: components.street,
          streetNumber: components.streetNumber,
          latitude: latitude,
          longitude: longitude,
          address: place.formatted_address,
        },
      },
    }));

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

  if (!isGoogleMapsLoaded) {
    return <div>Loading...</div>; // Or some loading indicator
  }

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
            label={order?.shipping.address.address || "Enter Location*"}
            variant="outlined"
            sx={{
              width: containerWidth,
              "& .MuiOutlinedInput-root": {
                background: theme.lightBackground,
                height: "53px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.line,
                  borderRadius: "10px",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "transparent",
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
                color: order?.shipping.address.address
                  ? theme.primaryText
                  : theme.secondaryText,
                fontSize: "16px",
                letterSpacing: "0.5px",
              },
              "& label.Mui-focused": {
                color: theme.primaryText,
                fontSize: "16px",
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
  z-index: 1000002;

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
    z-index: 1000003;
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
