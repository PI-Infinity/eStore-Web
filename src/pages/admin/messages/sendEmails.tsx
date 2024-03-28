import Button from "../../../components/button";
import { Input } from "../../../components/input";
import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";
import { SearchOffRounded, SearchOutlined } from "@mui/icons-material";
import { Checkbox, FormControlLabel } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import styled from "styled-components";

export default function SendEmails({ setOpenSendEmails }: any) {
  const { theme } = useTheme();
  const { activeLanguage, setAlert, backendUrl, isMobile } = useAppContext();

  // message fields
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  // users
  const [searchInput, setSearchInput] = useState("");
  const [allUsers, setAllUsers] = useState(false);

  interface UserProps {}
  const [activeUsers, setActiveUsers] = useState<UserProps[]>([]);

  useEffect(() => {
    if (allUsers) {
      setActiveUsers([]);
    }
  }, [allUsers]);

  const [usersList, setUsersList] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);

  // getting users
  useEffect(() => {
    // Flag to track if the current fetch request should update the state
    let shouldUpdateState = true;

    const GetUsers = async () => {
      if (searchInput.trim() === "") {
        setUsersList([]);
        return;
      }

      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/users?search=${searchInput}`
        );

        // Only update state if shouldUpdateState is still true
        if (shouldUpdateState) {
          setUsersList(
            response.data.data.users.length > 0 ? response.data.data.users : []
          );
          setTotalUsers(response.data.totalUsers);
          setPage(1);
        }
      } catch (error) {
        console.log(error);
      }
    };

    GetUsers();

    // Cleanup function to set shouldUpdateState to false when the effect re-runs or the component unmounts
    return () => {
      shouldUpdateState = false;
    };
  }, [searchInput]);

  // add users list
  const AddUsers = async () => {
    const newPage = page + 1;

    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/users?search=${searchInput}`
      );
      setUsersList((prevUsers: any) => {
        const existingIds = new Set(prevUsers.map((user: any) => user._id));
        const filteredNewProducts = response.data.data.users.filter(
          (user: any) => !existingIds.has(user._id)
        );

        if (filteredNewProducts.length > 0) {
          return [...prevUsers, ...filteredNewProducts];
        } else {
          return prevUsers;
        }
      });
      setPage(newPage);
    } catch (error) {
      console.log(error);
    }
  };

  // this useffect runs addproducts function when scroll is bottom
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Ensure containerRef.current is not null before accessing its properties
      if (containerRef.current) {
        const { bottom } = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if the bottom of the component is near the bottom of the window viewport
        if (bottom <= windowHeight + 100) {
          // 90px threshold, adjust as needed
          if (totalUsers > usersList.length) {
            AddUsers();
          }
        }
      }
    };

    // Register the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, [usersList.length, totalUsers]);

  /**
   * Sending emails
   */
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const SendingEmails = async () => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Send emails is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    if (!confirm) {
      return setAlert({
        active: true,
        text: activeLanguage.pleaseConfirm,
        type: "warning",
      });
    }
    try {
      setLoading(true);
      const response = await axios.post(backendUrl + "/api/v1/sendemails", {
        list: activeUsers,
        allUsers,
        title,
        message,
      });
      if (response.data.status === "success") {
        setLoading(false);
        setAlert({
          active: true,
          text: activeLanguage.messageSentSuccessfully,
          type: "success",
        });
      }
    } catch (error: any) {
      setAlert({
        active: true,
        text: error.response.data.message,
        type: "error",
      });
      console.log(error.response.data.message);
      console.log("Send emails error");
      setLoading(false);
    }
  };
  return (
    <Container style={{ border: `1px solid ${theme.line}` }}>
      <MdClose
        onClick={() => setOpenSendEmails(false)}
        color={theme.primary}
        size={24}
        className="hover"
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          zIndex: 9999999,
          cursor: "pointer",
        }}
      />
      <div style={{ margin: isMobile ? "8px" : "24px" }}>
        <div
          style={{
            width: isMobile ? "100%" : "50%",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {!allUsers && (
            <>
              <SearchOutlined
                sx={{ fontSize: "34px", color: theme.secondaryText }}
              />
              <Input
                label={activeLanguage.searchUser}
                type="text"
                onChange={setSearchInput}
                warning={false}
                value={searchInput}
              />
              {searchInput?.length > 0 && (
                <div>
                  <MdClose
                    size={16}
                    color={theme.primary}
                    onClick={() => setSearchInput("")}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              )}
            </>
          )}
          <div style={{ width: "100%" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={allUsers} // Determine if the item is selected
                  onChange={() => {
                    setAllUsers((prev: boolean) => !prev);
                  }}
                  name={activeLanguage.all}
                  sx={{ color: theme.secondaryText }}
                />
              }
              label={
                <span style={{ color: theme.primaryText }}>
                  {activeLanguage.all + " " + activeLanguage.users}
                </span>
              }
            />
          </div>
        </div>
        {usersList?.filter(
          (it: any) => !activeUsers.some((i: any) => i.email === it.email)
        )?.length > 0 && (
          <div
            style={{
              width: isMobile ? "100%" : "50%",
              maxHeight: "200px",
              padding: "16px",
              border: `1px solid ${theme.primary}`,
              borderRadius: "15px",
              marginTop: "8px",
              marginLeft: isMobile ? "0" : "24px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              overflowY: "auto",
            }}
          >
            {usersList
              ?.filter(
                (it: any) => !activeUsers.some((i: any) => i.email === it.email)
              )
              ?.map((it: any, indx: number) => {
                return (
                  <div
                    onClick={() => {
                      setActiveUsers((prev: any) => [...prev, it]);
                      setUsersList([]);
                      setSearchInput("");
                    }}
                    className="icon"
                    key={indx}
                    style={{
                      color: theme.primaryText,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      fontWeight: 600,
                      fontSize: "14px",
                      borderBottom: `1px solid ${theme.lineDark}`,
                      paddingBottom: "3px",
                    }}
                  >
                    <div style={{}}>{it?.firstName + " " + it?.lastName}</div>
                    <div
                      style={{ color: theme.secondaryText, fontWeight: 500 }}
                    >
                      {activeLanguage.email}: {it?.email}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        {activeUsers?.length > 0 && (
          <div
            style={{
              padding: isMobile ? "8px" : "24px",
              paddingBottom: "0",
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            {activeUsers?.map((item: any, index: number) => {
              return (
                <div
                  style={{
                    padding: "4px 16px",
                    borderRadius: "50px",
                    background: theme.line,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  key={index}
                >
                  {item?.email}
                  <div
                    onClick={() =>
                      setActiveUsers((prev: any) =>
                        prev.filter((i: any) => i.email !== item.email)
                      )
                    }
                  >
                    <MdClose
                      size={18}
                      color="red"
                      className="hover"
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div
          style={{
            display: "flex",
            padding: isMobile ? "8px" : "24px",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <Input
            label={activeLanguage.title}
            type="text"
            onChange={setTitle}
            warning={false}
            value={title}
          />
          <textarea
            placeholder={activeLanguage.typeHere}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={16}
            style={{
              background: theme.lightBackground,
              border: `1px solid ${theme.line}`,
              borderRadius: "15px",
              padding: "16px",
              height: "300px",
              color: theme.primaryText,
              fontSize: "16px",
            }}
          />
          <div style={{ width: "100%" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={confirm} // Determine if the item is selected
                  onChange={() => setConfirm((prev: boolean) => !prev)}
                  name={activeLanguage.confirm}
                  sx={{ color: theme.secondaryText }}
                />
              }
              label={
                <span style={{ color: theme.primaryText }}>
                  {activeLanguage.confirm}
                </span>
              }
            />
          </div>
          <Button
            background={theme.primary}
            color={theme.lightBackground}
            onClick={SendingEmails}
            title={
              loading ? (
                <BounceLoader size={24} color={theme.lightBackground} />
              ) : (
                activeLanguage.send
              )
            }
          />
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  z-index: 999999;
  backdrop-filter: blur(100px);
  webkit-backdrop-filter: blur(100px);
  overflow-y: auto;

  .hover {
    &:hover {
      filter: brightness(0.9);
    }
  }
`;
