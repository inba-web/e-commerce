import { useState } from "react";
import FilterSection from "./FilterSection";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ProductCard from "./ProductCard";

const Products = () => {
  const [sort, setSort] = useState("price_low");

  const handleSortProduct = (e: any) => {
    setSort(e.target.value);
  };

  console.log(sort);
  
  return (
    <div className="-z-10 mt-10">
      <div className="">
        <h1 className="text-3xl text-center font-bold text-gray-700 pb-5 px-9 uppercase space-x-2">
          Women Sarees
        </h1>
      </div>

      <div className="lg:flex">
        <section className="border-r hidden lg:block w-[20%] min-h-screen border-gray-300">
          <FilterSection />
        </section>

        <section className="w-full lg:w-[80%] space-y-5">
          <div className="flex justify-between items-center px-9 h-[40px]">
            <div></div>
            <FormControl>
              <InputLabel id="demo-simple-select-label">Sort</InputLabel>
              <Select
                labelId="sort"
                id="sort"
                value={sort}
                label="Sort"
                onChange={handleSortProduct}
              >
                <MenuItem value="price_low">Price: Low to High</MenuItem>
                <MenuItem value="price_high">Price: High to Low</MenuItem>

              </Select>
            </FormControl>
          </div>

          {/* <Divider /> */}

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-5 px-5 justify-center">
            {[1, 1, 1, 1, 1].map((item,key) => (
              <div key={key} >
                <ProductCard item={item} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Products;
