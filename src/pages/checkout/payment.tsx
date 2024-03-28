import Button from "../../components/button";
import { Input } from "../../components/input";
import { useAppContext } from "../../context/app";
import { useShippingContext } from "../../context/shipping";
import { useTheme } from "../../context/theme";
import { FormControlLabel, FormGroup, Radio } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

interface PropsTypes {
  stepOption: string;
  setStepOption: (step: string) => void;
}

const Payment: React.FC<PropsTypes> = ({ stepOption, setStepOption }) => {
  const { theme } = useTheme();

  const { backendUrl, setAlert, activeLanguage, isMobile } = useAppContext();

  const { order, setOrder, total, subtotal, discount } = useShippingContext();

  const [paymentType, setPaymentType] = useState("card");

  const [cardNumbers, setCardNumbers] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [cvc, setCvc] = useState("");

  const SetOrder = async () => {
    try {
      let fullOrder = { ...order, subtotal, discount, total };
      await axios.post(backendUrl + "/api/v1/orders", { order: fullOrder });
      setOrder(fullOrder);
    } catch (error: any) {
      setAlert({
        type: "error",
        text: error.response.data.message,
        active: true,
      });
      console.log(error.response.data.message);
    }
  };

  return (
    <div style={{ width: "100%", margin: "8px 0" }}>
      <h2
        style={{
          fontSize: "24px",
          marginRight: "auto",
          color: theme.primaryText,
          fontWeight: 600,
        }}
      >
        {activeLanguage.payment}
      </h2>
      {stepOption === "payment" && (
        <div
          style={{
            width: "100%",
            height: "300px",
            display: "flex",
            flexDirection: "column",

            gap: "16px",
            marginTop: "24px",
          }}
        >
          <FormGroup sx={{ marginLeft: "16px", marginBottom: "8px" }}>
            <FormControlLabel
              control={
                <Radio
                  checked={paymentType === "card"} // Determine if the item is selected
                  onChange={(e) => {
                    setPaymentType("card");
                  }}
                  name="Credit/Debit Card"
                  sx={{ color: theme.secondaryText }}
                />
              }
              label={activeLanguage.creditDebitCard}
            />
            <FormControlLabel
              control={
                <Radio
                  checked={paymentType === "paypal"} // Determine if the item is selected
                  onChange={(e) => {
                    setPaymentType("paypal");
                  }}
                  name="Pay Pal"
                  sx={{ color: theme.secondaryText }}
                />
              }
              label={"Pay Pal"}
            />
          </FormGroup>
          <div
            style={{
              width: isMobile ? "92vw" : "42vw",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div style={{ width: "50%" }}>
              <Input
                label={activeLanguage.cardNumbers + "*"}
                type="text"
                value={cardNumbers}
                onChange={setCardNumbers}
                warning={cardNumbers.length > 16 ? true : false}
              />
            </div>
            <div style={{ width: "25%" }}>
              <Input
                label={activeLanguage.expireDate + "*"}
                type="text"
                value={expireDate}
                onChange={setExpireDate}
                warning={expireDate?.length > 10 ? true : false}
              />
            </div>
            <div style={{ width: "25%" }}>
              <Input
                label="CVC*"
                type="text"
                value={cvc}
                onChange={setCvc}
                warning={cvc.length > 3 ? true : false}
              />
            </div>
          </div>
          <div style={{ width: "100%", marginLeft: "auto", marginTop: "16px" }}>
            <Button
              title={activeLanguage.acceptAndPay}
              color={theme.lightBackground}
              background={"green"}
              onClick={SetOrder}
              disabled={
                cardNumbers.length === 16 &&
                expireDate?.length < 11 &&
                cvc?.length === 3
                  ? false
                  : true
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
