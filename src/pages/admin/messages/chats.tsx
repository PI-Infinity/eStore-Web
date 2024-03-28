import Button from "../../../components/button";
import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";
import { storage } from "../../../firebase";
import axios from "axios";
import { deleteObject, listAll, ref } from "firebase/storage";
import React, { useState } from "react";
import { MdDelete, MdDoneAll, MdRemove } from "react-icons/md";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

export default function Chats({
  rooms,
  activeRoom,
  setActiveRoom,
  setRooms,
  containerRef,
}: any) {
  // theme context
  const { theme } = useTheme();

  // app context
  const { backendUrl, setConfirm, setAlert, activeLanguage, isMobile } =
    useAppContext();

  const location = useLocation();
  // delete chat
  const DeleteChat = async (roomId: string) => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Delete chat is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    try {
      setRooms((prev: any) =>
        prev.filter((i: any) => i.room?.toLowerCase() !== roomId)
      );
      let anotherRoom = rooms.find((i: any) => i.room.toLowerCase() !== roomId);
      await axios.delete(backendUrl + "/api/v1/chats/" + roomId);
      let fileRef = ref(storage, `chats/${roomId}/`);
      listAll(fileRef)
        .then((res) => {
          res.items.forEach((itemRef) => {
            deleteObject(itemRef).then(() => {
              console.log("item deleted");
            });
          });
        })
        .catch((error) => {
          console.log("error : " + error);
        });
      setActiveRoom(anotherRoom?.room || null);
      setConfirm({
        active: false,
        text: "",
        agree: null,
        close: null,
      });
      setAlert({
        active: true,
        type: "success",
        text: activeLanguage.chatDeletedSuccessfully,
      });
    } catch (error: any) {
      console.log(error);
      console.log("chat delete rror");
    }
  };

  return (
    <Container
      ref={containerRef}
      style={{ border: isMobile ? " none" : `1px solid ${theme.line}` }}
    >
      <h1
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: theme.primaryText,
          marginBottom: "16px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {activeLanguage.chats}
      </h1>

      {rooms?.length < 1 ? (
        <div style={{ margin: "4px", color: theme.secondaryText }}>
          {activeLanguage.chats} {activeLanguage.notFound}
        </div>
      ) : (
        rooms?.map((item: any, index: number) => {
          return (
            <div
              onClick={() => setActiveRoom(item.room)}
              key={index}
              style={{
                border: `1px solid ${
                  activeRoom === item.room ? theme.primary : theme.lineDark
                }`,
                borderRadius: "10px",
                padding: "16px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                position: "relative",
              }}
            >
              {item?.status?.consultant === "unread" && (
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "48px",
                    height: "16px",
                    width: "16px",
                    borderRadius: "50px",
                    background: theme.primary,
                  }}
                />
              )}

              <div
                style={{ position: "absolute", top: "16px", right: "16px" }}
                onClick={() =>
                  setConfirm({
                    active: true,
                    text: activeLanguage.askDeleteChat,
                    agree: () => DeleteChat(item.room.toLowerCase()),
                    close: () => {
                      setConfirm({
                        active: false,
                        text: "",
                        agree: null,
                        close: null,
                      });
                    },
                  })
                }
              >
                <MdDelete color={theme.primary} size={18} />
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: theme.secondaryText,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {activeLanguage.room}:{" "}
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    maxWidth: "300px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: theme.primaryText,
                  }}
                >
                  {item.room}
                </p>
              </div>
              <div style={{ fontSize: "14px", color: theme.secondaryText }}>
                {activeLanguage.userName}:{" "}
                <span
                  style={{
                    color: theme.primaryText,
                  }}
                >
                  {item?.user ? item.user : "UnAuthorized User"}
                </span>
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: theme.secondaryText,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {activeLanguage.status}:{" "}
                <div>
                  <MdDoneAll
                    color={
                      item.status?.user === "unread" ||
                      item.status?.consultant === "unread"
                        ? theme.primaryText
                        : theme.primary
                    }
                  />
                </div>
              </div>
              <div
                style={{
                  fontSize: "14px",
                  color: theme.secondaryText,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {activeLanguage.lastMessage}:{" "}
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    maxWidth: "300px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: !item?.seen ? theme.primary : theme.primaryText,
                  }}
                >
                  {item.lastMessage?.text?.length > 0
                    ? item.lastMessage?.text
                    : "—"}
                </p>
              </div>
            </div>
          );
        })
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  border-radius: 15px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  position: relative;
  max-height: 80vh;

  @media (max-width: 768px) {
    padding: 8px;
  }
`;
