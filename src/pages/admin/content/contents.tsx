import { useTheme } from "../../../context/theme";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { MdImage } from "react-icons/md";
import { useAppContext } from "../../../context/app";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../firebase";
import axios from "axios";
import { BarLoader, BounceLoader } from "react-spinners";
import { Input } from "../../../components/input";
import { useLocation } from "react-router-dom";

export default function Content() {
  const { theme } = useTheme();

  const location = useLocation();

  // current covers
  const { storeInfo, activeLanguage, isMobile } = useAppContext();
  const currentProject = storeInfo?.content;

  // load page
  const [loadPage, setLoadPage] = useState(true);

  // sliders
  const [covers, setCovers] = useState({
    desktopCover: {
      file: { blob: { type: "", size: 0 } },
      url: "",
      type: "",
      link: "",
      src: "",
    },
    mobileCover: {
      file: { blob: { type: "", size: 0 } },
      url: "",
      type: "",
      link: "",
      src: "",
    },
  });

  const current = {
    desktopCover: {
      file: { blob: { type: "", size: 0 } },
      url: currentProject?.covers?.desktopCover?.url || "",
      type: currentProject?.covers?.desktopCover.type,
      link: currentProject?.covers?.desktopCover.link || "",
      src: "",
    },
    mobileCover: {
      file: { blob: { type: "", size: 0 } },
      url: currentProject?.covers?.mobileCover?.url || "",
      type: currentProject?.covers?.mobileCover.type,
      link: currentProject?.covers?.mobileCover.link || "",
      src: "",
    },
  };

  useEffect(() => {
    setCovers({
      desktopCover: {
        file: { blob: { type: "", size: 0 } },
        url: currentProject?.covers?.desktopCover?.url || "",
        type: currentProject?.covers?.desktopCover.type,
        link: currentProject?.covers?.desktopCover.link || "",
        src: "",
      },
      mobileCover: {
        file: { blob: { type: "", size: 0 } },
        url: currentProject?.covers?.mobileCover?.url || "",
        type: currentProject?.covers?.mobileCover.type,
        link: currentProject?.covers?.mobileCover.link || "",
        src: "",
      },
    });
    setTimeout(() => {
      setLoadPage(false);
    }, 300);
  }, [storeInfo]);

  interface ProcessedVideo extends ProcessedImage {
    // Inherit from ProcessedImage and add any video-specific properties if needed
  }

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const uploadedFile = e.target.files ? e.target.files[0] : null;
    if (!uploadedFile) return; // Early return if no logo selected

    const file = uploadedFile;

    // Example usage:
    const maxWidth = type === "desktopCover" ? 1920 : 1080;
    const quality = 0.8;

    interface FileProp {
      blob?: any;
      url?: any;
      width: any;
      height: any;
      src?: any;
    }

    let resizedFile: FileProp = null as any;

    if (file.type.startsWith("image/")) {
      resizedFile = await resizeImage(file, maxWidth, quality);
    } else if (file.type.startsWith("video/")) {
      resizedFile = {
        blob: file,
        width: null,
        height: null,
        src: URL.createObjectURL(file),
      };
    }

    const fileUrl = URL.createObjectURL(resizedFile.blob);

    if (type === "desktopCover") {
      setCovers((prev: any) => ({
        ...prev,
        desktopCover: {
          ...prev.desktopCover,
          file: resizedFile,
          src: fileUrl,
          type: file.type.startsWith("image/") ? "img" : "video",
          url: "",
        },
      }));
    } else {
      setCovers((prev: any) => ({
        ...prev,
        mobileCover: {
          ...prev.mobileCover,
          file: resizedFile,
          src: fileUrl,
          type: file.type.startsWith("image/") ? "img" : "video",
          url: "",
        },
      }));
    }
  };

  interface ProcessedImage {
    blob: Blob; // Adjusting to accept null because toBlob's callback might provide null
    height: number;
    width: number;
    src?: string; // Optional since it's not used in the resizing process
  }

  const resizeImage = (
    file: any,
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

  /**
   * Product Upload
   */
  const [loading, setLoading] = useState(false);
  // app context
  const { backendUrl, setAlert, setRerenderStoreInfo } = useAppContext();

  async function FileUpload() {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "File upload is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    setLoading(true); // Assuming you have a setLoading function to manage UI loading state

    // Helper function to upload a file to Firebase Storage and return the download URL
    const uploadFileAndGetURL = async (path: any, fileBlob: any) => {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, fileBlob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Handle upload progress or state changes if needed
          },
          (error) => {
            // Handle unsuccessful uploads
            console.error("Upload error:", error);
            reject(error);
          },
          async () => {
            // Handle successful upload
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("before resolve: " + downloadURL);
              resolve(downloadURL);
            } catch (error) {
              console.error("Could not get download URL:", error);
              reject(error);
            }
          }
        );
      });
    };

    try {
      // Upload logo and favicon, and get their URLs
      const desktopCoverpath = `store/${storeInfo.theme}/desktopCover`;
      const mobileCoverpath = `store/${storeInfo.theme}/mobileCover`;
      let desktopCoverUrl;
      if (covers?.desktopCover?.file.blob.size > 0) {
        desktopCoverUrl = await uploadFileAndGetURL(
          desktopCoverpath,
          covers.desktopCover?.file?.blob
        );
      } else {
        desktopCoverUrl = covers.desktopCover?.url;
      }
      let mobileCoverUrl;
      if (covers?.mobileCover?.file.blob.size > 0) {
        mobileCoverUrl = await uploadFileAndGetURL(
          mobileCoverpath,
          covers.mobileCover?.file?.blob
        );
      } else {
        desktopCoverUrl = covers.desktopCover.url;
      }

      // Here, you'd update your product/store object with the logo and favicon URLs
      const coversObject = {
        desktopCover: {
          link: covers?.desktopCover.link,
          type: covers?.desktopCover.type,
          url: desktopCoverUrl,
        },
        mobileCover: {
          link: covers?.mobileCover.link,
          type: covers?.mobileCover.type,
          url: mobileCoverUrl,
        },
      };

      // Assuming you have an endpoint to save or update the store details
      await axios.post(backendUrl + `/api/v1/project?id=${storeInfo._id}`, {
        content: { covers: coversObject },
      });
      setLoading(false);
      setAlert({
        active: true,
        type: "success",
        text: activeLanguage.storeUpdatedSuccessfully,
      });
      setRerenderStoreInfo();
    } catch (error) {
      console.error("Error during file upload:", error);
      setLoading(false);
      setAlert({
        active: true,
        type: "error",
        text: activeLanguage.failedToUpdateStore,
      });
    }
  }

  const isVideo1 = covers?.desktopCover?.type === "video";
  const isVideo2 = covers?.mobileCover?.type === "video";

  return (
    <>
      {loadPage ? (
        <div style={{ margin: "24px" }}>
          <BarLoader color={theme.primaryText} height={6} />
        </div>
      ) : (
        <Container
          style={{ border: isMobile ? "none" : `1px solid ${theme.line}` }}
        >
          <Cover style={{ color: theme.primaryText }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h1
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "16px",
                  zIndex: 1000,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  paddingLeft: "8px",
                }}
              >
                {activeLanguage.covers}
              </h1>
              <div
                className={
                  JSON.stringify(current) === JSON.stringify(covers)
                    ? ""
                    : "icon"
                }
                style={{
                  width: "75px",
                  fontSize: "14px",
                  padding: "4px 8px",
                  background:
                    JSON.stringify(current) === JSON.stringify(covers)
                      ? theme.secondaryText
                      : theme.primary,
                  color: theme.lightBackground,
                  textAlign: "center",
                  borderRadius: "50px",
                  cursor:
                    JSON.stringify(current) === JSON.stringify(covers)
                      ? "not-allowed"
                      : "pointer",
                  zIndex: 10000,
                  // position: "absolute",
                  // right: "24px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={
                  JSON.stringify(current) === JSON.stringify(covers)
                    ? () => undefined
                    : FileUpload
                }
              >
                {loading ? (
                  <BounceLoader size={16} color={theme.primaryText} />
                ) : (
                  activeLanguage.save
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: "5%",
                marginTop: "24px",
                width: "100%",
                boxSizing: "border-box",
                color: theme.primaryText,
              }}
            >
              <div
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h2
                  style={{
                    color: theme.primaryText,
                    marginBottom: isMobile ? "16px" : "24px",
                    fontWeight: "600",
                    paddingLeft: "8px",
                  }}
                >
                  Desktop{" "}
                  <span style={{ color: theme.secondaryText }}>
                    (1920px/1080px)
                  </span>
                </h2>
                <input
                  type="file"
                  id="desktopCoverInput"
                  style={{ display: "none" }}
                  multiple={false}
                  accept="image/*,video/*" // Allow both images and videos
                  onChange={(e) => handleFileUpload(e, "desktopCover")}
                />
                <label
                  htmlFor="desktopCoverInput"
                  style={{
                    display: "flex",
                    width: "100%",
                    cursor: "pointer",
                  }}
                >
                  {covers.desktopCover.url.length > 0 ||
                  covers.desktopCover.src.length > 0 ? (
                    <ImageContainer
                      style={{
                        width: isMobile ? "96vw" : "800px",
                        height: isMobile ? "54vw" : "450px",
                      }}
                    >
                      {isVideo1 ? (
                        <video
                          key={covers.desktopCover.url}
                          controls={false}
                          autoPlay
                          loop
                          muted
                          playsInline
                          style={{
                            width: isMobile ? "96vw" : "960px",
                            height: isMobile ? "54vw" : "540px",
                            objectFit: "cover",
                          }}
                        >
                          <source
                            src={
                              covers.desktopCover.url
                                ? covers.desktopCover.url
                                : covers?.desktopCover?.src
                            }
                            type={covers.desktopCover?.file?.blob?.type}
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          className="img"
                          alt="Sport"
                          src={
                            covers?.desktopCover?.url ||
                            covers?.desktopCover?.src
                          }
                          style={{
                            objectFit: "cover",
                            width: isMobile ? "96vw" : "960px",
                            height: isMobile ? "54vw" : "540px",
                          }} // Ensures the image covers the container
                        />
                      )}
                    </ImageContainer>
                  ) : (
                    <MdImage style={{}} size={"50%"} cursor="pointer" />
                  )}
                </label>
                <div style={{ marginTop: isMobile ? "0" : "24px" }}>
                  <h2
                    style={{
                      margin: isMobile ? "16px 0" : "24px 0",
                      color: theme.primaryText,
                      fontWeight: 600,
                    }}
                  >
                    {activeLanguage.link}
                  </h2>
                  <Input
                    label={activeLanguage.link}
                    warning={false}
                    type="text"
                    value={covers.desktopCover.link}
                    onChange={(e) =>
                      setCovers((prev: any) => ({
                        ...prev,
                        desktopCover: { ...prev.desktopCover, link: e },
                      }))
                    }
                  />
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  color: theme.primaryText,
                  display: "flex",
                  flexDirection: "column",
                  marginTop: isMobile ? "24px" : "0",
                }}
              >
                <h2
                  style={{
                    color: theme.primaryText,
                    marginBottom: isMobile ? "16px" : "24px",
                    fontWeight: "600",
                    paddingLeft: "8px",
                  }}
                >
                  Mobile{" "}
                  <span style={{ color: theme.secondaryText }}>
                    (1080px/1350px)
                  </span>
                </h2>
                <input
                  type="file"
                  id="mobileCoverInput"
                  style={{ display: "none" }}
                  multiple={false}
                  accept="image/*,video/*" // Allow both images and videos
                  onChange={(e) => handleFileUpload(e, "mobileCover")}
                />

                <label
                  htmlFor="mobileCoverInput"
                  style={{
                    display: "flex",
                    // justifyContent: "space-evenly",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  {covers.mobileCover.url.length > 0 ||
                  covers.mobileCover.src.length > 0 ? (
                    <ImageContainer
                      style={{
                        width: !isMobile ? "400px" : "100vw",
                        height: !isMobile ? "500px" : "125vw",
                      }}
                    >
                      {isVideo2 ? (
                        <video
                          key={covers.mobileCover.url || covers.mobileCover.src}
                          controls={false}
                          autoPlay
                          loop
                          muted
                          playsInline
                          style={{
                            width: !isMobile ? "400px" : "100vw",
                            height: !isMobile ? "500px" : "125vw",
                            objectFit: "cover",
                          }}
                        >
                          <source
                            src={
                              covers.mobileCover.url || covers.mobileCover.src
                            }
                            type={
                              covers.mobileCover?.file?.blob?.type ??
                              "video/mp4"
                            }
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          className="img"
                          alt="Sport"
                          src={covers.mobileCover.url || covers.mobileCover.src}
                          style={{
                            objectFit: "cover",
                            width: !isMobile ? "400px" : "100vw",
                            height: !isMobile ? "500px" : "125vw",
                          }} // Ensures the image covers the container
                        />
                      )}
                    </ImageContainer>
                  ) : (
                    <MdImage style={{}} size={"50%"} cursor="pointer" />
                  )}
                </label>
                <div
                  style={{
                    marginTop: isMobile ? " 0" : "24px",
                    boxSizing: "border-box",
                  }}
                >
                  <h2
                    style={{
                      margin: isMobile ? "16px 0" : "24px 0",
                      color: theme.primaryText,
                      fontWeight: 600,
                    }}
                  >
                    {activeLanguage.link}
                  </h2>
                  <Input
                    label={activeLanguage.link}
                    warning={false}
                    type="text"
                    value={covers.mobileCover.link}
                    onChange={(e) =>
                      setCovers((prev: any) => ({
                        ...prev,
                        mobileCover: { ...prev.mobileCover, link: e },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </Cover>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  border-radius: 15px;
  padding: 24px;
  padding-bottom: 64px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    height: 80vh;
    padding: 8px;
    padding-bottom: 0px;
  }

  .icon {
    cursor: pointer;
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const Cover = styled.div`
  width: 100%;
  border-radius: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 80vh;

  @media (max-width: 768px) {
  }
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;

  .img {
    transition: ease-in 300ms;

    &:hover {
      filter: brightness(0.9);
    }
  }
`;
