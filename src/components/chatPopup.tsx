import { useAppContext } from "../context/app";
import { useCurrentUserContext } from "../context/currentUser";
import { useTheme } from "../context/theme";
import { Send } from "@mui/icons-material";
import IMG from "@mui/icons-material/Image";
import { Avatar, Badge } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BsChatDotsFill } from "react-icons/bs";
import { MdArrowDropDown, MdDelete } from "react-icons/md";
import { BarLoader } from "react-spinners";
import styled, { keyframes } from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { Input } from "./input";
import MessageItem from "./messageItem";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
import ConsultantCover from "../assets/consultant.png";
import { Link, Navigate, useNavigate } from "react-router-dom";

export default function ChatPopup() {
  // theme
  const { theme } = useTheme();

  const navigate = useNavigate();

  // current user
  const { currentUser, socket } = useCurrentUserContext();

  // app context
  const {
    backendUrl,
    storeInfo,
    activeLanguage,
    isMobile,
    setAlert,
    setPageLoading,
  } = useAppContext();

  // if not current user enter email
  const [email, setEmail] = useState("");
  const [chatHide, setChatHide] = useState(true);

  // open chat
  const [open, setOpen] = useState(false);
  // add user in socket
  const AddUserInSocket = () => {
    socket.current.emit("addUser", email.toLowerCase());
  };

  useEffect(() => {
    if (currentUser) {
      setChatHide(false);
    } else {
      setChatHide(true);
    }
  }, [currentUser]);

  /**
   * Getting Messages
   */
  interface MessagesProps {
    room: string;
    seen: boolean;
  }
  const [messages, setMessages] = useState<MessagesProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);

  const GetMessages = async (emailId: string) => {
    try {
      setLoading(true);
      if (!currentUser) {
        AddUserInSocket();
        setChatHide(false);
        await axios.post(backendUrl + "/api/v1/chats", { room: emailId });
      }
      const response = await axios.get(
        backendUrl + "/api/v1/messages/" + emailId
      );
      setMessages(response.data.data.messages);
      setTotalMessages(response.data.length);

      setPage(1);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error: any) {
      console.log("getting messages error");
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    if (currentUser && !currentUser?.admin.active) {
      GetMessages(currentUser?.email);
    }
  }, [currentUser]);

  // add messages on button press to top
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

  // seen messages

  const [unread, setUnread] = useState(false);

  // getting real time messages
  useEffect(() => {
    if (socket.current) {
      socket.current.on("getMessage", (newMessage: any) => {
        const Adding = async () => {
          setMessages((prev) => [...prev, newMessage]);
          setUnread(true);
        };
        Adding();
      });
    }
  }, [storeInfo]);

  /**
   * Sending message
   */
  // chat input
  const [text, setText] = useState("");

  // scroll to bottom when send message
  const [scrollToBottom, setScrollToBottom] = useState(false);

  // automatically scrolling bottom

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Directly set the scrollTop to the scrollHeight to scroll to the bottom
    const messagesContainer = messagesEndRef.current;
    if (messagesContainer && open && !chatHide) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [scrollToBottom, loading, open]);

  const [loadingUpload, setLoadingUpload] = useState(false);

  const SendMessage = async (txt: string) => {
    const folderId = currentUser
      ? currentUser?.email?.toLowerCase()
      : email.toLowerCase();
    const addFileInCloud = async (file: any, x: number) => {
      const fileId = uuidv4();
      const fileRef = ref(storage, `chats/${folderId}/${fileId}`);
      setLoadingUpload(true);
      // Initialize the upload process

      const uploadTask = uploadBytesResumable(fileRef, file?.blob);

      // Return a promise that resolves with the download URL upon successful upload
      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot: any) => {
            // Optional: Handle upload progress
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error: any) => {
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
      console.log(urls);
    } else {
      urls = [];
    }
    const newMessage = {
      messageId: uuidv4(),
      room: currentUser
        ? currentUser?.email?.toLowerCase()
        : email.toLowerCase(),
      sender: {
        role: "user",
        email: currentUser
          ? currentUser?.email?.toLowerCase()
          : email.toLowerCase(),
      },
      reciever: {
        role: "Consultant",
        uniqueId: "eStoreUniqueId",
      },
      text: txt,
      file: urls,
      seen: false,
    };
    if (txt?.length > 0 || files.length > 0) {
      try {
        await axios.post(backendUrl + "/api/v1/messages", {
          newMessage,
        });
        setMessages((prev: any) => [...prev, newMessage]);
        setScrollToBottom((prev: boolean) => !prev);
        setText("");
        setFiles([]);
        setLoadingUpload(false);
        socket.current.emit("sendMessage", newMessage);
      } catch (error: any) {
        console.log(error.response.data.message);
        console.log("send message error");
        setLoadingUpload(false);
      }
    }
  };

  // opened image
  const [openedImage, setOpenedImage] = useState("");

  /*
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
    <>
      {openedImage?.length > 0 && (
        <div
          onClick={() => setOpenedImage("")}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 999999,
            backdropFilter: "blur(100px)",
            WebkitBackdropFilter: "blur(100px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100vh",
            cursor: "pointer",
          }}
        >
          {
            <div
              style={{
                height: "512px",
                width: "512px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                position: "relative",
                borderRadius: "8px",
              }}
            >
              <img
                src={openedImage}
                alt="Preview"
                style={{
                  objectFit: "cover",
                  cursor: "pointer",
                }} // Ensures the image covers the container
                sizes="(max-width: 768px) 1000%, (max-width: 1200px) 100%, 100%"
              />
            </div>
          }
        </div>
      )}

      <Container
        style={{
          width: isMobile ? "100%" : "auto",
          color: theme.primaryText,
          bottom: isMobile ? "0" : "16px",
          right: isMobile ? "0" : "16px",
          justifyContent: "center",
        }}
      >
        {!open ? (
          <Badge
            color="primary"
            variant="dot"
            invisible={!unread}
            sx={{
              color: theme.primary,
              position: "fixed",
              right: isMobile ? "16px" : "32px",
              bottom: isMobile ? "24px" : "32px",
            }}
          >
            <BsChatDotsFill
              size={32}
              color={theme.primary}
              className="icon"
              onClick={() => setOpen(true)}
            />
          </Badge>
        ) : (
          <ChatContainer
            style={{
              width: isMobile ? "100%" : "400px",
              height: isMobile ? "85vh" : "500px",
              background: theme.lightBackground,
              border: `3px solid ${theme.lightBackground}`,
              borderBottomLeftRadius: isMobile ? "0" : "15px",
              borderBottomRightRadius: isMobile ? "0" : "15px",
            }}
          >
            <Header style={{ background: theme.line }}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  alt="Cindy Baker"
                  src={ConsultantCover}
                  sx={{ width: 32, height: 32 }}
                />
              </StyledBadge>
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                {activeLanguage.consultant}
              </h2>
              <MdArrowDropDown
                color={theme.primary}
                size={32}
                onClick={() => setOpen(false)}
                className="icon"
                style={{ position: "absolute", right: "12px", top: "12px" }}
              />
            </Header>
            {chatHide ? (
              <div
                style={{
                  width: "100%",
                  padding: "0 32px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                {/* <Input
                  label={activeLanguage.enterYourEmail}
                  value={email}
                  onChange={setEmail}
                  type="text"
                  warning={false}
                /> */}
                <div
                  style={{
                    width: "auto",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    fontSize: "14px",
                    padding: "8px 16px",
                    background: theme.line,
                    borderRadius: "50px",
                    gap: "4px",
                    cursor: "pointer",
                    color: theme.primary,
                    fontWeight: 500,
                  }}
                  onClick={() => {
                    setOpen(false);
                    setPageLoading(true);
                    navigate("/login");
                  }}
                >
                  <span>{activeLanguage.firstJoinInstructions}</span>
                  <span
                    style={{ textDecoration: "underline", fontWeight: "bold" }}
                  >
                    {activeLanguage.login}
                  </span>
                </div>
              </div>
            ) : (
              <div
                style={{
                  height: isMobile ? "71vh" : "388px",
                  width: "100%",
                  position: "relative",
                }}
              >
                {loading ? (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "40%",
                      zIndex: 999999,
                    }}
                  >
                    <BarLoader color={theme.primary} height={6} />
                  </div>
                ) : messages?.length < 1 ? (
                  <div
                    style={{
                      color: theme.secondaryText,
                      position: "absolute",
                      top: "50%",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    {activeLanguage.messagesNotFound}
                  </div>
                ) : (
                  <Messages ref={messagesEndRef}>
                    {totalMessages > messages?.length && (
                      <div
                        onClick={() => AddMessages(messages[0]?.room)}
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          color: theme.primary,
                          textAlign: "center",
                          marginTop: "8px",
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
                          setOpenedImage={setOpenedImage}
                        />
                      );
                    })}
                  </Messages>
                )}
              </div>
            )}
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
                          }} // Ensures the image covers the container
                          sizes="(max-width: 768px) 1000%, (max-width: 1200px) 100%, 100%"
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
                          color: theme.primry,
                          fontSize: "16px",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
            {chatHide ? (
              <div style={{ height: "0px" }} />
            ) : (
              <InputContainer style={{ background: theme.line }}>
                <textarea
                  placeholder={activeLanguage.typeHere}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  //   type="text"
                  className="input"
                  rows={3}
                  style={{ fontSize: "16px" }}
                  //   onKeyDown={(e) => {
                  //     if (e.key === "Enter") {
                  //       // Call your function here
                  //       SendMessage(text); // Replace this with your function call
                  //     }
                  //   }}
                />
                <div
                  style={{
                    width: "25%",
                    display: "flex",
                    alignItems: "center",
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
            )}
          </ChatContainer>
        )}
      </Container>
    </>
  );
}

const Container = styled.div`
  position: fixed;
  z-index: 999998;
  box-sizing: border-box;
  display: flex;

  .icon {
    cursor: pointer;
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const ChatContainer = styled.div`
  position: relative;
  border-radius: 15px;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  box-sizing: border-box;
`;

const Header = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 16px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    height: 7vh;
  }
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
  bottom: 0;
`;

const InputContainer = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  padding: 8px 0;

  @media (max-width: 768px) {
    height: 7vh;
  }

  .input {
    font-size: 14px;
    background: none;
    height: 100%;
    width: 100%;
    padding-left: 24px;
    border: none;
    resize: none;
    padding-top: 8px;

    &:focus {
      outline: none;
    }
  }
`;
