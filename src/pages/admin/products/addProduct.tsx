import { Input } from "../../../components/input";
import { useProductsContext } from "../../../context/productsContext";
import { useTheme } from "../../../context/theme";
import { Checkbox, FormControlLabel, FormGroup, Radio } from "@mui/material";
import axios from "axios";
import {
  StorageReference,
  UploadTask,
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import { FcAddImage } from "react-icons/fc";
import { MdClose, MdDelete, MdOutlineDownloadDone } from "react-icons/md";
import styled from "styled-components";
import { v4 } from "uuid";
import Button from "../../../components/button";
import InStock from "./inStockOption";
import Search from "./search";
import { storage } from "../../../firebase";
import UploaderPercentage from "./uploaderPercentage";
import { useAppContext } from "../../../context/app";
import ReactCountryFlag from "react-country-flag";
import { FaImage } from "react-icons/fa";
import { useLocation } from "react-router-dom";

interface PropsType {
  open: boolean;
  close: () => void;
  rerenderProducts: (prev: any) => void;
}

const AddProduct: React.FC<PropsType> = ({ open, close, rerenderProducts }) => {
  const { theme } = useTheme();

  const location = useLocation();

  const { setAlert, backendUrl, activeLanguage, isMobile } = useAppContext();

  const { genders, categories, colors } = useProductsContext();

  /**
   * fields
   *  */

  // files

  interface ProcessedImage {
    blob: Blob; // Or File, since File inherits from Blob and includes name, lastModified, etc.
    height: number;
    width: number;
    src?: string;
    cover?: boolean;
  }

  interface ProcessedVideo extends ProcessedImage {
    // Inherit from ProcessedImage and add any video-specific properties if needed
  }

  // If `files` can contain both images and videos, you might define a union type
  type ProcessedFile = ProcessedImage | ProcessedVideo;

  // files
  const [files, setFiles] = useState<ProcessedFile[]>([]);

  // set file as a cover image
  const setFileAsCover = (index: number) => {
    setFiles((currentFiles: ProcessedFile[]) =>
      currentFiles.map((file, i) => ({
        ...file,
        cover: i === index, // Set true only for the clicked index
      }))
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return; // Early return if no files selected

    const processedFiles: ProcessedFile[] = [];

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
      } else if (file.type.startsWith("video/")) {
        const videoMetadata: ProcessedVideo = await new Promise((resolve) => {
          const video = document.createElement("video");
          video.src = URL.createObjectURL(file);

          video.onloadedmetadata = () => {
            const width = video.videoWidth;
            const height = video.videoHeight;

            resolve({
              blob: file,
              height,
              width,
              src: video.src,
            });
          };
        });

        processedFiles.push(videoMetadata);
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

  // title
  const [title, setTitle] = useState("");
  // price
  const [price, setPrice] = useState("");
  // sale
  const [sale, setSale] = useState("");
  // gender
  const [sex, setSex] = useState("Men");
  // color
  const [color, setColor] = useState("Black");
  // brand
  const [brand, setBrand] = useState("");
  // categories
  const [category, setCategory] = useState("Shoes");
  // sub categories
  const [subCategory, setSubCategory] = useState<string[]>([]);

  const [activeLanguageInput, setActiveLanguageInput] = useState("GE");
  //  description
  const [description, setDescription] = useState({
    en: "",
    ru: "",
    ka: "",
  });

  // in stock options state
  const [options, setOptions] = useState([{ id: v4(), qnt: "", size: "" }]);
  // varinats options
  const [variants, setVariants] = useState([]);
  const [activeVariants, setActiveVariants] = useState([]);
  const [variantsInput, setVariantsInput] = useState("");
  const [totalVariants, setTotalVariants] = useState(0);
  const [page, setPage] = useState(1);

  // getting products
  useEffect(() => {
    const GetOptions = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/products?page=${1}&limit=8&search=${variantsInput}`
        );
        setVariants(response.data.data.products);
        setTotalVariants(response.data.totalProducts);
        setPage(1);
      } catch (error) {
        console.log(error);
      }
    };

    GetOptions();
  }, [variantsInput]);

  const AddOptions = async () => {
    const newPage = page + 1;

    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/products?page=${newPage}&limit=8&search=${variantsInput}`
      );
      setVariants((prevProducts: any) => {
        const existingIds = new Set(
          prevProducts.map((product: any) => product._id)
        );
        const filteredNewProducts = response.data.data.products.filter(
          (product: any) => !existingIds.has(product._id)
        );

        if (filteredNewProducts.length > 0) {
          return [...prevProducts, ...filteredNewProducts];
        } else {
          return prevProducts;
        }
      });
      setPage(newPage);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Product Upload
   */

  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fileRefs, setFileRefs] = useState<StorageReference[]>([]);
  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);

  async function FileUpload(status: any) {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Add new Product is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    if (
      fieldWarnings.title ||
      fieldWarnings.price ||
      fieldWarnings.brand ||
      fieldWarnings.inStock
    ) {
      return setAlert({
        active: true,
        type: "warning",
        text: activeLanguage.pleaseInputFieldsCorrectly,
      });
    }
    const folderId = v4();
    const addFileInCloud = async (itemTitle: string, file: any, x: number) => {
      const fileId = v4();
      const fileRef = ref(storage, `products/${folderId}/${fileId}`);
      setLoading(true);
      setFileRefs((prev) => [...prev, fileRef]);
      // Initialize the upload process

      const uploadTask = uploadBytesResumable(fileRef, file?.blob);
      setUploadTasks((prev) => [...prev, uploadTask]);

      // Return a promise that resolves with the download URL upon successful upload
      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Optional: Handle upload progress
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
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
                cover: file.cover,
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

    try {
      let urls: any;
      if (files.length > 0) {
        urls = await Promise.all(
          files.map((file, index) => addFileInCloud(title, file, index))
        );
      } else {
        urls = [];
      }
      const newProduct = {
        title,
        price,
        sale,
        brand,
        inStock: options,
        category: category,
        subCategories: subCategory,
        options: activeVariants,
        description,
        sex,
        color,
        gallery: urls,
        status,
      };
      await axios.post(backendUrl + "/api/v1/products", newProduct);
      rerenderProducts((prev: boolean) => !prev);
      setFileRefs([]);
      setUploadTasks([]);
      setLoading(false);
      setAlert({
        active: true,
        type: status === "publish" ? "success" : "warning",
        text:
          status === "publish"
            ? activeLanguage.productPublishedSuccessfully
            : activeLanguage.productUploadedButNotPublished,
      });
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  }

  // clear fields

  const ClearFields = () => {
    setFiles([]);
    setTitle("");
    setPrice("");
    setSale("");
    setSex("Men");
    setBrand("");
    setColor("Black");
    setCategory("Shoes");
    setSubCategory([]);
    setDescription({ en: "", ru: "", ka: "" });
    setOptions([{ id: v4(), qnt: "", size: "" }]);
    setActiveVariants([]);
    setVariantsInput("");
  };

  // cancel uploading
  const uploadTaskRef = useRef<UploadTask | null>(null);

  const cancelUpload = () => {
    // Cancel all upload tasks
    uploadTasks.forEach((task) => {
      if (task && typeof task.cancel === "function") {
        task.cancel();
      }
    });

    if (uploadTaskRef.current) {
      uploadTaskRef.current.cancel();
    }
    setAlert({
      active: true,
      type: "warning",
      text: activeLanguage.uploadingCanceled,
    });
    fileRefs.forEach(async (fileRef) => {
      if (fileRef) {
        try {
          await deleteObject(fileRef);
        } catch (error) {
          console.error("Error deleting uploaded file:", error);
        }
      }
    });
  };

  /**
   * Field Warnings
   */

  // field warnings states
  const [fieldWarnings, setFieldWarnings] = useState({
    title: false,
    price: false,
    brand: false,
    category: false,
    sex: false,
    color: false,
    inStock: false,
  });

  useEffect(() => {
    // warning if some field isnot filled right

    if (title.length < 1 || title.length > 70) {
      setFieldWarnings((prev) => ({ ...prev, title: true }));
    } else {
      setFieldWarnings((prev) => ({ ...prev, title: false }));
    }
    if (price.length < 1 || price.length > 30) {
      setFieldWarnings((prev) => ({ ...prev, price: true }));
    } else {
      setFieldWarnings((prev) => ({ ...prev, price: false }));
    }
    if (brand.length < 1 || brand.length > 30) {
      setFieldWarnings((prev) => ({ ...prev, brand: true }));
    } else {
      setFieldWarnings((prev) => ({ ...prev, brand: false }));
    }
    if (options[0].qnt.length < 1 || options[0].qnt.length > 1000) {
      setFieldWarnings((prev) => ({ ...prev, inStock: true }));
    } else {
      setFieldWarnings((prev) => ({ ...prev, inStock: false }));
    }
  }, [title, price, brand, options]);

  return (
    <Container
      style={{
        transform: `scale(${open ? 1 : 0})`,
        opacity: open ? 1 : 0,
        borderRadius: open ? "0" : "500px",
        color: theme.primaryText,
      }}
      onClick={close}
    >
      {loading && (
        <UploaderPercentage
          setLoading={setLoading}
          progress={uploadProgress}
          setProgress={setUploadProgress}
          cancelUpload={cancelUpload}
        />
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: isMobile ? "100vw" : "70vw",
          height: isMobile ? "90vh" : "90vh",
          borderRadius: "20px",
          border: `1px solid ${theme.line}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          gap: isMobile ? "16px" : "24px",
          background: theme.background,
          overflowY: "auto",
          padding: isMobile ? "16px 16px 40px 16px" : "24px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <h1 style={{ fontSize: "24px" }}>{activeLanguage.addProduct}</h1>

          <MdClose
            size={32}
            color={theme.primary}
            style={{ position: "absolute", right: "0px" }}
            onClick={close}
          />
        </div>
        <FieldContainer>
          <h2 style={{ color: theme.primaryText }}>{activeLanguage.title}*</h2>
          <Input
            label={activeLanguage.title}
            type="text"
            value={title}
            onChange={setTitle}
            warning={fieldWarnings.title}
          />
        </FieldContainer>
        <FieldContainer>
          <h2 style={{ color: theme.primaryText }}>{activeLanguage.price}*</h2>
          <Input
            label={activeLanguage.price}
            type="number"
            value={price}
            onChange={setPrice}
            warning={fieldWarnings.price}
          />
        </FieldContainer>
        <FieldContainer>
          <h2 style={{ color: theme.primaryText }}>
            {activeLanguage.sale} {activeLanguage.optional}
          </h2>
          <Input
            label={activeLanguage.sale}
            type="number"
            value={sale}
            onChange={setSale}
            warning={false}
          />
        </FieldContainer>
        <FieldContainer>
          <h2 style={{ color: theme.primaryText }}>{activeLanguage.brand}*</h2>
          <Input
            label={activeLanguage.brand}
            type="text"
            value={brand}
            onChange={setBrand}
            warning={fieldWarnings.brand}
          />
        </FieldContainer>
        <FieldContainer>
          <h2 style={{ color: theme.primaryText }}>
            {activeLanguage.category}
          </h2>
          <FormGroup row>
            {categories.map((item: any, index: number) => {
              return (
                <FormControlLabel
                  key={index}
                  sx={{ color: theme.secondaryText }}
                  control={
                    <Radio
                      checked={category === item.item} // Determine if the item is selected
                      onChange={(e) => setCategory(item.item)}
                      name={item.item}
                      sx={{ color: theme.secondaryText }}
                    />
                  }
                  label={item.label}
                />
              );
            })}
          </FormGroup>
        </FieldContainer>
        <FieldContainer>
          <h2 style={{ color: theme.primaryText }}>
            {activeLanguage.subCategories} {activeLanguage.optional}
          </h2>
          {category?.length > 0 ? (
            <FormGroup row>
              {categories
                .filter((i: any) => category === i.item)
                .reduce((acc: string[], currentItem: any) => {
                  return acc.concat(currentItem.subCategories);
                }, [])
                .map((item: any, index: number) => {
                  return (
                    <FormControlLabel
                      key={index}
                      sx={{ color: theme.secondaryText }}
                      control={
                        <Checkbox
                          checked={subCategory?.includes(item.item)}
                          onChange={(e: any) => {
                            if (e.target.checked) {
                              setSubCategory((prev: any) => [
                                ...prev,
                                item.item,
                              ]);
                            } else {
                              setSubCategory((prev: any) =>
                                prev.filter((c: any) => c !== item.item)
                              );
                            }
                          }}
                          name={item.item}
                          sx={{ color: theme.secondaryText }}
                        />
                      }
                      label={item.label}
                    />
                  );
                })}
            </FormGroup>
          ) : (
            <span style={{ color: theme.secondaryText }}>
              {activeLanguage.notFound}
            </span>
          )}
        </FieldContainer>
        <FieldContainer>
          <h2 style={{ color: theme.primaryText }}>{activeLanguage.sex}</h2>
          <FormGroup row>
            {genders.map((item: any, index: number) => {
              return (
                <FormControlLabel
                  key={index}
                  sx={{ color: theme.secondaryText }}
                  control={
                    <Radio
                      checked={sex === item.value} // Determine if the item is selected
                      onChange={(e) => setSex(item.value)}
                      name={item.value}
                      sx={{ color: theme.secondaryText }}
                    />
                  }
                  label={item.label}
                />
              );
            })}
          </FormGroup>
        </FieldContainer>
        <FieldContainer>
          <h2 style={{ color: theme.primaryText }}>{activeLanguage.color}</h2>
          <FormGroup row>
            {colors.map((item: any, index: number) => {
              return (
                <FormControlLabel
                  key={index}
                  sx={{ color: theme.secondaryText, width: "120px" }}
                  control={
                    <Radio
                      checked={color === item.name} // Determine if the item is selected
                      onChange={(e) => setColor(item.name)}
                      name={item.name}
                      sx={{ color: item.hex }}
                    />
                  }
                  label={item.label}
                />
              );
            })}
          </FormGroup>
        </FieldContainer>
        <FieldContainer>
          <h2 style={{ color: theme.primaryText }}>
            {activeLanguage.inStock}*
          </h2>
          <InStock
            category={category}
            options={options}
            setOptions={setOptions}
            setFiles={setFiles}
            fieldWarning={fieldWarnings.inStock}
          />
        </FieldContainer>
        <FieldContainer>
          <h2 style={{ color: theme.primaryText }}>
            {activeLanguage.variants} {activeLanguage.optional}
          </h2>
          <Search search={variantsInput} setSearch={setVariantsInput} />

          {variantsInput?.length > 0 && variants?.length > 0 && (
            <OptionsContainer
              style={{ width: "40vw", border: `1px solid ${theme.line}` }}
            >
              {variants?.map((item: any, index: number) => {
                let cover = item.gallery.find((i: any) => i.cover);
                return (
                  <OptionItem
                    style={{
                      border: `1px solid ${theme.line}`,
                      width: "40vw",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      color: activeVariants.some(
                        (it: any) => it._id === item._id
                      )
                        ? theme.primary
                        : "inherit",
                    }}
                    onClick={() => {
                      setActiveVariants((prev: any) => {
                        const isItemIncluded = prev.some(
                          (variant: any) => variant._id === item._id
                        );

                        if (isItemIncluded) {
                          return prev.filter(
                            (variant: any) => variant._id !== item._id
                          );
                        } else {
                          return [
                            ...prev,
                            {
                              _id: item._id,
                              cover: {
                                url: cover.url,
                                type: cover.type,
                              },
                              title: item.title,
                            },
                          ];
                        }
                      });
                    }}
                    key={index}
                  >
                    <div
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: "50px",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {cover.url ? (
                        <>
                          {cover.type.includes("video") ? (
                            <video
                              key={cover?.url}
                              controls={false}
                              autoPlay
                              loop
                              muted
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            >
                              <source src={cover?.url} type={cover?.type} />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <img
                              src={cover.url}
                              height={40}
                              width={40}
                              alt="img"
                              style={{
                                borderRadius: "5px",
                                objectFit: "cover",
                              }}
                            />
                          )}
                        </>
                      ) : (
                        <FaImage size={30} color={theme.secondaryText} />
                      )}
                    </div>
                    {item.title}
                    <div style={{ width: 40 }} />
                  </OptionItem>
                );
              })}
              {totalVariants > variants?.length && (
                <div
                  onClick={AddOptions}
                  style={{
                    color: theme.primary,
                    cursor: "pointer",
                    margin: "8px 0",
                  }}
                >
                  {activeLanguage.loadMore}
                </div>
              )}
            </OptionsContainer>
          )}
        </FieldContainer>
        {activeVariants?.length > 0 && (
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {activeVariants?.map((item: any, index: number) => {
              return (
                <OptionItem
                  style={{
                    border: `1px solid ${theme.line}`,
                    width: isMobile ? "100%" : "40vw",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  onClick={() =>
                    setActiveVariants((prev: any) =>
                      prev.filter((i: any) => i._id !== item._id)
                    )
                  }
                  key={index}
                >
                  <div
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: "50px",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item?.cover.url ? (
                      <>
                        {item.cover.type.includes("video") ? (
                          <video
                            key={item.cover?.url}
                            controls={false}
                            autoPlay
                            loop
                            muted
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          >
                            <source
                              src={item.cover?.url}
                              type={item.cover?.type}
                            />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={item.cover.url}
                            height={40}
                            width={40}
                            alt="img"
                            style={{
                              borderRadius: "5px",
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </>
                    ) : (
                      <FaImage size={30} color={theme.secondaryText} />
                    )}
                  </div>
                  {item.title}
                  <MdClose
                    color={theme.primary}
                    size={18}
                    style={{ cursor: "pointer" }}
                  />
                </OptionItem>
              );
            })}
          </div>
        )}
        <FieldContainer>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2 style={{ color: theme.primaryText }}>
              {activeLanguage.description} {activeLanguage.optional}
            </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
              }}
            >
              <ReactCountryFlag
                className="emojiFlag"
                onClick={() => setActiveLanguageInput("GE")}
                countryCode="GE"
                style={{
                  opacity: activeLanguageInput === "GE" ? 1 : 0.5,
                  cursor: "pointer",
                }}
                aria-label="Georgia"
              />
              <ReactCountryFlag
                className="emojiFlag"
                onClick={() => setActiveLanguageInput("US")}
                countryCode="US"
                style={{
                  opacity: activeLanguageInput === "US" ? 1 : 0.5,
                  cursor: "pointer",
                }}
                aria-label="United States"
              />
              <ReactCountryFlag
                className="emojiFlag"
                onClick={() => setActiveLanguageInput("RU")}
                countryCode="RU"
                style={{
                  opacity: activeLanguageInput === "RU" ? 1 : 0.5,
                  cursor: "pointer",
                }}
                aria-label="Russia"
              />
            </div>
          </div>
          <TextArea
            style={{ border: `1px solid ${theme.line}` }}
            placeholder={
              activeLanguageInput === "GE"
                ? activeLanguage.description + " " + activeLanguage.ka
                : activeLanguageInput === "US"
                ? activeLanguage.description + " " + activeLanguage.ru
                : activeLanguage.description + " " + activeLanguage.en
            }
            primary={theme.primary}
            primarytext={theme.primaryText}
            value={
              activeLanguageInput === "GE"
                ? description.ka
                : activeLanguageInput === "US"
                ? description.en
                : description.ru
            }
            onChange={(e) => {
              if (activeLanguageInput === "GE") {
                setDescription({
                  ...description,
                  ka: e.target.value,
                });
              } else if (activeLanguageInput === "US") {
                setDescription({
                  ...description,
                  en: e.target.value,
                });
              } else {
                setDescription({
                  ...description,
                  ru: e.target.value,
                });
              }
            }}
          />
        </FieldContainer>
        <FieldContainer
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: "16px",
            border: `1px solid ${theme.line}`,
            borderRadius: "15px",
          }}
        >
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            multiple
            onChange={handleFileUpload}
          />
          <label
            htmlFor="fileInput"
            style={{ cursor: "pointer" }}
            className="hover"
          >
            <FcAddImage size={120} color={theme.secondaryText} />
          </label>
          <span style={{ color: theme.secondaryText, fontSize: "14px" }}>
            {activeLanguage.uploadInstruction}
            {activeLanguage.optional}
          </span>
        </FieldContainer>
        {files?.length > 0 && (
          <span>
            {files?.length} {activeLanguage.files}
          </span>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "8px",
          }}
        >
          {files.map((item: any, index) => {
            return (
              <div
                key={index}
                style={{
                  padding: "8px",
                  borderRadius: "20px",
                  border: `1px solid ${theme.line}`,
                }}
              >
                <div
                  onClick={() => setFileAsCover(index)}
                  style={{
                    width: isMobile ? "85vw" : "312px",
                    height: isMobile ? "85vw" : "312px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "20px",
                    position: "relative",
                    border: item.cover
                      ? `2px solid ${theme.primary}`
                      : `2px solid transparent`,
                  }}
                >
                  {item.cover && (
                    <span
                      style={{
                        position: "absolute",
                        top: "16px",
                        left: "16px",
                        zIndex: 10000,
                        color: theme.primary,
                        fontSize: "16px",
                        fontWeight: "500",
                      }}
                    >
                      {activeLanguage.cover}
                    </span>
                  )}
                  <MdDelete
                    className="hover"
                    onClick={(e) => {
                      e.stopPropagation();

                      setFiles((prev) => {
                        // Determine if the item being removed is the cover
                        const isCover = item.cover;

                        // Filter out the item
                        const newFiles = prev.filter((i) => i !== item);

                        // If the removed item was the cover, assign cover to the first item of the new array
                        if (isCover && newFiles.length > 0) {
                          newFiles[0].cover = true;
                        }

                        return newFiles;
                      });
                    }}
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      zIndex: 10000,
                      color: theme.primary,
                      fontSize: "32px",
                      cursor: "pointer",
                    }}
                  />
                  {item?.blob.type.startsWith("video/") ? (
                    <video
                      key={URL.createObjectURL(item.blob)}
                      controls
                      autoPlay
                      loop
                      muted
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "20px", // Match your NextImage styles if necessary
                      }}
                    >
                      <source
                        src={URL.createObjectURL(item.blob)}
                        type={item?.blob.type}
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={URL.createObjectURL(item.blob)}
                      alt="Preview"
                      style={{
                        objectFit: "cover",
                        cursor: "pointer",
                        width: "100%",
                        height: "100%",
                      }} // Ensures the image covers the container
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: isMobile ? "column" : "row",
            width: isMobile ? "100%" : "40vw",
            gap: "16px",
          }}
        >
          <Button
            title={activeLanguage.cancel}
            color={theme.secondaryText}
            background={theme.lineDark}
            onClick={close}
          />
          <Button
            title={activeLanguage.clear}
            color={theme.lightBackground}
            background={theme.primary}
            onClick={ClearFields}
          />
          <Button
            title={activeLanguage.saveInDraft}
            color={theme.lightBackground}
            background={"orange"}
            onClick={() => FileUpload("unPublish")}
          />
          <Button
            title={activeLanguage.publish}
            color={theme.lightBackground}
            background={"green"}
            onClick={() => FileUpload("publish")}
          />
        </div>
      </div>
    </Container>
  );
};

export default AddProduct;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  transition: ease-in-out 200ms;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    align-items: start;
  }

  .hover {
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const FieldContainer = styled.div`
  width: 40vw;
  max-width: 40vw;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }

  & > h2 {
    font-size: 18px;
    font-weight: medium;
  }

  .emojiFlag {
    font-size: 16px;
    line-seight: 16px;
    cursor: pointer;
    transition: ease-in 200ms;

    &:hover {
      transform: scale(1.2);
    }
  }
`;

interface TextAreaProps {
  primarytext: string;
  primary: string;
}

const TextArea = styled.textarea<TextAreaProps>`
  color: ${(props) => props.primarytext};
  background: none;
  width: 100%;
  height: 200px;
  border-radius: 20px;
  padding: 16px;
  box-sizing: border-box;
  font-size: 16px;

  &:focus {
    border: 1px solid ${(props) => props.primary};
  }
`;

const OptionsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: black;
  border-radius: 10px;
  max-height: 250px;
  overflow-y: auto;
`;

const OptionItem = styled.div`
  width: 100%;
  border-radius: 10px;
  padding: 4px;
  text-align: center;
  cursor: pointer;
  transition: ease-in 200ms;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;
