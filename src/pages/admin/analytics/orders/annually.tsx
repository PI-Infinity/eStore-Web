import { useState } from "react";
import { TbNumbers } from "react-icons/tb";
import { BarLoader } from "react-spinners";
import styled from "styled-components";
import { useAdminContext } from "../../../../context/adminContext";
import { useAppContext } from "../../../../context/app";
import { useTheme } from "../../../../context/theme";

export default function Annually() {
  const { storeInfo, activeLanguage, isMobile } = useAppContext();
  const { theme } = useTheme();

  const { stats, loading } = useAdminContext();
  const orders = stats?.orders;

  // Calculate the height percentage based on the item value and max value

  let maxLength = orders?.annually?.find((i: any) => i.maxOrders);
  let maxIncome = orders?.annually?.find((i: any) => i.maxIncomes);
  const calculate = (itm: any) => {
    let lengthHeightPercentage;
    if (maxLength) {
      lengthHeightPercentage = (itm.totalOrders / maxLength?.totalOrders) * 80;
    }
    let incomeHeightPercentage;
    if (maxIncome) {
      incomeHeightPercentage =
        (itm.totalIncomes / maxIncome?.totalIncomes) * 80;
    }
    return { lengthHeightPercentage, incomeHeightPercentage };
  };

  // active type
  const [activeType, setActiveType] = useState("orders");

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h2
          style={{
            color: theme.primaryText,
            fontSize: "16px",
            fontWeight: "600",
            width: isMobile ? "auto" : "150px",
          }}
        >
          {activeLanguage.annuallyOrders}
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              borderRadius: "5px",
              padding: "2px",
              border: `1px solid ${
                activeType === "orders" ? theme.primary : theme.lineDark
              }`,
              width: "30px",
              aspectRatio: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onClick={() => setActiveType("orders")}
            className="icon"
          >
            <TbNumbers size={16} />
          </div>
          <div
            style={{
              borderRadius: "5px",
              padding: "2px",
              border: `1px solid ${
                activeType !== "orders" ? theme.primary : theme.lineDark
              }`,
              width: "30px",
              aspectRatio: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "16px",
            }}
            onClick={() => setActiveType("income")}
            className="icon"
          >
            {storeInfo?.currency === "Dollar"
              ? "$"
              : storeInfo?.currency == "Euro"
              ? "€"
              : "₾"}
          </div>
        </div>
      </div>
      <Section style={{ border: `2px solid ${theme.lineDark}` }}>
        {loading ? (
          <div style={{ position: "absolute", left: "15%", top: "50%" }}>
            <BarLoader color={theme.primary} height={6} />
          </div>
        ) : (
          orders?.annually?.map((item: any, index: number) => {
            let lengthHeightPercentage = calculate(item).lengthHeightPercentage;
            let incomeHeightPercentage = calculate(item).incomeHeightPercentage;
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
                      height: `${
                        activeType === "orders"
                          ? incomeHeightPercentage
                          : lengthHeightPercentage
                      }%`,
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
                      {activeType === "orders" ? (
                        <span style={{ color: theme.primaryText }}>
                          {item.totalOrders}
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
                          {storeInfo?.currency === "Dollar"
                            ? "$"
                            : storeInfo?.currency == "Euro"
                            ? "€"
                            : "₾"}
                          {item.totalIncomes.toFixed(2)}
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
                  {item.date}
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
