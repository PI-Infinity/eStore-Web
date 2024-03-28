import Button from "../../../components/button";
import { Input } from "../../../components/input";
import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { BarLoader } from "react-spinners";
import styled from "styled-components";
import TeamMember from "./teamMember";
import MobileCreateRole from "./mobileCreateRole";
import { useLocation } from "react-router-dom";

export default function Team() {
  // loading
  const [loading, setLoading] = useState(true);

  // theme
  const { theme } = useTheme();

  // advertismentss
  const { activeLanguage, backendUrl, setAlert, isMobile } = useAppContext();

  /**
   * get admin users
   */
  interface usersProps {}
  const [admins, setAdmins] = useState<usersProps[]>([]);

  useEffect(() => {
    const GetUsers = async () => {
      try {
        const response = await axios.get(
          backendUrl + "/api/v1/users?admins=true"
        );
        if (response.data.data.users) {
          setAdmins(response.data.data.users);
        }
      } catch (error: any) {
        console.log(error.response.data.message);
      }
    };
    GetUsers();
  }, []);

  const [newUser, setNewUser] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);

  // getting users
  useEffect(() => {
    // Flag to track if the current fetch request should update the state
    let shouldUpdateState = true;

    const GetUsers = async () => {
      if (newUser.trim() === "") {
        setUsersList([]);
        return;
      }

      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/users?search=${newUser}`
        );

        // Only update state if shouldUpdateState is still true
        if (shouldUpdateState) {
          setUsersList(
            response.data.data.users.length > 0 ? response.data.data.users : []
          );
          setTotalUsers(response.data.totalUsers);
          setPage(1);
        }
      } catch (error) {
        console.log(error);
      }
    };

    GetUsers();

    // Cleanup function to set shouldUpdateState to false when the effect re-runs or the component unmounts
    return () => {
      shouldUpdateState = false;
    };
  }, [newUser]);

  // add users list
  const AddUsers = async () => {
    const newPage = page + 1;

    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/users?search=${newUser}`
      );
      setUsersList((prevUsers: any) => {
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
          if (totalUsers > usersList.length) {
            AddUsers();
          }
        }
      }
    };

    // Register the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, [usersList.length, totalUsers]);

  // fields

  interface accessProps {}
  const [role, setRole] = useState("");
  const [user, setUser] = useState({ firstName: "", lastName: "", _id: "" });
  const [accesses, setAccesses] = useState<accessProps[]>([]);

  // create advertisments
  const location = useLocation();
  const CreateRole = async () => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Create role is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    if (
      role?.length < 1 ||
      user.firstName?.length < 1 ||
      accesses?.length < 1
    ) {
      return setAlert({
        active: true,
        type: "warning",
        text: activeLanguage.pleaseInputNecessaryFields,
      });
    }

    try {
      // Assuming you have an endpoint to save or update the store details
      const response = await axios.patch(
        backendUrl + "/api/v1/users/" + user?._id,
        {
          admin: { active: true, role, access: accesses },
        }
      );
      if (response.data.status === "success") {
        let roledUser = {
          ...user,
          admin: { active: true, role, access: accesses },
        };
        setAdmins((prev: any) => [roledUser, ...prev]);
        setRole("");
        setAccesses([]);
        setUser({ firstName: "", lastName: "", _id: "" });
        setAlert({
          active: true,
          type: "success",
          text: activeLanguage.newRoleCreatedSuccessfully,
        });
      }
    } catch (error: any) {
      console.log(error);
      console.log(error.response.data.message);
    }
  };

  // creat Role
  const [openCreateRole, setOpenCreateRole] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  return (
    <Container
      style={{
        color: theme.primaryText,
        border: isMobile ? "none" : `1px solid ${theme.line}`,
      }}
    >
      {isMobile && (
        <MobileCreateRole
          openCreateRole={openCreateRole}
          setOpenCreateRole={setOpenCreateRole}
          role={role}
          setRole={setRole}
          accesses={accesses}
          setAccesses={setAccesses}
          usersList={usersList}
          newUser={newUser}
          setNewUser={setNewUser}
          setUser={setUser}
          setUsersList={setUsersList}
          data={data}
          user={user}
          CreateRole={CreateRole}
        />
      )}
      {isMobile && (
        <h1
          className="icon"
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: theme.lightBackground,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            border: `1px solid ${theme.line}`,
            borderRadius: "50px",
            padding: "4px 8px",
            background: theme.primary,
            margin: "8px 8px 0 8px",
          }}
          onClick={() => setOpenCreateRole(!openCreateRole)}
        >
          <BiPlus size={24} /> {activeLanguage.createNewRole}
        </h1>
      )}
      <List>
        {loading ? (
          <div
            style={{
              margin: "24px",
              height: "70%",
              width: "100%",
            }}
          >
            <BarLoader color={theme.primary} height={6} />
          </div>
        ) : (
          <>
            {admins?.map((item: any, index: number) => {
              return (
                <TeamMember
                  item={item}
                  index={index}
                  key={index}
                  setAdmins={setAdmins}
                />
              );
            })}
          </>
        )}
      </List>
      {!isMobile && (
        <AddNewMember style={{ border: `1px solid ${theme.line}` }}>
          <h1
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: theme.primaryText,
              marginBottom: "16px",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <BiPlus size={24} /> {activeLanguage.createNewRole}
          </h1>

          <Input
            label={activeLanguage.roleTitle + "*"}
            value={role}
            onChange={setRole}
            warning={false}
            type="text"
          />

          <div>
            <div style={{}}>
              <Input
                label={activeLanguage.searchUser}
                warning={false}
                value={newUser}
                onChange={setNewUser}
                type="text"
              />
              {usersList?.length > 0 && (
                <div
                  style={{
                    width: "100%",
                    maxHeight: "200px",
                    padding: "16px",
                    border: `1px solid ${theme.primary}`,
                    borderRadius: "15px",
                    marginTop: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    overflowY: "auto",
                  }}
                >
                  {usersList?.map((it: any, indx: number) => {
                    return (
                      <div
                        onClick={() => {
                          setUser(it);
                          setUsersList([]);
                          setNewUser("");
                        }}
                        className="icon"
                        key={indx}
                        style={{
                          color: theme.primaryText,
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                        }}
                      >
                        <div>{it?.firstName + " " + it?.lastName}</div>
                        <div style={{ color: theme.secondaryText }}>
                          {activeLanguage.email}: {it?.email}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <div style={{ marginTop: "16px", marginLeft: "16px" }}>
                <h2 style={{ fontWeight: "600", color: theme.primaryText }}>
                  {activeLanguage.access}
                </h2>
                <FormGroup row sx={{ marginTop: "4px", gap: "4px" }}>
                  <FormControlLabel
                    // Move the key here and use item.label if it's unique
                    control={
                      <Checkbox
                        name={"All"} // Use item.name if available, otherwise default to "All"
                        sx={{ color: theme.secondaryText }}
                        checked={accesses.length === data?.length} // Determine if the checkbox should be checked
                        onChange={(e) => {
                          let all = data.map((i: any) => {
                            return i.label;
                          });
                          setAccesses(
                            accesses.length === data?.length ? [] : all
                          );
                        }}
                      />
                    }
                    label={activeLanguage.all}
                  />

                  {data?.map((item: any) => {
                    return (
                      <FormControlLabel
                        key={item.label} // Move the key here and use item.label if it's unique
                        control={
                          <Checkbox
                            name={item.name || "All"} // Use item.name if available, otherwise default to "All"
                            sx={{ color: theme.secondaryText }}
                            checked={accesses.includes(item.label)} // Determine if the checkbox should be checked
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAccesses((prev: any) => [
                                  ...prev,
                                  item.label,
                                ]);
                              } else {
                                setAccesses((prev: any) =>
                                  prev.filter(
                                    (label: string) => label !== item.label
                                  )
                                );
                              }
                            }}
                          />
                        }
                        label={item.label}
                      />
                    );
                  })}
                </FormGroup>
              </div>

              <Review
                style={{
                  color: theme.primaryText,
                  border: `1px solid ${theme.line}`,
                }}
              >
                <h2 style={{ marginBottom: "16px", fontWeight: 600 }}>
                  {activeLanguage.review}
                </h2>
                <div>
                  <h2 style={{ color: theme.secondaryText }}>
                    {activeLanguage.role}:
                  </h2>
                  <span>{role?.length > 0 ? role : "—"}</span>
                </div>
                <div>
                  <h2 style={{ color: theme.secondaryText }}>
                    {activeLanguage.user}:
                  </h2>
                  <span>
                    {user?.firstName
                      ? user?.firstName + " " + user?.lastName
                      : "—"}
                  </span>
                </div>
              </Review>
            </div>
          </div>

          <div>
            <Button
              disabled={false}
              title={activeLanguage.create}
              background={theme.primary}
              color={theme.lightBackground}
              onClick={CreateRole}
            />
          </div>
        </AddNewMember>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 95vh;
  border-radius: 15px;
  padding: 24px;
  padding-bottom: 64px;
  position: relative;
  display: flex;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 0;
    height: 80vh;
    flex-direction: column;
    gap: 16px;
  }

  .icon {
    cursor: pointer;
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const List = styled.div`
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 15px;
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 0 8px 8px 8px;
    width: 100%;
    gap: 8px;
  }
`;

const AddNewMember = styled.div`
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 15px;
  padding: 24px;
  overflow-y: auto;
`;

const Review = styled.div`
  border-radius: 15px;
  padding: 24px;
  margin-top: 16px;

  & > div {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    margin-bottom: 4px;
  }
`;

const data = [
  { label: "Orders" },
  { label: "Products" },
  { label: "Users" },
  { label: "Analytics" },
  {
    label: "Messages",
  },
  { label: "Team" },
  {
    label: "Shipping",
  },
  { label: "Finances" },
  {
    label: "Coupons",
  },
  { label: "Content" },
  { label: "Advertisements" },
  { label: "Settings" },
];
