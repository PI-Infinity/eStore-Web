import { FormControlLabel, Radio, Switch } from "@mui/material";
import { styled as MUIStyled } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BiPlus } from "react-icons/bi";
import { IoMdArrowDropup } from "react-icons/io";
import { MdCalendarMonth, MdClose } from "react-icons/md";
import { BarLoader } from "react-spinners";
import styled from "styled-components";
import { useAppContext } from "../../../context/app";
import { useCurrentUserContext } from "../../../context/currentUser";
import { useTheme } from "../../../context/theme";
import Search from "../products/search";
import CreateOrder from "./createOrder";
import MobileCreateOrder from "./mobileCreateOrdert";
import OrderItem from "./orderItem";
import { useLocation } from "react-router-dom";

export default function Orders() {
  const { theme } = useTheme();

  const location = useLocation();

  // get orders
  const [orders, setOrders] = useState([]);

  // load page
  const [loadPage, setLoadPage] = useState(true);

  const { backendUrl, activeLanguage, isMobile } = useAppContext();

  // current user
  const { currentUser } = useCurrentUserContext();

  // getting orders ordered byncurrentUser
  const [page, setPage] = useState(1);
  const [results, setResults] = useState({
    total: 0,
    new: 0,
    pickUp: 0,
    warehouse: 0,
    courier: 0,
    completed: 0,
    canceled: 0,
  });

  // date filter

  const [date, setDate] = useState(null);

  // filter
  const [status, setStatus] = useState("");

  // pick up
  const [pickUps, setPickUps] = useState(false);

  // search
  const [search, setSearch] = useState("");

  useEffect(() => {
    const GettingOrders = async () => {
      setLoadPage(true);
      try {
        const response = await axios.get(
          backendUrl +
            "/api/v1/orders?page=1&limit=2&status=" +
            status +
            "&search=" +
            search +
            `&date=${date || ""}&pickups=${pickUps ? "true" : ""}`
        );
        setOrders(response.data.data.orders);
        setResults(response.data.statusResults);
        if (page !== 1) {
          setPage(1);
        }

        setLoadPage(false);
      } catch (error: any) {
        console.log(error.response.data.message);
      }
    };
    if (currentUser || location.search.includes("overview")) {
      GettingOrders();
    }
  }, [currentUser, status, search, date, pickUps]);

  // add more orders on scrolling
  const AddOrders = async () => {
    // Use a temporary variable for the new page number
    const newPage = page + 1;

    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/orders?page=${newPage}&limit=2&status=${status}&search=${search}&date=${
          date || ""
        }&pickups=${pickUps ? "true" : ""}`
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

  // publish switch styled
  const GreenSwitch = MUIStyled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "green",
      "&:hover": {
        opacity: "0.8",
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "green",
    },
  }));

  const label = { inputProps: { "aria-label": "Color switch demo" } };

  // open orders filter
  const [openFilter, setOpenFilter] = useState(false);
  // creat order
  const [openCreateOrder, setOpenCreateOrder] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        gap: "24px",
      }}
    >
      {isMobile && (
        <MobileCreateOrder
          openCreateOrder={openCreateOrder}
          setOpenCreateOrder={setOpenCreateOrder}
          setOrders={setOrders}
        />
      )}
      <Container
        style={{ border: isMobile ? "none" : `1px solid ${theme.line}` }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: isMobile ? "column" : "row",
            width: "100%",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          {openFilter && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? "8px" : "16px",
                width: "100%",
              }}
            >
              <DateRangePicker date={date} setDate={setDate} />
              <div
                style={{
                  width: isMobile ? "100%" : "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  background: theme.line,
                  borderRadius: "50px",
                  padding: "0px 0px 0px 16px",
                }}
              >
                <h2
                  style={{
                    whiteSpace: "nowrap",
                    fontSize: "14px",
                    color: theme.primaryText,
                    fontWeight: "500",
                  }}
                >
                  {activeLanguage.pickUp} ({results?.pickUp}){" "}
                </h2>
                <GreenSwitch
                  {...label}
                  checked={pickUps}
                  onChange={() => setPickUps(pickUps ? false : true)}
                />
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {" "}
            <Search search={search} setSearch={setSearch} />
            <div
              onClick={() => setOpenFilter((prev: boolean) => !prev)}
              style={{
                color: theme.primaryText,
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {activeLanguage.filter}
              {openFilter ? (
                <MdClose size={24} color={theme.primary} />
              ) : (
                <IoMdArrowDropup size={24} />
              )}
            </div>
            {isMobile && !openFilter && (
              <div
                onClick={() => setOpenCreateOrder(!openCreateOrder)}
                style={{
                  color: openFilter ? "red" : theme.primary,
                  display: "flex",
                  alignItems: "center",
                  fontWeight: "bold",
                  cursor: "pointer",
                  borderRadius: "5px",
                  background: theme.line,
                  padding: "4px",
                }}
              >
                <BiPlus size={24} />
              </div>
            )}
          </div>
        </div>

        {openFilter && (
          <div
            style={{
              margin: isMobile ? "8px 0 0 8px" : "8px 0 0 0px",
              display: "flex",
              flexDirection: "row", // Sets the direction of flex items
              // flexWrap: "wrap", // Allows items to wrap as needed
              justifyContent: "space-between",
              overflowX: "auto",
            }}
          >
            <FormControlLabel
              control={
                <Radio
                  checked={status === "" ? true : false}
                  onChange={(e) => setStatus("")}
                  name="All"
                  sx={{ color: theme.primaryText }}
                />
              }
              label={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color: theme.secondaryText,
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  {activeLanguage.all}
                  <span style={{ color: theme.secondaryText, width: "20px" }}>
                    {results && " (" + results?.total + ")"}
                  </span>
                </div>
              }
            />
            <FormControlLabel
              control={
                <Radio
                  checked={status === "Pending" ? true : false}
                  onChange={(e) => setStatus("Pending")}
                  name="Pending"
                  sx={{ color: "green" }}
                />
              }
              label={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color:
                      results.new > 0 ? theme.primary : theme.secondaryText,
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  {activeLanguage.new}
                  <span style={{ width: "20px" }}>
                    {results && " (" + results.new + ")"}
                  </span>
                </div>
              }
            />

            <FormControlLabel
              control={
                <Radio
                  checked={status === "Warehouse" ? true : false}
                  onChange={(e) => setStatus("Warehouse")}
                  name="Warehouse"
                  sx={{ color: "orange" }}
                />
              }
              label={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color:
                      results.warehouse > 0
                        ? theme.primary
                        : theme.secondaryText,
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  {activeLanguage.warehouse}
                  <span style={{ width: "20px" }}>
                    {results && " (" + results.warehouse + ")"}
                  </span>
                </div>
              }
            />
            <FormControlLabel
              control={
                <Radio
                  checked={status === "Courier" ? true : false}
                  onChange={(e) => setStatus("Courier")}
                  name="Courier"
                  sx={{ color: theme.primary }}
                />
              }
              label={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color:
                      results.courier > 0 ? theme.primary : theme.secondaryText,
                    fontSize: "14px",
                  }}
                >
                  {activeLanguage.courier}
                  <span style={{ width: "20px" }}>
                    {results && " (" + results.courier + ")"}
                  </span>
                </div>
              }
            />
            <FormControlLabel
              control={
                <Radio
                  checked={status === "Completed" ? true : false}
                  onChange={(e) => setStatus("Completed")}
                  name="Completed"
                  sx={{ color: theme.primaryText }}
                />
              }
              label={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color: theme.secondaryText,
                    fontSize: "14px",
                  }}
                >
                  {activeLanguage.completed}
                  <span style={{ color: theme.secondaryText, width: "20px" }}>
                    {results && " (" + results.completed + ")"}
                  </span>
                </div>
              }
            />
            <FormControlLabel
              control={
                <Radio
                  checked={status === "Canceled" ? true : false}
                  onChange={(e) => setStatus("Canceled")}
                  name="Canceled"
                  sx={{ color: "red" }}
                />
              }
              label={
                <div
                  style={{
                    width: "60px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    color: theme.secondaryText,
                    fontSize: "14px",
                  }}
                >
                  {activeLanguage.canceled}
                  <span style={{ color: theme.secondaryText, width: "20px" }}>
                    {results && " (" + results.canceled + ")"}
                  </span>
                </div>
              }
            />
          </div>
        )}
        {loadPage ? (
          <div
            style={{
              margin: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "70%",
              width: "100%",
            }}
          >
            <BarLoader color={theme.primaryText} height={6} />
          </div>
        ) : (
          <>
            <div
              style={{
                marginTop: "16px",
                overflowY: "auto",
                height: openFilter ? "70vh" : "75vh",
                paddingBottom: "64px",
              }}
              ref={containerRef}
            >
              {orders?.length < 1 ? (
                <div style={{ padding: "24px", color: theme.secondaryText }}>
                  {status} {activeLanguage.ordersNotFound}
                </div>
              ) : (
                orders?.map((item: any, index: number) => {
                  return (
                    <OrderItem
                      item={item}
                      key={index}
                      setOrders={setOrders}
                      setResults={setResults}
                    />
                  );
                })
              )}
            </div>
          </>
        )}
      </Container>
      {!isMobile && <CreateOrder setOrders={setOrders} />}
    </div>
  );
}

const Container = styled.div`
  width: 70%;
  border-radius: 20px;
  padding: 24px;
  height: 90vh;
  overflow: hidden;

  .hover: {
    &:hover {
      filter: brightness(0.9);
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 8px;
  }
`;

const DateRangePicker = ({ date, setDate }: any) => {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const { activeLanguage, isMobile } = useAppContext();

  return (
    <div
      style={{
        width: isMobile ? "100%" : "auto",
        minWidth: "160px",
        zIndex: 1001,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        background: theme.line,
        borderRadius: "50px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          fontSize: "14px",
          fontWeight: "500",
          color: theme.primaryText,
        }}
      >
        <DatePickerWrapper
          theme={theme}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: "50px",
            zIndex: 1000,
            paddingLeft: isMobile && open ? "50px" : "0",
          }}
        >
          {open ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <DatePicker
                selected={date}
                onChange={(dt: any) => setDate(dt)}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy"
              />
              <div>
                <MdClose
                  size={14}
                  color="red"
                  onClick={() => {
                    setOpen(false);
                    setDate(null);
                  }}
                  className="hover"
                  style={{ cursor: "pointer", marginRight: "8px" }}
                />
              </div>
            </div>
          ) : (
            <div
              style={{
                cursor: "pointer",
                zIndex: 1000,
                color: theme.primaryText,
                padding: "8px",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onClick={() => setOpen(true)}
            >
              <MdCalendarMonth size={20} color={theme.primaryText} />
              {activeLanguage.choiceDate}
            </div>
          )}
        </DatePickerWrapper>
      </div>
    </div>
  );
};

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
    padding: 4px;
    border-radius: 5px;
    color: ${({ theme }) => theme.primary};
    font-weight: 500;
  }
  .react-datepicker__input-container,
  input {
    width: 100%;
    padding: 4px 8px;
    border-radius: 5px;
    color: ${({ theme }) => theme.primary};
    font-weight: 500;

    @media (max-width: 768px) {
      padding: 0px 8px;
      font-size: 16px;
    }
  }
`;
