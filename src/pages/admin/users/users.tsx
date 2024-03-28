import ConfirmPopup from "../../../components/confirmPopup";
import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";
import { DeleteForever } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BarLoader, BounceLoader } from "react-spinners";
import styled from "styled-components";
import Search from "../products/search";

import { MdArrowDropDown } from "react-icons/md";
import { useLocation } from "react-router-dom";

interface ItemProps {
  disabled: string;
}

const Users = () => {
  // theme
  const { theme } = useTheme();
  // users
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  // load page
  const [loadPage, setLoadPage] = useState(true);

  // rerender users list
  const [rerenderUsers, setRerenderUsers] = useState(false);

  // fetching page
  const [page, setPage] = useState(1);

  // app context
  const { backendUrl, setAlert, activeLanguage, isMobile } = useAppContext();

  // search
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  // getting users
  useEffect(() => {
    const GetUsers = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/users?search=${search}&sort=${sort}`
        );
        setUsers(response.data.data.users);
        setTotalUsers(response.data.totalUsers);
        setLoadPage(false);
        setPage(1);
      } catch (error) {
        console.log(error);
      }
    };

    GetUsers();
  }, [search, rerenderUsers, sort]);

  const AddUsers = async () => {
    const newPage = page + 1;

    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/users?search=${search}&sort=${sort}`
      );
      setUsers((prevUsers: any) => {
        const existingIds = new Set(prevUsers.map((user: any) => user._id));
        const filteredNewProducts = response.data.data.users.filter(
          (user: any) => !existingIds.has(user._id)
        );

        if (filteredNewProducts.length > 0) {
          return [...prevUsers, ...filteredNewProducts];
        } else {
          return prevUsers;
        }
      });
      setPage(newPage);
    } catch (error) {
      console.log(error);
    }
  };

  // this useffect runs addproducts function when scroll is bottom
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Ensure containerRef.current is not null before accessing its properties
      if (containerRef.current) {
        const { bottom } = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if the bottom of the component is near the bottom of the window viewport
        if (bottom <= windowHeight + 100) {
          // 90px threshold, adjust as needed
          if (totalUsers > users.length) {
            AddUsers();
          }
        }
      }
    };

    // Register the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, [users.length, totalUsers]);

  /**
   * delete user
   */
  interface Item {
    _id: string;
    gallery: GalleryItem[];
  }

  interface GalleryItem {
    folderId: string; // Assuming each gallery item has a folderId
    // Add other necessary properties
  }

  interface OpenConfirmState {
    active: boolean;
    item: Item | null; // Using null for no item selected
  }
  const [openConfirm, setOpenConfirm] = useState<OpenConfirmState>({
    active: false,
    item: null,
  });

  const location = useLocation();
  const DeleteUser = async (userId: any) => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Delete User is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    try {
      setUsers((prev) => prev.filter((i: any) => i._id !== userId));
      await axios.delete(backendUrl + "/api/v1/users/" + userId);

      setOpenConfirm({ active: false, item: null });
      setAlert({
        active: true,
        type: "success",
        text: activeLanguage.userDeletedSuccessfully,
      });
    } catch (error: any) {
      console.log(error);
      setAlert({
        active: true,
        type: "error",
        text: error.response,
      });
    }
  };

  return (
    <Container>
      <ConfirmPopup
        open={openConfirm.active}
        close={() => setOpenConfirm({ active: false, item: null })}
        agree={() => DeleteUser(openConfirm.item?._id)}
        text="Are you sure to want to delete this User?"
      />
      <div
        style={{
          width: isMobile ? "100%" : "70vw",
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <Search search={search} setSearch={setSearch} />
      </div>
      <div
        style={{
          height: "100%",
          border: isMobile ? "none" : `1px solid ${theme.line}`,
          padding: isMobile ? "0 8px" : "0 24px 24px 24px",
          borderRadius: "15px",
          color: theme.primaryText,
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        <Item
          disabled="transparent"
          style={{
            border: `1px solid ${theme.lineDark}`,
            borderTop: "none",
            borderLeft: "none",
            borderRight: "none",
            borderRadius: "0",
            cursor: "auto",
            marginBottom: "8px",
            width: isMobile ? "1500px" : "1700px",
          }}
        >
          <div
            style={{
              width: "20px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            N
          </div>
          <Divider style={{ background: theme.lineDark }} />
          <div
            style={{
              width: "150px",
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              fontWeight: "bold",
            }}
          >
            {activeLanguage.name}
          </div>
          <Divider style={{ background: theme.lineDark }} />
          <div
            style={{
              width: "120px",
              display: "flex",
              alignItems: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              fontWeight: "bold",
            }}
          >
            {activeLanguage.phone}
          </div>
          <Divider style={{ background: theme.lineDark }} />
          <div
            style={{
              width: "250px",
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            {activeLanguage.email}
          </div>
          <Divider style={{ background: theme.lineDark }} />
          <div
            style={{
              width: "300px",
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            {activeLanguage.address}
          </div>
          <Divider style={{ background: theme.lineDark }} />
          <div
            style={{
              width: "100px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            className="icon"
            onClick={() => setSort(sort !== "orders" ? "orders" : "")}
          >
            {activeLanguage.orders}{" "}
            <MdArrowDropDown
              size={24}
              color={sort === "orders" ? theme.primary : "inherit"}
            />
          </div>

          <Divider style={{ background: theme.lineDark }} />
          <div
            style={{
              width: "100px",
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            {activeLanguage.saves}
          </div>
          <Divider style={{ background: theme.lineDark }} />
        </Item>

        {loadPage ? (
          <div
            style={{
              margin: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "70%",
              width: "100%",
            }}
          >
            <BarLoader color={theme.primary} height={6} />
          </div>
        ) : (
          <div
            ref={containerRef}
            style={{
              width: " 100%",
              height: "70vh",
            }}
          >
            {users.length > 0 ? (
              users?.map((item: any, index: number) => {
                return (
                  <UserItem
                    key={index}
                    index={index}
                    item={item}
                    setOpenConfirm={setOpenConfirm}
                    setRerenderUsers={setRerenderUsers}
                    totalUsers={totalUsers}
                  />
                );
              })
            ) : (
              <div
                style={{
                  color: theme.secondaryText,
                  width: "100%",
                  padding: "64px",
                }}
              >
                {activeLanguage.notFound}
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default Users;

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  min-height: 95vh;
  height: 90vh;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Item = styled.div<ItemProps>`
  width: 1470px;
  height: 55px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  position: relative;
  margin-bottom: 8px;
  font-size: 14px;

  @media (max-width: 768px) {
    height: 40px;
    font-size: 14px;
  }

  &:hover {
    background: ${(props) => props.disabled};
  }

  .icon {
    cursor: pointer;
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 100%;
  margin: 0 16px;
`;

/**
 * user item
 */

const UserItem = ({ index, item, setOpenConfirm, totalUsers }: any) => {
  // user
  const [user, setUser] = useState(item);

  useEffect(() => {
    setUser(item);
  }, [item]);

  const { theme } = useTheme();

  return (
    <Item
      key={index}
      disabled={theme.line}
      style={{
        color: theme.primaryText,
        border: `1px solid ${theme.lineDark}`,
      }}
    >
      <div
        style={{
          width: "20px",
          textAlign: "center",
        }}
      >
        N{totalUsers - index}
      </div>
      <Divider style={{ background: theme.lineDark }} />
      <div style={{ width: "150px", whiteSpace: "nowrap", overflow: "hidden" }}>
        {user?.firstName + " " + user?.lastName}
      </div>
      <Divider style={{ background: theme.lineDark }} />
      <div style={{ whiteSpace: "nowrap", overflow: "hidden", width: "120px" }}>
        {user?.phone || "—"}
      </div>
      <Divider style={{ background: theme.lineDark }} />
      <div style={{ whiteSpace: "nowrap", overflow: "hidden", width: "250px" }}>
        {user?.email}
      </div>
      <Divider style={{ background: theme.lineDark }} />
      <div style={{ whiteSpace: "nowrap", overflow: "hidden", width: "300px" }}>
        {user?.address?.address || "—"}
      </div>
      <Divider style={{ background: theme.lineDark }} />

      <div style={{ whiteSpace: "nowrap", overflow: "hidden", width: "100px" }}>
        {user?.totalOrders}
      </div>
      <Divider style={{ background: theme.lineDark }} />
      <div style={{ whiteSpace: "nowrap", overflow: "hidden", width: "100px" }}>
        {user?.saves}
      </div>
      <Divider style={{ background: theme.lineDark }} />
      <div
        className="icon"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <DeleteForever
          sx={{ color: theme.primary }}
          onClick={() => setOpenConfirm({ active: true, item: user })}
        />
      </div>
    </Item>
  );
};
