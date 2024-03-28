import { useTheme } from "../../context/theme";
import React from "react";

interface PropsTypes {
  stepOption: string;
  setStepOption: (step: string) => void;
}

const Review: React.FC<PropsTypes> = ({}) => {
  const { theme } = useTheme();

  return (
    <div style={{ width: "100%", margin: "8px 0" }}>
      <h2
        style={{
          fontSize: "24px",
          marginRight: "auto",
          color: theme.secondaryText,
        }}
      >
        Review Order
      </h2>
      <></>
    </div>
  );
};

export default Review;
