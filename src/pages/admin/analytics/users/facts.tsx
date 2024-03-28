import { BarLoader } from "react-spinners";
import styled from "styled-components";
import { useAdminContext } from "../../../../context/adminContext";
import { useAppContext } from "../../../../context/app";
import { useTheme } from "../../../../context/theme";

export default function Facts() {
  const { storeInfo, activeLanguage } = useAppContext();
  const { theme } = useTheme();

  const { visitStats, loading } = useAdminContext();
  const users = visitStats?.users;

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
              <h2>{activeLanguage.todayUniqueVisits}:</h2>
              <span style={{ color: theme.primary, fontWeight: "600" }}>
                {users?.facts?.today}
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
              <h2>{activeLanguage.maxDailyUniqueVisit}:</h2>
              <h2 style={{ color: theme.primary, fontWeight: 600 }}>
                {users?.facts?.highest?.length}
              </h2>
              <span style={{ color: theme.secondaryText }}>
                {new Date(users?.facts?.highest?.date).toLocaleDateString()}
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
              <h2>{activeLanguage.minDailyUniqueVisit}:</h2>
              <h2 style={{ color: theme.primary, fontWeight: 600 }}>
                {users?.facts?.lowest?.length}
              </h2>
              <span style={{ color: theme.secondaryText }}>
                {new Date(users?.facts?.lowest?.date).toLocaleDateString()}
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
              <h2>{activeLanguage.averageDailyUniqueVisit}:</h2>
              <h2 style={{ color: theme.primary, fontWeight: 600 }}>
                {users?.facts?.average}
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
