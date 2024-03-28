import Button from "../../../components/button";
import { Input } from "../../../components/input";
import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";
// import Logo from "../../../assets/logo.png";
import { useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import { BiPlus } from "react-icons/bi";
import { MdClose } from "react-icons/md";
import { RiExchangeLine } from "react-icons/ri";
import styled from "styled-components";

export default function MobileCreateCoupon({
  openCreateCoupon,
  setOpenCreateCoupon,
  specialId,
  setSpecialId,
  discount,
  setDiscount,
  description,
  setDescription,
  selectedDate,
  handleDateChange,
  AddCoupon,
  discountType,
  setDiscountType,
}: any) {
  const { theme } = useTheme();

  const { storeInfo, activeLanguage, isMobile } = useAppContext();

  return (
    <Container
      style={{
        background: theme.background,
        transform: `scale(${openCreateCoupon ? 1 : 0})`,
        opacity: openCreateCoupon ? 1 : 0,
        borderRadius: openCreateCoupon ? "0" : "500px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "50px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "24px",
            top: "0px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <img src={storeInfo?.logo} width={50} height={40} alt="nike" />
        </div>
      </div>
      <MdClose
        onClick={() => setOpenCreateCoupon(false)}
        size={32}
        color={theme.primary}
        style={{ position: "absolute", right: "8px", top: "12px" }}
      />
      <div
        style={{
          marginTop: "0",
          paddingBottom: "88px",
          padding: "8px",
        }}
      >
        <AddNewCoupon
          style={{ border: isMobile ? "none" : `1px solid ${theme.line}` }}
        >
          <h1
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: theme.primaryText,
              marginBottom: "16px",
              marginLeft: "8px",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {activeLanguage.createNewCoupon}
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
            <ReactDatePicker
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
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 100vh;
  position: fixed;
  top: 0px;
  transition: ease-in 150ms;
  z-index: 100999;

  @media (max-width: 768px) {
    height: 90vh;
  }
`;

const AddNewCoupon = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 15px;
  overflow-y: auto;

  @media (max-width: 768px) {
    gap: 8px;
  }
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
