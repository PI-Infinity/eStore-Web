import { useAppContext } from "../../context/app";
import { useCurrentUserContext } from "../../context/currentUser";
import { useTheme } from "../../context/theme";
import axios from "axios";
import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { BiCopy } from "react-icons/bi";
import { IoMdHeart } from "react-icons/io";
import { MdDelete, MdRemove } from "react-icons/md";
import { BarLoader, BounceLoader } from "react-spinners";
import styled from "styled-components";

export default function Favourites() {
  const { theme } = useTheme();

  // get favourites
  const [favourites, setFavourites] = useState([]);

  const { storeInfo, backendUrl, setPageLoading, activeLanguage } =
    useAppContext();

  const [loadingFavourites, setLoadingFavourites] = useState(true);

  // current user
  const { currentUser } = useCurrentUserContext();

  // getting favourites products
  const [page, setPage] = useState(1);
  useEffect(() => {
    const GettingFavouriteProducts = async () => {
      try {
        const response = await axios.get(
          backendUrl +
            "/api/v1/products?page=1&limit=5&userId=" +
            currentUser._id +
            "&favourites=true"
        );
        setFavourites(response.data.data.products);
        if (page !== 1) {
          setPage(1);
        }
        setTimeout(() => {
          setLoadingFavourites(false);
        }, 200);
      } catch (error: any) {
        console.log(error.response.data.message);
      }
    };
    if (currentUser) {
      GettingFavouriteProducts();
    }
  }, [currentUser]);

  // add more favourites on scrolling
  const AddList = async () => {
    // Use a temporary variable for the new page number
    const newPage = page + 1;

    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/products?page=${newPage}&limit=5&userId=${currentUser._id}&favourites=true`
      );

      // Check if new favourites were fetched
      if (response.data.data.products?.length > 0) {
        setFavourites((prevItem: any) => {
          const newItem: any = response.data.data.products;

          const existingIds = new Set(prevItem.map((order: any) => order._id));

          // Filtering out duplicates from the newly fetched favourites
          const filteredNewItems = newItem.filter(
            (order: any) => !existingIds.has(order._id)
          );

          // If there are new favourites, concatenate them with previous favourites
          // Also, update the page state and set loading more to false
          if (filteredNewItems?.length > 0) {
            setPage(newPage);
            return [...prevItem, ...filteredNewItems];
          } else {
            // If there are no new favourites, just return the previous favourites
            return prevItem;
          }
        });
      }
    } catch (error: any) {
      console.error(
        "Error fetching favourites:",
        error.response?.data?.message
      );
    }
  };

  // this useffect runs add favourites function when scroll is bottom
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
        console.log("Container scrolled to bottom");
        AddList();
      }
    };

    // Register the scroll event listener to the container
    container.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => container.removeEventListener("scroll", handleScroll);
  }, [favourites.length]);

  /**
   * Unsave product
   */

  const UnSave = async (itemId: string) => {
    try {
      setFavourites((prev: any) => prev.filter((i: any) => i._id !== itemId));
      await axios.patch(
        backendUrl + "/api/v1/products/" + itemId + "/save?action=remove",
        {
          userId: currentUser._id,
        }
      );
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Container
      ref={containerRef}
      style={{ border: `1px solid ${theme.lineDark}` }}
    >
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
        <IoMdHeart size={24} /> {activeLanguage.favourites}:
      </h1>
      {loadingFavourites ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BarLoader height={6} color={theme.primaryText} />
        </div>
      ) : (
        <div>
          {favourites?.length < 1 ? (
            <div style={{ padding: "0 24px", color: theme.secondaryText }}>
              {activeLanguage.favouritesNotFound}
            </div>
          ) : (
            favourites?.map((item: any, index: number) => {
              let cover = item.gallery.find((i: any) => i.cover);
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: "16px",
                    padding: "16px",
                    border: `1px solid ${theme.lineDark}`,
                    borderRadius: "15px",
                    marginBottom: "16px",
                    color: theme.primaryText,
                  }}
                >
                  <ImageWrapper>
                    <Link
                      to={`/products/${item._id}`}
                      onClick={() => {
                        setPageLoading(true);
                      }}
                    >
                      <img
                        src={cover.url || "/cosmetics.png"}
                        alt="Item"
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          aspectRatio: 1,
                        }}
                      />
                    </Link>
                  </ImageWrapper>
                  <div
                    style={{
                      width: "60%",
                      boxSizing: "border-box",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h2 style={{ fontSize: "16px", fontWeight: 600 }}>
                        {item.title}
                      </h2>
                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          cursor: "pointer",
                        }}
                      >
                        <MdRemove
                          onClick={() => UnSave(item?._id)}
                          size={24}
                          color={theme.primary}
                          className="icon"
                        />
                      </div>
                    </div>
                    <h2
                      style={{
                        fontSize: "14px",
                        color: theme.secondaryText,
                        fontWeight: 500,
                      }}
                    >
                      {item.brand}
                    </h2>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontWeight: 500,
                      }}
                    >
                      {item.sale > 0 && (
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: theme.primaryText,
                          }}
                        >
                          {storeInfo?.currency === "Dollar"
                            ? "$"
                            : storeInfo?.currency == "Euro"
                            ? "€"
                            : "₾"}
                          {(
                            item.price -
                            (item.price / 100) * item.sale
                          ).toFixed(2)}
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color:
                            item.sale > 0
                              ? theme.secondaryText
                              : theme.primaryText,
                          textDecoration:
                            item.sale > 0 ? "line-through" : "none",
                        }}
                      >
                        {storeInfo?.currency === "Dollar"
                          ? "$"
                          : storeInfo?.currency == "Euro"
                          ? "€"
                          : "₾"}
                        {item.price.toFixed(2)}
                      </span>
                    </div>
                    <h2
                      style={{
                        fontSize: "14px",
                        color: theme.secondaryText,
                        fontWeight: 500,
                      }}
                    >
                      {item.category} / {item.subCategories[0]}
                    </h2>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 27.5%;
  border-radius: 20px;
  padding: 24px;
  overflow-y: auto;
  max-height: 700px;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    padding: 16px;
    max-height: 400px;
  }

  .icon {
    &:hover {
      opacity: 0.8;
    }
  }
`;

const ImageWrapper = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  transition: ease-in 200ms;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;
