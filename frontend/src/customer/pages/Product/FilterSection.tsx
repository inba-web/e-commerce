import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Divider from "@mui/material/Divider";

const colors = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Pink", "Gold"];
const sizes = ["S", "M", "L", "XL", "XXL"];
const priceRanges = [
  { label: "Under ₹499", min: 0, max: 499 },
  { label: "₹500 - ₹999", min: 500, max: 999 },
  { label: "₹1000 - ₹1999", min: 1000, max: 1999 },
  { label: "₹2000 - ₹4999", min: 2000, max: 4999 },
  { label: "₹5000 & Above", min: 5000, max: 999999 },
];
const discountRanges = [
  { label: "10% and Above", value: 10 },
  { label: "20% and Above", value: 20 },
  { label: "30% and Above", value: 30 },
  { label: "50% and Above", value: 50 },
];

interface FilterSectionProps {
  color: string;
  setColor: (color: string) => void;
  size: string;
  setSize: (size: string) => void;
  priceRange: string;
  setPriceRange: (range: string) => void;
  discount: number;
  setDiscount: (discount: number) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  color,
  setColor,
  size,
  setSize,
  priceRange,
  setPriceRange,
  discount,
  setDiscount,
}) => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.checked ? e.target.value : "");
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSize(e.target.checked ? e.target.value : "");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange(e.target.value);
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscount(Number(e.target.value));
  };

  return (
    <Box className="p-5 space-y-6">
      <Typography variant="h6" className="font-bold text-gray-700">
        Filters
      </Typography>
      <Divider />

      {/* Colors */}
      <FormControl component="fieldset">
        <FormLabel component="legend" className="font-bold text-sm text-gray-600 mb-2">
          COLORS
        </FormLabel>
        <FormGroup>
          {colors.map((c) => (
            <FormControlLabel
              key={c}
              control={
                <Checkbox
                  checked={color === c}
                  onChange={handleColorChange}
                  value={c}
                  size="small"
                  sx={{ color: "#00927c", "&.Mui-checked": { color: "#00927c" } }}
                />
              }
              label={<span className="text-sm text-gray-700">{c}</span>}
            />
          ))}
        </FormGroup>
      </FormControl>

      <Divider />

      {/* Sizes */}
      <FormControl component="fieldset">
        <FormLabel component="legend" className="font-bold text-sm text-gray-600 mb-2">
          SIZES
        </FormLabel>
        <FormGroup>
          {sizes.map((s) => (
            <FormControlLabel
              key={s}
              control={
                <Checkbox
                  checked={size === s}
                  onChange={handleSizeChange}
                  value={s}
                  size="small"
                  sx={{ color: "#00927c", "&.Mui-checked": { color: "#00927c" } }}
                />
              }
              label={<span className="text-sm text-gray-700">{s}</span>}
            />
          ))}
        </FormGroup>
      </FormControl>

      <Divider />

      {/* Price Range */}
      <FormControl component="fieldset">
        <FormLabel component="legend" className="font-bold text-sm text-gray-600 mb-2">
          PRICE RANGES
        </FormLabel>
        <RadioGroup value={priceRange} onChange={handlePriceChange}>
          <FormControlLabel
            value=""
            control={<Radio size="small" sx={{ color: "#00927c", "&.Mui-checked": { color: "#00927c" } }} />}
            label={<span className="text-sm text-gray-700">Any Price</span>}
          />
          {priceRanges.map((r, index) => (
            <FormControlLabel
              key={index}
              value={`${r.min}-${r.max}`}
              control={<Radio size="small" sx={{ color: "#00927c", "&.Mui-checked": { color: "#00927c" } }} />}
              label={<span className="text-sm text-gray-700">{r.label}</span>}
            />
          ))}
        </RadioGroup>
      </FormControl>

      <Divider />

      {/* Discounts */}
      <FormControl component="fieldset">
        <FormLabel component="legend" className="font-bold text-sm text-gray-600 mb-2">
          DISCOUNT OFFERS
        </FormLabel>
        <RadioGroup value={discount.toString()} onChange={handleDiscountChange}>
          <FormControlLabel
            value="0"
            control={<Radio size="small" sx={{ color: "#00927c", "&.Mui-checked": { color: "#00927c" } }} />}
            label={<span className="text-sm text-gray-700">Any Discount</span>}
          />
          {discountRanges.map((d, index) => (
            <FormControlLabel
              key={index}
              value={d.value.toString()}
              control={<Radio size="small" sx={{ color: "#00927c", "&.Mui-checked": { color: "#00927c" } }} />}
              label={<span className="text-sm text-gray-700">{d.label}</span>}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default FilterSection;