import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import styled from "styled-components";
import Outcomes from "./outcomes";
import Today from "./daily";
import Monthly from "./monthly";
import Annually from "./annually";
import axios from "axios";

interface FinancesProps {
  balance: number;
}

export default function Finances() {
  // loading
  const [loading, setLoading] = useState(true);

  // theme
  const { theme } = useTheme();

  // advertisments
  const { storeInfo, backendUrl, activeLanguage, isMobile } = useAppContext();

  // date
  const [date, setDate] = useState(new Date());
  // month
  const [month, setMonth] = useState(new Date());
  // year
  const [year, setYear] = useState(new Date());

  const [finances, setFinances] = useState<FinancesProps>({ balance: 0 });

  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    const getFinances = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/admin/finances?date=${date}&month=${month}&year=${year}`
        );
        setFinances(response.data.stats.finances);
      } catch (error) {
        console.log("get finances error");
        console.log(error);
      }

      setTimeout(() => {
        setLoading(false);
      }, 300);
    };
    getFinances();
  }, [date, month, year, rerender]);

  return (
    <Container
      style={{
        color: theme.primaryText,
        border: isMobile ? "none" : `1px solid ${theme.line}`,
      }}
    >
      {loading ? (
        <div
          style={{
            margin: "24px",
            height: "70%",
            width: "100%",
          }}
        >
          <BarLoader color={theme.primaryText} height={6} />
        </div>
      ) : (
        <>
          <Content>
            <Balance>
              {activeLanguage.balance}:{" "}
              <span
                style={{
                  whiteSpace: "nowrap",
                  color:
                    finances.balance > 0
                      ? "green"
                      : finances.balance < 0
                      ? theme.primary
                      : theme.primaryText,
                }}
              >
                {finances.balance < 0 ? "-" : finances.balance > 0 ? "+" : ""}
                {storeInfo?.currency === "Dollar"
                  ? "$"
                  : storeInfo?.currency === "Euro"
                  ? "€"
                  : "₾"}
                {Math.abs(finances.balance).toFixed(2)}
              </span>
            </Balance>
            <Today date={date} setDate={setDate} result={finances} />
            <Monthly date={month} setDate={setMonth} result={finances} />
            <Annually date={year} setDate={setYear} result={finances} />
          </Content>
          <Outcomes setRerender={setRerender} />
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 90vh;
  padding: 24px;
  position: relative;
  display: flex;
  gap: 24px;
  border-radius: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 8px;
    overflow-y: auto;
    height: 80vh;
    gap: 16px;
  }

  .icon {
    cursor: pointer;
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const Content = styled.div`
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Balance = styled.div`
  display: flex;
  gap: 16px;
  margin: 16px;
  font-size: 24px;
  font-weight: bold;
`;
