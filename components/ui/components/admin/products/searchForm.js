import { fetchAllCategories } from "@/redux/category/allCategoriesSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
export default function searchForm({
  selectedPrice,
  isInput,
  handleInputChange,
  setCategoryId,
  handleCatSelect,
  handlePrcChange,
}) {
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const [category, setCategory] = useState("All Categories");
  const parentCategoryRef = useRef(null);
  const {
    categories,
    isLoading: parentLoading,
    error: parentError,
  } = useSelector((state) => state.categories);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCategorySelect = (category, id) => {
    setCategory(category);
    setIsOpen(false);
    setCategoryId(id);
    handleCatSelect(id);
  };

  const handlePriceChange = (event) => {
    handlePrcChange(event.target.value); // Update the state with the selected value
  };

  return (
    <>
      <div className="min-w-0 rounded-lg border border-gray-200 ring-opacity-4 shadow-xs overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
        <div className="p-4">
          <form className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
            {/* Search Input */}
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow relative">
              <input
                type="search"
                name="search"
                placeholder="Search Product"
                className="block w-full px-3 py-1 text-sm leading-5 rounded-md focus:outline-none dark:text-gray-300 focus:border-gray-200 border border-gray-200 dark:border-gray-600  dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 h-12 bg-gray-100 border-transparent focus:bg-white"
                value={isInput}
                onChange={handleInputChange}
              />
            </div>

            {/* product categories */}
            <div className="grid grid-cols-6 gap-3  xl:gap-6 lg:gap-6 mb-6">
              <label
                htmlFor="category"
                className=" flex items-center md:justify-center block text-sm font-medium text-gray-700 dark:text-gray-400 col-span-6 sm:col-span-2"
              >
                Category
              </label>
              <div className="col-span-6 sm:col-span-4">
                <div className="relative">
                  {/* Parent Category Dropdown */}
                  <div
                    ref={parentCategoryRef}
                    className="parentCategory bg-white flex items-center justify-between px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer dark:bg-gray-700 dark:border-gray-600"
                    onClick={toggleDropdown} // Toggle the dropdown visibility
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {category}
                    </span>
                    <span className="text-gray-500 dark:text-gray-300">▼</span>
                  </div>

                  {/* Dropdown List */}
                  {isOpen && (
                    <ul
                      ref={dropdownRef}
                      className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-md dark:bg-gray-700 dark:border-gray-600 max-h-40 overflow-y-auto"
                    >
                      {categories.length > 0 ? (
                        categories.map((parentCategory) => (
                          <li key={parentCategory.id}>
                            <a
                              className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                              onClick={() =>
                                handleCategorySelect(
                                  parentCategory.name,
                                  parentCategory.id
                                )
                              } // Select category and close dropdown
                            >
                              {parentCategory.name}
                            </a>
                          </li>
                        ))
                      ) : (
                        <li>
                          <a
                            className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                            disabled
                          >
                            No Categories Available
                          </a>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Price Select */}
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <select
                className="block w-full px-2 py-1 text-sm dark:text-gray-300 rounded-md form-select focus:border-gray-200 border-gray-200 dark:border-gray-600 border dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 leading-5 h-12 bg-gray-100 border-transparent focus:bg-white"
                value={selectedPrice} // Bind the state to the select element
                onChange={handlePriceChange} // Handle the change event
              >
                <option value="All" hidden>
                  Price
                </option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
                {/* Add more price options as needed */}
              </select>
              <p className="mt-2 text-sm text-gray-600">
                Selected Price: {selectedPrice || "None"}
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
