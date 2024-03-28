"use client";

import { useProductsContext } from "../../context/productsContext";
import { BrandingWatermark, SortRounded } from "@mui/icons-material";
import AttachMoney from "@mui/icons-material/AttachMoney";
import Category from "@mui/icons-material/Category";
import Discount from "@mui/icons-material/Discount";
import StarIcon from "@mui/icons-material/Star";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  Typography,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import Slider from "@mui/material/Slider";
import { IoMdResize } from "react-icons/io";
import { IoColorFilterOutline } from "react-icons/io5";
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { PiGenderIntersex } from "react-icons/pi";
import styled from "styled-components";
import { useTheme } from "../../context/theme";
import { useAppContext } from "../../context/app";

interface ThemeProps {
  primarytext: string;
}

const Filter = () => {
  // theme
  const { theme } = useTheme();

  // product context
  const {
    sort,
    setSort,
    price,
    setPrice,
    sale,
    setSale,
    categories,
    activeCategory,
    setActiveCategory,
    activeSubCategory,
    setActiveSubCategory,
    rating,
    setRating,
    sex,
    setSex,
    color,
    setColor,
    size,
    setSize,
    colors,
    sizes,
    shoesSizes,
    genders,
    brands,
    brand,
    setBrand,
  } = useProductsContext();

  // app context
  const { storeInfo, activeLanguage, isMobile } = useAppContext();

  // price range

  const MAX_PRICE = 1000;
  const MIN_PRICE = 0;
  function valuetext(value: number) {
    return `${
      storeInfo?.currency === "Dollar"
        ? "$"
        : storeInfo?.currency == "Euro"
        ? "€"
        : "₾"
    } ${value}`;
  }

  const handlePriceChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setPrice([Math.min(newValue[0], price[1] - MIN_PRICE), price[1]]);
    } else {
      setPrice([price[0], Math.max(newValue[1], price[0] + MIN_PRICE)]);
    }
  };

  // sale range

  const MAX_PERCENT = 100;
  const MIN_PERCENT = 0;
  function valuetext2(value: number) {
    return `${value}%`;
  }

  const handleSaleChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setSale([Math.min(newValue[0], sale[1] - MIN_PERCENT), sale[1]]);
    } else {
      setSale([sale[0], Math.max(newValue[1], sale[0] + MIN_PERCENT)]);
    }
  };

  // rating range

  const MAX_RATING = 5;
  const MIN_RATING = 0;
  function valuetext3(value: number) {
    return `${value}%`;
  }

  const handleRatingChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setRating([Math.min(newValue[0], rating[1] - MIN_RATING), rating[1]]);
    } else {
      setRating([rating[0], Math.max(newValue[1], rating[0] + MIN_RATING)]);
    }
  };
  return (
    <div
      style={{
        width: isMobile ? "100%" : "22vw",
        minHeight: "100vh",
        height: "auto",
        transition: "ease-in 200ms",
        border: isMobile ? "none" : `1.5px solid ${theme.line}`,
        borderRadius: "10px",
        boxSizing: "border-box",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        zIndex: 998,
        background: theme.lightBackground,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          borderRadius: "10px",
          boxSizing: "border-box",
          padding: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <SortRounded
            style={{
              fontSize: "26px",
              position: "relative",
              bottom: "2px",
              color: theme.secondaryText,
            }}
          />
          <Typography
            variant="body2"
            style={{ color: theme.secondaryText }}
            sx={{
              marginBottom: "4px",
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: "500",
              letterSpacing: "0.5px",
              color: theme.secondaryText,
            }}
          >
            {activeLanguage.sort}
          </Typography>
        </div>
        <FormGroup row sx={{ marginLeft: "16px", marginBottom: "8px" }}>
          <FormControlLabel
            control={
              <Radio
                checked={sort === "New"} // Determine if the item is selected
                onChange={(e) => {
                  setSort("New");
                }}
                name="New"
                sx={{ color: theme.secondaryText }}
              />
            }
            label={
              <span
                style={{
                  color: theme.primaryText,
                  fontSize: isMobile ? "14px" : "18px",
                  fontWeight: isMobile ? "600" : "500",
                }}
              >
                {activeLanguage.new}
              </span>
            }
          />
          <FormControlLabel
            control={
              <Radio
                checked={sort === "Popular"}
                onChange={(e) => {
                  setSort("Popular");
                }}
                name="Popular"
                sx={{ color: theme.secondaryText }}
              />
            }
            label={
              <span
                style={{
                  color: theme.primaryText,
                  fontSize: isMobile ? "14px" : "18px",
                  fontWeight: isMobile ? "600" : "500",
                }}
              >
                {activeLanguage.popular}
              </span>
            }
          />
        </FormGroup>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Category
            style={{
              fontSize: "26px",
              position: "relative",
              bottom: "2px",
              color: theme.secondaryText,
            }}
          />
          <Typography
            variant="body2"
            style={{ color: theme.secondaryText }}
            sx={{
              marginBottom: "4px",
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: "500",
              letterSpacing: "0.5px",
              color: theme.secondaryText,
            }}
          >
            {activeLanguage.categories}
          </Typography>
        </div>
        {categories?.map((item: any, index: number) => {
          return (
            <div key={index}>
              <CategoryItem
                primarytext={theme.primaryText}
                onClick={
                  item.item === activeCategory
                    ? () => {
                        setActiveCategory("");
                        setActiveSubCategory("");
                        setSize([]);
                      }
                    : () => {
                        setActiveCategory(item.item);
                        setSize([]);
                      }
                }
                style={{
                  border: `1px solid ${
                    item.item === activeCategory
                      ? theme.primary
                      : theme.lineDark
                  }`,
                  color:
                    item.item === activeCategory
                      ? theme.primary
                      : theme.primaryText,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    fontWeight: "600",
                    fontSize: isMobile ? "14px" : "16px",
                  }}
                >
                  {item.label}
                </div>
              </CategoryItem>
              {activeCategory === item.item && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    margin: "8px",
                    marginTop: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {item.subCategories?.map((i: any, x: number) => {
                    return (
                      <CategoryItem
                        primarytext={theme.primaryText}
                        onClick={() =>
                          setActiveSubCategory(
                            (current: any) =>
                              current.includes(i.item)
                                ? current.filter(
                                    (subCat: any) => subCat !== i.item
                                  ) // Remove if exists
                                : [...current, i.item] // Add if not exists
                          )
                        }
                        key={x}
                        style={{
                          fontWeight: "600",
                          fontSize: isMobile ? "14px" : "16px",
                          border: `1px solid ${
                            activeSubCategory.includes(i.item)
                              ? theme.primary
                              : theme.lineDark
                          }`,
                        }}
                      >
                        {i.label}
                      </CategoryItem>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* <Divider sx={{ background: theme.line }} />
      <FormControl>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            left: "8px",
            marginBottom: "4px",
          }}
        >
          <BrandingWatermark
            style={{
              fontSize: "22px",
              position: "relative",
              bottom: "2px",
              color: "orange",
            }}
          />

          <Typography
            variant="body2"
            style={{ color: theme.secondaryText }}
            sx={{
              marginBottom: "4px",
              marginLeft: "12px",
              fon6Size: isMobile ? "14px" : "18px", fontWeight: "500",
            5colo
            letterSpacing: "0.5px",r: theme.secondaryText,
            }}
          >
            Brands
          </Typography>
        </div>
        <FormGroup sx={{ marginLeft: "2vw" }}>
          {brands.map((item: string, index: number) => {
            return (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={brand?.includes(item)} // Determine if the item is selected
                    onChange={(e) => {
                      if (e.target.checked) {
                        setBrand((prev: any) => [...prev, item]);
                      } else {
                        setBrand((prev: any) =>
                          prev.filter((br: any) => br !== item)
                        );
                      }
                    }}
                    name={item}
                    sx={{ color: theme.secondaryText }}
                  />
                }
                label={item}
              />
            );
          })}
        </FormGroup>
      </FormControl> */}
      <Divider sx={{ background: theme.line }} />
      <FormControl>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            left: "8px",
            marginBottom: "4px",
          }}
        >
          <PiGenderIntersex
            style={{
              fontSize: "30px",
              position: "relative",
              bottom: "2px",
              color: "orange",
            }}
          />

          <Typography
            variant="body2"
            style={{ color: theme.secondaryText }}
            sx={{
              marginBottom: "4px",
              marginLeft: "4px",
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: "500",
              letterSpacing: "0.5px",
              color: theme.secondaryText,
            }}
          >
            {activeLanguage.gender}
          </Typography>
        </div>
        <FormGroup sx={{ marginLeft: "2vw" }}>
          {genders.map((item: any, index: number) => {
            return (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={sex?.includes(item.value)} // Determine if the item is selected
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSex((prev: any) => [...prev, item.value]);
                      } else {
                        setSex((prev: any) =>
                          prev.filter((sex: any) => sex !== item.value)
                        );
                      }
                    }}
                    name={item.value}
                    sx={{ color: theme.secondaryText }}
                  />
                }
                label={
                  <span
                    style={{
                      color: theme.primaryText,
                      fontSize: isMobile ? "14px" : "16px",
                      fontWeight: "600",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {item.label}
                  </span>
                }
              />
            );
          })}
        </FormGroup>
      </FormControl>
      <Divider sx={{ background: theme.line }} />
      <div style={{ boxSizing: "border-box", padding: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            right: "4px",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontSize: "24px",
              color: "green",
              position: "relative",
              bottom: "2px",
            }}
          >
            {storeInfo?.currency === "Dollar"
              ? "$"
              : storeInfo?.currency == "Euro"
              ? "€"
              : "₾"}
          </span>
          <Typography
            variant="body2"
            style={{ color: theme.secondaryText }}
            sx={{
              marginBottom: "4px",
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: "500",
              letterSpacing: "0.5px",
              color: theme.secondaryText,
            }}
          >
            {activeLanguage.priceRange}
          </Typography>
        </div>
        <Slider
          getAriaLabel={() => "Minimum Price"}
          value={price}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) =>
            `${value} ${
              storeInfo?.currency === "Dollar"
                ? "$"
                : storeInfo?.currency == "Euro"
                ? "€"
                : "₾"
            }`
          }
          getAriaValueText={valuetext}
          min={0}
          max={1000}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" style={{ color: theme.primaryText }}>
            {storeInfo?.currency === "Dollar"
              ? "$"
              : storeInfo?.currency == "Euro"
              ? "€"
              : "₾"}
            {MIN_PRICE}
          </Typography>
          <Typography variant="body2" style={{ color: theme.primaryText }}>
            {storeInfo?.currency === "Dollar"
              ? "$"
              : storeInfo?.currency == "Euro"
              ? "€"
              : "₾"}
            {MAX_PRICE}
          </Typography>
        </Box>
      </div>
      <Divider sx={{ background: theme.line }} />
      <div style={{ boxSizing: "border-box", padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Discount
            style={{
              fontSize: "24px",
              position: "relative",
              bottom: "2px",
              color: theme.secondaryText,
            }}
          />
          <Typography
            variant="body2"
            style={{ color: theme.secondaryText }}
            sx={{
              marginBottom: "4px",
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: "500",
              letterSpacing: "0.5px",
              color: theme.secondaryText,
            }}
          >
            {activeLanguage.discount}
          </Typography>
        </div>
        <Slider
          getAriaLabel={() => "Minimum Sale"}
          value={sale}
          onChange={handleSaleChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value} %`}
          getAriaValueText={valuetext2}
          min={0}
          max={100}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" style={{ color: theme.primaryText }}>
            {MIN_PERCENT} %
          </Typography>
          <Typography variant="body2" style={{ color: theme.primaryText }}>
            {MAX_PERCENT} %
          </Typography>
        </Box>
      </div>
      <Divider sx={{ background: theme.line }} />
      <div style={{ boxSizing: "border-box", padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <StarIcon
            style={{
              fontSize: "28px",
              position: "relative",
              bottom: "2px",
              color: "#FFA726",
            }}
          />
          <Typography
            variant="body2"
            style={{ color: theme.secondaryText }}
            sx={{
              marginBottom: "4px",
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: "500",
              letterSpacing: "0.5px",
              color: theme.secondaryText,
            }}
          >
            {activeLanguage.rating}
          </Typography>
        </div>
        <Slider
          getAriaLabel={() => "Minimum Rating"}
          value={rating}
          onChange={handleRatingChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value} Star`}
          getAriaValueText={valuetext3}
          min={0}
          max={5}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" style={{ color: theme.primaryText }}>
            {MIN_RATING}
          </Typography>
          <Typography variant="body2" style={{ color: theme.primaryText }}>
            {MAX_RATING}
          </Typography>
        </Box>
      </div>
      <Divider sx={{ background: theme.line }} />
      <FormControl>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            left: "8px",
            marginBottom: "16px",
          }}
        >
          <IoColorFilterOutline
            style={{
              fontSize: "30px",
              position: "relative",
              bottom: "2px",
              color: "blue",
            }}
          />

          <Typography
            variant="body2"
            style={{ color: theme.secondaryText }}
            sx={{
              marginBottom: "4px",
              marginLeft: "4px",
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: "500",
              letterSpacing: "0.5px",
              color: theme.secondaryText,
            }}
          >
            {activeLanguage.color}
          </Typography>
        </div>
        <FormGroup
          sx={{
            marginLeft: "0vw",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            rowGap: "24px",
          }}
        >
          {colors?.map((item: any, index: number) => {
            return (
              <div
                onClick={() => {
                  setColor((prev: string[]) => {
                    const isItemIncluded = prev?.includes(item.name);
                    if (isItemIncluded) {
                      return prev.filter((i) => i !== item.name);
                    } else {
                      return [...prev, item.name];
                    }
                  });
                }}
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <ColorItem
                  style={{
                    background: item.hex,
                  }}
                />
                <span
                  style={{
                    fontWeight: "600",
                    color: color?.includes(item.name)
                      ? theme.primary
                      : theme.primaryText,
                    overflow: "hidden",
                    textAlign: "center",
                    fontSize: isMobile ? "14px" : "16px",
                  }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </FormGroup>
      </FormControl>
      <Divider sx={{ background: theme.line, margin: "16px 0" }} />
      {activeCategory !== "" && (
        <FormControl>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              left: "8px",
              marginBottom: "16px",
            }}
          >
            <IoMdResize
              style={{
                fontSize: "24px",
                position: "relative",
                bottom: "2px",
                color: "yellow",
              }}
            />

            <Typography
              variant="body2"
              style={{ color: theme.secondaryText }}
              sx={{
                marginBottom: "4px",
                marginLeft: "8px",
                fontSize: isMobile ? "14px" : "16px",
                fontWeight: "500",
                letterSpacing: "0.5px",
                color: theme.secondaryText,
              }}
            >
              Size
            </Typography>
          </div>

          <FormGroup
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              flexDirection: "column",
              // justifyItems: "center",
              marginLeft: "24px",
            }}
          >
            {activeCategory === "Shoes"
              ? shoesSizes?.map((item: any, index: number) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={size?.includes(item)} // Determine if the item is selected
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSize((prev: any) => [...prev, item]);
                          } else {
                            setSize((prev: any) =>
                              prev.filter((size: any) => size !== item)
                            );
                          }
                        }}
                        name={item}
                        sx={{ color: theme.secondaryText }}
                      />
                    }
                    label={
                      <span style={{ color: theme.primaryText }}>{item}</span>
                    }
                  />
                ))
              : sizes?.map((item: any, index: number) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={size?.includes(item)} // Determine if the item is selected
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSize((prev: any) => [...prev, item]);
                          } else {
                            setSize((prev: any) =>
                              prev.filter((size: any) => size !== item)
                            );
                          }
                        }}
                        name={item}
                        sx={{ color: theme.secondaryText }}
                      />
                    }
                    label={item}
                  />
                ))}
          </FormGroup>
        </FormControl>
      )}
    </div>
  );
};

export default Filter;

const CategoryItem = styled.div<ThemeProps>`
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  color: ${(props) => props.primarytext};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const ColorItem = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50px;
`;
