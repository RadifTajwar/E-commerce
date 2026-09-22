"use client";

import { Button } from "@/components/ui/button";
import { PRICE_FILTER } from "@/config/constants";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/** Price facet. The committed range lives in the query string. */
export default function RangeBar({ minPrice, maxPrice }) {
  const router = useRouter();
  const [range, setRange] = useState([Number(minPrice), Number(maxPrice)]);

  // The URL is the source of truth: adopt it whenever it changes.
  useEffect(() => {
    setRange([Number(minPrice), Number(maxPrice)]);
  }, [minPrice, maxPrice]);

  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) return;

    if (activeThumb === 0) {
      setRange([Math.min(newValue[0], range[1] - PRICE_FILTER.minDistance), range[1]]);
    } else {
      setRange([range[0], Math.max(newValue[1], range[0] + PRICE_FILTER.minDistance)]);
    }
  };

  const handleFilterClick = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("min_price", range[0]);
    params.set("max_price", range[1]);

    router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Box sx={{ width: "full" }}>
      <p className="text-md text-black font-medium">FILTER BY PRICE</p>
      <Slider
        getAriaLabel={() => "Minimum distance"}
        value={range}
        min={PRICE_FILTER.min}
        max={PRICE_FILTER.max}
        step={PRICE_FILTER.step}
        onChange={handleChange}
        valueLabelDisplay="auto"
        disableSwap
        className="mt-5"
        sx={{
          color: "black", // Change track & thumb color
          "& .MuiSlider-thumb": {
            width: 5, // Adjust width
            height: 15, // Make it taller (long bar)
            borderRadius: 0, // Reduce border-radius for a bar shape
            backgroundColor: "black", // Change thumb color
            "&:hover, &.Mui-focusVisible": {
              boxShadow: "0px 0px 0px 8px rgba(0, 0, 0, 0.16)", // Custom focus effect
            },
          },
          "& .MuiSlider-track": {
            height: 2, // Adjust height
            backgroundColor: "black", // Active track color
          },
          "& .MuiSlider-rail": {
            height: 2, // Adjust height
            backgroundColor: "black", // Inactive track color
          },
        }}
      />

      <Typography variant="body1" sx={{ mt: 2 }} className="text-sm font-light text-gray-600">
        Price:{" "}
        <span className="text-md font-medium text-black">
          ৳ {range[0]} - ৳ {range[1]}
        </span>
      </Typography>

      <div className="button w-full my-3">
        <Button onClick={handleFilterClick} variant="secondary" className="w-full rounded-none text-xs text-normal">
          FILTER
        </Button>
      </div>
    </Box>
  );
}
