import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import { useRouter, useSearchParams } from "next/navigation";

export default function eachColorBar({
  colorName,
  count,
  hex,
  productsFetched,
  setProductsFetched,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter_color = searchParams.get("filter_color");
  //

  const handleFilterClick = () => {
    const params = new URLSearchParams(window.location.search);

    const existingColors = params.get("filter_color")
      ? params.get("filter_color").split(",")
      : [];

    if (!existingColors.includes(colorName)) {
      existingColors.unshift(colorName); // Add color to the beginning
    } else {
      existingColors.splice(existingColors.indexOf(colorName), 1); // Remove color
    }

    if (existingColors.length === 0) {
      params.delete("filter_color");
    } else {
      params.set("filter_color", existingColors.join(",")); // Manually set to keep commas
    }

    // Manually construct the final URL to prevent unwanted encoding
    const newUrl = `${window.location.pathname}?${params
      .toString()
      .replace(/%2C/g, ",")}`;

    router.push(newUrl, { scroll: false });
    setTimeout(() => {
      setProductsFetched(!productsFetched);
    }, 500);
  };

  return (
    <>
      <div
        key={colorName}
        className="flex space-between w-full gap-x-4 items-center group cursor-pointer"
        onClick={handleFilterClick}
      >
        <div className="w-5/6 ">
          <div className="color_palette_&_text flex gap-x-3 items-center">
            <div
              className="color_palette w-[62px] h-[62px] rounded-3xl flex items-center justify-center"
              style={{ backgroundColor: hex }}
            >
              {filter_color && filter_color.split(",").includes(colorName) ? (
                <>
                  <div className="tick_icon hidden group-hover:block">
                    <CloseIcon className="text-white" />
                  </div>
                  <div className="tick_icon  group-hover:hidden">
                    <DoneIcon className="text-white" />
                  </div>
                </>
              ) : (
                <>
                  <div className="tick_icon hidden group-hover:block">
                    <DoneIcon className="text-white" />
                  </div>
                </>
              )}
            </div>
            <div className="text">
              <p className="text-sm font-light text-gray-600 group-hover:text-black">
                {colorName}
              </p>
            </div>
          </div>
        </div>
        <div className="w-1/6 text-center flex justify-center">
          <p className="w-8 h-6 rounded-full border border-gray-300 text-sm font-light text-gray-600 group-hover:bg-gray-700 group-hover:border-black group-hover:text-white">
            {count}
          </p>
        </div>
      </div>
    </>
  );
}
