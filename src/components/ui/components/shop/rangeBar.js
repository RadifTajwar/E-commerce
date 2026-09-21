"use client";

import { Button } from "@/components/ui/button";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useRouter } from "next/navigation";
import * as React from 'react';

const minDistance = 100;

export default function RangeBar({productsFetched,setProductsFetched,minPrice,maxPrice}) {
  const [value1, setValue1] = React.useState([Number(minPrice), Number(maxPrice)]);
  const router = useRouter();

  const handleChange1 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
    } else {
      setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
    }
  };

  const handleFilterClick = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("min_price", value1[0]);
    params.set("max_price", value1[1]);

    router.push(`${window.location.pathname}?${params.toString()}`, { shallow: true, scroll: false });
    setTimeout(() => {
      setProductsFetched(!productsFetched);
    }, 500);
  };

  return (
    <Box sx={{ width: 'full' }}>
      <p className='text-md text-black font-medium'>FILTER BY PRICE</p>
      <Slider
        getAriaLabel={() => "Minimum distance"}
        value={value1}
        min={0}
        max={18000}
        step={60}
        onChange={handleChange1}
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
        Price: <span className="text-md font-medium text-black">৳ {value1[0]} - ৳ {value1[1]}</span>
      </Typography>

      <div className="button w-full my-3">
        <Button onClick={handleFilterClick} variant="secondary" className="w-full rounded-none text-xs text-normal">
          FILTER
        </Button>
      </div>
    </Box>
  );
}
