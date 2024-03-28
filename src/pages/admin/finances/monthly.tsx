import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";

const DatePickerComponent = ({ date, setDate }: any) => {
  const { theme } = useTheme();
  const { activeLanguage, isMobile } = useAppContext();

  return (
    <div
      style={{
        width: isMobile ? "100%" : "30%",
        display: "flex",
        alignItems: "center",
        gap: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px",
          fontWeight: "600",
          color: theme.primaryText,
        }}
      >
        <label style={{ whiteSpace: "nowrap", width: "40%" }}>
          {activeLanguage.month}:
        </label>
        <DatePickerWrapper
          theme={theme}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: `1px solid ${theme.line}`,
            borderRadius: "10px",
          }}
        >
          <DatePicker
            selected={date}
            onChange={(dt: any) => setDate(dt)}
            timeCaption="Time"
            dateFormat="MMMM yyyy"
            showMonthYearPicker
          />
        </DatePickerWrapper>
      </div>
    </div>
  );
};

const DatePickerWrapper = styled.div`
  .react-datepicker-wrapper {
     {
      width: 100%;
      padding: 4px;
      border-radius: 5px;
      color: ${({ theme }) => theme.primary};
      font-weight: 500;
    }
  }
  .react-datepicker__input-container,
  input {
    width: 100%;
    padding: 4px 8px;
    border-radius: 5px;
    color: ${({ theme }) => theme.primary};
    font-weight: 500;

    @media (max-width: 768px) {
      font-size: 16px;
    }
  }
`;

export default function Monthly({ date, setDate, result }: any) {
  const { storeInfo, activeLanguage, isMobile } = useAppContext();
  const { theme } = useTheme();

  const monthlyTotal = (
    ((result?.monthly && result?.monthly?.totalIncomes?.toFixed(2)) || 0) -
    ((result?.monthly && result?.monthly?.totalOutcomes?.toFixed(2)) || 0)
  ).toFixed(2);
  return (
    <Container style={{ border: `1px solid ${theme.lineDark}` }}>
      <DatePickerComponent date={date} setDate={setDate} />
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "start" : "center",
          width: isMobile ? "100%" : "70%",
          justifyContent: "space-between",
          fontWeight: 500,
        }}
      >
        <div
          style={{
            width: "25%",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <h3 style={{ color: theme.secondaryText }}>
            {activeLanguage.income}:
          </h3>
          <span
            style={{
              whiteSpace: "nowrap",
              color: "green",
            }}
          >
            +
            {storeInfo?.currency === "Dollar"
              ? "$"
              : storeInfo?.currency == "Euro"
              ? "€"
              : "₾"}
            {(result?.monthly && result?.monthly?.totalIncomes?.toFixed(2)) ||
              0}
          </span>
        </div>
        <div
          style={{
            width: "19%",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <h3 style={{ color: theme.secondaryText }}>
            {activeLanguage.expense}:
          </h3>
          <span
            style={{
              whiteSpace: "nowrap",
              color: "red",
            }}
          >
            -
            {storeInfo?.currency === "Dollar"
              ? "$"
              : storeInfo?.currency == "Euro"
              ? "€"
              : "₾"}
            {(result?.monthly && result?.monthly?.totalOutcomes?.toFixed(2)) ||
              0}
          </span>
        </div>
        <div
          style={{
            width: "26%",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <h3 style={{ color: theme.secondaryText }}>
            {activeLanguage.total}:
          </h3>
          <span
            style={{
              whiteSpace: "nowrap",
              color:
                parseInt(monthlyTotal) > 0
                  ? "green"
                  : parseInt(monthlyTotal) < 0
                  ? "red"
                  : theme.primary,
            }}
          >
            {parseInt(monthlyTotal) < 0
              ? "-"
              : parseInt(monthlyTotal) > 0
              ? "+"
              : ""}
            {storeInfo?.currency === "Dollar"
              ? "$"
              : storeInfo?.currency == "Euro"
              ? "€"
              : "₾"}
            {Math.abs(parseInt(monthlyTotal)).toFixed(2)}
          </span>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  padding: 16px 24px;
  border-radius: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 24px;
  z-index: 888;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: start;
    z-index: 888;
  }
`;
