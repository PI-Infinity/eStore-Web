"use client";

import React, { useState } from "react";
import { LuSearch } from "react-icons/lu";
import styled from "styled-components";
import { MdClose } from "react-icons/md";
import { useTheme } from "../../../context/theme";
import { useAppContext } from "../../../context/app";

interface PropsType {
  search: string;
  setSearch: (srch: string) => void;
}

const Search: React.FC<PropsType> = ({ search, setSearch }) => {
  const [focus, setFocus] = useState(false);

  //theme
  const { theme } = useTheme();

  const { activeLanguage } = useAppContext();

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "ease-in 200ms",
        borderRadius: "50px",
      }}
    >
      <InputContainer
        style={{
          background: theme.lightBackground,
          border: `2px solid ${focus ? theme.primary : "rgba(0,0,0,0)"}`,
        }}
      >
        <div>
          <LuSearch color={theme.primaryText} size={24} />
        </div>
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          style={{ color: theme.primary }}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder={activeLanguage.search}
        />
        {search?.length > 0 && (
          <MdClose
            color={theme.primary}
            size={24}
            className="close"
            onClick={() => setSearch("")}
          />
        )}
      </InputContainer>
    </div>
  );
};

export default Search;

const InputContainer = styled.div`
  height: 45px;
  width: 100%;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  web-kit-filter: blur(50px);

  @media (max-width: 768px) {
    width: 95%;
    margin-top: 8px;
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

const Input = styled.input`
  width: 100%;
  height: 100%;
  background: none;
  text-align: center;
  border-radius: 50px;
  outline: none;
  z-index: 100;
  font-size: 16px;
`;
