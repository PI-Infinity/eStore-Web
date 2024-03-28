"use client";
import { createContext, useContext, useState } from "react";

const SearchDesignContext = createContext();

export const useSearchDesignContext = () => useContext(SearchDesignContext);

export function SearchDesignWrapper({ children }) {
  // open animation designed search in navbar
  const [openSearch, setOpenSearch] = useState(false);
  // hide in
  const [openIn, setOpenIn] = useState(null);

  return (
    <SearchDesignContext.Provider
      value={{
        openSearch,
        setOpenSearch,
        openIn,
        setOpenIn,
      }}
    >
      {children}
    </SearchDesignContext.Provider>
  );
}
