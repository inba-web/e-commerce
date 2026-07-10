import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import FilterSection from "./FilterSection";
import ProductCard from "./ProductCard";
import { useProducts } from "../../../context/ProductContext";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";

const Products = () => {
  const location = useLocation();
  const { products, loading, totalPages, fetchProducts, searchProducts } = useProducts();

  // Search parameters
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get("category") || "";
  const searchParam = queryParams.get("q") || "";

  // Filter States
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [discount, setDiscount] = useState(0);
  const [sort, setSort] = useState("price_low");
  const [page, setPage] = useState(1);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // When URL search changes or query updates, reset paging
  useEffect(() => {
    setPage(1);
    // If there is an explicit search term, let searchProducts handle it
    if (searchParam) {
      searchProducts(searchParam);
    }
  }, [searchParam]);

  // General Filter query effect
  useEffect(() => {
    if (searchParam) return; // skip normal listing if searching

    let minPrice = undefined;
    let maxPrice = undefined;

    if (priceRange) {
      const parts = priceRange.split("-");
      minPrice = parseInt(parts[0]);
      maxPrice = parseInt(parts[1]);
    }

    fetchProducts({
      category: categoryParam,
      color: color || undefined,
      size: size || undefined,
      minPrice,
      maxPrice,
      minDiscount: discount > 0 ? discount : undefined,
      sort,
      pageNumber: page - 1, // backend is 0-indexed
    });
  }, [categoryParam, searchParam, color, size, priceRange, discount, sort, page]);

  const handleSortChange = (e: any) => {
    setSort(e.target.value);
  };

  const handlePageChange = (_e: any, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-6">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-black text-gray-800 uppercase tracking-wide">
          {searchParam
            ? `Search Results for "${searchParam}"`
            : categoryParam
            ? `${categoryParam.replace("-", " ")} Catalog`
            : "All Products Collection"}
        </h1>
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <section className="w-[20%] hidden md:block border border-gray-200 rounded-xl bg-white shadow-sm h-fit">
          <FilterSection
            color={color}
            setColor={setColor}
            size={size}
            setSize={setSize}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            discount={discount}
            setDiscount={setDiscount}
          />
        </section>

        {/* Product Grid & Paging */}
        <section className="w-full md:w-[80%] space-y-6">
          <div className="flex justify-between items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-150 flex-wrap sm:flex-nowrap">
            <span className="text-sm font-semibold text-gray-500">
              {products.length} products found
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Mobile Filter Button */}
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => setFilterDrawerOpen(true)}
                className="md:hidden capitalize font-bold text-gray-700 border-gray-300 hover:border-teal-600"
                sx={{
                  color: "text.primary",
                  borderColor: "divider",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  height: "40px",
                }}
              >
                Filters
              </Button>

              <FormControl size="small" className="w-36 sm:w-48">
                <InputLabel id="sort-select-label">Sort By</InputLabel>
                <Select
                  labelId="sort-select-label"
                  id="sort-select"
                  value={sort}
                  label="Sort By"
                  onChange={handleSortChange}
                >
                  <MenuItem value="price_low">Price: Low to High</MenuItem>
                  <MenuItem value="price_high">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <CircularProgress size={50} sx={{ color: "#00927c" }} />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-gray-500 font-semibold">
                No products match your description or filters.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
                {products.map((product) => (
                  <ProductCard key={product._id} item={product} />
                ))}
              </div>

              {/* Paging */}
              {totalPages > 1 && (
                <div className="flex justify-center pt-8 pb-12">
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    sx={{
                      "& .MuiPaginationItem-root.Mui-selected": {
                        bgcolor: "#00927c",
                        color: "white",
                        "&:hover": {
                          bgcolor: "#007d6a",
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 290,
            p: 3,
          },
        }}
      >
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-150">
          <span className="font-extrabold text-lg text-gray-800 uppercase tracking-wide">
            Filters
          </span>
          <IconButton onClick={() => setFilterDrawerOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </div>
        <FilterSection
          color={color}
          setColor={setColor}
          size={size}
          setSize={setSize}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          discount={discount}
          setDiscount={setDiscount}
        />
      </Drawer>
    </div>
  );
};

export default Products;
