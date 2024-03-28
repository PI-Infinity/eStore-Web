import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { IoMdList } from "react-icons/io";
import { BarLoader } from "react-spinners";
import styled from "styled-components";
import { useAppContext } from "../../context/app";
import { useCurrentUserContext } from "../../context/currentUser";
import { useTheme } from "../../context/theme";
import OrderItem from "./orderItem";

export default function Orders() {
  const { theme } = useTheme();

  // get orders
  const [orders, setOrders] = useState([]);

  const { backendUrl, activeLanguage, isMobile } = useAppContext();

  const [loadingOrders, setLoadingOrders] = useState(true);

  // current user
  const { currentUser } = useCurrentUserContext();

  // getting orders ordered byncurrentUser
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(null);
  useEffect(() => {
    const GettingOrders = async () => {
      try {
        const response = await axios.get(
          backendUrl +
            "/api/v1/orders?page=1&limit=2&email=" +
            currentUser.email
        );
        setOrders(response.data.data.orders);
        setTotalOrders(response.data.statusResults.total);
        if (page !== 1) {
          setPage(1);
        }

        setLoadingOrders(false);
      } catch (error: any) {
        console.log(error.response.data.message);
      }
    };
    if (currentUser) {
      GettingOrders();
    }
  }, [currentUser]);

  // add more orders on scrolling
  const AddOrders = async () => {
    // Use a temporary variable for the new page number
    const newPage = page + 1;

    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/orders?page=${newPage}&limit=2&email=${currentUser.email}`
      );

      // Check if new orders were fetched
      if (response.data.data.orders.length > 0) {
        setOrders((prevOrders: any) => {
          const newOrders: any = response.data.data.orders;

          const existingIds = new Set(
            prevOrders.map((order: any) => order._id)
          );

          // Filtering out duplicates from the newly fetched orders
          const filteredNewOrders = newOrders.filter(
            (order: any) => !existingIds.has(order._id)
          );

          // If there are new orders, concatenate them with previous orders
          // Also, update the page state and set loading more to false
          if (filteredNewOrders.length > 0) {
            setPage(newPage);
            return [...prevOrders, ...filteredNewOrders];
          } else {
            // If there are no new orders, just return the previous orders
            return prevOrders;
          }
        });
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error.response?.data?.message);
    }
  };

  // this useffect runs add orders function when scroll is bottom
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return; // Exit if container is not available

    const handleScroll = () => {
      // Calculate the scroll position and container's height
      const scrollPosition = container.scrollTop + container.offsetHeight;
      const containerHeight = container.scrollHeight;

      // Check if the scroll is near the bottom of the container
      if (containerHeight - scrollPosition <= 100) {
        console.log("Container scrolled to bottom");
        AddOrders();
      }
    };

    // Register the scroll event listener to the container
    container.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => container.removeEventListener("scroll", handleScroll);
  }, [orders.length]);

  return (
    <Container
      ref={containerRef}
      style={{ border: `1px solid ${theme.lineDark}` }}
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
          margin: isMobile ? "8px" : "0 0 16px 0",
        }}
      >
        <IoMdList size={24} /> {activeLanguage.orders}:
        <span
          style={{
            opacity: loadingOrders ? 0 : 1,
            transition: "ease-in 200ms",
            transform: `scale(${loadingOrders ? 0 : 1})`,
          }}
        >
          {totalOrders && "(" + totalOrders + ")"}
        </span>
      </h1>
      {loadingOrders ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BarLoader height={6} color={theme.primaryText} />
        </div>
      ) : (
        <div>
          {orders?.length < 1 ? (
            <div style={{ padding: "0 24px", color: theme.secondaryText }}>
              Orders not found!
            </div>
          ) : (
            orders?.map((item: any, index: number) => {
              return <OrderItem item={item} key={index} />;
            })
          )}
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 50%;
  border-radius: 20px;
  padding: 24px;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    min-height: 150px;
    padding: 8px;
  }
`;
