import { useAppContext } from "./app";
import axios from "axios";
// import { signOut } from "next-auth/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useShippingContext } from "./shipping";
import { googleLogout } from "@react-oauth/google";
import { v4 } from "uuid";

const CurrentUserContext = createContext();

export const useCurrentUserContext = () => useContext(CurrentUserContext);

export function CurrentUserContextWrapper({ children }) {
  // current user state
  const [currentUser, setCurrentUser] = useState(null);

  // order state
  const { setOrder } = useShippingContext();

  // backend url
  const { backendUrl, setAppLoad, storeInfo } = useAppContext();

  // define visitor unique identificator and add to db for getting visitor statistics
  useEffect(() => {
    let uniqueIdentificator = localStorage.getItem(
      "eStore:uniqueIdentificator"
    );
    const AddVisitor = async (uid) => {
      try {
        await axios.post(backendUrl + "/visit", {
          id: uid,
          visitDate: new Date(),
        });
      } catch (error) {
        console.log("add visitor error");
        console.log(error.response);
      }
    };

    if (uniqueIdentificator) {
      AddVisitor(uniqueIdentificator);
    } else {
      let id = v4();
      AddVisitor(id);
      localStorage.setItem("eStore:uniqueIdentificator", id);
    }
    // // Note: Use your own API token here
    // fetch("https://ipinfo.io/json?token=9301a66f94f421")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //   });
  }, []);

  useEffect(() => {
    const localUser = localStorage.getItem("eStore:currentUser");
    const GetUser = async () => {
      try {
        const response = await axios.get(
          backendUrl + "/api/v1/users/" + JSON.parse(localUser)._id
        );
        if (response.data.data.user) {
          setCurrentUser(response.data.data.user);
          setOrder((prev) => ({
            ...prev,
            shipping: {
              ...prev.shipping,
              address: response.data.data.user?.address || "",
              phone: response.data.data.user?.phone || "",
              cost: 0,
            },
            buyer: {
              ...prev.buyer,
              firstName: response.data.data.user?.firstName || "",
              lastName: response.data.data.user?.lastName || "",
              id: response.data.data.user?._id || "",
              email: response.data.data.user?.email || "",
            },
          }));
        } else {
          localStorage.removeItem("eStore:currentUser");
          setCurrentUser(null);
          googleLogout();
        }

        setTimeout(() => {
          setAppLoad(false);
          document.body.style.overflowY = "auto";
        }, 1000);
      } catch (error) {
        if (error?.response?.data?.message === "User not found with this id") {
          localStorage.removeItem("eStore:currentUser");
          setCurrentUser(null);
          googleLogout();
        }
        setTimeout(() => {
          setAppLoad(false);
          document.body.style.overflowY = "auto";
        }, 1000);
      }
    };
    if (localUser) {
      GetUser();
    } else {
      setTimeout(() => {
        setAppLoad(false);
        document.body.style.overflowY = "auto";
      }, 500);
    }
  }, []);

  // change user in local storage
  useEffect(() => {
    localStorage.setItem("eStore:currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  /**
   * create socket server
   */

  const socket = useRef();

  /**
   * Getting new message on real time used socket io
   */

  useEffect(() => {
    socket.current = io(backendUrl);
  }, []);

  useEffect(() => {
    if (currentUser && storeInfo) {
      socket.current.emit(
        "addUser",
        currentUser?.admin.active ? "eStoreUniqueId" : currentUser?.email
      );
    }
  }, [currentUser, storeInfo]);

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        socket,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
}
