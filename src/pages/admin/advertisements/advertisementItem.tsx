import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";
import { Switch } from "@mui/material";
import { styled as MUIStyled } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useLocation } from "react-router-dom";

export default function AddvertismentItem({ index, item }: any) {
  //theme
  const { theme } = useTheme();

  const location = useLocation();

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
    language,
    isMobile,
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

  const DeleteAdvertisements = async (ad: any) => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Delete advertisment is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    let updatedList = storeInfo?.advertisements?.filter(
      (itm: any) =>
        !(
          itm?.page === ad?.page &&
          itm?.title === ad?.title &&
          itm?.users === ad?.users
        )
    );
    try {
      const response = await axios.post(
        backendUrl + `/api/v1/project?id=${storeInfo._id}`,
        {
          advertisements: updatedList,
        }
      );
      if (response.data.status === "success") {
        setStoreInfo((prev: any) => ({ ...prev, advertisements: updatedList }));
        setConfirm({
          active: false,
          text: "",
          agree: null,
          close: null,
        });
        setAlert({
          active: true,
          type: "success",
          text: activeLanguage.adDeletedSuccessfully,
        });
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  // active/unactive coupon
  const ChangeActivity = async (ad: any, active: boolean) => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Change activity is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    setActive(active);
    let updatedList = storeInfo?.advertisements?.map((itm: any) => {
      if (itm?.title === ad?.title && itm?.page === ad?.page) {
        return { ...itm, active };
      } else {
        return itm;
      }
    });

    try {
      const response = await axios.post(
        backendUrl + `/api/v1/project?id=${storeInfo._id}`,
        {
          advertisements: updatedList,
        }
      );
      if (response.data.status === "success") {
        setStoreInfo((prev: any) => ({ ...prev, advertisements: updatedList }));
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  return (
    <div
      key={index}
      style={{
        padding: isMobile ? "16px" : "24px",
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
            text: activeLanguage.askDeleteAds,
            agree: () => DeleteAdvertisements(item),
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
          onChange={() => ChangeActivity(item, !active)}
        />
      </div>
      <div>
        {activeLanguage?.page}:{" "}
        <span style={{ color: theme.primaryText, fontWeight: 600 }}>
          {item?.page}
        </span>
      </div>
      <div>
        {activeLanguage?.title}:{" "}
        <span style={{ color: theme.primaryText, fontWeight: 600 }}>
          {item?.title[language as keyof typeof item.title]}
        </span>
      </div>
      {item?.description && (
        <div>
          {activeLanguage.description}:{" "}
          <span style={{ color: theme.primaryText, fontWeight: 600 }}>
            {item?.description[language as keyof typeof item.description]}
          </span>
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {activeLanguage.users}:
        <span
          style={{
            color: theme.primaryText,
            fontWeight: 600,
            marginLeft: "8px",
          }}
        >
          {item?.users}
        </span>
        <span style={{ color: theme.primaryText, fontWeight: 600 }}>
          {item?.shipppingCost}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {activeLanguage.linkButtonTitle}:
        <span
          style={{
            color: theme.primaryText,
            fontWeight: 600,
            marginLeft: "8px",
          }}
        >
          {item?.linkButtonTitle[language as keyof typeof item.linkButtonTitle]}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <h2 style={{}}>{activeLanguage.destinationLink}:</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontWeight: 600,
          }}
        >
          <span style={{ color: theme.primaryText, marginLeft: "8px" }}>
            {item?.link}
          </span>
        </div>
      </div>
    </div>
  );
}
