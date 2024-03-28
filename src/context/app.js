"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { en, ru, ka } from "../languages/list";
import { InitFacebookPixel } from "../utils/fbPixel";
import { useLocation } from "react-router-dom";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export function AppContextWrapper({ children }) {
  const location = useLocation();
  // define device type
  const [isMobile, setIsMobile] = useState("undefined");

  useEffect(() => {
    const handleResize = () => {
      // Assuming a width less than 768px is a mobile device
      setIsMobile(window.innerWidth < 768);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call the function to set the initial state
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // app loading
  const [appLoad, setAppLoad] = useState(true);
  // backend url
  const backendUrl = "https://estoretemplate-7a004e17b17a.herokuapp.com";
  // const backendUrl = "http://192.168.1.6:8000";
  // open animation designed search in navbar
  const [scrollY, setScrollY] = useState(0);
  // alert message
  const [alert, setAlert] = useState({ active: false, type: "", text: "" });
  // backdrop loader
  const [openBackDrop, setOpenBackDrop] = useState({ active: false, text: "" });
  // page loading
  const [pageLoading, setPageLoading] = useState(false);
  const [loadActive, setLoadActive] = useState(false);

  useEffect(() => {
    if (pageLoading) {
      setLoadActive(true);
    } else {
      setTimeout(() => {
        setLoadActive(false);
      }, 500);
    }
  }, [pageLoading]);

  // confirm popup
  const [confirm, setConfirm] = useState({
    active: false,
    close: null,
    agree: null,
    text: "",
  });
  // store info

  const [storeInfo, setStoreInfo] = useState({});

  const [rerender, setRerender] = useState(false);

  const setRerenderStoreInfo = () => {
    setRerender((prev) => !prev);
  };

  // get store info
  useEffect(() => {
    const GetStore = async () => {
      try {
        const response = await axios.get(
          backendUrl +
            `/api/v1/project?theme=${
              location.search.includes("sport-dark")
                ? "sport-dark"
                : "sport-light"
            }`
        );

        setStoreInfo(response.data.data.project);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    GetStore();
  }, [rerender]);

  useEffect(() => {
    const faviconURL = storeInfo.favicon; // Your cloud-hosted favicon URL
    const timestamp = new Date().getTime();
    const updatedFaviconURL = `${faviconURL}?${timestamp}`;

    const link =
      document.querySelector("link[rel~='icon']") ||
      document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = updatedFaviconURL;
    document.getElementsByTagName("head")[0].appendChild(link);
    document.title = storeInfo?.name || "Loading...";
    const meta = document.querySelector("meta[name='description']");
    if (meta) {
      meta.content = storeInfo?.description;
    }
  }, [storeInfo]);

  /**
   * languages
   */
  const [language, setLanguage] = useState(null);
  const [activeLanguage, setActiveLanguage] = useState("en");

  useEffect(() => {
    if (storeInfo) {
      let appLang = localStorage.getItem("eStore:language");
      if (appLang) {
        setLanguage(appLang);
      } else {
        setLanguage(storeInfo.language);
      }
    }
  }, [storeInfo]);

  useEffect(() => {
    if (language) {
      if (language === "en") {
        setActiveLanguage(en);
      } else if (language === "ru") {
        setActiveLanguage(ru);
      } else {
        setActiveLanguage(ka);
      }
      localStorage.setItem("eStore:language", language);
    }
  }, [language]);

  // mobile menu open
  const [openMenu, setOpenMenu] = useState(false);

  /**
   * integrate fb pixel
   */

  useEffect(() => {
    InitFacebookPixel(storeInfo?.pixelId);
  }, [storeInfo]);

  return (
    <AppContext.Provider
      value={{
        isMobile,
        appLoad,
        setAppLoad,
        backendUrl,
        scrollY,
        setScrollY,
        alert,
        setAlert,
        openBackDrop,
        setOpenBackDrop,
        pageLoading,
        setPageLoading,
        loadActive,
        confirm,
        setConfirm,
        storeInfo,
        setStoreInfo,
        setRerenderStoreInfo,
        language,
        setLanguage,
        activeLanguage,
        setOpenMenu,
        openMenu,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
