"use client";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
export default function page() {
  const dispatch = useDispatch();

  const [formState, setFormState] = useState({
    name: "",
    address: "",
    district: "",
    searchTerm: "",
    phone: "",
    email: "",
    additionalInfo: "",
    zip: "",
  });

  const [showDistrictOption, setShowDistrictOption] = useState(false);
  const [filteredDistricts, setFilteredDistricts] = useState([]); // Example: populate this with districts
  const districts = ["Dhaka", "Chittagong", "Khulna", "Barisal", "Sylhet"]; // Example list of districts
  useEffect(() => {
    setFilteredDistricts(districts);
  }, []);

  // Handler for updating form state
  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Update form state
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));

    // Clear error for the specific field if it has a value
    setErrors((prevErrors) => {
      if (value.trim()) {
        const { [id]: _, ...remainingErrors } = prevErrors; // Remove the error for the current field
        return remainingErrors;
      }
      return prevErrors;
    });
  };

  // Filter districts based on search term
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      searchTerm: value,
    }));
    setFilteredDistricts(
      districts.filter((district) =>
        district.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  // Select a district
  const handleDistrictSelect = (district) => {
    setFormState((prevState) => ({
      ...prevState,
      district,
      searchTerm: "",
    }));

    // Clear the district error
    setErrors((prevErrors) => {
      const { district: _, ...remainingErrors } = prevErrors; // Remove 'district' error
      return remainingErrors;
    });

    setShowDistrictOption(false);
  };

  const [errors, setErrors] = useState({});

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formState.name.trim())
      newErrors.name =
        "Billing Full Name(আপনার সম্পূর্ণ নাম) is a required field";
    if (!formState.address.trim())
      newErrors.address =
        "Full Address (আপনার সম্পূর্ণ ঠিকানা লিখুন) is a required field.";
    if (!formState.district.trim())
      newErrors.district = "District (জেলা)  is a required field.";
    if (!formState.phone.trim()) {
      newErrors.phone =
        "Phone (আপনার ফোন নাম্বারটি লিখুন) is a required field.";
    } else if (formState.phone.length != 11) {
      newErrors.phone = "Phone (আপনার ফোন নাম্বারটি লিখুন) must be 11 digits";
    }
    if (!formState.zip.trim()) {
      newErrors.zip = "Zip Code (আপনার পোষ্টকোড) is a required field.";
    } else if (formState.zip.length != 4) {
      newErrors.zip = "Zip Code (আপনার পোষ্টকোড) must be 4 digits";
    }
    if (!formState.email.trim())
      newErrors.email = "Email address is a required field.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
    }
  };
  return (
    <div className="right w-full md:w-2/3 lg:w-3/4  px-8 py-2.5">
      <div className="text mb-5">
        <p className="text-2xl txt-black">BILLING ADDRESS</p>
      </div>

      <div className="name_address_district_phone_email_&_additionalInformation">
        <div className="name_address_district_phone_email_&_additionalInformation">
          <div className="w-1/2 pb-5">
            <label
              htmlFor="name"
              className="block text-sm font-normal text-gray-700 pb-1"
            >
              Full Name (আপনার সম্পূর্ণ নাম){" "}
              <span className="text-sm text-red-600">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formState.name}
              onChange={handleInputChange}
              className={`border-2 px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm sm:text-sm ${
                errors.name ? "border-red-500" : "border-gray-200"
              }`}
            />
          </div>

          <div className="w-full pb-5">
            <label
              htmlFor="address"
              className="block text-sm font-normal text-gray-700 pb-1"
            >
              Full Address (আপনার সম্পূর্ণ ঠিকানা লিখুন){" "}
              <span className="text-sm text-red-600">*</span>
            </label>
            <input
              type="text"
              id="address"
              value={formState.address}
              onChange={handleInputChange}
              className={`border-2 px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm sm:text-sm ${
                errors.address ? "border-red-500" : "border-gray-200"
              }`}
            />
          </div>

          <div className="w-full pb-5">
            <label
              htmlFor="district"
              className="block text-sm font-normal text-gray-700 pb-1"
            >
              District (জেলা) <span className="text-sm text-red-600">*</span>
            </label>
            <div className="relative">
              <div
                className={`border-2 px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm sm:text-sm ${
                  errors.district ? "border-red-500" : "border-gray-200"
                }`}
              >
                <button
                  type="button"
                  className="w-full text-left flex justify-between items-center focus:outline-none"
                  onClick={() => setShowDistrictOption(!showDistrictOption)}
                >
                  {formState.district || "Select District"}
                  <svg
                    className={`w-4 h-4 ml-2 ${
                      showDistrictOption ? "rotate-180" : "rotate-0"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {showDistrictOption && (
                <div className="absolute z-10 left-0 right-0 bg-white border-2 shadow-md">
                  <div className="relative w-full p-4 bg-gray-200">
                    <input
                      type="text"
                      placeholder="Search District"
                      value={formState.searchTerm}
                      onChange={handleSearchChange}
                      className="w-full px-4 py-2 border-2 border-gray-300 focus:outline-none text-sm"
                    />
                    <SearchIcon className="absolute right-7 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                  </div>
                  <ul className="max-h-[200px] overflow-scroll">
                    {filteredDistricts.length > 0 ? (
                      filteredDistricts.map((district, index) => (
                        <li
                          key={index}
                          onClick={() => handleDistrictSelect(district)}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-700 hover:text-white text-sm"
                        >
                          {district}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-sm text-gray-500">
                        No results found
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="sm:flex sm:space-x-4">
            <div className="w-full sm:w-1/2 pb-5">
              <label
                htmlFor="phone"
                className="block text-sm font-normal text-gray-700 pb-1"
              >
                Phone (আপনার ফোন নাম্বারটি লিখুন){" "}
                <span className="text-sm text-red-600">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                value={formState.phone}
                onChange={handleInputChange}
                className={`border-2 px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm sm:text-sm ${
                  errors.phone ? "border-red-500" : "border-gray-200"
                }`}
              />
            </div>
            <div className="w-full sm:w-1/2 pb-5">
              <label
                htmlFor="name"
                className="block text-sm font-normal text-gray-700 pb-1"
              >
                Zip Code (আপনার পোষ্টকোড){" "}
                <span className="text-sm text-red-600">*</span>
              </label>
              <input
                type="text"
                id="zip"
                value={formState.zip}
                onChange={handleInputChange}
                className={`border-2 px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm sm:text-sm ${
                  errors.zip ? "border-red-500" : "border-gray-200"
                }`}
              />
            </div>
          </div>

          <div className="w-full pb-5">
            <label
              htmlFor="email"
              className="block text-sm font-normal text-gray-700 pb-1"
            >
              Email address (optional){" "}
              <span className="text-sm text-red-600">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formState.email}
              onChange={handleInputChange}
              className={`border-2 px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm sm:text-sm ${
                errors.email ? "border-red-500" : "border-gray-200"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
