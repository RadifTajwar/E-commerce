"use client";

import { Button } from "@/components/ui/button";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useRouter } from "next/navigation";
import * as React from 'react';

const minDistance = 100;

export default function RangeBar() {
  const [value1, setValue1] = React.useState([390, 18000]);
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

    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <Box sx={{ width: 'full' }}>
      <p className='text-md text-black font-medium'>FILTER BY PRICE</p>
      <Slider
        getAriaLabel={() => 'Minimum distance'}
        value={value1}
        min={0}
        max={18000}
        step={60}
        onChange={handleChange1}
        valueLabelDisplay="auto"
        disableSwap
        className='mt-5'
      />
      <Typography variant="body1" sx={{ mt: 2 }}>
        <p className='text-sm font-light text-gray-600'>
          Price: <span className='text-md font-medium text-black'>৳ {value1[0]} - ৳ {value1[1]}</span>
        </p>
      </Typography>
      <div className="button w-full my-3">
        <Button onClick={handleFilterClick} variant="secondary" className="w-full rounded-none text-xs text-normal">
          FILTER
        </Button>
      </div>
    </Box>
  );
}
