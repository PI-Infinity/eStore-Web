import { useLocation } from "react-router-dom";
import BackDrop from "./components/backDrop";
import ChatPopup from "./components/chatPopup";
import { Footer } from "./components/footer";
import Loading from "./components/loading";
import MobileMenu from "./components/mobileMenu";
import Navbar from "./components/navbar";
import SearchResult from "./components/searchResult";
import SimpleSnackbar from "./components/snackbar";
import { useAppContext } from "./context/app";
import { Routers } from "./router";
import { useCurrentUserContext } from "./context/currentUser";

export default function Content() {
  const { isMobile } = useAppContext();
  const { currentUser } = useCurrentUserContext();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <>
      {!isMobile && <SearchResult />}
      {isMobile && <MobileMenu />}
      {!pathname.includes("admin") && !pathname.includes("checkout") && (
        <Navbar />
      )}
      <Routers />
      <Footer />
      {/** app loading */}
      <Loading />
      {/** alert messages */}
      <SimpleSnackbar />
      {/** loading backdrop */}
      <BackDrop />
      {!currentUser?.admin?.active && !pathname.includes("admin") && (
        <ChatPopup />
      )}
    </>
  );
}
