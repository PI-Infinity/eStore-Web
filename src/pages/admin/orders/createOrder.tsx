import { Input } from "../../../components/input";
import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";
import {
  Button,
  FormControlLabel,
  FormGroup,
  Menu,
  MenuItem,
  Radio,
} from "@mui/material";
import axios from "axios";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import React, { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { FaImage } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import styled from "styled-components";
import Search from "../products/search";
import MapAutoComplete from "./mapAutocomplete";
import Total from "./total";

export default function CreateOrder({ setOrders }: any) {
  const { theme } = useTheme();

  const { storeInfo, activeLanguage, isMobile, backendUrl } = useAppContext();

  // products options
  const [products, setProducts] = useState([]);
  const [productsInput, setProductsInput] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);

  // getting products
  useEffect(() => {
    const GetOptions = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/products?page=${1}&limit=8&search=${productsInput}`
        );
        setProducts(response.data.data.products);
        setTotalProducts(response.data.totalProducts);
        setPage(1);
      } catch (error) {
        console.log(error);
      }
    };

    GetOptions();
  }, [productsInput]);

  const AddOptions = async () => {
    const newPage = page + 1;

    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/products?page=${newPage}&limit=8&search=${productsInput}`
      );
      setProducts((prevProducts: any) => {
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
   * order
   */

  const generateOrderId = () => {
    const now = new Date();
    return [
      now.getDate().toString().padStart(2, "0"),
      (now.getMonth() + 1).toString().padStart(2, "0"), // Months are zero-indexed
      now.getFullYear().toString().slice(-2),
      now.getHours().toString().padStart(2, "0"),
      now.getMinutes().toString().padStart(2, "0"),
      now.getSeconds().toString().padStart(2, "0") +
        now.getMilliseconds().toString().padStart(3, "0"),
    ].join("");
  };

  // shipping variants
  const [shippingVariants, setShippingVariants] = useState([]);
  const [deliveryType, setDeliveryType] = useState("delivery");

  const [order, setOrder] = useState({
    items: [],
    shipping: {
      cost: 0,
      currency: "$",
      address: "",
      addationalInfo: "",
      phone: "",
      estimatedDelivery: "",
      paymentMethod: "",
      estimatedTax: 0,
    },
    buyer: {
      firstName: "",
      lastName: "",
      id: "no ID",
      email: "",
    },
    promotions: [],
    comment: "",
    returnPolicy: "",
    status: "Pending",
    orderId: generateOrderId(),
    subtotal: 0,
    discount: 0,
    total: 0,
  });

  const addSize = (itemId: any, selectedSize: string, SKU: string) => {
    console.log(SKU);
    setOrder((prevOrder: any) => {
      const itemsWithoutUpdatedItem = prevOrder.items.filter(
        (variant: any) => variant.SKU !== SKU
      );

      const existingItem = prevOrder.items.find(
        (variant: any) => variant.SKU === SKU
      );

      let updatedItems = [...itemsWithoutUpdatedItem];

      if (existingItem) {
        const updatedItem = {
          ...existingItem,
          size: selectedSize,
          SKU: itemId + selectedSize,
        };
        console.log(updatedItem);
        updatedItems = [...itemsWithoutUpdatedItem, updatedItem];
      } else {
        // If the item is not found, this means you're trying to update an item that doesn't exist in the order.
        // You might want to handle this case differently, e.g., by adding the item with the new size or showing an error.
      }

      return { ...prevOrder, items: updatedItems };
    });
  };
  const addQnt = (selectedQnt: number, SKU: string) => {
    setOrder((prevOrder: any) => {
      const itemsWithoutUpdatedItem = prevOrder.items.filter(
        (variant: any) => variant.SKU !== SKU
      );

      const existingItem = prevOrder.items.find(
        (variant: any) => variant.SKU === SKU
      );

      let updatedItems = [...itemsWithoutUpdatedItem];

      console.log(updatedItems);

      if (existingItem) {
        const updatedItem = { ...existingItem, quantity: selectedQnt };
        updatedItems = [...itemsWithoutUpdatedItem, updatedItem];
      } else {
        // If the item is not found, this means you're trying to update an item that doesn't exist in the order.
        // You might want to handle this case differently, e.g., by adding the item with the new size or showing an error.
      }

      return { ...prevOrder, items: updatedItems };
    });
  };

  return (
    <Container
      style={{
        border: isMobile ? "none" : `1px solid ${theme.lineDark}`,
      }}
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
          marginLeft: isMobile ? "16px" : "0",
        }}
      >
        {!isMobile && <BiPlus size={24} />} {activeLanguage.createOrder}
      </h1>
      <div
        style={{
          padding: isMobile ? "16px" : "24px",
          borderRadius: "15px",
          border: `1px solid ${theme.lineDark}`,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <h2 style={{ fontSize: "16px", color: theme.primaryText }}>
          {activeLanguage.shipping}{" "}
        </h2>
        <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
          <Input
            label={activeLanguage.firstName + "*"}
            warning={false}
            onChange={(e) =>
              setOrder((prev: any) => ({
                ...prev,
                buyer: { ...prev.buyer, firstName: e },
              }))
            }
            value={order.buyer.firstName}
            type="text"
          />
          <Input
            label={activeLanguage.lastName + "*"}
            warning={false}
            onChange={(e) =>
              setOrder((prev: any) => ({
                ...prev,
                buyer: { ...prev.buyer, lastName: e },
              }))
            }
            value={order.buyer.lastName}
            type="text"
          />
        </div>
        <Input
          label={activeLanguage.email + "*"}
          warning={false}
          onChange={(e) =>
            setOrder((prev: any) => ({
              ...prev,
              buyer: { ...prev.buyer, email: e },
            }))
          }
          value={order.buyer.email}
          type="text"
        />
        <Input
          label={activeLanguage.phone + "*"}
          warning={false}
          onChange={(e) =>
            setOrder((prev: any) => ({
              ...prev,
              shipping: { ...prev.shipping, phone: e },
            }))
          }
          value={order.shipping.phone}
          type="text"
        />
        <FormGroup row sx={{ marginLeft: "16px", marginBottom: "8px" }}>
          <FormControlLabel
            control={
              <Radio
                checked={deliveryType === "delivery"} // Determine if the item is selected
                onChange={(e) => {
                  setDeliveryType("delivery");
                }}
                name="Delivery"
                sx={{ color: theme.secondaryText }}
              />
            }
            label={
              <span style={{ color: theme.primaryText }}>
                {activeLanguage.delivery}
              </span>
            }
          />
          <FormControlLabel
            control={
              <Radio
                checked={deliveryType === "pickUp"}
                onChange={(e) => {
                  setDeliveryType("pickUp");
                  setShippingVariants([]);
                  setOrder((prev: any) => ({
                    ...prev,
                    shipping: {
                      ...prev.shipping,
                      cost: 0,
                      shippingTitle: "Pick Up",
                      address: {},
                    },
                  }));
                }}
                name="Pick Up"
                sx={{ color: theme.secondaryText }}
              />
            }
            label={
              <span style={{ color: theme.primaryText }}>
                {activeLanguage.pickUp}
              </span>
            }
          />
        </FormGroup>
        {deliveryType === "delivery" && (
          <MapAutoComplete
            setOrder={setOrder}
            setShippingVariants={setShippingVariants}
            setState={(e: any) =>
              setOrder((prev: any) => ({
                ...prev,
                shipping: { ...prev.shipping, address: { ...e } },
              }))
            }
          />
        )}
        <Input
          label={activeLanguage.addationalInfo + " " + activeLanguage.optional}
          warning={false}
          onChange={(e) =>
            setOrder((prev: any) => ({
              ...prev,
              shipping: { ...prev.shipping, addationalInfo: e },
            }))
          }
          value={order.shipping.addationalInfo}
          type="text"
        />
        <Input
          label={activeLanguage.comment + " " + activeLanguage.optional}
          warning={false}
          onChange={(e) =>
            setOrder((prev: any) => ({
              ...prev,
              comment: e,
            }))
          }
          value={order.comment}
          type="text"
        />
        <ItemsSection>
          <h2 style={{ color: theme.primaryText, fontSize: "16px" }}>
            {activeLanguage.products}
          </h2>

          <Search search={productsInput} setSearch={setProductsInput} />

          {productsInput?.length > 0 && products?.length > 0 && (
            <OptionsContainer
              style={{ width: "100%", border: `1px solid ${theme.lineDark}` }}
            >
              {products?.map((item: any, index: number) => {
                let cover = item.gallery.find((i: any) => i?.cover);
                return (
                  <OptionItem
                    style={{
                      border: `1px solid ${theme.lineDark}`,
                      color: order.items.some((it: any) => it._id === item._id)
                        ? theme.primary
                        : "inherit",
                    }}
                    onClick={() => {
                      setOrder((prevOrder: any) => {
                        const existingItemIndex = prevOrder.items.findIndex(
                          (variant: any) => variant.SKU === item.SKU
                        );

                        // Clone the items array from the previous state
                        let newItems = [...prevOrder.items];

                        if (existingItemIndex > -1) {
                          // If item is already included, remove it
                          newItems.splice(existingItemIndex, 1);
                        } else {
                          console.log(new Date().toISOString());
                          newItems.push({
                            id: item._id,
                            SKU: new Date().toISOString(),
                            cover: { url: cover?.url, type: cover.type },
                            title: item.title,
                            brand: item.brand,
                            color: item.color,
                            sale: item.sale,
                            price: item.price,
                            inStock: item.inStock,
                            category: item.category,
                            subCategort: item.subCategories,
                            sex: item.sex,
                            rating: item.rating,
                          });
                        }

                        // Return the updated order with the new items array
                        return { ...prevOrder, items: newItems };
                      });
                    }}
                    key={index}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "10px",
                        overflow: "hidden",
                      }}
                    >
                      {cover?.type?.startsWith("video") ? (
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
                        <>
                          {cover ? (
                            <img
                              src={cover.url}
                              height={60}
                              width={60}
                              alt="img"
                              style={{
                                borderRadius: "5px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <FaImage size={30} color={theme.secondaryText} />
                          )}
                        </>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "24px",
                        width: "80%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "start",
                          flexDirection: "column",
                          gap: "4px",
                          color: theme.primaryText,
                          fontSize: isMobile ? "14px" : "16px",
                        }}
                      >
                        <p style={{ whiteSpace: "nowrap" }}>
                          {item.title} / {item.brand}
                        </p>
                        <p style={{ color: theme.secondaryText }}>
                          {item.color}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          marginLeft: "auto",
                        }}
                      >
                        {item.sale > 0 && (
                          <SpanText
                            primarytext={theme.primaryText}
                            style={{
                              fontSize: "14px",
                              fontWeight: "bold",
                              color: theme.primaryText,
                            }}
                          >
                            {storeInfo?.currency === "Dollar"
                              ? "$"
                              : storeInfo?.currency == "Euro"
                              ? "€"
                              : "₾"}
                            {item.price - (item.price / 100) * item.sale}{" "}
                          </SpanText>
                        )}
                        <SpanText
                          primarytext={theme.primaryText}
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color:
                              item.sale > 0
                                ? theme.secondaryText
                                : theme.primaryText,
                            textDecoration:
                              item.sale > 0 ? "line-through" : "none",
                          }}
                        >
                          {storeInfo?.currency === "Dollar"
                            ? "$"
                            : storeInfo?.currency == "Euro"
                            ? "€"
                            : "₾"}
                          {item.price}
                        </SpanText>
                      </div>
                    </div>
                  </OptionItem>
                );
              })}
              {totalProducts > products?.length && (
                <div
                  onClick={AddOptions}
                  style={{
                    color: theme.primaryText,
                    cursor: "pointer",
                    margin: "8px 0",
                  }}
                >
                  {activeLanguage.loadMore}
                </div>
              )}
            </OptionsContainer>
          )}
        </ItemsSection>
        {order.items?.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              padding: "8px",
            }}
          >
            {order.items?.map((item: any, index: number) => {
              console.log(item);
              return (
                <OptionItem
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px",
                    border: `1px solid ${theme.lineDark}`,
                  }}
                  key={index}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "8px",
                      border: `1px solid ${theme.lineDark}`,
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      style={{
                        height: "50px",
                        width: "50px",
                        borderRadius: "10px",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.cover?.type?.startsWith("video") ? (
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
                        <>
                          {item.cover ? (
                            <img
                              src={item.cover.url}
                              height={50}
                              width={50}
                              alt="img"
                              style={{
                                borderRadius: "5px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <FaImage size={30} color={theme.secondaryText} />
                          )}
                        </>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "24px",
                        width: isMobile ? "60%" : "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                          fontSize: "14px",
                          color: theme.primaryText,
                        }}
                      >
                        <p style={{ whiteSpace: "nowrap" }}>
                          {item.title} / {item.brand}
                        </p>
                        <p>{item.color}</p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          marginLeft: "auto",
                        }}
                      >
                        {item.sale > 0 && (
                          <SpanText
                            primarytext={theme.primaryText}
                            style={{
                              fontSize: "14px",
                              fontWeight: "bold",
                              color: theme.primaryText,
                            }}
                          >
                            {storeInfo?.currency === "Dollar"
                              ? "$"
                              : storeInfo?.currency == "Euro"
                              ? "€"
                              : "₾"}
                            {item.price - (item.price / 100) * item.sale}
                          </SpanText>
                        )}
                        <SpanText
                          primarytext={theme.primaryText}
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color:
                              item.sale > 0
                                ? theme.secondaryText
                                : theme.primaryText,
                            textDecoration:
                              item.sale > 0 ? "line-through" : "none",
                          }}
                        >
                          {storeInfo?.currency === "Dollar"
                            ? "$"
                            : storeInfo?.currency == "Euro"
                            ? "€"
                            : "₾"}
                          {item.price}
                        </SpanText>
                      </div>

                      <MdClose
                        color="red"
                        size={18}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setOrder((prev: any) => ({
                            ...prev,
                            items: prev.items?.filter(
                              (i: any) => i.SKU !== item.SKU
                            ),
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <PopupState variant="popover" popupId="demo-popup-menu">
                      {(popupState) => (
                        <React.Fragment>
                          <Button
                            variant="contained"
                            {...bindTrigger(popupState)}
                            style={{ fontSize: "14px" }}
                          >
                            {item?.size ? "Size: " + item?.size : "Size"}
                          </Button>
                          <Menu {...bindMenu(popupState)}>
                            {item?.inStock.map((it: any, x: any) => {
                              return (
                                <MenuItem
                                  onClick={() => {
                                    popupState.close();
                                    // Assuming you have a function to handle adding to order
                                    addSize(item.id, it.size, item.SKU);
                                  }}
                                  key={x}
                                >
                                  {it.size}
                                </MenuItem>
                              );
                            })}
                          </Menu>
                        </React.Fragment>
                      )}
                    </PopupState>
                    <PopupState variant="popover" popupId="demo-popup-menu">
                      {(popupState) => (
                        <React.Fragment>
                          <Button
                            variant="contained"
                            {...bindTrigger(popupState)}
                            style={{ fontSize: "14px" }}
                          >
                            {item?.quantity
                              ? activeLanguage.quantity + ": " + item?.quantity
                              : activeLanguage.quantity}
                          </Button>
                          <Menu {...bindMenu(popupState)}>
                            <MenuItem
                              onClick={() => {
                                popupState.close();
                                addQnt(1, item.SKU);
                              }}
                            >
                              1
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close();
                                addQnt(2, item.SKU);
                              }}
                            >
                              2
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close();
                                addQnt(3, item.SKU);
                              }}
                            >
                              3
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close();
                                addQnt(4, item.SKU);
                              }}
                            >
                              4
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close();
                                addQnt(5, item.SKU);
                              }}
                            >
                              5
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close();
                                addQnt(6, item.SKU);
                              }}
                            >
                              6
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close();
                                addQnt(7, item.SKU);
                              }}
                            >
                              7
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close();
                                addQnt(8, item.SKU);
                              }}
                            >
                              8
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close();
                                addQnt(9, item.SKU);
                              }}
                            >
                              9
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close();
                                addQnt(10, item.SKU);
                              }}
                            >
                              10
                            </MenuItem>
                          </Menu>
                        </React.Fragment>
                      )}
                    </PopupState>
                  </div>
                </OptionItem>
              );
            })}
          </div>
        ) : (
          <div style={{ margin: "24px", color: theme.secondaryText }}>
            {activeLanguage.empty}
          </div>
        )}
        {/** Total */}
        <Total
          order={order}
          setOrder={setOrder}
          setOrders={setOrders}
          shippingVariants={shippingVariants}
          deliveryType={deliveryType}
        />
      </div>
    </Container>
  );
}

const ItemsSection = styled.div`
  width: 100%;
  max-width: 40vw;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 24px;

  @media (max-width: 768px) {
    max-width: 100%;
  }

  color: theme.primaryText, & > h2 {
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

const Container = styled.div`
  width: 50%;
  border-radius: 20px;
  padding: 24px;
  overflow-y: auto;
  height: 83vh;

  @media (max-width: 768px) {
    width: 100%;
    padding: 8px;
  }
`;

const OptionsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px;
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
  display: flex;
  gap: 16px;
`;

interface SpanTextProps {
  primarytext: string;
}

const SpanText = styled.p<SpanTextProps>`
  font-size: 14px;
  color: ${(props) => props.primarytext};
  font-wright: 500;
`;
