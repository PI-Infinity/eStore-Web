import { Input } from "../../../components/input";
import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";
import { storage } from "../../../firebase";
import axios from "axios";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import {
  FaDollarSign,
  FaEuroSign,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaTwitter,
  FaViber,
  FaWhatsapp,
} from "react-icons/fa";
import { FaDeleteLeft, FaLariSign } from "react-icons/fa6";
import { MdArrowDropUp, MdDone, MdImage } from "react-icons/md";
import { BarLoader, BounceLoader } from "react-spinners";
import styled from "styled-components";
import MapAutoComplete from "../orders/mapAutocomplete";
import { useLocation } from "react-router-dom";

const Settings = () => {
  const { theme, setActiveTheme } = useTheme();

  const location = useLocation();

  // load page
  const [loadPage, setLoadPage] = useState(true);

  const {
    storeInfo,
    setRerenderStoreInfo,
    setAlert,
    backendUrl,
    activeLanguage,
    isMobile,
  } = useAppContext();

  /**
   * fields
   *  */
  interface Store {
    name: string;
    description: string;
    email: string;
    logo: any;
    favicon: any;
    address: any;
    phone: any;
    links: any;
    currency: string;
    language: string;
    fbPixel: string;
  }

  const currentProject = {
    name: storeInfo?.name,
    description: storeInfo?.description,
    email: storeInfo?.email,
    logo: storeInfo?.logo,
    favicon: storeInfo?.favicon,
    address: storeInfo?.address,
    phone: storeInfo?.phone,
    links: storeInfo?.links,
    currency: storeInfo?.currency,
    language: storeInfo?.language,
    fbPixel: storeInfo?.fbPixel,
  };

  const [store, setStore] = useState<Store>({
    name: storeInfo?.name,
    description: storeInfo?.description,
    email: storeInfo?.email,
    logo: storeInfo?.logo,
    favicon: storeInfo?.favicon,
    address: storeInfo?.address,
    phone: storeInfo?.phone,
    links: storeInfo?.links,
    currency: storeInfo?.currency,
    language: storeInfo?.language,
    fbPixel: storeInfo?.fbPixel,
  });

  useEffect(() => {
    setStore({
      name: storeInfo?.name,
      description: storeInfo?.description,
      email: storeInfo?.email,
      logo: storeInfo?.logo,
      favicon: storeInfo?.favicon,
      address: storeInfo?.address,
      phone: storeInfo?.phone,
      links: storeInfo?.links,
      currency: storeInfo?.currency,
      language: storeInfo?.language,
      fbPixel: storeInfo?.fbPixel,
    });
    setTimeout(() => {
      setLoadPage(false);
    }, 300);
  }, [storeInfo]);

  const [phoneInput, setPhoneInput] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const [activeLink, setActiveLink] = useState("Facebook");
  const [openOptions, setOpenOptions] = useState(false);
  const [openCurrency, setOpenCurrency] = useState(false);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const uploadedlogo = e.target.files ? e.target.files[0] : null;
    if (!uploadedlogo) return; // Early return if no logo selected

    const file = uploadedlogo;

    // Example usage:
    const maxWidth = type === "logo" ? 160 : 60;
    const quality = 1;

    // Assuming `resizeImage` returns a Promise<ProcessedImage>
    const resizedFile = await resizeImage(file, maxWidth, quality);

    const fileUrl = URL.createObjectURL(resizedFile.blob);

    if (type === "logo") {
      setStore((prev: any) => ({
        ...prev,
        logo: { ...resizedFile, url: fileUrl },
      }));
    } else {
      setStore((prev: any) => ({
        ...prev,
        favicon: { ...resizedFile, url: fileUrl },
      }));
    }
  };

  interface ProcessedImage {
    blob: Blob; // Adjusting to accept null because toBlob's callback might provide null
    height: number;
    width: number;
    src?: string; // Optional since it's not used in the resizing process
  }

  // loading
  const [loading, setLoading] = useState(false);

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

  async function FileUpload() {
    setLoading(true);
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
      const logoPath = `stores/${storeInfo?.theme}/logo`;
      const faviconPath = `stores/${storeInfo?.theme}/favicon`;

      let logoURL;
      if (store.logo.blob) {
        logoURL = await uploadFileAndGetURL(logoPath, store.logo.blob);
      } else {
        logoURL = store.logo;
      }

      let faviconURL;
      if (store.favicon.blob) {
        faviconURL = await uploadFileAndGetURL(faviconPath, store.favicon.blob);
      } else {
        faviconURL = store.favicon;
      }

      // Here, you'd update your product/store object with the logo and favicon URLs
      const updatedStore = {
        ...store,
        logo: logoURL,
        favicon: faviconURL,
      };

      // Assuming you have an endpoint to save or update the store details
      await axios.post(
        backendUrl + `/api/v1/project?id=${storeInfo._id}`,
        updatedStore
      );
      setRerenderStoreInfo();
      setLoading(false);
      setAlert({
        active: true,
        type: "success",
        text: activeLanguage.storeUpdatedSuccessfully,
      });
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

  return (
    <>
      {loadPage ? (
        <div style={{ margin: "24px" }}>
          <BarLoader color={theme.primaryText} height={6} />
        </div>
      ) : (
        <Container style={{ border: `1px solid ${theme.line}` }}>
          <div
            style={{
              fontSize: "14px",
              padding: "4px 8px",
              background:
                JSON.stringify(currentProject) === JSON.stringify(store)
                  ? theme.lineDark
                  : theme.primary,
              color:
                JSON.stringify(currentProject) === JSON.stringify(store)
                  ? theme.secondaryText
                  : theme.lightBackground,
              textAlign: "center",
              borderRadius: "50px",
              cursor:
                JSON.stringify(currentProject) === JSON.stringify(store)
                  ? "not-allowed"
                  : "pointer",
              zIndex: 10000,
              position: "absolute",
              right: "24px",
              minWidth: "80px",
            }}
            className="icon"
            onClick={
              JSON.stringify(currentProject) === JSON.stringify(store)
                ? () => undefined
                : location.search.includes("overview")
                ? () =>
                    setAlert({
                      active: true,
                      text: "You can't modify setting",
                      type: "warning",
                    })
                : FileUpload
            }
          >
            {loading ? (
              <BounceLoader size={16} color={theme.primaryText} />
            ) : (
              activeLanguage.save
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: "24px",
              position: "relative",
              marginTop: isMobile ? "48px" : "8px",
            }}
          >
            <div
              style={{
                width: isMobile ? "100%" : "400px",
                display: "flex",
                justifyContent: "space-evenly",
                border: `1px solid ${theme.lineDark}`,
                borderRadius: "10px",
                padding: "16px",
              }}
            >
              <div style={{}}>
                <h2 style={{ color: theme.primaryText, fontWeight: "500" }}>
                  {activeLanguage.storeLogo}
                </h2>
                <input
                  type="file"
                  id="fileInputLogo"
                  style={{ display: "none" }}
                  multiple={false}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "logo")}
                />
                <label
                  className="icon"
                  htmlFor="fileInputLogo"
                  style={{
                    display: "flex",
                    // justifyContent: "space-evenly",
                    gap: "40px",
                    marginTop: "24px",
                    border: `1px solid ${theme.line}`,
                    borderRadius: "10px",
                    padding: "16px",
                    cursor: "pointer",
                  }}
                >
                  {store.logo ? (
                    <div>
                      <img
                        alt="logo"
                        src={store?.logo?.url || store?.logo}
                        width={120}
                      />
                    </div>
                  ) : (
                    <MdImage style={{}} size={120} cursor="pointer" />
                  )}
                </label>
              </div>
              <div>
                <h2 style={{ color: theme.primaryText, fontWeight: "500" }}>
                  {activeLanguage.storeFavicon}
                </h2>
                <input
                  type="file"
                  id="fileInputFavicon"
                  style={{ display: "none" }}
                  multiple={false}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "favicon")}
                />

                <label
                  className="icon"
                  htmlFor="fileInputFavicon"
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    gap: "40px",
                    marginTop: "24px",
                    border: `1px solid ${theme.line}`,
                    borderRadius: "10px",
                    padding: "16px",
                    cursor: "pointer",
                  }}
                >
                  {store.favicon ? (
                    <div>
                      <img
                        alt="favicon"
                        src={store?.favicon.url || store?.favicon}
                        width={30}
                      />
                    </div>
                  ) : (
                    <MdImage style={{}} size={60} cursor="pointer" />
                  )}
                </label>
              </div>
            </div>
            <div
              style={{
                width: isMobile ? "100%" : "70%",
                display: "flex",
                gap: "24px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  width: isMobile ? "100%" : "400px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <h2 style={{ color: theme.primaryText, fontWeight: "500" }}>
                  {activeLanguage.storeName}
                </h2>
                <Input
                  label={activeLanguage.name}
                  value={store.name}
                  onChange={(e) =>
                    setStore((prev: any) => ({ ...prev, name: e }))
                  }
                  warning={false}
                  type="text"
                />
              </div>
              <div
                style={{
                  width: isMobile ? "100%" : "300px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  zIndex: 999,
                }}
              >
                <h2 style={{ color: theme.primaryText, fontWeight: "500" }}>
                  {activeLanguage.storeDescription}
                </h2>
                <Input
                  label={activeLanguage.description}
                  value={store.description}
                  onChange={(e) =>
                    setStore((prev: any) => ({ ...prev, description: e }))
                  }
                  warning={false}
                  type="text"
                />
              </div>
              <div
                style={{
                  width: isMobile ? "100%" : "400px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <h2
                  style={{
                    color: theme.primaryText,
                    fontWeight: "500",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {activeLanguage.contactEmail}
                  <span
                    style={{ color: theme.secondaryText, fontSize: "12px" }}
                  >
                    ({activeLanguage.notUsedForSendingEmails})
                  </span>
                </h2>
                <Input
                  label={activeLanguage.email}
                  value={store.email}
                  onChange={(e) =>
                    setStore((prev: any) => ({ ...prev, email: e }))
                  }
                  warning={false}
                  type="text"
                />
              </div>
              <div
                style={{
                  width: "100px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <h2 style={{ color: theme.primaryText, fontWeight: "500" }}>
                  {activeLanguage.currency}
                </h2>
                <div
                  style={{
                    width: "50px",
                    padding: "4px",
                    borderRadius: "5px",
                    background: theme.primaryText,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className="icon"
                  onClick={() => setOpenCurrency(!openCurrency)}
                >
                  {store.currency === "Dollar" ? (
                    <FaDollarSign color={theme.lightBackground} size={20} />
                  ) : store.currency === "Euro" ? (
                    <FaEuroSign color={theme.lightBackground} size={20} />
                  ) : (
                    <FaLariSign color={theme.lightBackground} size={20} />
                  )}
                  <MdArrowDropUp color={theme.lightBackground} size={18} />
                  {openCurrency && (
                    <LinksIcons
                      style={{
                        background: theme.primaryText,
                        marginTop: "70px",
                        border: `1px solid ${theme.line}`,
                      }}
                    >
                      <FaDollarSign
                        color={theme.lightBackground}
                        className="icon"
                        size={20}
                        onClick={() =>
                          setStore((prev: any) => ({
                            ...prev,
                            currency: "Dollar",
                          }))
                        }
                      />
                      <FaEuroSign
                        color={theme.lightBackground}
                        className="icon"
                        size={20}
                        onClick={() =>
                          setStore((prev: any) => ({
                            ...prev,
                            currency: "Euro",
                          }))
                        }
                      />
                      <FaLariSign
                        color={theme.lightBackground}
                        className="icon"
                        size={20}
                        onClick={() =>
                          setStore((prev: any) => ({
                            ...prev,
                            currency: "Lari",
                          }))
                        }
                      />
                    </LinksIcons>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* <div
            style={{
              cursor: "pointer",
              color: theme.primaryText,
              margin: "24px",
            }}
            onClick={() =>
              setActiveTheme((prev: any) =>
                prev === "dark" ? "light" : "dark"
              )
            }
          >
            Theme
          </div> */}
          <div
            style={{
              width: "20%",
              display: "flex",
              flexDirection: "column",
              marginLeft: "40px",
              marginTop: "40px",
              gap: "8px",
              fontSize: "14px",
              cursor: "pointer",
              boxSizing: "border-box",
              letterSpacing: "0.5px",
              zIndex: 10000,
              color: theme.secondaryText,
              borderRadius: "15px",
            }}
          >
            <h2
              style={{
                color: theme.primaryText,
                fontWeight: "500",
                margin: "0 0 8px 0",
                whiteSpace: "nowrap",
              }}
            >
              {activeLanguage.storeMainLanguage}
            </h2>
            <div
              onClick={(e) =>
                setStore((prev: any) => ({ ...prev, language: "ka" }))
              }
              style={{
                borderRadius: "15px",
                padding: "4px 8px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color:
                  store?.language === "ka"
                    ? theme.primaryText
                    : theme.secondaryText,
              }}
            >
              <ReactCountryFlag
                className="emojiFlag"
                countryCode="GE"
                aria-label="Georgia"
              />
              ქართული
            </div>
            <div
              onClick={(e) =>
                setStore((prev: any) => ({ ...prev, language: "en" }))
              }
              style={{
                borderRadius: "15px",
                padding: "4px 8px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color:
                  store?.language === "en"
                    ? theme.primaryText
                    : theme.secondaryText,
              }}
            >
              <ReactCountryFlag
                className="emojiFlag"
                countryCode="US"
                aria-label="Georgia"
              />
              English
            </div>
            <div
              onClick={(e) =>
                setStore((prev: any) => ({ ...prev, language: "ru" }))
              }
              style={{
                borderRadius: "15px",
                padding: "4px 8px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color:
                  store?.language === "ru"
                    ? theme.primaryText
                    : theme.secondaryText,
              }}
            >
              <ReactCountryFlag
                className="emojiFlag"
                countryCode="RU"
                aria-label="Georgia"
              />
              Russian
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              width: "100%",
              gap: "24px",
              marginTop: "64px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: isMobile ? "100%" : "400px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                gap: "16px",
                overflowY: "auto",
              }}
            >
              <h2 style={{ color: theme.primaryText, fontWeight: "500" }}>
                {activeLanguage.storeAddress}
              </h2>
              <div>
                <MapAutoComplete
                  setShippingVariants={undefined}
                  setOrder={undefined}
                  setState={(e: any) =>
                    setStore((prev: any) => ({
                      ...prev,
                      address: [...prev.address, e],
                    }))
                  }
                />
              </div>
              <div
                style={{
                  border: `1px solid ${theme.line}`,
                  borderRadius: "10px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {store?.address?.length < 1 ? (
                  <span
                    style={{ color: theme.secondaryText, fontSize: "14px" }}
                  >
                    — {activeLanguage.notFound}
                  </span>
                ) : (
                  store?.address?.map((i: any, x: number) => {
                    return (
                      <div
                        key={x}
                        style={{
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "16px",
                          border: `1px solid ${theme.line}`,
                          borderRadius: "10px",
                          padding: "16px",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            fontSize: "14px",
                            color: theme.primaryText,
                          }}
                        >
                          <span>—</span> {i.address}{" "}
                          <FaDeleteLeft
                            className="icon"
                            color={theme.primary}
                            size={18}
                            style={{ cursor: "pointer", marginLeft: "auto" }}
                            onClick={() =>
                              setStore((prev: any) => ({
                                ...prev,
                                address: prev.address?.filter(
                                  (it: any) => it !== i
                                ),
                              }))
                            }
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                          }}
                        >
                          <h2
                            style={{
                              color: theme.secondaryText,
                              fontSize: "14px",
                            }}
                          >
                            {activeLanguage.workingHours}
                            <span style={{}}>(00:00 - 00:00)</span>
                          </h2>
                          <div style={{ display: "flex", gap: "16px" }}>
                            <Input
                              label={activeLanguage.starting}
                              value={i?.workingHours?.starting}
                              onChange={(e) => {
                                const newStartingTime = e;
                                setStore((prevStore) => ({
                                  ...prevStore,
                                  address: prevStore.address.map(
                                    (addressItem: any, index: number) => {
                                      if (index === x) {
                                        // Find the address by index
                                        return {
                                          ...addressItem,
                                          workingHours: {
                                            ...addressItem.workingHours,
                                            starting: newStartingTime, // Update the starting time
                                          },
                                        };
                                      }
                                      return addressItem; // Return unchanged for other addresses
                                    }
                                  ),
                                }));
                              }}
                              warning={false}
                              type="text"
                            />
                            <Input
                              label={activeLanguage.ending}
                              value={i?.workingHours?.ending}
                              onChange={(e) => {
                                const newEndingTime = e;
                                setStore((prevStore) => ({
                                  ...prevStore,
                                  address: prevStore.address.map(
                                    (addressItem: any, index: number) => {
                                      if (index === x) {
                                        // Find the address by index
                                        return {
                                          ...addressItem,
                                          workingHours: {
                                            ...addressItem.workingHours,
                                            ending: newEndingTime, // Update the ending time
                                          },
                                        };
                                      }
                                      return addressItem; // Return unchanged for other addresses
                                    }
                                  ),
                                }));
                              }}
                              warning={false}
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            <div
              style={{
                width: isMobile ? "100%" : "400px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <h2 style={{ color: theme.primaryText, fontWeight: "500" }}>
                {activeLanguage.storePhone}
              </h2>
              <div
                style={{ display: "flex", gap: "16px", alignItems: "center" }}
              >
                <Input
                  label={activeLanguage.addNewPhone}
                  value={phoneInput}
                  onChange={setPhoneInput}
                  warning={false}
                  type="text"
                />
                <div
                  className={phoneInput?.length > 0 ? "icon" : ""}
                  style={{
                    padding: "4px",
                    borderRadius: "5px",
                    background:
                      phoneInput?.length > 0
                        ? theme.lightBackground
                        : theme.lightBackground,
                    cursor: phoneInput?.length > 0 ? "pointer" : "not-allowed",
                  }}
                  onClick={
                    phoneInput?.length > 0
                      ? () => {
                          setStore((prev: any) => ({
                            ...prev,
                            phone: [...prev.phone, phoneInput],
                          }));
                          setPhoneInput("");
                        }
                      : undefined
                  }
                >
                  <MdDone
                    color={
                      phoneInput?.length > 0 ? theme.primary : theme.primary
                    }
                    size={18}
                  />
                </div>
              </div>
              <div
                style={{
                  border: `1px solid ${theme.line}`,
                  borderRadius: "10px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {store?.phone?.length < 1 ? (
                  <span
                    style={{ color: theme.secondaryText, fontSize: "14px" }}
                  >
                    — {activeLanguage.notFound}
                  </span>
                ) : (
                  store?.phone?.map((i: any, x: number) => {
                    return (
                      <div
                        key={x}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          color: theme.primaryText,
                        }}
                      >
                        <span>—</span> {i}{" "}
                        <FaDeleteLeft
                          className="icon"
                          color={theme.primary}
                          size={18}
                          style={{ cursor: "pointer", marginLeft: "auto" }}
                          onClick={() =>
                            setStore((prev: any) => ({
                              ...prev,
                              phone: prev.phone?.filter((it: any) => it !== i),
                            }))
                          }
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div
              style={{
                width: isMobile ? "100%" : "400px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <h2 style={{ color: theme.primaryText, fontWeight: "500" }}>
                {activeLanguage.storeLinks}
              </h2>
              <div
                style={{ display: "flex", gap: "16px", alignItems: "center" }}
              >
                <div>
                  <div
                    style={{
                      padding: "4px",
                      borderRadius: "5px",
                      background: theme.lightBackground,
                      cursor: "pointer",
                      display: "flex",
                    }}
                    onClick={() => setOpenOptions(!openOptions)}
                  >
                    {activeLink === "Facebook" ? (
                      <FaFacebook color={theme.primaryText} size={20} />
                    ) : activeLink === "Instagram" ? (
                      <FaInstagram color={theme.primaryText} size={20} />
                    ) : activeLink === "Whatsapp" ? (
                      <FaWhatsapp color={theme.primaryText} size={20} />
                    ) : activeLink === "Telegram" ? (
                      <FaTelegram color={theme.primaryText} size={20} />
                    ) : activeLink === "Viber" ? (
                      <FaViber color={theme.primaryText} size={20} />
                    ) : activeLink === "Linkedin" ? (
                      <FaLinkedin color={theme.primaryText} size={20} />
                    ) : (
                      <FaTwitter color={theme.primaryText} size={20} />
                    )}
                    <MdArrowDropUp color={theme.primaryText} size={18} />
                    {openOptions && (
                      <LinksIcons
                        style={{
                          background: theme.lightBackground,
                          border: `1px solid ${theme.line}`,
                        }}
                      >
                        <FaFacebook
                          color={theme.primaryText}
                          size={20}
                          className="icon"
                          onClick={() => setActiveLink("Facebook")}
                        />
                        <FaInstagram
                          color={theme.primaryText}
                          size={20}
                          className="icon"
                          onClick={() => setActiveLink("Instagram")}
                        />
                        <FaWhatsapp
                          color={theme.primaryText}
                          size={20}
                          className="icon"
                          onClick={() => setActiveLink("Whatsapp")}
                        />
                        <FaTelegram
                          color={theme.primaryText}
                          size={20}
                          className="icon"
                          onClick={() => setActiveLink("Telegram")}
                        />
                        <FaTwitter
                          color={theme.primaryText}
                          size={20}
                          className="icon"
                          onClick={() => setActiveLink("Twitter")}
                        />
                        <FaLinkedin
                          color={theme.primaryText}
                          size={20}
                          className="icon"
                          onClick={() => setActiveLink("Linkedin")}
                        />
                        <FaViber
                          color={theme.primaryText}
                          size={20}
                          className="icon"
                          onClick={() => setActiveLink("Viber")}
                        />
                      </LinksIcons>
                    )}
                  </div>
                </div>
                <Input
                  label={
                    activeLink === "Viber" || activeLink === "Whatsapp"
                      ? activeLanguage.phone
                      : activeLanguage.username
                  }
                  value={linkInput}
                  onChange={setLinkInput}
                  warning={false}
                  type="text"
                />
                <div
                  className={linkInput?.length > 0 ? "icon" : ""}
                  style={{
                    padding: "4px",
                    borderRadius: "5px",
                    background:
                      linkInput?.length > 0
                        ? theme.lightBackground
                        : theme.lightBackground,
                    cursor: linkInput?.length > 0 ? "pointer" : "not-allowed",
                  }}
                  onClick={
                    linkInput?.length > 0
                      ? () => {
                          setStore((prev: any) => ({
                            ...prev,
                            links: [
                              ...prev.links,
                              { type: activeLink, link: linkInput },
                            ],
                          }));
                          setLinkInput("");
                        }
                      : undefined
                  }
                >
                  <MdDone
                    color={
                      linkInput?.length > 0 ? theme.primary : theme.primary
                    }
                    size={18}
                  />
                </div>
              </div>
              <div
                style={{
                  border: `1px solid ${theme.line}`,
                  borderRadius: "10px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {store?.links?.length < 1 ? (
                  <span
                    style={{ color: theme.secondaryText, fontSize: "14px" }}
                  >
                    — {activeLanguage.notFound}
                  </span>
                ) : (
                  store?.links?.map((i: any, x: number) => {
                    return (
                      <div
                        key={x}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          color: theme.primaryText,
                        }}
                      >
                        {i.type === "Facebook" ? (
                          <FaFacebook color={theme.primaryText} size={20} />
                        ) : i.type === "Instagram" ? (
                          <FaInstagram color={theme.primaryText} size={20} />
                        ) : i.type === "Whatsapp" ? (
                          <FaWhatsapp color={theme.primaryText} size={20} />
                        ) : i.type === "Telegram" ? (
                          <FaTelegram color={theme.primaryText} size={20} />
                        ) : i.type === "Viber" ? (
                          <FaViber color={theme.primaryText} size={20} />
                        ) : i.type === "Linkedin" ? (
                          <FaLinkedin color={theme.primaryText} size={20} />
                        ) : (
                          <FaTwitter color={theme.primaryText} size={20} />
                        )}{" "}
                        {i.link}
                        <FaDeleteLeft
                          className="icon"
                          color={theme.primary}
                          size={18}
                          style={{ cursor: "pointer", marginLeft: "auto" }}
                          onClick={() =>
                            setStore((prev: any) => ({
                              ...prev,
                              links: prev.links?.filter((it: any) => it !== i),
                            }))
                          }
                        />
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              width: isMobile ? "100%" : "400px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            <h2 style={{ color: theme.primaryText, fontWeight: "500" }}>
              FB Pixel
            </h2>
            <Input
              label="ID"
              value={store.fbPixel}
              onChange={(e) =>
                setStore((prev: any) => ({ ...prev, fbPixel: e }))
              }
              warning={false}
              type="text"
            />
          </div>
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 85vh;
  border-radius: 15px;
  padding: 24px;
  padding-bottom: 64px;
  overflow-y: auto;
  position: relative;

  @media (max-width: 768px) {
    padding: 16px;
  }

  .icon {
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const LinksIcons = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border-radius: 5px;

  .icon {
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

export default Settings;
