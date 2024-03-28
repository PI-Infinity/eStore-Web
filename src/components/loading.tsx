import { useAppContext } from "../context/app";
import { useTheme } from "../context/theme";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const Loading: React.FC = () => {
  const { appLoad, isMobile } = useAppContext();
  const { theme } = useTheme();

  useEffect(() => {
    document.body.style.overflowY = "hidden";
  }, []);

  return (
    <>
      {appLoad && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            height: "100vh",
            background: theme.background,
            zIndex: 9999999,
            overflow: "hidden",
          }}
        >
          {/* <div
            style={{ position: "absolute", top: "40%", left: "30%" }}
            className="flex place-items-start before:w-full sm:before:w-[880px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[25vw] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"
          ></div> */}
          <div
            style={{ zIndex: 9999999, marginBottom: isMobile ? "10vh" : "0" }}
          >
            <BarLoader height={6} color={theme.primary} />
          </div>
        </div>
      )}
    </>
  );
};

export default Loading;
