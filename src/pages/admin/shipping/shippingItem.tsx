import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";
import { Switch } from "@mui/material";
import { styled as MUIStyled } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { MdClose } from "react-icons/md";
import { useLocation } from "react-router-dom";

export default function ShippingItem({ index, item, setCoupons }: any) {
  //theme
  const { theme } = useTheme();

  /**
   * coupon activation
   */

  const [active, setActive] = useState(true);

  useEffect(() => {
    setActive(item?.active);
  }, [item]);

  // app context
  const {
    setConfirm,
    storeInfo,
    setStoreInfo,
    backendUrl,
    setAlert,
    activeLanguage,
  } = useAppContext();

  // publish switch styled
  const GreenSwitch = MUIStyled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "green",
      "&:hover": {
        opacity: "0.8",
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "green",
    },
  }));

  const label = { inputProps: { "aria-label": "Color switch demo" } };

  /**
   * delete coupon
   */

  const DeleteShipping = async (title: string) => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Delete shipping is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    let updatedList = storeInfo?.shipping.filter(
      (itm: any) => itm?.title !== title
    );
    try {
      const response = await axios.post(
        backendUrl + `/api/v1/project?id=${storeInfo._id}`,
        {
          shipping: updatedList,
        }
      );
      if (response.data.status === "success") {
        setStoreInfo((prev: any) => ({ ...prev, shipping: updatedList }));
        setConfirm({
          active: false,
          text: "",
          agree: null,
          close: null,
        });
        setAlert({
          active: true,
          type: "success",
          text: activeLanguage.shippingDeletedSuccessfully,
        });
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  // active/unactive coupon
  const location = useLocation();
  const ChangeActivity = async (title: any, active: boolean) => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Change activity is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    setActive(active);
    let updatedList = storeInfo?.shipping.map((itm: any) => {
      if (itm?.title === title) {
        return { ...itm, active };
      } else {
        return itm;
      }
    });
    try {
      const response = await axios.post(
        backendUrl + `/api/v1/project?id=${storeInfo._id}`,
        {
          shipping: updatedList,
        }
      );
      if (response.data.status === "success") {
        setStoreInfo((prev: any) => ({ ...prev, shipping: updatedList }));
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  return (
    <div
      key={index}
      style={{
        padding: "24px",
        borderRadius: "15px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        border: `1px solid ${theme.lineDark}`,
        color: theme.secondaryText,
        position: "relative",
      }}
    >
      <MdClose
        onClick={() =>
          setConfirm({
            active: true,
            text: activeLanguage.askDeleteShipping,
            agree: () => DeleteShipping(item?.title),
            close: () =>
              setConfirm({
                active: false,
                text: "",
                agree: null,
                close: null,
              }),
          })
        }
        className="icon"
        color={theme.primary}
        size={24}
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          cursor: "pointer",
        }}
      />
      <div style={{ position: "relative", right: "12px" }}>
        <GreenSwitch
          {...label}
          checked={active}
          onChange={() => ChangeActivity(item?.title, !active)}
        />
      </div>
      <div>
        {activeLanguage.title}:{" "}
        <span style={{ color: theme.primaryText, fontWeight: 600 }}>
          {item?.title}
        </span>
      </div>
      <div>
        {activeLanguage.area}:{" "}
        <span style={{ color: theme.primaryText, fontWeight: 600 }}>
          {item?.shippingArea?.address}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {activeLanguage.cost}:
        <span
          style={{
            color: theme.primaryText,
            fontWeight: 600,
            marginLeft: "8px",
          }}
        >
          {item?.discountType === "%"
            ? "%"
            : storeInfo?.currency === "Dollar"
            ? "$"
            : storeInfo?.currency == "Euro"
            ? "€"
            : "₾"}
        </span>
        <span style={{ color: theme.primaryText, fontWeight: 600 }}>
          {item?.shippingCost}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <h2 style={{}}>{activeLanguage.deliveryTime}:</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <span
            style={{
              color: theme.primaryText,
              fontWeight: 600,
              marginLeft: "8px",
            }}
          >
            {item?.shippingTime} {activeLanguage.days}
          </span>
        </div>
      </div>
    </div>
  );
}
