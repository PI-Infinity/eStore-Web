"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAppContext } from "./app";

const ShippingContext = createContext();

export const useShippingContext = () => useContext(ShippingContext);

export function ShippingWrapper({ children }) {
  // order context
  const [order, setOrder] = useState(null);

  // app contex
  const { storeInfo } = useAppContext();
  // set order from localstorage to context state, if not iclude simple add new object structure

  // shipping variants
  const [shippingVariants, setShippingVariants] = useState([]);

  // delivery type
  const [deliveryType, setDeliveryType] = useState("ship");

  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  // calculate

  // define discount and total

  const calculateTotalPrice = () => {
    return order?.items.reduce((acc, item) => {
      if (item.sale > 0) {
        return (
          acc + (item.price - (item.price / 100) * item.sale) * item.quantity
        );
      } else {
        return acc + item.price * item.quantity;
      }
    }, 0);
  };

  const calculateTotalWithDiscounts = (type) => {
    const originalTotalPrice = calculateTotalPrice() || 0; // Assuming this calculates the total price before discounts
    setSubtotal(originalTotalPrice);
    let discountAmount = 0;

    // Calculate total discount amount
    order?.promotions.forEach((promotion) => {
      if (promotion.discountType === "%") {
        // Calculate percentage discount on the original total price, not the already discounted price
        discountAmount += (originalTotalPrice * promotion.discount) / 100;
      } else {
        // Add fixed discount amount directly
        discountAmount += promotion.discount;
      }
    });

    // Calculate final total price after applying all discounts
    let finalTotalPrice = originalTotalPrice - discountAmount;

    // Ensure the final total price does not go below zero
    finalTotalPrice = Math.max(finalTotalPrice, 0);

    // Include shipping cost in the final total
    if (type === "ship") {
      console.log(finalTotalPrice);
      console.log("order: " + order?.shipping.cost);
      finalTotalPrice =
        parseInt(finalTotalPrice) +
        (parseInt(
          order?.shipping.address?.address?.length > 0
            ? order?.shipping.cost
            : 0
        ) || 0);
      console.log(finalTotalPrice);
    } else {
      setShippingVariants([]);
    }

    setDiscount(discountAmount > 0 ? parseInt(discountAmount) : 0);
    setTotal(parseInt(finalTotalPrice));
  };

  useEffect(() => {
    calculateTotalWithDiscounts(deliveryType);
  }, [order, deliveryType]);

  // define order
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Ensure window object is available
      const orderObject = localStorage.getItem("eStore:Order");
      if (orderObject) {
        setOrder(JSON.parse(orderObject));
      } else {
        setOrder({
          items: [],
          shipping: {
            cost: 0,
            currency: storeInfo?.currency,
            address: "",
            addationalInfo: "",
            phone: "",
            estimatedDelivery: "",
            paymentMethod: "",
            estimatedTax: 0,
            deliveryType: "",
            shippingTime: "",
          },
          buyer: {
            firstName: "",
            lastName: "",
            id: "",
            email: "",
          },
          promotions: [],
          subtotal: 0,
          discount: 0,
          total: 0,
          comment: "",
          returnPolicy: "",
        });
      }
    }
  }, []);

  // change date in local storage
  useEffect(() => {
    if (order) {
      localStorage.setItem(
        "eStore:Order",
        JSON.stringify({
          ...order,
          promotions: [],
          total,
          subtotal,
          discount,
          currency: storeInfo?.currency,
        })
      );
    }
  }, [order]);

  return (
    <ShippingContext.Provider
      value={{
        order,
        setOrder,
        shippingVariants,
        setShippingVariants,
        subtotal,
        setSubtotal,
        discount,
        setDiscount,
        total,
        setTotal,
        deliveryType,
        setDeliveryType,
      }}
    >
      {children}
    </ShippingContext.Provider>
  );
}
