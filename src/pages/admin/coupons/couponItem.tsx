import React, { useEffect, useState } from "react";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdClose,
  MdDelete,
  MdDone,
  MdEdit,
} from "react-icons/md";
import { styled as MUIStyled } from "@mui/material/styles";
import { Switch } from "@mui/material";
import { useAppContext } from "../../..//context/app";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useTheme } from "../../..//context/theme";
import { People } from "@mui/icons-material";
import { Input } from "../../..//components/input";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

export default function CouponItem({
  index,
  item,
  coupons,
  setCoupons,
  usersList,
  newUser,
  setNewUser,
}: any) {
  //theme
  const { theme } = useTheme();

  /**
   * coupon activation
   */

  const [active, setActive] = useState(true);

  useEffect(() => {
    setActive(item?.active);
  }, [item]);

  // open users list
  const [openUsers, setOpenUsers] = useState(null);

  // app context
  const {
    setConfirm,
    storeInfo,
    backendUrl,
    setAlert,
    activeLanguage,
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

  // date pick
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  /**
   * edit coupon expire date
   */
  const [editDate, setEditDate] = useState({ active: false, item: "" });

  const location = useLocation();

  // Example function to add a user to a coupon's user list
  const UpdateCouponDate = async (couponId: string, newDate: any) => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Update coupon outcome is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    // Then, try to update the backend
    try {
      const response = await axios.patch(
        `${backendUrl}/api/v1/coupons/${couponId}`,
        {
          expireDate: newDate, // Send the updated user list to the backend
        }
      );
      if (response.data.data.coupon) {
        setCoupons((prev: any) =>
          prev.map((coupon: any) => {
            if (coupon._id === couponId) {
              return {
                ...coupon,
                expireDate: newDate, // Update with the new user list
              };
            } else {
              return coupon;
            }
          })
        );
        setEditDate({
          active: false,
          item: "",
        });
        setSelectedDate(new Date());
        setAlert({
          active: true,
          type: "success",
          text: activeLanguage.couponDateChangedSuccesfully,
        });
      }
      console.log("Update successful:", response.data);
    } catch (error: any) {
      console.error("Error updating coupon:", error?.response?.data?.message);
    }
  };

  // Example function to add a user to a coupon's user list
  const DeleteUserFromCoupon = async (couponId: string, newUser: any) => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Delete user is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    // Update the local state first
    let couponUsers = coupons.find((i: any) => i._id === couponId)?.users;
    let updatedList = couponUsers?.filter(
      (i: any) => i.email.toLowerCase() !== newUser?.email.toLowerCase()
    );

    setCoupons((prev: any) =>
      prev.map((coupon: any) => {
        if (coupon._id === couponId) {
          return {
            ...coupon,
            users: updatedList, // Assuming newUser is the user object to add
          };
        } else {
          return coupon;
        }
      })
    );
    // Then, try to update the backend
    try {
      const response = await axios.patch(
        `${backendUrl}/api/v1/coupons/${couponId}`,
        {
          users: updatedList, // You might need to adjust this depending on how your backend expects the data
        }
      );
      console.log("Update successful:", response.data);
    } catch (error: any) {
      console.error("Error updating coupon:", error?.response?.data?.message);
    }
  };

  // format order date to display format
  const DefineDate = (dateValue: any) => {
    const date = new Date(dateValue);

    // Example format: "February 25, 2024, 16:35"
    // Adjust the format according to your needs
    const formattedDate = date.toLocaleString("en-US", {
      month: "short", // "February"
      day: "2-digit", // "25"
      year: "numeric", // "2024"
      hour: "2-digit", // "16"
      minute: "2-digit", // "35"
      hour12: false,
    });
    return formattedDate;
  };

  /**
   * delete coupon
   */
  const DeleteCoupon = async (id: string) => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Delete coupon is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    try {
      const response = await axios.delete(backendUrl + "/api/v1/coupons/" + id);
      if (response.data.status === "success") {
        setCoupons((prev: any) => prev.filter((i: any) => i._id !== id));
        setConfirm({
          active: false,
          text: "",
          agree: null,
          close: null,
        });
        setAlert({
          active: true,
          type: "success",
          text: activeLanguage.couponDeletedSuccesfully,
        });
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  // Example function to add a user to a coupon's user list
  const AddUserInCoupon = async (couponId: string, newUser: any) => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Add user is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    // Find the coupon by ID and get its users
    let couponUsers = coupons.find((i: any) => i._id === couponId)?.users;

    // Check if newUser is already in the couponUsers list by a unique identifier
    const isUserAlreadyAdded = couponUsers.some(
      (user: any) => user.email.toLowerCase() === newUser.email.toLowerCase()
    );

    let updatedList = isUserAlreadyAdded
      ? [...couponUsers]
      : [
          ...couponUsers,
          {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser?.email,
          },
        ];

    // Update the local state only if newUser was not already added
    if (!isUserAlreadyAdded) {
      setCoupons((prev: any) =>
        prev.map((coupon: any) => {
          if (coupon._id === couponId) {
            return {
              ...coupon,
              users: updatedList, // Update with the new user list
            };
          } else {
            return coupon;
          }
        })
      );

      // Then, try to update the backend
      try {
        const response = await axios.patch(
          `${backendUrl}/api/v1/coupons/${couponId}`,
          {
            users: updatedList, // Send the updated user list to the backend
          }
        );
        console.log("Update successful:", response.data);
      } catch (error: any) {
        console.error("Error updating coupon:", error?.response?.data?.message);
      }
    } else {
      console.log("User already exists in the coupon's user list.");
    }
  };

  // active/unactive coupon
  const ChangeActivity = async (id: any, active: boolean) => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Change activity is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    try {
      const response = await axios.patch(backendUrl + "/api/v1/coupons/" + id, {
        active,
      });
      if (response.data.status === "success") {
        setActive(active);
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
            text: activeLanguage.askDeleteCoupon,
            agree: () => DeleteCoupon(item?._id),
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
          onChange={() => ChangeActivity(item?._id, !active)}
        />
      </div>
      <div>
        {activeLanguage.specialID}:{" "}
        <span style={{ color: theme.primaryText, fontWeight: 600 }}>
          {item?.specialId}
        </span>
      </div>
      <div>
        {activeLanguage.description}:{" "}
        <span style={{ color: theme.primaryText, fontWeight: 600 }}>
          {item?.description}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {activeLanguage.discount}:
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
          {item?.discount}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <h2 style={{ whiteSpace: "nowrap" }}>{activeLanguage.expireDate}:</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {editDate.active && editDate?.item === item?.specialId ? (
            <DatePickerWrapper
              theme={theme}
              style={{
                width: isMobile ? "80%" : "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: isMobile ? "column" : "row",
                marginLeft: "16px",
                border: `1px solid ${theme.line}`,
                borderRadius: "10px",
                padding: "0 4px",
              }}
            >
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                timeIntervals={60} // Show only hour options in the dropdown
                timeCaption="Time"
                dateFormat="MMMM d, yyyy"
              />
            </DatePickerWrapper>
          ) : (
            <span
              style={{
                color: theme.primaryText,
                marginLeft: "8px",
                fontWeight: 600,
              }}
            >
              {DefineDate(item?.expireDate)}
            </span>
          )}
          <div style={{ marginTop: "8px" }}>
            {editDate?.active ? (
              <MdDone
                size={24}
                color="green"
                style={{ cursor: "pointer" }}
                onClick={() => UpdateCouponDate(item?._id, selectedDate)}
              />
            ) : (
              <MdEdit
                onClick={() => {
                  setEditDate({
                    active: true,
                    item: item?.specialId,
                  });

                  // Parse item?.expireDate to ensure it's a Date object
                  const expireDate = new Date(item?.expireDate);

                  // Set the selectedDate using the full expireDate
                  setSelectedDate(expireDate);
                }}
                size={24}
                color={theme.primary}
                style={{ cursor: "pointer" }}
                className="icon"
              />
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "4px",
          color: item?.users?.length > 0 ? theme.primary : theme.primaryText,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            cursor: "pointer",
          }}
          onClick={
            openUsers === null
              ? () => setOpenUsers((prev: any) => (prev = index))
              : () => setOpenUsers(null)
          }
        >
          <People style={{ cursor: "pointer" }} className="icon" />
          {openUsers ? <MdArrowDropDown /> : <MdArrowDropUp />}
        </div>
      </div>
      {openUsers === index && (
        <div>
          <div style={{ marginTop: "8px" }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Input
                label={activeLanguage.search}
                warning={false}
                value={newUser}
                onChange={setNewUser}
                type="text"
              />
              {newUser?.length > 0 && (
                <MdClose
                  style={{ cursor: "pointer" }}
                  color={theme.primary}
                  size={14}
                  onClick={() => setNewUser("")}
                />
              )}
            </div>
            {newUser?.length > 0 && (
              <div
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  padding: "16px",
                  border: `1px solid ${theme.primary}`,
                  borderRadius: "15px",
                  marginTop: "8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  overflowY: "auto",
                }}
              >
                {usersList?.length < 1 && (
                  <div
                    onClick={() =>
                      AddUserInCoupon(item?._id, {
                        firstName: newUser,
                        lastName: newUser,
                        email: newUser,
                      })
                    }
                    className="icon"
                    style={{
                      color: theme.primaryText,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      borderBottom: `1px solid ${theme.lineDark}`,
                      paddingBottom: "8px",
                    }}
                  >
                    <div>{"Unknown"}</div>
                    <div
                      style={{
                        color: item?.users?.some(
                          (i: any) => i.email === newUser
                        )
                          ? theme.primaryText
                          : theme.secondaryText,
                      }}
                    >
                      {activeLanguage.email}: {newUser}
                    </div>
                  </div>
                )}
                {usersList?.length > 0 &&
                  usersList?.map((it: any, indx: number) => {
                    return (
                      <div
                        onClick={() => AddUserInCoupon(item?._id, it)}
                        className="icon"
                        key={indx}
                        style={{
                          color: theme.primaryText,
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          borderBottom: `1px solid ${theme.lineDark}`,
                          paddingBottom: "8px",
                        }}
                      >
                        <div>{it?.firstName + " " + it?.lastName}</div>
                        <div
                          style={{
                            color: item?.users?.some(
                              (i: any) => i.email === it.email
                            )
                              ? theme.primaryText
                              : theme.secondaryText,
                          }}
                        >
                          {activeLanguage.email}: {it?.email}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
          <div style={{ marginTop: "16px" }}>
            {item?.users?.length > 0 ? (
              item?.users?.map((i: any, x: number) => {
                return (
                  <div
                    key={x}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: isMobile ? "0 8px" : "0 24px",
                      marginBottom: "4px",
                      color: theme.primaryText,
                      fontSize: isMobile ? "14px" : "16px",
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>
                      {x + 1}: {i.firstName + " - " + i.email}
                    </div>
                    <div>
                      <MdDelete
                        size={24}
                        className="icon"
                        style={{ cursor: "pointer" }}
                        color={theme.primary}
                        onClick={() => DeleteUserFromCoupon(item?._id, i)}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  color: theme.secondaryText,
                  padding: "24px",
                  fontSize: "14px",
                }}
              >
                {activeLanguage.notFound}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper,
  .react-datepicker__input-container,
  input {
    width: 100%;
    padding: 8px;
    border-radius: 10px;
    color: ${({ theme }) => theme.primary};
    font-weight: 500;
  }
`;
