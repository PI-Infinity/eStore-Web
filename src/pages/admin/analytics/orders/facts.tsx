import { useAdminContext } from "../../../../context/adminContext";
import { useAppContext } from "../../../../context/app";
import { useTheme } from "../../../../context/theme";
import React, { useState } from "react";
import { TbNumbers } from "react-icons/tb";
import { BarLoader } from "react-spinners";
import styled from "styled-components";

export default function Facts() {
  const { storeInfo, activeLanguage } = useAppContext();
  const { theme } = useTheme();

  const { stats, loading } = useAdminContext();
  const orders = stats?.orders;

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
            width: "100px",
          }}
        >
          {activeLanguage.facts}
        </h2>
      </div>
      <Section
        style={{
          color: theme.primaryText,
          border: `1px solid ${theme.lineDark}`,
        }}
      >
        {loading ? (
          <div
            style={{
              position: "absolute",
              left: "15%",
              top: "50%",
              height: "150px",
            }}
          >
            <BarLoader color={theme.primaryText} height={6} />
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
              }}
            >
              <h2>{activeLanguage.totalOrders}:</h2>
              <span style={{ color: theme.primary, fontWeight: "600" }}>
                {orders?.facts?.totalOrders}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
              }}
            >
              <h2>{activeLanguage.maxOrder}:</h2>
              <h2 style={{ color: theme.primary, fontWeight: 600 }}>
                {storeInfo?.currency === "Dollar"
                  ? "$"
                  : storeInfo?.currency == "Euro"
                  ? "€"
                  : "₾"}
                {orders?.facts?.highest?.total?.toFixed(2)}
              </h2>
              <span style={{ color: theme.secondaryText }}>
                {orders?.facts?.highest?.createdAt}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
              }}
            >
              <h2>{activeLanguage.minOrder}:</h2>
              <h2 style={{ color: theme.primary, fontWeight: 600 }}>
                {storeInfo?.currency === "Dollar"
                  ? "$"
                  : storeInfo?.currency == "Euro"
                  ? "€"
                  : "₾"}
                {orders?.facts?.lowest?.total?.toFixed(2)}
              </h2>
              <span style={{ color: theme.secondaryText }}>
                {orders?.facts?.lowest?.createdAt}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
              }}
            >
              <h2>{activeLanguage.averageOrder}:</h2>
              <h2 style={{ color: theme.primary, fontWeight: 600 }}>
                {storeInfo?.currency === "Dollar"
                  ? "$"
                  : storeInfo?.currency == "Euro"
                  ? "€"
                  : "₾"}
                {orders?.facts?.average?.toFixed(2)}
              </h2>
            </div>
          </>
        )}
      </Section>
    </>
  );
}

const Section = styled.div`
  width: 100%;
  border-radius: 15px;
  margin: 16px 0;
  display: flex;
  flex-direction: column;
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
