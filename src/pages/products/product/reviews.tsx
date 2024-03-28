import StarIcon from "@mui/icons-material/Star";
import { Rating, Stack } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdRemove, MdSend } from "react-icons/md";
import styled from "styled-components";
import { Input } from "../../../components/input";
import { useAppContext } from "../../../context/app";
import { useCurrentUserContext } from "../../../context/currentUser";
import { useTheme } from "../../../context/theme";

// Interface for the review
interface Review {
  actions: any;
  product: any;
}

const Reviews: React.FC<Review> = ({ actions, product }) => {
  //theme
  const { theme } = useTheme();

  // current user
  const { currentUser } = useCurrentUserContext();

  interface ReviewObj {
    review: string;
    user: any;
    rating: number;
  }

  const [reviews, setReviews] = useState<ReviewObj[]>([]);
  useEffect(() => {
    setReviews(product?.reviews);
  }, [product]);

  // review input
  const [review, setReview] = useState("");

  // add review
  const { backendUrl, activeLanguage, setConfirm, isMobile } = useAppContext();

  const AddReview = async () => {
    try {
      let updatedReviews = [
        {
          review,
          user: { id: currentUser?._id, name: currentUser?.firstName },
          rating: actions?.rating,
        },
        ...reviews,
      ];
      setReviews(updatedReviews);
      await axios.patch(backendUrl + "/api/v1/products/" + product?._id, {
        reviews: updatedReviews,
      });
    } catch (error: any) {
      console.log("Add Review Error:" + error.response);
    }
  };

  /**
   * delete review
   */
  const DeleteReview = async (rev: string) => {
    try {
      let updatedReviews = reviews?.filter((i: any) => i.review !== rev);
      setReviews(updatedReviews);
      setConfirm({
        active: false,
        text: "",
        agree: null,
        close: null,
      });
      await axios.patch(backendUrl + "/api/v1/products/" + product?._id, {
        reviews: updatedReviews,
      });
    } catch (error: any) {
      console.log("Add Review Error:" + error.response);
    }
  };
  return (
    <Container style={{ border: `1px solid ${theme.lineDark}` }}>
      {actions?.canAction && (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "8px" : "24px",
          }}
        >
          <Input
            label={activeLanguage.writeReview}
            value={review}
            type="text"
            warning={false}
            textarea={true}
            onChange={setReview}
          />

          <div
            style={{
              width: isMobile ? "40px" : "50px",
              marginLeft: isMobile ? "5px" : "auto",
            }}
          >
            <MdSend
              size={isMobile ? 26 : 32}
              style={{ transform: "rotate(-145deg)", cursor: "pointer" }}
              color={theme.primaryText}
              onClick={() => {
                AddReview();
                setReview("");
              }}
            />
          </div>
        </div>
      )}
      {reviews?.length > 0 ? (
        <ReviewsList>
          {reviews.map((item: any, index: number) => {
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FaUser color={theme.secondaryText} size={24} />
                  <h3 style={{ color: theme.primaryText, fontWeight: 700 }}>
                    {item.user.name}
                  </h3>
                  {item.rating > 0 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Stack spacing={1}>
                        <Rating
                          name="half-rating-read"
                          value={item.rating}
                          precision={0.1}
                          size="medium"
                          readOnly
                          emptyIcon={
                            <StarIcon
                              style={{
                                opacity: 0.55,
                                color: theme.secondaryText,
                              }}
                              fontSize="inherit"
                            />
                          }
                        />
                      </Stack>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: isMobile ? "16px" : "24px",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: `1px solid ${theme.line}`,
                      borderRadius: "10px",
                    }}
                  >
                    <p style={{ color: theme.primaryText }}>{item.review}</p>
                  </div>
                  {(item.user.id === currentUser?._id ||
                    currentUser?.admin.active) && (
                    <MdRemove
                      color={theme.primary}
                      size={24}
                      style={{ cursor: "pointer" }}
                      className="hover"
                      onClick={() => {
                        setConfirm({
                          active: true,
                          agree: () => DeleteReview(item.review),
                          text: activeLanguage.askDeleteReview,
                          close: () =>
                            setConfirm({
                              active: false,
                              text: "",
                              agree: null,
                              close: null,
                            }),
                        });
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </ReviewsList>
      ) : (
        <span
          style={{ color: theme.secondaryText, width: "100%", padding: "24px" }}
        >
          {activeLanguage.noReviewsFound}
        </span>
      )}
    </Container>
  );
};

export default Reviews;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 20px;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
    font-weight: 500;
  }

  .hover {
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const ReviewsList = styled.div`
  border-radius: 20px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 8px;
`;
