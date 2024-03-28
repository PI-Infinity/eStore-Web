import Button from "../../../components/button";
import { Input } from "../../../components/input";
import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";
import { ListAlt } from "@mui/icons-material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { BiPlus } from "react-icons/bi";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdClose,
  MdList,
} from "react-icons/md";
import { useLocation } from "react-router-dom";
import { BarLoader, BounceLoader } from "react-spinners";
import styled from "styled-components";

export default function Outcomes({ setRerender }: any) {
  // theme
  const { theme } = useTheme();

  // app context
  const { backendUrl, storeInfo, setAlert, setConfirm, activeLanguage } =
    useAppContext();

  // adding fields
  const [title, setTitle] = useState("");
  const [allowSearch, setAllowSearch] = useState(false);
  const [titleList, setTitleList] = useState([]);
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");

  // outcomes
  const [closeCreate, setCloseCreate] = useState(false);
  interface outcomeProps {}
  const [outcomes, setOutcomes] = useState<outcomeProps[]>([]);
  const [totalOutcomes, setTotalOutcomes] = useState(0);
  const [search, setSearch] = useState("");
  // Group items by date
  const groupedItems = outcomes
    .filter((i: any) => i.title.toLowerCase().includes(search.toLowerCase()))
    .reduce((acc: any, item: any) => {
      const date = new Date(item.createdAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      return acc;
    }, {});

  /**
   * Getting outcomes
   */
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const GetOutcomes = async () => {
      try {
        const response = await axios.get(
          backendUrl + "/api/v1/outcomes?search=" + search + "&page=1&limit=10"
        );
        setOutcomes(
          response.data.data.outcomes.length > 0
            ? response.data.data.outcomes
            : []
        );
        setTotalOutcomes(response.data.result);
        setPage(1);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    GetOutcomes();
  }, [search]);

  // add outcomes
  const AddOutcomes = async () => {
    const newPage = page + 1;

    try {
      const response = await axios.get(
        backendUrl +
          "/api/v1/outcomes?search=" +
          search +
          "&page=" +
          newPage +
          "&limit=10"
      );
      setOutcomes((prevOutcomes: any) => {
        const existingIds = new Set(
          prevOutcomes.map((outcome: any) => outcome._id)
        );
        const filteredNewOutcomes = response.data.data.outcomes.filter(
          (outcome: any) => !existingIds.has(outcome._id)
        );

        if (filteredNewOutcomes.length > 0) {
          return [...prevOutcomes, ...filteredNewOutcomes];
        } else {
          return prevOutcomes;
        }
      });
      setPage(newPage);
      setTotalOutcomes(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  // search outcome title
  useEffect(() => {
    // Flag to track if the current fetch request should update the state
    let shouldUpdateState = true;

    const GetOutcomes = async () => {
      if (title?.trim() === "") {
        setTitleList([]);
        return;
      }

      try {
        const response = await axios.get(
          backendUrl + "/api/v1/outcomes?limit=10&search=" + title
        );

        // Only update state if shouldUpdateState is still true
        if (shouldUpdateState) {
          setTitleList(
            response.data.data.outcomes.length > 0
              ? response.data.data.outcomes
              : []
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    {
      allowSearch && GetOutcomes();
    }

    // Cleanup function to set shouldUpdateState to false when the effect re-runs or the component unmounts
    return () => {
      shouldUpdateState = false;
      setAllowSearch(false);
    };
  }, [title]);

  /**
   * Create new outcome
   */
  const [createLoading, setCreateLoading] = useState(false);

  const location = useLocation();

  const CreateOutcome = async () => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Create new outcome is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    if (title?.length < 1 || cost?.length < 1) {
      return setAlert({
        active: true,
        text: activeLanguage.pleaseInputNecessaryFields,
        type: "warning",
      });
    }
    try {
      setCreateLoading(true);
      const response = await axios.post(backendUrl + "/api/v1/outcomes", {
        title,
        description,
        cost,
      });
      if (response.data.status === "success") {
        setCreateLoading(false);
        setAlert({
          active: true,
          text: activeLanguage.expenseCreatedSuccessfully,
          type: "success",
        });
        setOutcomes((prev: any) => [response.data.data.outcome, ...prev]);
        setTotalOutcomes(response.data.total);
        setTitle("");
        setDescription("");
        setCost("");
        setRerender((prev: boolean) => !prev);
      }
    } catch (error: any) {
      console.log("Add outcome error");
      console.log(error.response.data.message);
    }
  };

  /**
   * Delete outcome
   */
  const DeleteOutcome = async (id: string) => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Delete outcome is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    try {
      setAlert({
        active: true,
        text: activeLanguage.expenseDeletedSuccesfully,
        type: "success",
      });

      setOutcomes((prev: any) => prev.filter((i: any) => i._id !== id));
      const response = await axios.delete(
        backendUrl + "/api/v1/outcomes/" + id
      );
      if (response.data.status === "success") {
        setConfirm({
          active: false,
          agree: null,
          close: null,
          text: "",
        });
        setTotalOutcomes(response.data.total);
        setRerender((prev: boolean) => !prev);
      }
    } catch (error: any) {
      console.log("delete outcome error");
      console.log(error.response.data.message);
    }
  };

  return (
    <Container
      style={{ color: theme.primaryText, border: `1px solid ${theme.line}` }}
    >
      <AddOutcome>
        <div
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: theme.primaryText,
            marginBottom: "16px",
            zIndex: 666,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
          className="hover"
          onClick={() => setCloseCreate((prev: boolean) => !prev)}
        >
          <BiPlus size={24} /> {activeLanguage.createNewExpense}{" "}
          <div style={{ marginLeft: "auto" }}>
            {closeCreate ? (
              <MdArrowDropUp color={theme.primaryText} size={24} />
            ) : (
              <MdArrowDropDown color={theme.primaryText} size={24} />
            )}
          </div>
        </div>
        {!closeCreate && (
          <>
            <Input
              label={activeLanguage.title + "*"}
              value={title}
              onChange={(e) => {
                setTitle(e);
                setAllowSearch(true);
              }}
              warning={false}
              type="text"
            />
            {titleList?.length > 0 && (
              <div style={{ fontSize: "14px", padding: "0 16px" }}>
                {titleList?.map((i: any, x: number) => {
                  return (
                    <div
                      key={x}
                      style={{
                        marginBottom: "8px",
                        borderBottom: `1px solid ${theme.line}`,
                        paddingBottom: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setAllowSearch(false);
                        setTitle(i.title);
                        setTitleList([]);
                      }}
                    >
                      <h2>{i.title}</h2>
                    </div>
                  );
                })}
              </div>
            )}
            <Input
              label={activeLanguage.description + " " + activeLanguage.optional}
              value={description}
              onChange={setDescription}
              warning={false}
              type="text"
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "60%",
              }}
            >
              <Input
                label={activeLanguage.cost + "*"}
                value={cost}
                onChange={setCost}
                warning={false}
                type="number"
              />
              <span style={{ fontSize: "20px" }}>
                {storeInfo?.currency === "Dollar"
                  ? "$"
                  : storeInfo?.currency == "Euro"
                  ? "€"
                  : "₾"}
              </span>
            </div>
            <Button
              disabled={false}
              title={
                createLoading ? (
                  <BounceLoader size={25} color={theme.primaryText} />
                ) : (
                  activeLanguage.create
                )
              }
              background={theme.primary}
              color={theme.lightBackground}
              onClick={CreateOutcome}
            />
          </>
        )}
      </AddOutcome>
      <h1
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: theme.primaryText,
          zIndex: 666,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          margin: "16px 0 0 0",
        }}
      >
        <MdList style={{ fontSize: "24px" }} /> {activeLanguage.outcomes}
      </h1>
      {loading ? (
        <div
          style={{
            margin: "40px",
            height: "100%",
            width: "100%",
          }}
        >
          <BarLoader color={theme.primary} height={6} />
        </div>
      ) : (
        <List>
          <div
            style={{
              marginTop: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
            }}
          >
            <Input
              label={activeLanguage.search}
              warning={false}
              type="text"
              value={search}
              onChange={setSearch}
            />

            {search?.length > 0 && (
              <MdClose
                style={{
                  color: theme.primary,
                  fontSize: "18px",
                  cursor: "pointer",
                }}
                className="hover"
                onClick={() => setSearch("")}
              />
            )}
          </div>
          {Object.keys(groupedItems).map((date, index) => (
            <div key={index}>
              <h3
                style={{
                  color: theme.secondaryText,
                  margin: "16px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                {date}
              </h3>
              {groupedItems[date].map((item: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      border: `1px solid ${theme.lineDark}`,
                      padding: "8px 16px",
                      width: "100%",
                      borderRadius: "10px",
                      fontSize: "14px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <h2 style={{ fontWeight: 600 }}>{item.title}</h2>
                      <span style={{ color: theme.primary, fontWeight: 600 }}>
                        -
                        {storeInfo?.currency === "Dollar"
                          ? "$"
                          : storeInfo?.currency === "Euro"
                          ? "€"
                          : "₾"}
                        {item.cost}
                      </span>
                    </div>
                    <p style={{ color: theme.secondaryText, fontSize: "12px" }}>
                      {item.description}
                    </p>
                  </div>
                  <div style={{ padding: "4px" }}>
                    <MdClose
                      className="hover"
                      onClick={() =>
                        setConfirm({
                          active: true,
                          agree: () => DeleteOutcome(item._id),

                          text: activeLanguage.askDeleteExpense,
                          close: () =>
                            setConfirm({
                              active: false,
                              agree: null,
                              close: null,
                              text: "",
                            }),
                        })
                      }
                      style={{
                        color: "red",
                        fontSize: "24px",
                        cursor: "pointer",
                        zIndex: 666,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
          {totalOutcomes > outcomes?.length && (
            <div
              onClick={AddOutcomes}
              style={{
                color: theme.primary,
                cursor: "pointer",
                textAlign: "center",
                margin: "8px 0",
              }}
            >
              {activeLanguage.loadMore}
            </div>
          )}
        </List>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 15px;
  padding: 24px;

  @media (max-width: 768px) {
    height: auto;
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
    padding-bottom: 20px;
  }

  .hover {
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const AddOutcome = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const List = styled.div`
  width: 100%;
  padding: 0 8px;
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: 768px) {
    overflow-y: visible;
    height: auto;
  }
`;
