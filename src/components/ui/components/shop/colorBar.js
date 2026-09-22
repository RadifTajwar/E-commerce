"use client";

import { useSelector } from "react-redux";
import EachColorBar from "./eachColorBar";
import "./scrollbar.css";

/**
 * Colour facet list. The colours themselves are fetched once by `ShopBrowser`
 * (this bar is rendered twice: desktop rail + mobile drawer).
 */
export default function ColorBar() {
  const { colors } = useSelector((state) => state.getColor);

  return (
    <>
      <p className="text-md text-black font-medium my-2">FILTER BY COLOR</p>
      <div className="rangeBar max-h-56 flex flex-col justify-between gap-y-4 overflow-y-auto mt-5">
        {colors?.length > 0 ? (
          colors.map((item) => (
            <EachColorBar
              key={item?.colorName}
              colorName={item?.colorName}
              count={item?.productCount}
              hex={item?.Hex}
            />
          ))
        ) : (
          <div className="sss">No colors available for the selected stock status.</div>
        )}
      </div>
    </>
  );
}
