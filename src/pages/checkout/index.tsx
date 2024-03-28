import { useAppContext } from "../../context/app";
import { useShippingContext } from "../../context/shipping";
import { useTheme } from "../../context/theme";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Bag from "./bag";
import Delivery from "./delivery";
import Payment from "./payment";

const Checkout = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { theme } = useTheme();

  // choice step
  const [stepOption, setStepOption] = useState("delivery");

  const {
    shippingVariants,
    setShippingVariants,
    order,
    deliveryType,
    setOrder,
  } = useShippingContext();

  const { storeInfo, activeLanguage, isMobile, setPageLoading } =
    useAppContext();

  // load logo smoothly
  const [load, setLoad] = useState(true);

  useEffect(() => {
    let shippings = storeInfo?.shipping?.filter(
      (i: any) => i.shippingArea.region === order.shipping.address.region
    );
    setShippingVariants(shippings);
    setLoad(false);
  }, [order, storeInfo, deliveryType]);

  useEffect(() => {
    if (deliveryType === "ship" && storeInfo?.shipping) {
      let shippings = storeInfo?.shipping?.filter(
        (i: any) => i.shippingArea.region === order.shipping.address.region
      );
      setOrder((prev: any) => ({
        ...prev,
        shipping: {
          ...prev?.shipping,
          cost: parseInt(shippings[0]?.shippingCost),
          shippingTitle: shippings[0]?.title,
          shippingTime: shippings[0]?.shippingTime,
        },
      }));
    } else {
      setOrder((prev: any) => ({
        ...prev,
        shipping: {
          ...prev?.shipping,
          cost: 0,
          shippingTitle: "Pick Up",
        },
      }));
    }
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  }, [deliveryType, storeInfo]);

  return (
    <Container
      style={{ color: theme.primaryText, padding: isMobile ? "8px" : "24px" }}
    >
      <div
        style={{
          width: "100%",
          height: "50px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          // secondarytext={theme.secondaryText}
          style={{
            display: "flex",
            justifyContent: "center",
            opacity: 1,
            marginLeft: "2%",
          }}
        >
          <img
            src={storeInfo?.logo}
            width={70}
            // height={40}
            alt="nike"
            style={{
              opacity: load ? 0 : 1,
              transition: "ease-in 300ms",
              zIndex: 1001,
            }}
          />
          {/* <div
            style={{
              position: "absolute",
              top: "-50px",
              left: "-10%",
              zIndex: "998",
            }}
            className="flex place-items-start before:w-full sm:before:w-[880px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[25vw] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"
          ></div> */}
        </Link>
      </div>
      <h2
        style={{
          fontSize: "24px",
          margin: "24px 0",
          position: "relative",
          bottom: "40px",
          fontWeight: "600",
        }}
      >
        {activeLanguage.shipping}
      </h2>
      <Wrapper
        style={{
          padding: isMobile ? "0" : "24px",
          border: isMobile ? "none" : `1px solid ${theme.lineDark}`,
          minHeight: isMobile ? "auto" : "80vh",
          width: isMobile ? "100%" : "75vw",
          gap: isMobile ? "8px" : "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            width: "100%",
            boxSizing: "border-box",
            gap: isMobile ? "8px" : "24px",
          }}
        >
          <div
            style={{
              width: isMobile ? "100%" : "65%",
              border: isMobile ? "none" : `1px solid ${theme.lineDark}`,
              padding: isMobile ? "8px" : "24px",
              borderRadius: "15px",
              boxSizing: "border-box",
            }}
          >
            <Delivery
              stepOption={stepOption}
              setStepOption={setStepOption}
              shippingVariants={shippingVariants}
              setShippingVariants={setShippingVariants}
            />
            <div
              style={{
                height: "1px",
                width: "100%",
                background: theme.line,
                margin: "24px 0",
              }}
            />
            <Payment stepOption={stepOption} setStepOption={setStepOption} />
          </div>
          {!isMobile && <Bag shippingVariants={shippingVariants} />}
        </div>
      </Wrapper>
    </Container>
  );
};

export default Checkout;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  letter-spacing: 0.5px;
`;

const Wrapper = styled.div`
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  z-index: 999;
  position: relative;
  bottom: 40px;
`;
