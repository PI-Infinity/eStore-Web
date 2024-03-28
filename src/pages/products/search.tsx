import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { LuSearch } from "react-icons/lu";
import { MdClose } from "react-icons/md";
import styled from "styled-components";
import { useAppContext } from "../../context/app";
import { useProductsContext } from "../../context/productsContext";
import { useTheme } from "../../context/theme";

const Search = () => {
  const [focus, setFocus] = useState(false);
  const { searchInput, setSearchInput, setOpenFilter } = useProductsContext();

  //theme
  const { theme } = useTheme();
  const { isMobile } = useAppContext();

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "ease-in 200ms",
        border: isMobile
          ? "none"
          : `1.5px solid ${focus ? theme.primary : "rgba(0,0,0,0)"}`,
        borderRadius: "50px",
        gap: isMobile ? "2px" : "0",
      }}
    >
      <InputContainer
        style={{
          border: isMobile
            ? `2px solid ${focus ? theme.primary : "transparent"}`
            : `1.5px solid ${theme.line}`,
          width: focus ? "100%" : "95%",
          transition: "ease-in 200ms",
          background: theme.lightBackground,
        }}
      >
        <LuSearch color={theme.primaryText} size={24} />
        <Input
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder="Search Products..."
          style={{
            letterSpacing: "0.5px",
            color: theme.primaryText,
            fontSize: isMobile ? "16px" : "16px",
          }}
        />
        {searchInput?.length > 0 && (
          <MdClose
            color="red"
            size={24}
            className="close"
            onClick={() => setSearchInput("")}
          />
        )}
      </InputContainer>
      {isMobile && (
        <div
          style={{
            transform: `scale(${focus ? 0 : 1})`,
            opacity: focus ? 0 : 1,
            width: focus ? "0" : "70px",
            height: "40px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "ease-in 200ms",
            padding: "0 10px 0 0",
            fontWeight: "bold",
            color: theme.primaryText,
          }}
          onClick={() => setOpenFilter(true)}
          className="icon"
        >
          <IoMdArrowDropdown size={20} color={theme.primary} />
          filter
        </div>
      )}
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

const Input = styled.input`
  width: 100%;
  height: 100%;
  background: none;
  text-align: center;
  border-radius: 50px;
  outline: none;
  z-index: 100;
`;
