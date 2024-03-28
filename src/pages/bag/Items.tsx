import { useAppContext } from "../../context/app";
import { useCurrentUserContext } from "../../context/currentUser";
import { useShippingContext } from "../../context/shipping";
import { useTheme } from "../../context/theme";
import axios from "axios";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { BiMinus, BiPlus } from "react-icons/bi";
import { IoMdHeart } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import styled from "styled-components";

const Items: React.FC = () => {
  const { theme } = useTheme();
  // order
  const { order, setOrder } = useShippingContext();

  // language
  const { activeLanguage, isMobile, setPageLoading, setAlert } =
    useAppContext();

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  }, []);

  return (
    <ItemsContainer
      style={{
        border: `1px solid ${theme.lineDark}`,
        padding: isMobile ? "8px" : "24px",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          margin: isMobile ? "8px 16px" : "0px",
          fontWeight: "600",
        }}
      >
        {activeLanguage.bag}
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "8px" : "24px",
          marginTop: "16px",
        }}
      >
        {order?.items.length < 1 ? (
          <h2
            style={{
              color: theme.secondaryText,
              marginLeft: "24px",
              paddingBottom: "16px",
            }}
          >
            {activeLanguage.bagIsEmpty}
          </h2>
        ) : (
          order?.items.map((item: any, index: number) => {
            return (
              <Item item={item} key={index} order={order} setOrder={setOrder} />
            );
          })
        )}
      </div>
    </ItemsContainer>
  );
};

export default Items;

