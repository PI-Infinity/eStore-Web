import { useTheme } from "../context/theme";
import { TextField } from "@mui/material";
import React from "react";

interface PropsType {
  label: string;
  value: any;
  onChange: (e: any) => void;
  type: string;
  warning: boolean;
  onKeyDown?: (prev: any) => void;
  textarea?: boolean;
  id?: string;
}

export const Input: React.FC<PropsType> = ({
  label,
  value,
  onChange,
  type,
  warning,
  onKeyDown,
  textarea,
  id,
}) => {
  const { theme } = useTheme();
  return (
    <TextField
      id={id}
      label={label}
      variant="outlined"
      value={value}
      autoFocus={false}
      type={type}
      autoComplete="off"
      onChange={(e: any) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      multiline={textarea ? true : false}
      rows={textarea ? 3 : 1}
      sx={{
        width: "100%",
        background: theme.lightBackground,
        borderRadius: "10px",
        "& .MuiOutlinedInput-root": {
          height: "53px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderWidth: "1.5px",
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
          borderRadius: "10px",
          color: theme.secondaryText,
        },
        "& label": {
          color: theme.secondaryText,
          fontSize: "14px",
          letterSpacing: "0.5px",
        },
        "& label.Mui-focused": {
          color: theme.secondaryText,
          fontSize: "14px",
          letterSpacing: "0.5px",
        },
      }}
    />
  );
};
