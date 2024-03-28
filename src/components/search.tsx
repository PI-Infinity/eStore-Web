"use client";

import React, { useState } from "react";
import { LuSearch } from "react-icons/lu";
import styled from "styled-components";
import { useProductsContext } from "../context/productsContext";
import { MdClose } from "react-icons/md";
import { useTheme } from "../context/theme";
import { useSearchDesignContext } from "../context/searchDesign";
import { useAppContext } from "../context/app";

interface SearchProps {
  setOpenSearch: (openSearch: Boolean) => void;
}

const Search: React.FC<SearchProps> = ({ setOpenSearch }) => {
  const [focus, setFocus] = useState(false);
  const {
    searchInput,
    setSearchInput,
    setPageLoading,
    setSex,
    setPrice,
    setSale,
    setActiveCategory,
    setActiveSubCategory,
    setBrand,
    setRating,
    setSize,
    setColor,
  } = useProductsContext();
  const { setOpenIn } = useSearchDesignContext();

  //theme
  const { theme } = useTheme();

  // language
  const { activeLanguage, isMobile } = useAppContext();

  // route pathname
  const pathname = window.location.pathname;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "ease-in 200ms",
        // border: isMobile
        //   ? "none"
        //   : `1.5px solid ${focus ? theme.primary : "rgba(0,0,0,0)"}`,
        borderRadius: "50px",
        marginTop: isMobile ? "8px" : "0",
      }}
    >
      <InputContainer
        style={{
          width: !focus && isMobile ? "95%" : "100%",
          background: theme.lightBackground,
          border: isMobile
            ? `2px solid ${focus ? theme.primary : "transparent"}`
            : `2px solid ${focus ? theme.primary : "transparent"}`,
        }}
      >
        <div
          style={{
            width: "35px",
            height: "30px",
            borderRadius: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: focus ? theme.background : "transparent",
          }}
        >
          <LuSearch color={theme.primaryText} size={20} />
        </div>
        <Input
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          secondarytext={theme.secondaryText}
          style={{ color: theme.primary }}
          onFocus={() => {
            setFocus(true);
            setOpenSearch(true);
            setSex(["Men"]);
            setPrice([0, 1000]);
            setSale([0, 100]);
            setActiveCategory("");
            setActiveSubCategory([]);
            setBrand([]);
            setRating([0, 5]);
            setSize([]);
            setColor([]);
            setOpenIn(pathname);
            setSearchInput("");
          }}
          onBlur={() => setFocus(false)}
          placeholder={
            typeof activeLanguage?.search === "string"
              ? activeLanguage.search
              : ""
          }
        />
        {searchInput?.length > 0 && (
          <MdClose
            color={theme.primary}
            size={24}
            className="close"
            onClick={() => setSearchInput("")}
          />
        )}
      </InputContainer>
    </div>
  );
};

export default Search;

const InputContainer = styled.div`
  height: 35px;
  z-index: 1001;
  width: 100%;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3px;
  web-kit-filter: blur(50px);
  transition: ease-in 200ms;

  @media (max-width: 768px) {
    height: 40px;
  }

  .close {
    cursor: pointer;
    transition: ease-in 200;
    z-index: 10;

    &:hover {
      transform: scale(1.2);
    }
  }
`;

interface InputProps {
  secondarytext: string;
}

const Input = styled.input<InputProps>`
  width: 100%;
  height: 100%;
  background: none;
  text-align: center;
  border-radius: 50px;
  outline: none;
  z-index: 100;
  border: none;
  font-size: 16px;

  &::placeholder {
    font-weight: 500;
    color: ${(props) => props.secondarytext};
    opacity: 0.7;
  }
`;
