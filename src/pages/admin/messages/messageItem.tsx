import { useAdminContext } from "../../../context/adminContext";
import { useAppContext } from "../../../context/app";
import { useCurrentUserContext } from "../../../context/currentUser";
import { useTheme } from "../../../context/theme";
import { storage } from "../../../firebase";
import axios from "axios";
import { deleteObject, listAll, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { MdClose, MdDone, MdDoneAll, MdRemove } from "react-icons/md";
import styled from "styled-components";

export default function MessageItem({
  item,
  index,
  length,
  setRooms,
  setMessages,
}: any) {
  const { theme } = useTheme();

  const { socket } = useCurrentUserContext();

  const { backendUrl } = useAppContext();

  const [seen, setSeen] = useState(false);

  useEffect(() => {
    setSeen(item?.seen);
  }, []);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("seenMessage", (msg: any) => {
        if (msg) {
          setSeen(true);
          setRooms((prev: any) =>
            prev.map((i: any) => {
              if (i.room?.toLowerCase() === item?.room?.toLowerCase()) {
                return {
                  ...i,
                  status: { user: "read", consultant: "read" },
                };
              } else {
                return i;
              }
            })
          );
        }
      });
    }
  }, [socket]);

  // read message
  useEffect(() => {
    const SeenMessage = async () => {
      if (index === length - 1 && !item?.seen && item?.sender.role === "user") {
        await axios.patch(
          backendUrl + "/api/v1/chats/" + item?.room + "?role=consultant",
          {
            status: "read",
          }
        );
        socket.current.emit("seenMessage", {
          message: item,
        });
        setRooms((prev: any) =>
          prev.map((i: any) => {
            if (i.room?.toLowerCase() === item?.room?.toLowerCase()) {
              return {
                ...i,
                status: { user: "read", consultant: "read" },
              };
            } else {
              return i;
            }
          })
        );
      }
    };
    SeenMessage();
  }, [item]);

  /**
   * Delete message
   */
  const [confirmDelete, setConfirmDelete] = useState(false);

  const DeleteMessage = async (message: any) => {
    try {
      setMessages((prev: any) =>
        prev.filter((i: any) => i.messageId !== message?.messageId)
      );
      setConfirmDelete(false);
      await axios.delete(backendUrl + "/api/v1/messages/" + message?.messageId);

      if (message?.file?.length > 1) {
        let fileRef = ref(storage, `chats/${message?.file[0].folderId}/`);

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
      } else if (message?.file?.length === 1) {
        let fileRef = ref(
          storage,
          `chats/${message?.file[0].folderId}/${message?.file[0].itemId}`
        );
        deleteObject(fileRef).then(() => {
          console.log("item deleted");
        });
      }
    } catch (error: any) {
      console.log("Delete message error");
      console.log(error.response.data.message);
    }
  };

  // admin context
  const { setOpenedImage } = useAdminContext();

  return (
    <Container
      style={{
        boxSizing: "border-box",
        width: "100%",
        padding: "8px 16px",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: "8px",
        alignItems:
          item?.sender?.role === "consultant" ? "flex-end" : "flex-start",
      }}
    >
      {item?.file?.length > 0 &&
        item?.file?.map((i: any, x: number) => {
          return (
            <div
              key={x}
              style={{
                height: "200px",
                width: "200px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                position: "relative",
                borderRadius: "8px",
              }}
            >
              <img
                onClick={() => setOpenedImage(i.url)}
                src={i.url}
                alt="Preview"
                width={"100%"}
                style={{
                  aspectRatio: 1,
                  objectFit: "cover",
                  cursor: "pointer",
                }} // Ensures the image covers the container
              />
            </div>
          );
        })}
      <div
        style={{
          background:
            item?.sender?.role === "consultant"
              ? "rgba(255,255,255,0)"
              : theme.line,
          border: `1px solid ${
            item?.sender?.role === "consultant"
              ? theme.line
              : "rgba(255,255,255,0)"
          }`,
          color: theme.primaryText,
          borderRadius: "50px",
          padding: item?.text.length > 0 ? "6px 14px" : "0",
          fontSize: "14px",
          fontWeight: "400",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          textWrap: "wrap",
          maxWidth: "100%",
          cursor: "pointer",
        }}
        onClick={() => setConfirmDelete(true)}
      >
        {item?.sender?.role === "consultant" && (
          <div>
            <MdDoneAll color={seen ? theme.primary : theme.secondaryText} />
          </div>
        )}
        {item?.text}
        {confirmDelete && (
          <div
            onClick={(e) => e.preventDefault()}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <MdClose
              size={14}
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(false);
              }}
              color={theme.secondaryText}
              className="hover"
            />{" "}
            <MdDone
              size={14}
              onClick={(e) => {
                e.stopPropagation();
                DeleteMessage(item);
              }}
              color={"red"}
              className="hover"
            />
          </div>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  .hover {
    &:hover {
      filter: brightness(0.9);
    }
  }
`;
