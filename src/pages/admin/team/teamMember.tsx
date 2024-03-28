import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";
import axios from "axios";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { MdClose } from "react-icons/md";
import { useLocation } from "react-router-dom";

export default function AddvertismentItem({ index, item, setAdmins }: any) {
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
  const { setConfirm, activeLanguage, backendUrl, setAlert, isMobile } =
    useAppContext();

  /**
   * delete role
   */

  const location = useLocation();
  const DeleteRole = async (user: any) => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Delete member is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    try {
      const response = await axios.patch(
        backendUrl + "/api/v1/users/" + user._id,
        {
          admin: { active: false, role: "", access: [] },
        }
      );
      if (response.data.status === "success") {
        setAdmins((prev: any) => prev?.filter((i: any) => i._id !== user?._id));
        setConfirm({
          active: false,
          text: "",
          agree: null,
          close: null,
        });
        setAlert({
          active: true,
          type: "success",
          text: activeLanguage.advertisementDeletedSuccessfully,
        });
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
            text: activeLanguage.askDeleteMember,
            agree: () => DeleteRole(item),
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
      <div>
        {activeLanguage.role}:{" "}
        <span style={{ color: theme.primaryText, fontWeight: "600" }}>
          {item?.admin?.role}
        </span>
      </div>
      <div>
        {activeLanguage.user}:{" "}
        <span style={{ color: theme.primaryText, fontWeight: "600" }}>
          {item?.firstName + " " + item?.lastName}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {activeLanguage.access}:
        <div
          style={{
            color: theme.primaryText,
            marginLeft: "8px",
            marginTop: "8px",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            fontWeight: 600,
          }}
        >
          {item?.admin.access?.map((i: any) => {
            return <div key={i}>{i} |</div>;
          })}
        </div>
        <span style={{ color: theme.primaryText }}>{item?.shipppingCost}</span>
      </div>
    </div>
  );
}
