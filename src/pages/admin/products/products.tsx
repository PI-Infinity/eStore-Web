import { AddSharp, DeleteForever, EditSharp } from "@mui/icons-material";
import { Switch } from "@mui/material";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaCopy, FaImage } from "react-icons/fa";
import { BarLoader } from "react-spinners";
import styled from "styled-components";
import ConfirmPopup from "../../../components/confirmPopup";
import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";
import AddProduct from "./addProduct";
import Search from "./search";

import { styled as MUIStyled } from "@mui/material/styles";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { MdArrowDropDown } from "react-icons/md";
import { v4 } from "uuid";
import { storage } from "../../../firebase";
import EditProduct from "./editProduct";
import { useLocation } from "react-router-dom";

interface ItemProps {
  disabled: string;
}

const Products = () => {
  // theme
  const { theme } = useTheme();
  // products
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  // filters
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [price, setPrice] = useState("");
  const [sale, setSale] = useState("");
  const [rating, setRating] = useState("");
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [sex, setSex] = useState("");

  /**
   * sorting
   */
  const [sort, setSort] = useState("");

  // load page
  const [loadPage, setLoadPage] = useState(true);

  // rerender products list
  const [rerenderProducts, setRerenderProducts] = useState(false);

  const { backendUrl, activeLanguage, setAlert, isMobile } = useAppContext();

  // getting products
  useEffect(() => {
    const GetProducts = async () => {
      try {
        const encodedSubcategory = encodeURIComponent(subCategory);
        const response = await axios.get(
          `${backendUrl}/api/v1/products?page=${1}&limit=12&search=${search}&category=${category}&subcategory=${encodedSubcategory}&sale=${sale}&price=${price}&rating=${rating}&sex=${sex}&color=${color}&admin=true&size=${size}&sort=${sort}`
        );
        setProducts(response.data.data.products);
        setTotalProducts(response.data.totalProducts);
        setLoadPage(false);
        setPage(1);
      } catch (error) {
        console.log(error);
      }
    };

    GetProducts();
  }, [search, rerenderProducts, sort]);

  const AddProducts = async () => {
    const newPage = page + 1;

    try {
      const encodedSubcategory = encodeURIComponent(subCategory);
      const response = await axios.get(
        `${backendUrl}/api/v1/products?page=${newPage}&limit=12&search=${search}&category=${category}&subcategory=${encodedSubcategory}&sale=${sale}&price=${price}&rating=${rating}&sex=${sex}&color=${color}&size=${size}&admin=${true}`
      );
      setProducts((prevProducts: any) => {
        const existingIds = new Set(
          prevProducts.map((product: any) => product._id)
        );
        const filteredNewProducts = response.data.data.products.filter(
          (product: any) => !existingIds.has(product._id)
        );

        if (filteredNewProducts.length > 0) {
          return [...prevProducts, ...filteredNewProducts];
        } else {
          return prevProducts;
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
          // 65px threshold, adjust as needed
          if (totalProducts > products.length) {
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

  /**
   * Add product
   */
  const [openAdd, setOpenAdd] = useState(false);

  /**
   * Edit product
   */
  const [openEdit, setOpenEdit] = useState(null);

  /**
   * delete product
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
  const DeleteProduct = async (itemId: any, folderId: any) => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Delete Product is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    try {
      let fileRef = ref(storage, `products/${folderId}/`);
      setProducts((prev) => prev.filter((i: any) => i._id !== itemId));
      await axios.delete(backendUrl + "/api/v1/products/" + itemId);
      listAll(fileRef)
        .then((res) => {
          res.items.forEach((itemRef) => {
            deleteObject(itemRef).then(() => {
              console.log("item deleted");
            });
          });
        })
        .catch((error) => {
          console.log("error : " + error);
        });
      setOpenConfirm({ active: false, item: null });
      setAlert({
        active: true,
        type: "success",
        text: activeLanguage.productDeletedSuccessfully,
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
      <AddProduct
        open={openAdd}
        close={() => setOpenAdd(false)}
        rerenderProducts={setRerenderProducts}
      />
      {openEdit && (
        <EditProduct
          product={openEdit}
          close={() => setOpenEdit(null)}
          rerenderProducts={setRerenderProducts}
        />
      )}
      <ConfirmPopup
        open={openConfirm.active}
        close={() => setOpenConfirm({ active: false, item: null })}
        agree={() =>
          DeleteProduct(
            openConfirm.item?._id,
            openConfirm.item?.gallery[0]?.folderId
          )
        }
        text="Are you sure to want to delete this item?"
      />
      <div
        style={{
          width: isMobile ? "100%" : "40vw",
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "8px" : "24px",
        }}
      >
        <div style={{ width: "90%" }}>
          <Search search={search} setSearch={setSearch} />
        </div>
        <div
          onClick={() => setOpenAdd(true)}
          className="icon"
          style={{
            background: theme.primary,
            padding: "2px",
            borderRadius: "65px",
            cursor: "pointer",
            marginRight: "16px",
            marginTop: "8px",
            width: "35px",
            height: "35px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AddSharp sx={{ fontSize: "28px", color: theme.lightBackground }} />
        </div>
      </div>
      <div
        style={{
          height: "100%",
          width: "100%",
          border: `1px solid ${theme.line}`,
          padding: isMobile ? "0px" : "0 24px 24px 24px",
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
              width: "60px",
              textAlign: "center",
              overflow: "hidden",
            }}
          >
            {activeLanguage.publish}
          </div>
          <Divider style={{ background: theme.lineDark }} />
          <div
            style={{
              width: "25px",
              textAlign: "center",
            }}
          >
            N
          </div>
          <Divider style={{ background: theme.lineDark }} />
          <div style={{ width: "45px" }}>{activeLanguage.cover}</div>
          <Divider style={{ background: theme.lineDark }} />
          <div
            style={{
              width: "150px",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              cursor: "pointer",
              overflow: "hidden",
            }}
            className="icon"
            onClick={() => setSort(sort !== "Title" ? "Title" : "")}
          >
            <div>
              <MdArrowDropDown
                size={24}
                color={sort === "Title" ? theme.primary : "inherit"}
              />
            </div>
            {activeLanguage.title}{" "}
          </div>
          <Divider style={{ background: theme.lineDark }} />
          <div
            style={{
              width: "65px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            className="icon"
            onClick={() => setSort(sort !== "Price" ? "Price" : "")}
          >
            <MdArrowDropDown
              size={24}
              color={sort === "Price" ? theme.primary : "inherit"}
            />
            {activeLanguage.price}
          </div>
          <Divider style={{ background: theme.lineDark }} />
          <div
            style={{
              width: "55px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              overflow: "hidden",
            }}
            className="icon"
            onClick={() => setSort(sort !== "Sale" ? "Sale" : "")}
          >
            <div>
              <MdArrowDropDown
                size={24}
                color={sort === "Sale" ? theme.primary : "inherit"}
              />
            </div>
            {activeLanguage.sale}
          </div>
          <Divider style={{ background: theme.lineDark }} />
          <div
            style={{
              width: "80px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            className="icon"
            onClick={() => setSort(sort !== "inStock" ? "inStock" : "")}
          >
            <div>
              <MdArrowDropDown
                size={24}
                color={sort === "inStock" ? theme.primary : "inherit"}
              />
            </div>
            {activeLanguage.inStock}
          </div>
          <Divider style={{ background: theme.lineDark }} />
          <div
            style={{
              width: "65px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              overflow: "hidden",
            }}
            className="icon"
            onClick={() => setSort(sort !== "Brand" ? "Brand" : "")}
          >
            <div>
              <MdArrowDropDown
                size={24}
                color={sort === "Brand" ? theme.primary : "inherit"}
              />
            </div>
            {activeLanguage.brand}
          </div>
          <Divider style={{ background: theme.lineDark }} />
          <div
            style={{
              width: "50px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              overflow: "hidden",
            }}
            className="icon"
            onClick={() => setSort(sort !== "Sex" ? "Sex" : "")}
          >
            <div>
              <MdArrowDropDown
                size={24}
                color={sort === "Sex" ? theme.primary : "inherit"}
              />
            </div>
            {activeLanguage.sex}
          </div>
          <Divider style={{ background: theme.lineDark }} />
          <div
            style={{
              width: "100px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              overflow: "hidden",
            }}
            className="icon"
            onClick={() => setSort(sort !== "Category" ? "Category" : "")}
          >
            <div>
              <MdArrowDropDown
                size={24}
                color={sort === "Category" ? theme.primary : "inherit"}
              />
            </div>
            {activeLanguage.categories}
          </div>
          <Divider style={{ background: theme.lineDark }} />
          <div
            style={{
              width: "80px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              overflow: "hidden",
            }}
            className="icon"
            onClick={() => setSort(sort !== "Popular" ? "Popular" : "")}
          >
            <div>
              <MdArrowDropDown
                size={24}
                color={sort === "Popular" ? theme.primary : "inherit"}
              />
            </div>
            {activeLanguage.orders}
          </div>
          <Divider style={{ background: theme.lineDark }} />
          <div
            style={{
              width: "65px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              overflow: "hidden",
            }}
            className="icon"
            onClick={() => setSort(sort !== "Save" ? "Save" : "")}
          >
            <div>
              <MdArrowDropDown
                size={24}
                color={sort === "Save" ? theme.primary : "inherit"}
              />
            </div>
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
              width: isMobile ? "1500px" : "1700px",
              overflowY: "auto",
              height: "70vh",
              overflowX: "hidden",
              paddingBottom: "40px",
            }}
          >
            {products.length > 0 ? (
              products?.map((item: any, index: number) => {
                return (
                  <ProductItem
                    key={index}
                    index={index}
                    item={item}
                    setOpenConfirm={setOpenConfirm}
                    setOpenEdit={setOpenEdit}
                    setRerenderProducts={setRerenderProducts}
                    totalProducts={totalProducts}
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
                Products not found!
              </div>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default Products;

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  min-height: 95vh;
  height: 90vh;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    min-height: 80vh;
    height: 80vh;
    gap: 8px;
  }

  .icon {
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const Item = styled.div<ItemProps>`
  width: 100%;
  height: 55px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  position: relative;
  margin-bottom: 8px;
  font-size: 14px;
  box-sizing: border-box;
  width: 1700px;

  @media (max-width: 768px) {
    width: 1500px;
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
 * product item
 */

const ProductItem = ({
  index,
  item,
  setOpenConfirm,
  setOpenEdit,
  setRerenderProducts,
  totalProducts,
}: any) => {
  // product
  const [product, setProduct] = useState(item);

  useEffect(() => {
    setProduct(item);
  }, [item]);

  const { theme } = useTheme();
  let cover = product?.gallery.find((i: any) => i.cover);

  // publish state
  const [publish, setPublish] = useState(
    product?.status === "publish" ? true : false
  );

  // publish switch styled
  const GreenSwitch = MUIStyled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "green",
      "&:hover": {
        opacity: "0.8",
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "green",
    },
  }));

  const label = { inputProps: { "aria-label": "Color switch demo" } };

  // backend url
  const { storeInfo, backendUrl, activeLanguage, setAlert } = useAppContext();

  // update status
  const updateProductStatus = async () => {
    try {
      setPublish((prev) => !prev);
      setProduct({
        ...product,
        status: product.status === "publish" ? "unPublish" : "publish",
      });
      await axios.patch(backendUrl + "/api/v1/products/" + product._id, {
        status: product.status === "publish" ? "unPublish" : "publish",
      });
    } catch (error: any) {
      console.log(error.response.data.message);
    }
  };

  /**
   * Dublicate product
   */

  // Ensure GalleryItem is defined outside the function
  interface GalleryItem {
    url: string;
    type: string;
    folderId: string;
    cover?: boolean;
    width: number;
    height: number;
    itemId: string;
  }
  const { setOpenBackDrop } = useAppContext();

  const duplicateFolder = async (product: any) => {
    let folderId = product?.gallery[0]?.folderId; // Ensure this exists
    const sourceFolder = `products/${folderId}/`;
    let newFolderId = v4();
    const destinationFolder = `products/${newFolderId}/`;

    const sourceReference = ref(storage, sourceFolder);

    let listResult;
    try {
      listResult = await listAll(sourceReference);
    } catch (error) {
      console.error("Error listing source folder:", error);
      throw error;
    }
    const newGallery: GalleryItem[] = [];

    const copyPromises = listResult.items.map(async (itemRef) => {
      const itemPath = itemRef.fullPath;
      const newPathName = v4();
      const destinationPath = `${destinationFolder}${newPathName}`;

      try {
        const url = await getDownloadURL(ref(storage, itemPath));
        const response = await fetch(url);
        const blob = await response.blob();

        await uploadBytesResumable(ref(storage, destinationPath), blob);

        // Attempt to find the corresponding gallery item in the product
        let dbObj = product.gallery.find((i: any) => i.itemId === itemRef.name);

        if (dbObj) {
          // Create a new gallery item with the new URL and copied metadata from dbObj
          const newObj: GalleryItem = {
            url: url, // New URL from the duplicated file
            type: dbObj.type, // Copy type from dbObj
            width: dbObj.width, // Copy width from dbObj
            height: dbObj.height, // Copy height from dbObj
            cover: dbObj.cover, // Copy cover from dbObj, if it exists
            folderId: newFolderId, // New folder ID
            itemId: newPathName,
          };
          newGallery.push(newObj);
          return newObj;
        } else {
          console.error(`No matching dbObj found for ${itemPath}`);
        }
      } catch (error) {
        console.error(`Error duplicating file from ${itemPath}:`, error);
      }
    });

    try {
      await Promise.all(copyPromises);
      console.log("Folder duplicated successfully");
      // Return the newGallery array containing the new gallery items
      return newGallery;
    } catch (error) {
      console.error("Error during folder duplication:", error);
      throw error;
    }
  };
  const location = useLocation();
  const Duplicate = async (productItem: any) => {
    if (location.search.includes("overview")) {
      return setAlert({
        active: true,
        text: "Dublicate Product is impossible, because you are in overview mode",
        type: "warning",
      });
    }
    setOpenBackDrop({ active: true, text: "Dublicating..." });
    const { _id, ...restOfProduct } = productItem; // Exclude _id from the rest of the product properties

    const newGallery = await duplicateFolder(productItem); // Assume this function populates newGallery correctly

    try {
      await axios.post(`${backendUrl}/api/v1/products`, {
        ...restOfProduct, // Spread the properties excluding _id
        gallery: newGallery, // Use the new gallery
        title: productItem.title,
        saves: [],
        ratings: [],
        reviews: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setOpenBackDrop({ active: false, text: "" });
      setRerenderProducts((prev: boolean) => !prev);
    } catch (error: any) {
      console.error(
        "Error duplicating product:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <Item
      key={index}
      disabled={theme.line}
      style={{
        opacity: product?.status === "publish" ? 1 : 0.6,
        color: theme.primaryText,
        border: `1px solid ${theme.line}`,
      }}
    >
      <div
        style={{
          width: "60px",
          textAlign: "center",
        }}
      >
        <GreenSwitch
          {...label}
          checked={publish}
          onChange={updateProductStatus}
        />
      </div>
      <Divider style={{ background: theme.lineDark }} />
      <div
        style={{
          width: "25px",
          textAlign: "center",
        }}
      >
        N{totalProducts - index}
      </div>
      <Divider style={{ background: theme.lineDark }} />
      <div
        style={{
          width: "45px",
          height: "45px",
          borderRadius: "90px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="icon"
      >
        {cover ? (
          <>
            {cover.type.startsWith("video") ? (
              <video
                key={cover?.url}
                controls={false}
                autoPlay
                loop
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              >
                <source src={cover?.url} type={cover?.type} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={cover?.url}
                width={45}
                height={45}
                alt="nike"
                style={{ objectFit: "cover", border: "none" }}
              />
            )}
          </>
        ) : (
          <FaImage size={35} color={theme.secondaryText} />
        )}
      </div>
      <Divider style={{ background: theme.lineDark }} />
      <div style={{ whiteSpace: "nowrap", overflow: "hidden", width: "150px" }}>
        {product?.title}
      </div>
      <Divider style={{ background: theme.lineDark }} />
      <div style={{ whiteSpace: "nowrap", overflow: "hidden", width: "65px" }}>
        {storeInfo?.currency === "Dollar"
          ? "$"
          : storeInfo?.currency == "Euro"
          ? "€"
          : "₾"}
        {product?.price}
      </div>
      <Divider style={{ background: theme.lineDark }} />
      <div style={{ whiteSpace: "nowrap", overflow: "hidden", width: "55px" }}>
        {product?.sale} %
      </div>
      <Divider style={{ background: theme.lineDark }} />
      <div style={{ whiteSpace: "nowrap", overflow: "hidden", width: "80px" }}>
        {product?.inStock.reduce(
          (total: any, item: any) => total + parseInt(item.qnt, 10),
          0
        )}{" "}
        {activeLanguage.pcs}
      </div>
      <Divider style={{ background: theme.lineDark }} />
      <div style={{ whiteSpace: "nowrap", overflow: "hidden", width: "65px" }}>
        {product?.brand}
      </div>
      <Divider style={{ background: theme.lineDark }} />
      <div style={{ whiteSpace: "nowrap", overflow: "hidden", width: "50px" }}>
        {product?.sex}
      </div>
      <Divider style={{ background: theme.lineDark }} />
      <div style={{ whiteSpace: "nowrap", overflow: "hidden", width: "100px" }}>
        {product?.category}
      </div>
      <Divider style={{ background: theme.lineDark }} />
      <div style={{ whiteSpace: "nowrap", overflow: "hidden", width: "80px" }}>
        {product?.popularity}
      </div>
      <Divider style={{ background: theme.lineDark }} />
      <div style={{ whiteSpace: "nowrap", overflow: "hidden", width: "65px" }}>
        {product?.saves?.length}
      </div>
      <Divider style={{ background: theme.lineDark }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <FaCopy
          className="icon"
          color={theme.secondaryText}
          size={20}
          onClick={() => Duplicate(product)}
        />
        <EditSharp
          className="icon"
          sx={{ color: "orange" }}
          onClick={() => setOpenEdit(product)}
        />
        <DeleteForever
          className="icon"
          sx={{ color: theme.primary }}
          onClick={() => setOpenConfirm({ active: true, item: product })}
        />
      </div>
    </Item>
  );
};
