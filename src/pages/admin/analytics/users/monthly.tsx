import { useAdminContext } from "../../../../context/adminContext";
import { useAppContext } from "../../../../context/app";
import { useTheme } from "../../../../context/theme";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TbNumbers } from "react-icons/tb";
import { BarLoader } from "react-spinners";
import styled from "styled-components";

const DateRangePicker = () => {
  const { theme } = useTheme();

  const { activeLanguage, isMobile } = useAppContext();

  const {
    startMonthVisit,
    setStartMonthVisit,
    endMonthVisit,
    setEndMonthVisit,
  } = useAdminContext();

  return (
    <div
      style={{
        zIndex: 10000,
        display: "flex",
        alignItems: isMobile ? "start" : "center",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? "8px" : "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: isMobile ? "start" : "center",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "8px" : "16px",
          fontSize: "14px",
          fontWeight: "500",
          color: theme.primaryText,
        }}
      >
        <label style={{ whiteSpace: "nowrap" }}>
          {activeLanguage.startDate}:
        </label>
        <DatePickerWrapper
          theme={theme}
          style={{
            width: "100%",
            display: "flex",
            alignItems: isMobile ? "start" : "center",
            justifyContent: "space-between",
            border: `1px solid ${theme.line}`,
            borderRadius: "10px",
          }}
        >
          <DatePicker
            selected={startMonthVisit}
            onChange={(date: any) => setStartMonthVisit(date)}
            showMonthYearPicker
            dateFormat="MM/yyyy"
          />
        </DatePickerWrapper>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: isMobile ? "start" : "center",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "8px" : "16px",
          fontSize: "14px",
          fontWeight: "500",
          color: theme.primaryText,
        }}
      >
        <label style={{ whiteSpace: "nowrap" }}>
          {activeLanguage.endDate}:
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
            selected={endMonthVisit}
            onChange={(date: any) => setEndMonthVisit(date)}
            showMonthYearPicker
            dateFormat="MM/yyyy"
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
    font-size: 14px;

    @media (max-width: 768px) {
      font-size: 16px;
    }
  }
`;

export default function Monthly() {
  const { storeInfo, activeLanguage, isMobile } = useAppContext();
  const { theme } = useTheme();

  const { visitStats, loading } = useAdminContext();
  const users = visitStats?.users;

  // Calculate the height percentage based on the item value and max value

  const [percentages, setPercentages] = useState([]);

  // Determine percentages whenever stats changes
  useEffect(() => {
    if (users?.daily) {
      const maxLength =
        users.monthly.find((i: any) => i.maxLength)?.length || 1; // Avoid division by 0
      const calculatedPercentages = users.monthly.map((item: any) => ({
        ...item,
        lengthHeightPercentage: (item.length / maxLength) * 80,
      }));

      setPercentages(calculatedPercentages);
    }
  }, [visitStats]);

  // active type
  const [activeType, setActiveType] = useState("users");

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "start" : "center",
          justifyContent: "space-between",
        }}
      >
        <h2
          style={{
            color: theme.primaryText,
            fontSize: "16px",
            fontWeight: "600",
            width: isMobile ? "auto" : "150px",
            marginBottom: isMobile ? "24px" : "0",
          }}
        >
          {activeLanguage.monthlyusers}
        </h2>
        <DateRangePicker />
      </div>
      <Section style={{ border: `1px solid ${theme.lineDark}` }}>
        {loading ? (
          <div style={{ position: "absolute", left: "15%", top: "50%" }}>
            <BarLoader color={theme.primary} height={6} />
          </div>
        ) : (
          percentages?.map((item: any, index: number) => {
            const { lengthHeightPercentage } = item;
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "8px",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    height: "100%",
                    alignItems: "flex-end",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      background: theme.primary,
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                      fontSize: "10px",
                      height: `${lengthHeightPercentage}%`,
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        bottom: "20px",
                        color: theme.secondaryText,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {activeType === "users" ? (
                        <span style={{ color: theme.primaryText }}>
                          {item.length}
                        </span>
                      ) : (
                        <span
                          style={{
                            color: theme.primaryText,
                            transform: "rotate(-45deg)",
                            position: "relative",
                            bottom: "10px",
                          }}
                        >
                          {item.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    width: "40px",
                    textAlign: "center",
                  }}
                >
                  {item.month}
                </div>
              </div>
            );
          })
        )}
      </Section>
    </>
  );
}

const Section = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 15px;
  height: 300px;
  margin: 16px 0;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 24px;
  overflow-x: auto;
  position: relative;
  z-index: 999;

  .icon {
    cursor: pointer;
    &:hover {
      filter: brightness(0.9);
    }
  }
`;
