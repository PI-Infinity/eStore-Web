"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAppContext } from "./app";
import axios from "axios";

const ProductsContext = createContext();

export const useProductsContext = () => useContext(ProductsContext);

export function ProductsWrapper({ children }) {
  // open mobile filter
  const [openFilter, setOpenFilter] = useState(false);
  // total products
  const [totalProducts, setTotalProducts] = useState(0);
  // products list
  const [products, setProducts] = useState([]);
  // load products
  const [loadProducts, setLoadProducts] = useState(true);
  // page using for fetching new products on infinity scrolling
  const [page, setPage] = useState(1);
  // search state
  const [searchInput, setSearchInput] = useState("");
  // sort
  const [sort, setSort] = useState("New");
  // product
  const [product, setProduct] = useState("");
  // price
  const [price, setPrice] = useState([0, 1000]);
  // sale
  const [sale, setSale] = useState([0, 100]);
  // category
  const [activeCategory, setActiveCategory] = useState("");
  // sub category
  const [activeSubCategory, setActiveSubCategory] = useState([]);
  // category
  const [brand, setBrand] = useState([]);
  // rating
  const [rating, setRating] = useState([0, 5]);
  // sex
  const [sex, setSex] = useState([]);
  // size
  const [size, setSize] = useState([]);
  // color
  const [color, setColor] = useState([]);

  // product loading
  const [loadProduct, setLoadProduct] = useState(true);

  // on change value gettings products as default filter
  const [render, setRender] = useState(false);

  // page loading cotext
  const { activeLanguage, backendUrl } = useAppContext();
  // getting products
  useEffect(() => {
    const GetProducts = async () => {
      setLoadProducts(true);
      try {
        const encodedSubcategory = encodeURIComponent(activeSubCategory);

        const response = await axios.get(
          `${backendUrl}/api/v1/products?page=1&limit=${
            window.innerWidth < 768 ? "4" : "6"
          }&search=${searchInput}&category=${activeCategory}&subcategory=${encodedSubcategory}&brand=${brand}&sale=${sale}&price=${price}&rating=${rating}&sex=${sex}&color=${color}&size=${size}&sort=${sort}`
        );
        setTotalProducts(response.data.totalProducts);
        setProducts(response.data.data.products);
        setPage(1);
        setLoadProducts(false);
      } catch (error) {
        console.log(error);
      }
    };

    GetProducts();
  }, [
    render,
    sort,
    searchInput,
    activeCategory,
    activeSubCategory,
    brand,
    sale,
    price,
    rating,
    sex,
    color,
    size,
  ]);

  // adding more products on scrolling
  const [loadMore, setLoadMore] = useState(false);

  const AddProducts = async () => {
    const newPage = page + 1;

    try {
      const encodedSubcategory = encodeURIComponent(activeSubCategory);
      const response = await axios.get(
        `${backendUrl}/api/v1/products?page=${newPage}&limit=${
          window.innerWidth < 768 ? "4" : "6"
        }&search=${searchInput}&category=${activeCategory}&subcategory=${encodedSubcategory}&brand=${brand}&sale=${sale}&price=${price}&rating=${rating}&sex=${sex}&color=${color}&size=${size}&sort=${sort}`
      );
      setTotalProducts(response.data.totalProducts);
      console.log(response.data.data.products.length);
      console.log(page);
      setProducts((prevProducts) => {
        // Create a new set with existing product IDs for quick lookup
        const existingIds = new Set(prevProducts.map((product) => product._id));

        // Filter out duplicates from the newly fetched products based on product ID
        const filteredNewProducts = response.data.data.products.filter(
          (p) => !existingIds.has(p._id)
        );

        console.log("data: " + response.data.data.products.length);
        console.log("filtered: " + filteredNewProducts?.length);

        if (filteredNewProducts.length > 0) {
          // Return the concatenation of previous products and filtered new products
          setLoadMore(false);
          return [...prevProducts, ...filteredNewProducts];
        } else {
          setLoadMore(false);
          return [...prevProducts];
        }
      });
      setPage(newPage);
      setLoadProducts(false);
      // Assuming each product in productsList has a unique _id property
    } catch (error) {
      console.log(error);
    }
  };

  // this useffect runs addproducts function when scroll is bottom
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Ensure containerRef.current is not null before accessing its properties
      if (containerRef.current) {
        console.log(totalProducts);
        const { bottom } = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if the bottom of the component is near the bottom of the window viewport
        if (bottom <= windowHeight + 100) {
          console.log("run");
          // 100px threshold, adjust as needed
          if (totalProducts > products.length) {
            console.log("this");
            setLoadMore(true);
            AddProducts();
          }
        }
      }
    };

    // Register the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, [products.length, totalProducts]);

  const brands = ["Nike", "Adidas", "Reebok", "New Balance", "Puma"];

  const categories = [
    {
      item: "Shoes",
      label: activeLanguage.shoes,
      subCategories: [
        { item: "Jordan", label: activeLanguage.jordan },
        { item: "Lifestyle", label: activeLanguage.lifestyle },
        { item: "Running", label: activeLanguage.running },
        { item: "Basketball", label: activeLanguage.basketball },
        { item: "Traning & Gym", label: activeLanguage.trainingGym },
        { item: "Walking", label: activeLanguage.walking },
        { item: "Football", label: activeLanguage.football },
        { item: "Tennis", label: activeLanguage.tennis },
        { item: "Skateboarding", label: activeLanguage.skateboarding },
      ],
    },
    {
      item: "Clotches",
      label: activeLanguage.clotches,
      subCategories: [
        { item: "Hoodies & Pullovers", label: activeLanguage.hoodiesPullovers },
        { item: "Pants & Tights", label: activeLanguage.pantsTights },
        { item: "Jackets & Vests", label: activeLanguage.jacketsVests },
        { item: "Tops & T-Shirts", label: activeLanguage.topsTShirts },
        { item: "Shorts", label: activeLanguage.shorts },
        { item: "Underwear", label: activeLanguage.underwear },
        { item: "Socks", label: activeLanguage.socks },
        { item: "Swimwear", label: activeLanguage.swimwear },
        {
          item: "Sets",
          label: activeLanguage.sets,
        },
        {
          item: "Skirts & Dresses",
          label: activeLanguage.skirtsdresses,
        },
      ],
    },
    {
      item: "Accessories & Equipment",
      label: activeLanguage.accessoriesAndEquipment,
      subCategories: [
        { item: "Bags & Backpacks", label: activeLanguage.bagsBackpacks },
        {
          item: "Hats, Visors, & Headbands",
          label: activeLanguage.hatsVisorsHeadbands,
        },
        { item: "Sunglasses", label: activeLanguage.sunglasses },
        { item: "Balls", label: activeLanguage.balls },
        { item: "Belts", label: activeLanguage.belts },
        { item: "Yoga Mats", label: activeLanguage.yogaMats },
        {
          item: "Water Bottles & Hydration",
          label: activeLanguage.waterBottlesHydration,
        },
        { item: "Gloves & Mitts", label: activeLanguage.glovesMitts },
        {
          item: "Home Workout Gear",
          label: activeLanguage.homeWorkoutGear,
        },
        {
          item: "Pads, Guards, Protection",
          label: activeLanguage.padsGuardsProtection,
        },
      ],
    },
  ];

  const shoesSizes = [
    "36",
    "36.5",
    "37",
    "37.5",
    "38",
    "38.5",
    "39",
    "39.5",
    "40",
    "40.5",
    "41",
    "41.5",
    "42",
    "42.5",
    "43",
    "43.5",
    "44",
    "44.5",
    "45",
    "45.5",
    "46",
    "46.5",
    "47",
    "47.5",
    "48",
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

  const colors = [
    { label: activeLanguage.black, name: "Black", hex: "#222" },
    { label: activeLanguage.white, name: "White", hex: "#FFFFFF" },
    { label: activeLanguage.red, name: "Red", hex: "#FF0000" },
    { label: activeLanguage.green, name: "Green", hex: "#008000" },
    { label: activeLanguage.blue, name: "Blue", hex: "#0000FF" },
    { label: activeLanguage.yellow, name: "Yellow", hex: "#FFFF00" },
    { label: activeLanguage.purple, name: "Purple", hex: "#800080" },
    { label: activeLanguage.cyan, name: "Cyan", hex: "#00FFFF" },
    { label: activeLanguage.magenta, name: "Magenta", hex: "#FF00FF" },
    { label: activeLanguage.lime, name: "Lime", hex: "#00FF00" },
    { label: activeLanguage.pink, name: "Pink", hex: "#FFC0CB" },
    { label: activeLanguage.lavender, name: "Lavender", hex: "#E6E6FA" },
    { label: activeLanguage.brown, name: "Brown", hex: "#A52A2A" },
    { label: activeLanguage.orange, name: "Orange", hex: "#FFA500" },
    { label: activeLanguage.gray, name: "Gray", hex: "#808080" },
    { label: activeLanguage.other, name: "Other", hex: "#121453" },
  ];

  const genders = [
    { value: "Men", label: activeLanguage.men },
    { value: "Women", label: activeLanguage.women },
    { value: "Unisex", label: activeLanguage.unisex },
    { value: "Kids", label: activeLanguage.kids },
  ];

  return (
    <ProductsContext.Provider
      value={{
        openFilter,
        setOpenFilter,
        totalProducts,
        setTotalProducts,
        searchInput,
        setSearchInput,
        page,
        setPage,
        sort,
        setSort,
        products,
        setProducts,
        product,
        setProduct,
        price,
        setPrice,
        sale,
        setSale,
        categories,
        activeCategory,
        brand,
        setBrand,
        setActiveCategory,
        activeSubCategory,
        setActiveSubCategory,
        rating,
        setRating,
        sex,
        setSex,
        size,
        setSize,
        color,
        setColor,
        sizes,
        shoesSizes,
        colors,
        genders,
        containerRef,
        loadMore,
        setLoadMore,
        loadProduct,
        setLoadProduct,
        setRender,
        loadProducts,
        setLoadProducts,
        brands,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}
