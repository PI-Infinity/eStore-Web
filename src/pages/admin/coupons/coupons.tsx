import Button from "../../../components/button";
import { Input } from "../../../components/input";
import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RiExchangeLine } from "react-icons/ri";
import { BarLoader } from "react-spinners";
import styled from "styled-components";
import CouponItem from "./couponItem";
import { BiPlus } from "react-icons/bi";
import MobileCreateCoupon from "./mobileCreateCoupon";
import { useLocation } from "react-router-dom";

export default function Coupons() {
  //theme
  const { theme } = useTheme();

  // app context
  const { backendUrl, storeInfo, setAlert, activeLanguage, isMobile } =
    useAppContext();

  // Define a type for your coupon
  interface Coupon {
    id: string;
    specialId: string;
    description: string;
    discount: number;
    discountType: string;
    expireDate: string;
    users: any;
  }

  // coupons
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // load coupns
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const GetCoupons = async () => {
      try {
        const response = await axios.get(backendUrl + "/api/v1/coupons");
        setCoupons(response.data.data.coupons);
        setTimeout(() => {
          setLoading(false);
        }, 300);
      } catch (error: any) {
        console.log(error.response.data.message);
      }
    };
    GetCoupons();
  }, []);

  // fields
  const [specialId, setSpecialId] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountType, setDiscountType] = useState("%");

  // date pick
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
  };

  const location = useLocation();
  const AddCoupon = async () => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Add coupon is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    if (specialId?.length < 1 || discount?.length < 1) {
      return setAlert({
        active: true,
        type: "warning",
        text: activeLanguage.inputAllRequiredFields,
      });
    }
    try {
      const response = await axios.post(backendUrl + "/api/v1/coupons", {
        specialId,
        description,
        discount,
        discountType,
        expireDate: selectedDate,
      });
      if (response.data.data.coupon) {
        setCoupons((prev: any) => [response.data.data.coupon, ...prev]);
        setSpecialId("");
        setDescription("");
        setDiscount("");
        setDiscountType("");
        setSelectedDate(new Date());
        setAlert({
          active: true,
          type: "success",
          text: activeLanguage.newCouponCreatedSuccessfully,
        });
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  // coupons users

  const [newUser, setNewUser] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);

  // getting users
  useEffect(() => {
    // Flag to track if the current fetch request should update the state
    let shouldUpdateState = true;

    const GetUsers = async () => {
      if (newUser.trim() === "") {
        setUsersList([]);
        return;
      }

      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/users?search=${newUser}`
        );

        // Only update state if shouldUpdateState is still true
        if (shouldUpdateState) {
          setUsersList(
            response.data.data.users.length > 0 ? response.data.data.users : []
          );
          setTotalUsers(response.data.totalUsers);
          setPage(1);
        }
      } catch (error) {
        console.log(error);
      }
    };

    GetUsers();

    // Cleanup function to set shouldUpdateState to false when the effect re-runs or the component unmounts
    return () => {
      shouldUpdateState = false;
    };
  }, [newUser]);

  // add users list
  const AddUsers = async () => {
    const newPage = page + 1;

    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/users?search=${newUser}`
      );
      setUsersList((prevUsers: any) => {
        const existingIds = new Set(prevUsers.map((user: any) => user._id));
        const filteredNewProducts = response.data.data.users.filter(
          (user: any) => !existingIds.has(user._id)
        );

        if (filteredNewProducts.length > 0) {
          return [...prevUsers, ...filteredNewProducts];
        } else {
          return prevUsers;
        }
      });
      setPage(newPage);
    } catch (error) {
      console.log(error);
    }
  };

  // this useffect runs addproducts function when scroll is bottom
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Ensure containerRef.current is not null before accessing its properties
      if (containerRef.current) {
        const { bottom } = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if the bottom of the component is near the bottom of the window viewport
        if (bottom <= windowHeight + 100) {
          // 90px threshold, adjust as needed
          if (totalUsers > usersList.length) {
            AddUsers();
          }
        }
      }
    };

    // Register the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, [usersList.length, totalUsers]);

  // creat Role
  const [openCreateCoupon, setOpenCreateCoupon] = useState(false);

  return (
    <Container
      style={{
        color: theme.primaryText,
        border: isMobile ? "none" : `1px solid ${theme.line}`,
      }}
    >
      {isMobile && (
        <MobileCreateCoupon
          openCreateCoupon={openCreateCoupon}
          setOpenCreateCoupon={setOpenCreateCoupon}
          specialId={specialId}
          setSpecialId={setSpecialId}
          discount={discount}
          setDiscount={setDiscount}
          description={description}
          setDescription={setDescription}
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
          AddCoupon={AddCoupon}
          discountType={discountType}
          setDiscountType={setDiscountType}
        />
      )}
      {isMobile && (
        <h1
          className="icon"
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: theme.lightBackground,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            border: `1px solid ${theme.line}`,
            borderRadius: "50px",
            padding: "4px 8px",
            background: theme.primary,
            margin: "8px 8px 0 8px",
          }}
          onClick={() => setOpenCreateCoupon(!openCreateCoupon)}
        >
          <BiPlus size={24} /> {activeLanguage.createNewCoupon}
        </h1>
      )}
      <List>
        {loading ? (
          <div
            style={{
              margin: "24px",
              height: "70%",
              width: "100%",
            }}
          >
            <BarLoader color={theme.primary} height={6} />
          </div>
        ) : (
          <>
            {coupons?.length > 0 ? (
              coupons?.map((item: any, index: number) => {
                return (
                  <CouponItem
                    key={index}
                    index={index}
                    item={item}
                    coupons={coupons}
                    setCoupons={setCoupons}
                    usersList={usersList}
                    newUser={newUser}
                    setNewUser={setNewUser}
                  />
                );
              })
            ) : (
              <div style={{ color: theme.secondaryText, padding: "24px" }}>
                {activeLanguage.nofFound}
              </div>
            )}
          </>
        )}
      </List>

      {!isMobile && (
        <AddNewCoupon style={{ border: `1px solid ${theme.line}` }}>
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
            }}
          >
            <BiPlus size={24} /> {activeLanguage.createNewCoupon}
          </h1>
          <Input
            label={activeLanguage.specialID + "*"}
            value={specialId}
            onChange={setSpecialId}
            warning={false}
            type="text"
          />
          <Input
            label={activeLanguage.description + " " + activeLanguage.optional}
            value={description}
            onChange={setDescription}
            warning={false}
            type="text"
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "70%",
              gap: "16px",
            }}
          >
            <Input
              label={activeLanguage.discount + "*"}
              value={discount}
              onChange={setDiscount}
              warning={false}
              type="text"
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "24px",
              }}
            >
              <div>
                {discountType === "%"
                  ? "%"
                  : storeInfo?.currency === "Dollar"
                  ? "$"
                  : storeInfo?.currency == "Euro"
                  ? "€"
                  : "₾"}
              </div>
              <RiExchangeLine
                color={theme.primary}
                className="icon"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setDiscountType((prev: any) =>
                    prev === storeInfo.currency ? "%" : storeInfo.currency
                  )
                }
              />
            </div>
          </div>
          <DatePickerWrapper
            theme={theme}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px",
              border: `1px solid ${theme.line}`,
              borderRadius: "10px",
            }}
          >
            <h2
              style={{
                color: theme.secondaryText,
                fontSize: "14px",
                whiteSpace: "nowrap",
              }}
            >
              {activeLanguage.expireDate}
            </h2>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              timeIntervals={60} // Show only hour options in the dropdown
              timeCaption="Time"
              dateFormat="MMMM d, yyyy"
            />
          </DatePickerWrapper>
          <Button
            disabled={false}
            title={activeLanguage.create}
            background={theme.primary}
            color={theme.lightBackground}
            onClick={AddCoupon}
          />
        </AddNewCoupon>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 90vh;
  border-radius: 15px;
  padding: 24px;
  padding-bottom: 64px;
  position: relative;
  display: flex;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0;
    gap: 16px;
    height: 80vh;
    padding-bottom: 12px;
  }

  .icon {
    cursor: pointer;
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const List = styled.div`
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 15px;
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: 768px) {
    width: 100%;
    padding-bottom: 24px;
    gap: 8px;
  }
`;

const AddNewCoupon = styled.div`
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 15px;
  padding: 24px;
`;

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper,
  .react-datepicker__input-container,
  input {
    width: 100%;
    padding: 8px;
    border-radius: 10px;
    color: ${({ theme }) => theme.primary};
    font-weight: 500;
  }
`;