const ItemsContainer = styled.div`
  border-radius: 10px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const ItemContainer = styled.div`
  display: flex;
  gap: 16px;
  border-radius: 15px;

  .hover {
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const ImageWrapper = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  transition: ease-in 200ms;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const Item = ({ item, order, setOrder }: any) => {
  interface ActionsProps {
    saved: Boolean;
  }
  // user actions
  const [actions, setActions] = useState<ActionsProps>({ saved: false });

  // app context
  const {
    storeInfo,
    backendUrl,
    setPageLoading,
    activeLanguage,
    isMobile,
    setAlert,
  } = useAppContext();

  // current user
  const { currentUser } = useCurrentUserContext();

  // theme
  const { theme } = useTheme();

  // check current user actions in product
  useEffect(() => {
    const CheckProduct = async () => {
      try {
        const response = await axios.get(
          backendUrl +
            "/api/v1/products/check/" +
            item.id +
            "?user=" +
            currentUser._id
        );
        setActions(response.data.data);
      } catch (error: any) {
        console.log("product check error: " + error);
      }
    };
    if (currentUser) {
      CheckProduct();
    }
  }, [currentUser, item]);

  // increment / decriement quantity
  const handleChangeQuantity = (type: string, SKU: string) => {
    if (
      order?.items
        .find((i: any) => i.SKU === SKU)
        .inStock.find(
          (it: any) =>
            it.size === order?.items.find((i: any) => i.SKU === SKU).size
        ).qnt === order?.items.find((i: any) => i.SKU === SKU).quantity &&
      type === "increment"
    ) {
      return setAlert({
        active: true,
        text: activeLanguage.maxQuantityReached,
        type: "warning",
      });
    }
    // Find the index of the item to ensure we can update it in the array
    const itemIndex = order?.items.findIndex((i: any) => i.SKU === SKU);
    if (itemIndex === -1) return; // Item not found, optionally handle this case

    // Update the quantity of the found item based on the type
    const updatedItems = order?.items.map((item: any, index: number) => {
      if (index === itemIndex) {
        return {
          ...item,
          quantity:
            type === "increment"
              ? item.quantity + 1
              : Math.max(item.quantity - 1, 1), // Prevent negative quantities
        };
      }
      return item;
    });

    // Use setOrder or a similar function to update the state of the order
    setOrder((prevOrder: any) => ({
      ...prevOrder,
      items: updatedItems,
    }));
  };

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
        backendUrl + "/api/v1/products/" + item.id + "/save?action=" + action,
        {
          userId: currentUser._id,
        }
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  // transition
  const [transition, setTransition] = useState(true);
  useEffect(() => {
    setTransition(false);
  }, []);

  return (
    <ItemContainer
      style={{
        border: `1px solid ${theme.lineDark}`,
        flexDirection: isMobile ? "column" : "row",
        padding: isMobile ? "16px" : "24px",
      }}
    >
      <div
        style={{
          display: isMobile ? "flex" : "static",
          width: isMobile ? "100%" : "auto",
        }}
      >
        <ImageWrapper>
          <Link
            to={`/products/${item.id}`}
            onClick={() => {
              setPageLoading(true);
            }}
          >
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
                <source src={item.cover?.url} type={item.cover?.type} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={item.cover.url || "/cosmetics.png"}
                alt="Item"
                style={{ objectFit: "cover", width: "100%", aspectRatio: 1 }}
              />
            )}
          </Link>
        </ImageWrapper>
        {isMobile && (
          <div
            style={{
              width: "55%",
              display: "flex",
              alignItems: "flex-end",
              flexDirection: "column",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                opacity: transition ? 0 : 1,
                transition: "ease-in 200ms",
                transform: `scale(${transition ? 0 : 1})`,
                gap: "16px",
              }}
            >
              <IoMdHeart
                className="hover"
                size={24}
                style={{ cursor: "pointer" }}
                color={actions?.saved ? theme.primary : theme.primaryText}
                onClick={() => SaveProduct(actions?.saved ? "remove" : "save")}
              />

              <MdDelete
                className="hover"
                size={24}
                style={{ cursor: "pointer" }}
                color={theme.primaryText}
                onClick={() =>
                  setOrder({
                    ...order,
                    items: order?.items.filter((i: any) => i.SKU !== item.SKU),
                  })
                }
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                marginTop: "16px",
              }}
            >
              <h2
                style={{
                  fontSize: isMobile ? "14px" : "16px",
                  color: theme.secondaryText,
                  fontWeight: "500",
                }}
              >
                {activeLanguage.qnt}:
              </h2>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  marginLeft: "16px",
                  marginTop: "8px",
                  background: theme.line,
                  padding: "4px 8px",
                  borderRadius: "5px",
                  boxSizing: "border-box",
                  width: "100px",
                }}
              >
                <BiMinus
                  style={{
                    cursor: "pointer",
                    userSelect: "none", // Standard
                    WebkitUserSelect: "none", // WebKit
                    MozUserSelect: "none", // Firefox
                    msUserSelect: "none",
                  }}
                  className="hover"
                  color={theme.primaryText}
                  size={16}
                  onClick={() => handleChangeQuantity("decriment", item.SKU)}
                />
                {item.quantity}
                <BiPlus
                  style={{
                    cursor: "pointer",
                    userSelect: "none", // Standard
                    WebkitUserSelect: "none", // WebKit
                    MozUserSelect: "none", // Firefox
                    msUserSelect: "none",
                  }}
                  className="hover"
                  color={theme.primaryText}
                  size={16}
                  onClick={() => handleChangeQuantity("increment", item.SKU)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          width: "80%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          letterSpacing: "0.5px",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "start" : "center",
          }}
        >
          <h2 style={{ fontSize: "16px", fontWeight: "bold" }}>{item.title}</h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: isMobile ? "8px" : "0px",
            }}
          >
            {item.sale > 0 && (
              <span
                style={{
                  fontSize: isMobile ? "14px" : "16px",
                  fontWeight: "600",
                  color: theme.primaryText,
                }}
              >
                {storeInfo?.currency === "Dollar"
                  ? "$"
                  : storeInfo?.currency == "Euro"
                  ? "€"
                  : "₾"}
                {(
                  (item.price - (item.price / 100) * item.sale) *
                  item.quantity
                ).toFixed(2)}
              </span>
            )}
            <span
              style={{
                fontSize: isMobile ? "14px" : "16px",
                fontWeight: "500",
                color: item.sale > 0 ? theme.secondaryText : theme.primaryText,
                textDecoration: item.sale > 0 ? "line-through" : "none",
              }}
            >
              {storeInfo?.currency === "Dollar"
                ? "$"
                : storeInfo?.currency == "Euro"
                ? "€"
                : "₾"}
              {(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        </div>
        <h2
          style={{
            fontSize: isMobile ? "14px" : "16px",
            color: theme.secondaryText,
            fontWeight: "500",
          }}
        >
          {item.category} / {item.subCategory[0]}
        </h2>
        <h2
          style={{
            fontSize: isMobile ? "14px" : "16px",
            color: theme.secondaryText,
            fontWeight: "500",
          }}
        >
          {activeLanguage.size}: {item.size}
        </h2>

        {!isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px",
              marginTop: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                opacity: transition ? 0 : 1,
                transition: "ease-in 200ms",
                transform: `scale(${transition ? 0 : 1})`,
                gap: "16px",
              }}
            >
              <IoMdHeart
                className="hover"
                size={24}
                style={{ cursor: "pointer" }}
                color={actions?.saved ? theme.primary : theme.primaryText}
                onClick={() => SaveProduct(actions?.saved ? "remove" : "save")}
              />

              <MdDelete
                className="hover"
                size={24}
                style={{ cursor: "pointer" }}
                color={theme.primary}
                onClick={() =>
                  setOrder({
                    ...order,
                    items: order?.items.filter((i: any) => i.SKU !== item.SKU),
                  })
                }
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h2
                style={{
                  fontSize: "16px",
                  color: theme.secondaryText,
                  fontWeight: "400",
                }}
              >
                {activeLanguage.qnt}:
              </h2>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  marginLeft: "16px",
                  background: theme.line,
                  padding: "4px 8px",
                  borderRadius: "5px",
                  boxSizing: "border-box",
                  width: "100px",
                }}
              >
                <BiMinus
                  style={{
                    cursor: "pointer",
                    userSelect: "none", // Standard
                    WebkitUserSelect: "none", // WebKit
                    MozUserSelect: "none", // Firefox
                    msUserSelect: "none",
                  }}
                  className="hover"
                  color={theme.primary}
                  size={16}
                  onClick={() => handleChangeQuantity("decriment", item.SKU)}
                />
                <span style={{ fontWeight: "800" }}>{item.quantity}</span>
                <BiPlus
                  style={{
                    cursor: "pointer",
                    userSelect: "none", // Standard
                    WebkitUserSelect: "none", // WebKit
                    MozUserSelect: "none", // Firefox
                    msUserSelect: "none",
                  }}
                  className="hover"
                  color={theme.primary}
                  size={16}
                  onClick={() => handleChangeQuantity("increment", item.SKU)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ItemContainer>
  );
};
