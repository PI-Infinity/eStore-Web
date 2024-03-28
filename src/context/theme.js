import { createContext, useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

const darkTheme = {
  primary: "#FFBE0F",
  primaryText: "#E0E1EC",
  secondaryText: "#9696A0",
  dark: "#050505",
  background: "#050505",
  lightBackground: "#111",
  lineLight: "rgba(255,255,255,0.05)",
  line: "rgba(255,255,255,0.05)",
  lineDark: "rgba(255,255,255,0.1)",
};
const lightTheme = {
  primary: "#CF1E1E",
  primaryText: "#111",
  secondaryText: "#6F6F75",
  dark: "#050505",
  background: "#fff",
  lightBackground: "#f9f9f9",
  lineLight: "rgba(0,0,0,0.05)",
  line: "rgba(0,0,0,0.05)",
  lineDark: "rgba(0,0,0,0.1)",
};

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState("dark");

  const location = useLocation();

  useEffect(() => {
    // Define custom scrollbar styles
    const style = document.createElement("style");
    style.innerHTML = `
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        border-radius: 50px;
      }
      ::-webkit-scrollbar-track {
        background: ${
          location.search.includes("sport-dark")
            ? darkTheme.lightBackground
            : lightTheme.lightBackground
        };
        border-radius: 50px;
      }
      ::-webkit-scrollbar-thumb {
        background: ${
          location.search.includes("sport-dark")
            ? darkTheme.primary
            : lightTheme.primary
        };
        border-radius: 50px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: ${
          location.search.includes("sport-dark")
            ? darkTheme.primary
            : lightTheme.primary
        };
        border-radius: 50px;
      }
    `;
    // Append the style to the head of the document
    document.head.appendChild(style);

    if (location.search.includes("sport-dark")) {
      setActiveTheme("dark");
    } else {
      setActiveTheme("light");
    }

    // Cleanup function to remove the style when the component unmounts
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor =
      activeTheme === "light" ? lightTheme.background : darkTheme.background;
    localStorage.setItem("eStore:theme", activeTheme);
  }, [activeTheme]);

  return (
    <ThemeContext.Provider
      value={{
        activeTheme,
        theme: activeTheme === "dark" ? darkTheme : lightTheme,
        setActiveTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
