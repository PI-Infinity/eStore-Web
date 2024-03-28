import { useAppContext } from "../context/app";
import { useCurrentUserContext } from "../context/currentUser";
import { useTheme } from "../context/theme";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdDoneAll } from "react-icons/md";

export default function MessageItem({
  item,
  index,
  length,
  setOpenedImage,
}: any) {
  const { theme } = useTheme();

  const { socket } = useCurrentUserContext();

  const { backendUrl } = useAppContext();

  const [seen, setSeen] = useState(false);

  useEffect(() => {
    setSeen(item.seen);
  }, []);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("seenMessage", (msg: any) => {
        if (msg) {
          setSeen(true);
        }
      });
    }
  }, [socket]);

  // read message
  useEffect(() => {
    const SeenMessage = async () => {
      if (index === length - 1) {
        console.log(item);
      }
      if (
        index === length - 1 &&
        !item.seen &&
        item.sender.role === "consultant"
      ) {
        console.log("seen consultant message");
        await axios.patch(
          backendUrl + "/api/v1/chats/" + item.room + "?role=user",
          {
            status: "read",
          }
        );
        socket.current.emit("seenMessage", {
          message: item,
        });
      }
    };
    SeenMessage();
  }, [item]);

  return (
    <div
      style={{
        width: "100%",
        padding: "8px 16px",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        gap: "8px",
        alignItems: item?.sender?.role === "user" ? "flex-end" : "flex-start",
      }}
    >
      {item.file?.length > 0 &&
        item.file?.map((i: any, x: number) => {
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
                style={{
                  objectFit: "cover",
                  cursor: "pointer",
                }} // Ensures the image covers the container
                sizes="(max-width: 768px) 1000%, (max-width: 1200px) 100%, 100%"
              />
            </div>
          );
        })}
      <div
        style={{
          background:
            item?.sender?.role === "user" ? "rgba(255,255,255,0)" : theme.line,
          border: `1px solid ${
            item?.sender?.role === "user" ? theme.line : "rgba(255,255,255,0)"
          }`,
          color: theme.primaryText,
          borderRadius: "50px",
          padding: "6px 14px",
          fontSize: "14px",
          fontWeight: "400",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          textWrap: "wrap",
          maxWidth: "100%",
        }}
      >
        {item?.sender?.role === "user" && (
          <div>
            <MdDoneAll color={seen ? theme.primary : theme.secondaryText} />
          </div>
        )}
        {item?.text}
      </div>
    </div>
  );
}
