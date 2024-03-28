import { useAdminContext } from "../../../context/adminContext";
import { useAppContext } from "../../../context/app";
import { useCurrentUserContext } from "../../../context/currentUser";
import { useTheme } from "../../../context/theme";
import { storage } from "../../../firebase";
import { Send } from "@mui/icons-material";
import IMG from "@mui/icons-material/Image";
import { Badge } from "@mui/material";
import axios from "axios";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdDelete, MdList } from "react-icons/md";
import { BarLoader } from "react-spinners";
import styled from "styled-components";
import { v4 } from "uuid";
import MessageItem from "./messageItem";
import { useLocation } from "react-router-dom";

export default function Room({
  activeRoom,
  setRooms,
  setRerenderRooms,
  setOpenChats,
}: any) {
  // theme
  const { theme } = useTheme();

  // current user
  const { socket } = useCurrentUserContext();

  // app context
  const { backendUrl, setAlert, activeLanguage, isMobile } = useAppContext();

  // admin context
  const { setRerenderUnreads } = useAdminContext();

  // scroll to bottom when send message
  const [scrollToBottom, setScrollToBottom] = useState(false);

  // automatically scrolling bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<MessagesProps[]>([]);

  useEffect(() => {
    // Directly set the scrollTop to the scrollHeight to scroll to the bottom
    const messagesContainer = messagesEndRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: "smooth", // Add smooth scrolling effect
      });
    }
  }, [scrollToBottom, loading, activeRoom]);

  /**
   * Getting Messages
   */
  interface MessagesProps {
    room: string;
  }
  const [page, setPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);

  const GetMessages = async (emailId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        backendUrl + "/api/v1/messages/" + emailId.toLowerCase()
      );
      setMessages(response.data.data.messages);
      setTotalMessages(response.data.length);
      setPage(1);
      setTimeout(() => {
        setLoading(false);
        setRerenderUnreads((prev: any) => !prev);
        setScrollToBottom((prev: any) => !prev);
      }, 100);
    } catch (error: any) {
      console.log(error.response);
      console.log("getting messages error");
    }
  };

  useEffect(() => {
    if (activeRoom) {
      GetMessages(activeRoom);
    }
  }, [activeRoom]);

  // add messages on top button click
  const AddMessages = async (emailId: string) => {
    // Use a temporary variable for the new page number
    const newPage = page + 1;

    try {
      const response = await axios.get(
        backendUrl + "/api/v1/messages/" + emailId + "?page=" + newPage
      );

      // Check if new orders were fetched
      if (response.data.data.messages.length > 0) {
        setTotalMessages(response.data.length);
        setMessages((prevMessages: any) => {
          const newMessages: any = response.data.data.messages;

          const existingIds = new Set(prevMessages.map((msg: any) => msg._id));

          // Filtering out duplicates from the newly fetched orders
          const filteredNewMessages = newMessages.filter(
            (msg: any) => !existingIds.has(msg._id)
          );

          // If there are new orders, concatenate them with previous orders
          // Also, update the page state and set loading more to false
          if (filteredNewMessages.length > 0) {
            setPage(newPage);
            return [...filteredNewMessages, ...prevMessages];
          } else {
            // If there are no new orders, just return the previous orders
            return prevMessages;
          }
        });
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error.response?.data?.message);
    }
  };

  // Using a ref to store the activeRoom state to access in the socket event listener
  const activeRoomRef = useRef(activeRoom);

  // Update the ref on each render so it always has the latest activeRoom value
  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

  // Fetch messages whenever the activeRoom changes
  useEffect(() => {
    if (activeRoom) {
      GetMessages(activeRoom);
    }
  }, [activeRoom]);

  // Setup the socket listener for incoming messages
  useEffect(() => {
    const handleMessage = (newMessage: any) => {
      if (
        newMessage.room?.toLowerCase() === activeRoomRef.current?.toLowerCase()
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setScrollToBottom((prev: any) => !prev);
      }
      setRerenderRooms((prev: boolean) => !prev);
      setRerenderUnreads((prev: any) => !prev);
    };

    if (socket.current) {
      socket.current.on("getMessage", handleMessage);

      // Cleanup on component unmount or when the socket changes
      return () => {
        socket.current.off("getMessage", handleMessage);
      };
    }
  }, [socket]);

  /**
   * Sending message
   */
  // chat input
  const [text, setText] = useState("");

  const [loadingUpload, setLoadingUpload] = useState(false);

  const location = useLocation();
  const SendMessage = async (txt: string) => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Send Message is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    const folderId = activeRoom;
    const addFileInCloud = async (file: any, x: number) => {
      const fileId = v4();
      const fileRef = ref(storage, `chats/${folderId}/${fileId}`);
      setLoadingUpload(true);
      // Initialize the upload process

      const uploadTask = uploadBytesResumable(fileRef, file?.blob);

      // Return a promise that resolves with the download URL upon successful upload
      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Optional: Handle upload progress
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {
            // Handle unsuccessful uploads
            console.error(error);
            reject(error);
          },
          async () => {
            // Handle successful uploads on complete
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({
                url: downloadURL,
                type: file.blob.type,
                width: file.width,
                height: file.height,
                folderId: folderId,
                itemId: fileId,
              });
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    };
    let urls: any;
    if (files.length > 0) {
      urls = await Promise.all(
        files.map((file, index) => addFileInCloud(file, index))
      );
    } else {
      urls = [];
    }
    const newMessage = {
      messageId: v4(),
      room: activeRoom.toLowerCase(),
      sender: { role: "consultant", uniqueId: "eStoreUniqueId" },
      reciever: { role: "User", email: activeRoom.toLowerCase() },
      text: txt,
      file: urls,
      seen: false,
    };
    if (txt?.length > 0 || urls?.length > 0) {
      try {
        setRooms((prev: any) =>
          prev.map((i: any) => {
            if (i.room?.toLowerCase() === newMessage.room?.toLowerCase()) {
              return {
                ...i,
                status: { user: "unread", consultant: "read" },
                lastMessage: { sender: "consultant", text: txt },
              };
            } else {
              return i;
            }
          })
        );
        await axios.post(backendUrl + "/api/v1/messages", {
          newMessage,
        });
        setMessages((prev: any) => [...prev, newMessage]);
        setScrollToBottom((prev: boolean) => !prev);
        socket.current.emit("sendMessage", newMessage);
        setText("");
        setFiles([]);
        setLoadingUpload(false);
      } catch (error: any) {
        console.log(error.response.data.message);
        console.log("send message error");
      }
    }
  };

  /**
   *
   * file upload
   */
  interface filesProps {}
  const [files, setFiles] = useState<filesProps[]>([]);

  interface ProcessedImage {
    blob: Blob; // Or File, since File inherits from Blob and includes name, lastModified, etc.
    height: number;
    width: number;
    src?: string;
    cover?: boolean;
  }

  // If `files` can contain both images and videos, you might define a union type
  type ProcessedFile = ProcessedImage;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return; // Early return if no files selected

    const processedFiles: ProcessedFile[] = [];

    if (uploadedFiles.length + files.length > 4) {
      setAlert({
        active: true,
        text: activeLanguage.maxImagesLimitReached,
        type: "warning",
      });
      return;
    }

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];

      if (file.type.startsWith("image/")) {
        // Assuming `resizeImage` returns a Promise<ProcessedImage>
        const resizedFile: ProcessedImage = await resizeImage(
          file,
          maxWidth,
          quality
        );
        processedFiles.push(resizedFile);
      }
    }

    setFiles((prevFiles: any) => {
      const clonedProcessedFiles = processedFiles.map((file) => ({ ...file }));

      // Check if any of the previous files already has a cover
      const alreadyHasCover = prevFiles.some((file: any) => file.cover);

      // If there are processed files and none of the previous files has a cover, set the first processed file as cover
      if (clonedProcessedFiles.length > 0 && !alreadyHasCover) {
        clonedProcessedFiles[0].cover = true;
      }

      // Combine previous files with the updated processedFiles
      return [...prevFiles, ...clonedProcessedFiles];
    });
  };

  // Example usage:
  const maxWidth = 512;
  const quality = 0.8;

  interface ProcessedImage {
    blob: Blob; // Adjusting to accept null because toBlob's callback might provide null
    height: number;
    width: number;
    src?: string; // Optional since it's not used in the resizing process
  }

  const resizeImage = (
    file: File,
    maxWidth: number,
    quality: number
  ): Promise<ProcessedImage> =>
    new Promise((resolve, reject) => {
      // Adding reject to handle potential errors
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: ProgressEvent<FileReader>) => {
        // Ensure e.target.result is not null
        if (!e.target || typeof e.target.result !== "string") {
          reject(new Error("Failed to read file."));
          return;
        }

        const image = new Image();
        image.src = e.target.result;
        image.onload = () => {
          const scale = maxWidth / image.width;
          const width = maxWidth;
          const height = image.height * scale;

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw the image on the canvas
          ctx.drawImage(image, 0, 0, width, height);

          // Convert the canvas content to a blob with the specified quality
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to convert canvas to blob"));
                return;
              }
              // Create an object that includes the Blob, height, and width

              const resizedFile: ProcessedImage = {
                blob,
                height,
                width,
              };
              resolve(resizedFile);
            },
            file.type,
            quality
          );
        };
        image.onerror = () => reject(new Error("Image loading error"));
      };
      reader.onerror = () => reject(new Error("FileReader error"));
    });

  return (
    <Container style={{ color: theme.primaryText }}>
      <ChatContainer
        style={{
          background: theme.background,
          border: `2px solid ${theme.primaryText}`,
        }}
      >
        <Header style={{ border: `1px solid ${theme.line}` }}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <FaUser size={24} />
          </StyledBadge>

          <h2
            style={{
              fontSize: "16px",
              fontWeight: "500",
              maxWidth: "400px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {activeRoom}
          </h2>
          {isMobile && (
            <MdList
              onClick={() => setOpenChats(true)}
              color={theme.primaryText}
              size={24}
              style={{ marginLeft: "auto", marginRight: "16px" }}
            />
          )}
        </Header>

        <div
          style={{
            height: "100%",
            width: "100%",
            position: "relative",
          }}
        >
          {loading ? (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "45%",
                zIndex: 999999,
              }}
            >
              <BarLoader color={theme.primary} height={6} />
            </div>
          ) : (
            <Messages
              ref={messagesEndRef}
              // style={{ bottom: files?.length > 0 ? "50px" : "0" }}
            >
              {totalMessages > messages?.length && (
                <div
                  onClick={() => AddMessages(messages[0]?.room)}
                  style={{
                    fontSize: "12px",
                    color: theme.primary,
                    textAlign: "center",
                    marginTop: "8px",
                    cursor: "pointer",
                  }}
                  className="icon"
                >
                  {activeLanguage.loadMore}
                </div>
              )}
              {messages?.map((item: any, index: number) => {
                return (
                  <MessageItem
                    key={index}
                    index={index}
                    item={item}
                    length={messages?.length}
                    setRooms={setRooms}
                    setMessages={setMessages}
                    setScrollToBottom={setScrollToBottom}
                  />
                );
              })}
            </Messages>
          )}
        </div>
        {files?.length > 0 && (
          <div
            style={{
              height: "72px",
              overflow: "hidden",
              width: "calc(100% - 16px)",
              margin: "8px",
              borderRadius: "8px",
              padding: "8px",
              background: theme.line,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {files?.map((i: any, x: number) => {
              return (
                <div key={x} style={{ display: "flex", gap: "4px" }}>
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "5px",
                      position: "relative",
                    }}
                  >
                    <img
                      src={URL.createObjectURL(i.blob)}
                      alt="Preview"
                      style={{
                        objectFit: "cover",
                        cursor: "pointer",
                        aspectRatio: 1,
                      }} // Ensures the image covers the container
                      width="100%"
                    />
                  </div>
                  <MdDelete
                    className="hover"
                    onClick={(e) => {
                      e.stopPropagation();

                      setFiles((prev) => {
                        // Filter out the item
                        const newFiles = prev.filter((it) => it !== i);

                        return newFiles;
                      });
                    }}
                    style={{
                      zIndex: 10000,
                      color: "red",
                      fontSize: "16px",
                      cursor: "pointer",
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
        <InputContainer style={{ border: `1px solid ${theme.line}` }}>
          <textarea
            placeholder={activeLanguage.typeHere}
            value={text}
            onChange={(e) => setText(e.target.value)}
            //   type="text"
            className="input"
            rows={3}
            style={{
              fontSize: "16px",
            }}
            //   onKeyDown={(e) => {
            //     if (e.key === "Enter") {
            //       // Call your function here
            //       SendMessage(text); // Replace this with your function call
            //     }
            //   }}
          />
          <div
            style={{
              width: "15%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              multiple
              onChange={handleFileUpload}
              accept="image/*"
            />
            <label
              htmlFor="fileInput"
              style={{ cursor: "pointer" }}
              className="hover"
            >
              <IMG sx={{ fontSize: "24px" }} className="icon" />
            </label>
            {loadingUpload ? (
              <BarLoader height={6} width={24} color={theme.primary} />
            ) : (
              <Send
                onClick={() => SendMessage(text)}
                sx={{
                  fontSize: "24px",
                  color: theme.primary,
                }}
                className="icon"
              />
            )}
          </div>
        </InputContainer>
      </ChatContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 60%;
  z-index: 99999;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
    padding: 8px;
    height: 100%;
  }

  .icon {
    cursor: pointer;
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const ChatContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  box-sizing: border-box;
`;

const Header = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding-left: 16px;
  box-sizing: border-box;
`;

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",

    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const Messages = styled.div`
  max-height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 8px 0;
  overflow-y: auto;
  position: absolute;
  left: 0;
  bottom: 0;
`;

const InputContainer = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  padding: 8px 0;

  @media (max-width: 768px) {
    padding: 8px;
    padding-right: 16px;
  }

  .input {
    font-size: 14px;
    background: none;
    height: 100%;
    width: 100%;
    padding-left: 24px;
    @media (max-width: 768px) {
      padding-left: 8px;
    }
    border: none;
    resize: none;
    padding-top: 12px;

    &:focus {
      outline: none;
    }
  }
`;
