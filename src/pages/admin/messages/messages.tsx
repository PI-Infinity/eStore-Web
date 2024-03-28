import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BarLoader } from "react-spinners";
import styled from "styled-components";
import Chats from "./chats";
import Room from "./room";
import { useAdminContext } from "../../../context/adminContext";
import SendEmails from "./sendEmails";
import { MdOutlineMailOutline } from "react-icons/md";
import MobileChats from "./mobileChats";

export default function Messages() {
  const { theme } = useTheme();

  // load page
  const [loadPage, setLoadPage] = useState(true);

  // app context
  const { backendUrl, activeLanguage, isMobile } = useAppContext();

  // chats
  interface RoomsType {
    room: any;
  }
  const [rooms, setRooms] = useState<RoomsType[]>([]);
  const [page, setPage] = useState(1);
  const [totalRooms, setTotalRooms] = useState(0);

  // ACTIVE room
  const [activeRoom, setActiveRoom] = useState(null);
  const [rerenderRooms, setRerenderRooms] = useState(false);

  // admin context
  const { setUnreadMessages } = useAdminContext();

  const isFirstLoad = useRef(true);

  useEffect(() => {
    const GetRooms = async () => {
      try {
        const response = await axios.get(
          backendUrl + "/api/v1/chats?page=" + page
        );
        if (response.data.status === "success") {
          setRooms(response.data.data.chats);
          if (isFirstLoad.current) {
            setActiveRoom(response.data.data.chats[0].room);
            isFirstLoad.current = false;
          }
          if (response.data.data.chats.some((i: any) => !i.seen)) {
            setUnreadMessages(true);
          }
          setTotalRooms(response.data.length);
          setPage(1);
        }
        setLoadPage(false);
      } catch (error: any) {
        setTimeout(() => {
          setLoadPage(false);
        }, 300);
        console.log(error.response);
        console.log("getting chats error");
      }
    };
    GetRooms();
  }, [rerenderRooms]);

  const AddRooms = async () => {
    try {
      const newPage = page + 1;
      const response = await axios.get(
        backendUrl + "/api/v1/chats?page=" + newPage
      );
      // Check if new chats were fetched
      if (response.data.data.chats.length > 0) {
        setRooms((prevRooms: any) => {
          const newRooms: any = response.data.data.chats;

          const existingIds = new Set(prevRooms.map((room: any) => room.room));

          // Filtering out duplicates from the newly fetched orders
          const filteredNewRooms = newRooms.filter(
            (room: any) => !existingIds.has(room.room)
          );

          // If there are new orders, concatenate them with previous orders
          // Also, update the page state and set loading more to false
          if (filteredNewRooms.length > 0) {
            setPage(newPage);
            setTotalRooms(response.data.length);
            return [...prevRooms, ...filteredNewRooms];
          } else {
            // If there are no new orders, just return the previous orders
            return prevRooms;
          }
        });
      }
    } catch (error: any) {
      console.log(error);
      console.log("getting chats error");
    }
  };

  // this useffect runs add orders function when scroll is bottom
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return; // Exit if container is not available

    const handleScroll = () => {
      // Calculate the scroll position and container's height
      const scrollPosition = container.scrollTop + container.offsetHeight;
      const containerHeight = container.scrollHeight;

      // Check if the scroll is near the bottom of the container
      if (containerHeight - scrollPosition <= 100) {
        if (totalRooms > rooms?.length) {
          AddRooms();
        }
      }
    };

    // Register the scroll event listener to the container
    container.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => container.removeEventListener("scroll", handleScroll);
  }, [rooms.length]);

  // send emails to user
  const [openSendEmails, setOpenSendEmails] = useState(false);
  // open chats in mobile
  const [openChats, setOpenChats] = useState(false);

  return (
    <Container>
      {isMobile && (
        <MobileChats
          rooms={rooms}
          setRooms={setRooms}
          activeRoom={activeRoom}
          setActiveRoom={setActiveRoom}
          containerRef={containerRef}
          openChats={openChats}
          setOpenChats={setOpenChats}
        />
      )}
      {openSendEmails ? (
        <SendEmails setOpenSendEmails={setOpenSendEmails} />
      ) : (
        <>
          {loadPage ? (
            <div style={{ margin: "24px" }}>
              <BarLoader color={theme.primary} height={6} />
            </div>
          ) : (
            <Container>
              {activeRoom ? (
                <Room
                  activeRoom={activeRoom}
                  setRooms={setRooms}
                  setRerenderRooms={setRerenderRooms}
                  setOpenChats={setOpenChats}
                />
              ) : (
                <div
                  style={{
                    margin: "24px",
                    color: theme.secondaryText,
                    width: "65%",
                  }}
                >
                  Room not found!
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: isMobile ? "100%" : "35%",
                  gap: "16px",
                  alignItems: "center",
                }}
              >
                <div
                  onClick={() => setOpenSendEmails(true)}
                  style={{
                    width: "95%",
                    background: theme.primary,
                    color: theme.lightBackground,
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "16px",
                    fontSize: "18px",
                    fontWeight: "500",
                  }}
                >
                  <MdOutlineMailOutline size={24} /> {activeLanguage.sendEmails}
                </div>
                {!isMobile && (
                  <Chats
                    rooms={rooms}
                    setRooms={setRooms}
                    activeRoom={activeRoom}
                    setActiveRoom={setActiveRoom}
                    containerRef={containerRef}
                  />
                )}
              </div>
            </Container>
          )}
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 90vh;
  border-radius: 15px;
  padding-bottom: 32px;
  overflow-y: hidden;
  position: relative;
  display: flex;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    height: 85vh;
    gap: 8px;
  }

  .icon {
    cursor: pointer;
    &:hover {
      filter: brightness(0.9);
    }
  }
`;
