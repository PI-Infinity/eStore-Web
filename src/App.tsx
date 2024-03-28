import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Content from "./content";
import { AdminContextWrapper } from "./context/adminContext";
import { AppContextWrapper } from "./context/app";
import { CurrentUserContextWrapper } from "./context/currentUser";
import { ProductsWrapper } from "./context/productsContext";
import { SearchDesignWrapper } from "./context/searchDesign";
import { ShippingWrapper } from "./context/shipping";
import { ThemeProvider } from "./context/theme";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleMapsProvider } from "./context/googleMapContext";

function App() {
  // auto app reload if user dont react in 2 hours
  const useAutoReload = (timeout = 7200000) => {
    // Default to 2 hours (7200000 milliseconds)
    useEffect(() => {
      let timer = setTimeout(() => {
        window.location.reload();
      }, timeout);

      const resetTimer = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          window.location.reload();
        }, timeout);
      };

      // List of events to reset the timer
      const events = ["click", "keypress"];

      events.forEach((event) => {
        window.addEventListener(event, resetTimer);
      });

      return () => {
        clearTimeout(timer);
        events.forEach((event) => {
          window.removeEventListener(event, resetTimer);
        });
      };
    }, [timeout]);
  };

  useAutoReload();

  return (
    <BrowserRouter>
      <GoogleMapsProvider>
        <GoogleOAuthProvider clientId="211246211778-7j18gi9fkh6lgv3iosk62urd03suqt8p.apps.googleusercontent.com">
          <AppContextWrapper>
            <ThemeProvider>
              <ProductsWrapper>
                <ShippingWrapper>
                  <CurrentUserContextWrapper>
                    <AdminContextWrapper>
                      <SearchDesignWrapper>
                        <Content />
                      </SearchDesignWrapper>
                    </AdminContextWrapper>
                  </CurrentUserContextWrapper>
                </ShippingWrapper>
              </ProductsWrapper>
            </ThemeProvider>
          </AppContextWrapper>
        </GoogleOAuthProvider>
      </GoogleMapsProvider>
    </BrowserRouter>
  );
}

export default App;
