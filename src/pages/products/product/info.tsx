import StarIcon from "@mui/icons-material/Star";
import { Breadcrumbs, Rating, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaImage, FaShare } from "react-icons/fa";
import { HiOutlineSave } from "react-icons/hi";
import { IoBagAdd, IoBagRemove } from "react-icons/io5";
import styled from "styled-components";
import { useTheme } from "../../../context/theme";
import { Link, useNavigate } from "react-router-dom";
import { useShippingContext } from "../../../context/shipping";
import { useAppContext } from "../../../context/app";
import { useProductsContext } from "../../../context/productsContext";
import { BiMinus, BiPlus } from "react-icons/bi";
import { FavoriteOutlined } from "@mui/icons-material";
import axios from "axios";
import { useCurrentUserContext } from "../../../context/currentUser";
import ShareComponent from "./shareComponent";
import { MdClose } from "react-icons/md";

interface AddButtonProps {
  primary: string;
}
interface ActionButtonProps {
  primarytext: string;
}
interface ItemContainerProps {
  secondarytext: string;
}

interface ProductTypes {
  product: any;
  actions: any;
  setActions: (prev: any) => void;
}

const Info: React.FC<ProductTypes> = ({ product, actions, setActions }) => {
  const { theme } = useTheme();

  const navigate = useNavigate();

  const {
    isMobile,
    storeInfo,
    setAlert,
    backendUrl,
    setPageLoading,
    activeLanguage,
  } = useAppContext();

  // add to cart icon config
  // order
  const { order, setOrder } = useShippingContext();

  // size
  // const [selectSize, setSelectSize] = useState(12);
  const [selectSize, setSelectSize] = useState(
    product?.inStock?.length > 0 && product?.inStock[0]?.size
  );

  const { categories } = useProductsContext();

  const AddToCart = (itm: any) => {
    const isItemInOrder = order?.items.some(
      (i: any) => i.SKU === itm._id + selectSize
    );
    return isItemInOrder ? (
      <AddButton
        style={{}}
        primary={theme.lineDark}
        onClick={() =>
          setOrder((prev: any) => ({
            ...prev,
            items: prev.items.filter(
              (i: any) => i.SKU !== itm._id + selectSize
            ),
          }))
        }
      >
        <IoBagRemove
          fontSize={isMobile ? 20 : 24}
          color={theme.secondaryText}
        />
        <span
          style={{
            color: theme.secondaryText,
            fontSize: isMobile ? "14px" : "16px",
          }}
        >
          {activeLanguage.removeFromCart}
        </span>
      </AddButton>
    ) : (
      <AddButton
        style={{ border: `1px solid ${theme.lineDark}` }}
        primary={theme.primary}
        onClick={() => {
          if (!selectSize) {
            setAlert({
              active: true,
              type: "error",
              text: activeLanguage.pleaseChooseSize,
            });
          } else {
            if (stock > 0) {
              let cover = itm.gallery.find((i: any) => i.cover);
              setOrder((prev: any) => ({
                ...prev,
                items: [
                  ...prev.items.filter(
                    (it: any) => it.SKU !== itm._id + selectSize
                  ),
                  {
                    id: itm._id,
                    SKU: itm._id + selectSize,
                    title: itm.title,
                    brand: itm.brand,
                    category: itm.category,
                    subCategory: itm.subCategories,
                    cover: { url: cover.url, type: cover.type },
                    price: itm.price,
                    sale: itm.sale,
                    quantity: 1,
                    inStock: itm.inStock,
                    color: itm.color,
                    size: selectSize,
                    sex: itm.sex,
                    rating: itm.rating,
                  },
                ],
              }));
            } else {
              setAlert({
                active: true,
                text: activeLanguage.productSoldOut,
                type: "warning",
              });
            }
          }
        }}
      >
        <IoBagAdd fontSize={isMobile ? 20 : 24} color={theme.lightBackground} />
        <span
          style={{
            color: theme.lightBackground,
            fontSize: isMobile ? "14px" : "16px",
          }}
        >
          {activeLanguage.addToCart}
        </span>
      </AddButton>
    );
  };

  // product context
  const {
    colors,
    setSex,
    setPrice,
    setSale,
    setActiveCategory,
    setActiveSubCategory,
    setBrand,
    setRating,
    setSize,
    setColor,
  } = useProductsContext();

  // increament
  const stock = product?.inStock?.find((i: any) => i.size === selectSize)?.qnt;

  // current user
  const { currentUser } = useCurrentUserContext();

  /**
   * Save/unsave product
   */

  const SaveProduct = async (action: string) => {
    try {
      if (action === "save") {
        setActions((prev: any) => ({ ...prev, saved: true }));
      } else {
        setActions((prev: any) => ({ ...prev, saved: false }));
      }
      await axios.patch(
        backendUrl +
          "/api/v1/products/" +
          product?._id +
          "/save?action=" +
          action,
        {
          userId: currentUser._id,
        }
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  /**
   * Share product
   */
  const [openShareOptions, setOpenShareOptions] = useState(false);

  /**
   * Set star rating to product
   */

  const [productRating, setProductRating] = useState({ rating: 0, length: 0 });

  useEffect(() => {
    // Update state based on the current product ratings
    setProductRating({
      rating: parseFloat(product?.ratings?.rating) || 0,
      length: product?.ratings?.length || 0,
    });
  }, [product]);

  const SetRating = async (star: number) => {
    try {
      const currentRating = productRating.rating; // Current average rating
      const currentLength = productRating.length; // Current number of ratings
      const newRating = star; // New rating being added

      if (star > 0) {
        setActions((prev: any) => ({ ...prev, rating: star }));
        // Update state based on whether it's a new rating or an update to an existing rating
        if (!actions.rating) {
          // For a new rating
          setProductRating({
            rating: currentRating + newRating,
            length: currentLength + 1,
          });
        } else {
          setProductRating({
            rating: currentRating - actions?.rating + newRating,
            length: currentLength, // Length remains unchanged since this is an update
          });
        }
      } else {
        setActions((prev: any) => ({ ...prev, rating: null }));
        if (!actions.rating) {
          return;
        } else {
          setProductRating({
            rating: currentRating - actions?.rating,
            length: currentLength - 1, // Length remains unchanged since this is an update
          });
        }
      }

      // Update rating in the backend
      await axios.patch(
        `${backendUrl}/api/v1/products/${product?._id}/rating`,
        {
          userId: currentUser._id,
          star: newRating,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  // transition await components
  const [transition, setTransition] = useState(true);
  useEffect(() => {
    setTransition(true);
    setTransition(false);
  }, [product]);

  return (
    <Container
      style={{
        height: isMobile ? "auto" : "550px",
        border: `1px solid ${theme.lineDark}`,
        padding: isMobile ? "12px" : "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {!isMobile && (
            <Breadcrumbs
              aria-label="breadcrumb"
              style={{
                color: theme.secondaryText,
                letterSpacing: "0.5px",
                fontSize: isMobile ? "14px" : "16px",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              <Link
                to={"/products"}
                color="inherit"
                onClick={() => {
                  setPageLoading(true);
                  setSex([]);
                  setPrice([0, 1000]);
                  setSale([0, 100]);
                  setActiveCategory(product?.category);
                  setActiveSubCategory([]);
                  setBrand([]);
                  setRating([0, 5]);
                  setSize([]);
                  setColor([]);
                }}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {
                  categories?.find((i: any) => i.item === product?.category)
                    ?.label
                }
              </Link>
              <Link
                style={{ textDecoration: "none", color: "inherit" }}
                to={"/products"}
                color="inherit"
                onClick={() => {
                  setPageLoading(true);
                  setSex([]);
                  setPrice([0, 1000]);
                  setSale([0, 100]);
                  setActiveCategory(product?.category);
                  setActiveSubCategory(product?.subCategories);
                  setBrand([]);
                  setRating([0, 5]);
                  setSize([]);
                  setColor([]);
                }}
              >
                {product?.subCategories?.length > 0 &&
                  categories
                    ?.flatMap((cat: any) => cat.subCategories)
                    ?.find((i: any) => i.item === product?.subCategories[0])
                    ?.label}
              </Link>
              <div
                style={{
                  opacity: 0.7,
                  cursor: "default",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                {product?.title}
              </div>
            </Breadcrumbs>
          )}
          <div
            style={{
              position: "relative",
              width: isMobile ? "100%" : "auto",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <ActionButton
                style={{
                  width: isMobile ? "38px" : "40px",
                  height: isMobile ? "38px" : "40px",
                  opacity: transition ? 0 : 1,
                  transition: "ease-in 300ms",
                  transform: `scale(${transition})`,

                  background: theme.lightBackground,
                }}
                primarytext={
                  actions?.saved ? theme.primary : theme.secondaryText
                }
                onClick={
                  currentUser
                    ? () => SaveProduct(actions?.saved ? "remove" : "save")
                    : () => navigate("/login")
                }
              >
                <FavoriteOutlined
                  sx={{
                    fontSize: isMobile ? 20 : 24,
                  }}
                  id="icon"
                />
              </ActionButton>

              <ActionButton
                style={{
                  width: isMobile ? "38px" : "40px",
                  height: isMobile ? "38px" : "40px",
                  background: theme.lightBackground,
                }}
                primarytext={theme.primaryText}
                onClick={() => setOpenShareOptions((prev) => !prev)}
              >
                {openShareOptions ? (
                  <MdClose size={isMobile ? 20 : 24} color="red" />
                ) : (
                  <FaShare fontSize={isMobile ? 20 : 24} id="icon" />
                )}
              </ActionButton>
              {openShareOptions && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    position: "absolute",
                    right: 0,
                    top: "40px",
                    background: theme.background,
                    padding: "0 24px",
                    borderRadius: "50px",
                  }}
                >
                  <ShareComponent productId={product?._id} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            position: isMobile ? "relative" : "static",
            bottom: isMobile ? "40px" : "0",
            fontWeight: 500,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginBottom: "24px",
              }}
            >
              <ItemContainer
                secondarytext={theme.secondaryText}
                style={{ marginRight: "16px" }}
              >
                <h2
                  style={{
                    fontSize: isMobile ? "18px" : "24px",
                    fontWeight: "bold",
                    color: theme.primaryText,
                  }}
                >
                  {product?.title}
                </h2>
              </ItemContainer>
              <StarIcon
                style={{
                  fontSize: isMobile ? "20px" : "28px",
                  position: "relative",
                  bottom: isMobile ? "0" : "2px",
                  color: "#FFA726",
                }}
              />
              <span
                style={{
                  color: theme.primaryText,
                  fontSize: isMobile ? "18px" : "24px",
                  fontWeight: "bold",
                }}
              >
                {productRating.length > 0
                  ? (productRating.rating / productRating.length).toFixed(1)
                  : "0.0"}
              </span>
            </div>
          </div>

          <ItemContainer
            secondarytext={theme.secondaryText}
            style={{ marginLeft: "8px" }}
          >
            <span>{activeLanguage.price}: </span>
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              {product?.sale > 0 && (
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: theme.primaryText,
                  }}
                >
                  {storeInfo?.currency === "Dollar"
                    ? "$"
                    : storeInfo?.currency == "Euro"
                    ? "€"
                    : "₾"}
                  {product?.price - (product?.price / 100) * product?.sale}
                </span>
              )}
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color:
                    product?.sale > 0 ? theme.secondaryText : theme.primaryText,
                  textDecoration: product?.sale > 0 ? "line-through" : "none",
                  marginLeft: "4px",
                }}
              >
                {storeInfo?.currency === "Dollar"
                  ? "$"
                  : storeInfo?.currency == "Euro"
                  ? "€"
                  : "₾"}
                {product?.price}
              </span>
              <span style={{ color: theme.secondaryText }}>
                (-{product?.sale}%)
              </span>
            </div>
          </ItemContainer>

          <ItemContainer
            secondarytext={theme.secondaryText}
            style={{
              marginLeft: "8px",
              marginTop: isMobile ? "0" : "8px",
            }}
          >
            <span>{activeLanguage.brand}: </span>
            <p style={{ fontSize: "16px", color: theme.primaryText }}>
              {product?.brand}
            </p>
          </ItemContainer>
          {product?.color !== "Other" && (
            <ItemContainer
              secondarytext={theme.secondaryText}
              style={{
                marginLeft: "8px",
                marginTop: isMobile ? "0px" : "8px",
              }}
            >
              <span>{activeLanguage.color}: </span>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50px",
                  background: colors.find((i: any) => i.name === product?.color)
                    ?.hex,
                }}
              />
              <p
                style={{
                  fontSize: "16px",
                  color: theme.primaryText,
                }}
              >
                {product?.color}
              </p>
            </ItemContainer>
          )}
          <ItemContainer
            secondarytext={theme.secondaryText}
            style={{
              marginLeft: "8px",
              marginTop: isMobile ? "0" : "8px",
            }}
          >
            <span>{activeLanguage.sex}: </span>
            <p
              style={{
                fontSize: "16px",
                color: theme.primaryText,
              }}
            >
              {product?.sex}
            </p>
          </ItemContainer>
          {product?.inStock?.some((i: any) => i.qnt > 0) && (
            <ItemContainer
              secondarytext={theme.secondaryText}
              style={{
                marginLeft: "8px",
                marginTop: isMobile ? "0" : "8px",
                flexDirection: "column",
                alignItems: "start",
              }}
            >
              <span>{activeLanguage.sizes}: </span>
              <div
                style={{
                  // border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "8px",
                  maxWidth: "32vw",
                }}
              >
                {product?.inStock.map((it: any, x: any) => {
                  return (
                    <div
                      onClick={() => setSelectSize(it.size)}
                      key={x}
                      style={{
                        fontSize: "16px",
                        color: theme.primaryText,
                        border: `1px solid ${
                          selectSize === it.size ? theme.primary : theme.line
                        }`,
                        padding: "4px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        width: isMobile ? "auto" : "3vw",
                        textAlign: "center",
                      }}
                    >
                      {it.size}
                    </div>
                  );
                })}
              </div>
            </ItemContainer>
          )}
        </div>

        {product?.options?.length > 0 && (
          <ItemContainer
            secondarytext={theme.secondaryText}
            style={{
              marginLeft: "8px",
              flexDirection: "column",
              alignItems: "center",
              position: "absolute",
              right: isMobile ? "16px" : "32px",
              top: isMobile ? "77px" : "120px",
              opacity: transition ? 0 : 1,
              transition: "ease-in 200ms",
              transform: `scale(${transition})`,
            }}
          >
            <span style={{ fontWeight: "600" }}>
              {activeLanguage.options}:{" "}
            </span>
            <div
              style={{
                borderRadius: "10px",
                padding: "12px",
                overflowY: "auto",
                height: "220px",
              }}
            >
              {product?.options.map((itm: any, indx: number) => {
                return (
                  <Link
                    className="link"
                    key={indx}
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "100px",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      margin: "8px 0px",
                    }}
                    to={`/products/${itm._id}`}
                  >
                    {itm.cover.url ? (
                      <>
                        {itm.cover.type.includes("video") ? (
                          <video
                            key={itm.cover?.url}
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
                              src={itm.cover?.url}
                              type={itm.cover?.type}
                            />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={itm.cover.url}
                            width={45}
                            height={45}
                            alt="nike"
                            style={{ objectFit: "cover", border: "none" }}
                          />
                        )}
                      </>
                    ) : (
                      <FaImage size={35} color={theme.secondaryText} />
                    )}
                  </Link>
                );
              })}
            </div>
          </ItemContainer>
        )}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "100%",
            justifyContent: "space-between",
            marginTop: isMobile ? "16px" : "auto",
          }}
        >
          {AddToCart(product)}

          {actions?.canAction && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                opacity: transition ? 0 : 1,
                transition: "ease-in 200ms",
              }}
            >
              <Stack spacing={1}>
                <Rating
                  name="half-rating-read"
                  value={actions?.rating ?? 0}
                  size="large"
                  onChange={(event, newValue) => {
                    SetRating(newValue || 0);
                  }}
                  emptyIcon={
                    <StarIcon
                      style={{ opacity: 0.55, color: theme.secondaryText }}
                      fontSize="inherit"
                    />
                  }
                />
              </Stack>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Info;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  overflow: hidden;
  gap: 8px;
  border-radius: 20px;
  position: relative;
`;

const ItemContainer = styled.div<ItemContainerProps>`
  display: flex;
  align-items: center;
  gap: 8px;

  & > span {
    font-size: 16px;
    color: ${(props) => props.secondarytext};
  }

  .link {
    &:hover {
      opacity: 0.9;
    }
  }
`;

const AddButton = styled.div<AddButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 100px;
  background: ${(props) => props.primary};
  width: 300px;
  height: 45px;
  cursor: pointer;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 55%;
    height: 40px;
    font-weight: 600;
  }

  &:hover {
    filter: brightness(0.95);
  }
`;
const ActionButton = styled.div<ActionButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 10px;

  cursor: pointer;
  box-sizing: border-box;

  #icon {
    color: ${(props) => props.primarytext};

    &:hover {
      opacity: 0.9;
    }
  }
`;
