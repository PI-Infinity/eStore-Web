import { useAppContext } from "../../../context/app";
import { useProductsContext } from "../../../context/productsContext";
import { useTheme } from "../../../context/theme";
import { TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { MdArrowDropUp } from "react-icons/md";
import styled from "styled-components";
import { v4 } from "uuid";

interface PropsType {
  category: string;
  options: any;
  setOptions: (opt: any) => void;
  setFiles: (f: any) => void;
  fieldWarning: boolean;
}

const InStock: React.FC<PropsType> = ({
  category,
  options,
  setOptions,
  setFiles,
  fieldWarning,
}) => {
  // theme
  const { theme } = useTheme();

  // languages
  const { activeLanguage } = useAppContext();

  // options
  const { shoesSizes, sizes } = useProductsContext();

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // Toggle the flag after the first render
    } else {
      // This code will run on category updates, but not on the first render
      setOptions([{ id: v4(), qnt: "", size: "" }]);
    }
  }, [category]);
  const [openSizes, setOpenSizes] = useState({ active: false, group: 0 });

  return (
    <div
      style={{
        width: "100%",
        height: "auto", // Changed to auto to accommodate variable number of inputs
        border: fieldWarning ? "1px solid red" : `1px solid ${theme.line}`,
        borderRadius: "20px",
        padding: "16px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {options?.map((item: any, index: number) => {
        return (
          <div
            key={index}
            style={{ display: "flex", gap: "8px", alignItems: "center" }}
          >
            <h3 style={{ whiteSpace: "nowrap", color: theme.secondaryText }}>
              {activeLanguage.group} {index + 1}
            </h3>
            <Input
              label={`${activeLanguage.qnt}*`}
              type="text"
              value={item.qnt}
              onChange={(e) => {
                const newQnt = e;

                setOptions((prevOptions: any) =>
                  prevOptions.map((option: any, idx: number) =>
                    idx === index ? { ...option, qnt: newQnt } : option
                  )
                );

                setFiles((prevFiles: any) =>
                  prevFiles.map((file: any) => {
                    // Check if this file's groups array contains an item that matches the updated option
                    const isGroupItemExists = file.groups?.some(
                      (groupItem: any) => groupItem.id === options[index].id
                    );

                    // If there's a matching group item, update its quantity
                    if (isGroupItemExists) {
                      return {
                        ...file,
                        groups: file.groups?.map((groupItem: any) =>
                          groupItem.id === options[index].id
                            ? { ...groupItem, qnt: newQnt }
                            : groupItem
                        ),
                      };
                    }

                    return file;
                  })
                );
              }}
              onFocus={() => undefined}
              onBlur={() => undefined}
            />
            <div style={{ position: "relative", width: "12vw" }}>
              <Input
                label={activeLanguage.size}
                type="text"
                value={item.size}
                onChange={(e) => {
                  const newSize = e;
                  // Update the options, setting the new size for the option at the given index
                  setOptions((prevOptions: any) =>
                    prevOptions.map((option: any, idx: any) =>
                      idx === index ? { ...option, size: newSize } : option
                    )
                  );
                  // Then, update the corresponding item in each file's groups array
                  setFiles((prevFiles: any) =>
                    prevFiles.map((file: any) => {
                      // Check if this file's groups array contains an item that matches the updated option by ID
                      const isGroupItemExists = file.groups?.some(
                        (groupItem: any) => groupItem.id === options[index].id
                      );
                      // If there's a matching group item, update its size
                      if (isGroupItemExists) {
                        return {
                          ...file,
                          groups: file.groups?.map((groupItem: any) =>
                            groupItem.id === options[index].id
                              ? { ...groupItem, size: newSize }
                              : groupItem
                          ),
                        };
                      }
                      // Return the file unmodified if there's no matching group item
                      return file;
                    })
                  );
                }}
                onFocus={() => setOpenSizes({ active: true, group: index + 1 })}
                onBlur={() => undefined}
              />
              {openSizes && openSizes.group === index + 1 && (
                <OptionsContainer
                  style={{
                    border: `1px solid ${theme.line}`,
                    background: theme.background,
                  }}
                >
                  <div
                    onClick={() => setOpenSizes({ active: false, group: 0 })}
                  >
                    <MdArrowDropUp
                      color={theme.primary}
                      size={24}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                  {category === "Shoes"
                    ? shoesSizes
                        ?.filter((i: any) => i?.includes(item.size))
                        ?.map((itm: any, x: number) => {
                          return (
                            <OptionItem
                              style={{ border: `1px solid ${theme.line}` }}
                              onClick={() => {
                                const newSize = itm;

                                setOptions((prev: any) =>
                                  prev.map((i: any, idx: number) =>
                                    idx === index ? { ...i, size: newSize } : i
                                  )
                                );
                                // Then, update the corresponding item in each file's groups array
                                setFiles((prevFiles: any) =>
                                  prevFiles.map((file: any) => {
                                    // Check if this file's groups array contains an item that matches the updated option by ID
                                    const isGroupItemExists = file.groups?.some(
                                      (groupItem: any) =>
                                        groupItem.id === options[index].id
                                    );
                                    // If there's a matching group item, update its size
                                    if (isGroupItemExists) {
                                      return {
                                        ...file,
                                        groups: file.groups?.map(
                                          (groupItem: any) =>
                                            groupItem.id === options[index].id
                                              ? { ...groupItem, size: newSize }
                                              : groupItem
                                        ),
                                      };
                                    }
                                    // Return the file unmodified if there's no matching group item
                                    return file;
                                  })
                                );
                                setOpenSizes({ active: false, group: 0 });
                              }}
                              key={x}
                            >
                              {itm}
                            </OptionItem>
                          );
                        })
                    : sizes
                        ?.filter((i: any) =>
                          i?.toLowerCase().includes(item.size?.toLowerCase())
                        )
                        ?.map((itm: any, x: number) => {
                          return (
                            <OptionItem
                              onClick={() => {
                                const newSize = itm;

                                setOptions((prev: any) =>
                                  prev.map((i: any, idx: number) =>
                                    idx === index ? { ...i, size: newSize } : i
                                  )
                                );
                                // Then, update the corresponding item in each file's groups array
                                setFiles((prevFiles: any) =>
                                  prevFiles.map((file: any) => {
                                    // Check if this file's groups array contains an item that matches the updated option by ID
                                    const isGroupItemExists = file.groups?.some(
                                      (groupItem: any) =>
                                        groupItem.id === options[index].id
                                    );
                                    // If there's a matching group item, update its size
                                    if (isGroupItemExists) {
                                      return {
                                        ...file,
                                        groups: file.groups?.map(
                                          (groupItem: any) =>
                                            groupItem.id === options[index].id
                                              ? { ...groupItem, size: newSize }
                                              : groupItem
                                        ),
                                      };
                                    }
                                    // Return the file unmodified if there's no matching group item
                                    return file;
                                  })
                                );
                                setOpenSizes({ active: false, group: 0 });
                              }}
                              key={x}
                            >
                              {itm}
                            </OptionItem>
                          );
                        })}
                </OptionsContainer>
              )}
            </div>
          </div>
        );
      })}
      <div
        onClick={() =>
          setOptions((prev: any) => [
            ...prev,
            { id: v4(), qnt: "", size: "", color: "" },
          ])
        }
        style={{
          minWidth: "10vw",
          margin: "16px 0 0 0",
          padding: "4px 8px",
          border: `1px solid ${theme.line}`,
          borderRadius: "20px",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        + {activeLanguage.addNewGroup}
      </div>
    </div>
  );
};

export default InStock;

const OptionsContainer = styled.div`
  width: 100%;
  position: absolute;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 10px;
  margin-top: 8px;
  max-height: 250px;
  overflow-y: auto;
`;

const OptionItem = styled.div`
  width: 100%;
  border-radius: 10px;
  padding: 4px;
  text-align: center;
  cursor: pointer;
  transition: ease-in 200ms;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

interface InputType {
  label: string;
  value: any;
  onChange: (e: any) => void;
  type: string;
  onFocus: (e: any) => void;
  onBlur: (e: any) => void;
}

const Input: React.FC<InputType> = ({
  label,
  value,
  onChange,
  type,
  onFocus,
  onBlur,
}) => {
  const { theme } = useTheme();
  return (
    <TextField
      id="outlined-basic"
      label={label}
      variant="outlined"
      value={value}
      type={type}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={(e: any) => onChange(e.target.value)}
      sx={{
        width: "100%",
        "& .MuiOutlinedInput-root": {
          height: "53px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.line,
            borderRadius: "15px",
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
  );
};
