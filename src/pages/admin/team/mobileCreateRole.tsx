import Button from "../../../components/button";
import { Input } from "../../../components/input";
import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { MdClose } from "react-icons/md";
import styled from "styled-components";

export default function MobileCreateRole({
  openCreateRole,
  setOpenCreateRole,
  role,
  setRole,
  accesses,
  setAccesses,
  usersList,
  newUser,
  setNewUser,
  setUser,
  setUsersList,
  data,
  user,
  CreateRole,
}: any) {
  const { theme } = useTheme();

  const { storeInfo, activeLanguage } = useAppContext();

  return (
    <Container
      style={{
        background: theme.background,
        transform: `scale(${openCreateRole ? 1 : 0})`,
        opacity: openCreateRole ? 1 : 0,
        borderRadius: openCreateRole ? "0" : "500px",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "50px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "24px",
            top: "0px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <img src={storeInfo?.logo} width={50} height={40} alt="nike" />
        </div>
      </div>
      <MdClose
        onClick={() => setOpenCreateRole(false)}
        size={32}
        color={theme.primary}
        style={{ position: "absolute", right: "8px", top: "12px" }}
      />
      <div
        style={{
          flex: 1,
          paddingBottom: "88px",
          padding: "8px",
        }}
      >
        <AddNewMember>
          <h1
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: theme.primaryTex,
              paddingLeft: "8px",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {activeLanguage.createNewRole}
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
                <h2 style={{ fontWeight: "700", color: theme.primaryText }}>
                  {activeLanguage.access}
                </h2>
                <FormGroup row sx={{ marginTop: "4px", gap: "4px" }}>
                  <FormControlLabel
                    // Move the key here and use item.label if it's unique
                    control={
                      <Checkbox
                        name={"All"} // Use item.name if available, otherwise default to "All"
                        sx={{ color: theme.secondaryText }}
                        checked={accesses?.length === data?.length} // Determine if the checkbox should be checked
                        onChange={(e) => {
                          let all = data.map((i: any) => {
                            return i.label;
                          });
                          setAccesses(
                            accesses?.length === data?.length ? [] : all
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
                  fontWeight: 500,
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
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 100vh;
  position: fixed;
  top: 0px;
  transition: ease-in 150ms;
  z-index: 100999;

  @media (max-width: 768px) {
    height: 90vh;
  }
`;

const AddNewMember = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 15px;
  padding-bottom: 24px;
  overflow-y: auto;
`;

const Review = styled.div`
  border-radius: 15px;
  padding: 24px;

  & > div {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    margin-bottom: 4px;
  }
`;
