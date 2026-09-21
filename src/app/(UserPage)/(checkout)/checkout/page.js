"use client";
import {
  decrementItem,
  incrementItem,
  resetCart,
} from "@/redux/cart/cartSlicer";
import { createOrder, resetOrder } from "@/redux/order/createOrderSlice";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ProductionQuantityLimitsOutlinedIcon from "@mui/icons-material/ProductionQuantityLimits";
import SearchIcon from "@mui/icons-material/Search";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import localStorageUtil from "@/utils/localStorageUtil";
export default function page() {
  const router = useRouter();

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.total);
  const { order, isLoading, error, status } = useSelector(
    (state) => state.createOrderItem
  );

  const [selectedShipping, setSelectedShipping] = useState(60);
  const [showCoupon, setShowCoupon] = useState(false);

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

  const handleShippingChange = (e) => {
    const cost = Number(e.target.value);

    localStorageUtil.setItem("selectedShipping", cost);
    const savedShipping = localStorageUtil.getItem("selectedShipping");

    setSelectedShipping(cost);
  };

  const handleIncrementItem = (id) => {
    dispatch(incrementItem({ id }));
  };
  const handleDecrementItem = (id) => {
    dispatch(decrementItem({ id }));
  };
  useEffect(() => {
    const savedShipping = localStorage.getItem("selectedShipping");
    if (savedShipping) {
      setSelectedShipping(Number(savedShipping));
    }
  }, []);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (status === "succeeded" && order) {
      router.push(`checkout/orderReceived/${order._id}`); // Redirect on success

      // Reset order and status after redirection
      dispatch(resetOrder());
      dispatch(resetCart());
    }
  }, [status, order, router, dispatch]);

  const handleFormSubmit = async (e) => {
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
      const simplifiedCartItems = cartItems.map((item) => ({
        quantity: item.quantity,
        product: item.id, // Ensure 'product' is set to the product ID (not 'id')
        color: item.color,
        // Include other properties if needed
      }));

      const orderData = {
        orderItems: simplifiedCartItems, // Include the simplified cart items
        shippingAddress: formState.address,
        name: formState.name,
        email: formState.email,
        city: formState.district,
        zip: formState.zip,
        country: "Bangladesh",
        phone: formState.phone,
        status: "Pending",
        totalPrice: cartTotal,
        additionalDetails: formState.additionalInfo,
      };
      const orderDataRes = dispatch(createOrder(orderData)).unwrap();
      if (status === "succeeded") {
        setFormState({
          name: "",
          address: "",
          district: "",
          searchTerm: "",
          phone: "",
          email: "",
          additionalInfo: "",
          zip: "",
        });
      }
      // Handle actual form submission logic here
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedShipping = localStorageUtil.getItem("selectedShipping");
      if (savedShipping) {
        setSelectedShipping(Number(savedShipping));
      }
    }
  }, []);

  return (
    <>
      <div className="total_container  max-w-7xl mx-auto my-10">
        {cartItems.length !== 0 ? (
          <>
            <div className="coupon_section px-4 w-auto ">
              <div className="coupon_text mb-6">
                <p className="text-sm text-black font-medium">
                  Have a coupon?{" "}
                  <button
                    className="cursor-pointer border-b border-black text-gray-800 text-sm font-medium"
                    onClick={() => setShowCoupon(!showCoupon)}
                  >
                    Click here to enter your code
                  </button>
                </p>
              </div>
              <div
                className={`coupon_apply transition-max-height duration-1000 ease-in-out overflow-hidden  ${
                  showCoupon ? "max-h-screen " : "max-h-0 "
                }`}
              >
                <div className="scoupon_apply_inner inline-block p-8 border-2 border-gray-200 mb-6">
                  <div className="promo_text">
                    <p className="text-gray-600 font-normal text-xs">
                      If you have a coupon code, please apply it below.
                    </p>
                  </div>
                  <div className="coupon_box sm:flex sm:space-x-4 pt-4 space-y-2 sm:space-y-0">
                    <input
                      type="text"
                      id="name"
                      value={formState.name}
                      onChange={handleInputChange}
                      className={`border-2 px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm sm:text-sm  'border-gray-200'
                              }`}
                      placeholder="Coupon Code"
                    />
                    <div className="Apply_coupon_button bg-black  text-white text-center inline-block">
                      <button className="text-center  py-3 px-4 text-sm font-medium">
                        APPLY
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {Object.values(errors).length > 0 && (
              <div className="coupon_section px-4 w-auto">
                <div className="flex items-center justify-start bg-red-500 p-2 rounded">
                  <div className="icon mr-2">
                    <ErrorOutlineIcon className="text-white" />
                  </div>
                  <div className="texts">
                    {Object.values(errors).map((error, index) => (
                      <div key={index} className="text-white text-sm">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <form className="w-full" onSubmit={handleFormSubmit}>
              <div className="inner_divs md:flex w-full justify-center ">
                <div className="w-full md:w-5/12 lg:w-1/2  px-4">
                  <div className="inner mt-8 mb-6 ">
                    <div className="billing_shipping_text pb-5">
                      <p className="text-xl font-normal text-gray-900">
                        BILLING & SHIPPING
                      </p>
                    </div>
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
                            errors.address
                              ? "border-red-500"
                              : "border-gray-200"
                          }`}
                        />
                      </div>

                      <div className="w-full pb-5">
                        <label
                          htmlFor="district"
                          className="block text-sm font-normal text-gray-700 pb-1"
                        >
                          District (জেলা){" "}
                          <span className="text-sm text-red-600">*</span>
                        </label>
                        <div className="relative">
                          <div
                            className={`border-2 px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm sm:text-sm ${
                              errors.district
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                          >
                            <button
                              type="button"
                              className="w-full text-left flex justify-between items-center focus:outline-none"
                              onClick={() =>
                                setShowDistrictOption(!showDistrictOption)
                              }
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
                                      onClick={() =>
                                        handleDistrictSelect(district)
                                      }
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
                              errors.phone
                                ? "border-red-500"
                                : "border-gray-200"
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
                          Email address Or Phone Number{" "}
                          <span className="text-sm text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          id="email"
                          value={formState.email}
                          onChange={handleInputChange}
                          className={`border-2 px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm sm:text-sm ${
                            errors.email ? "border-red-500" : "border-gray-200"
                          }`}
                        />
                      </div>

                      <div className="w-full pb-5">
                        <label
                          htmlFor="additionalInfo"
                          className="block text-sm font-normal text-gray-700 pb-1"
                        >
                          Additional Information
                        </label>
                        <textarea
                          id="additionalInfo"
                          rows="3"
                          value={formState.additionalInfo}
                          onChange={handleInputChange}
                          className="border-2 border-gray-200 px-4 py-2 focus:outline-none mt-1 block w-full shadow-sm sm:text-sm resize-none"
                          placeholder="Notes about your order, e.g. special notes for delivery."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-7/12 lg:w-1/2  px-4">
                  <div className="inner p-8 bg-gray-100 bg-opacity-70">
                    <div className="your_order_text text-center text-xl mb-5">
                      YOUR ORDER
                    </div>

                    <div className="product_detail py-1 px-4 bg-white  mb-5">
                      <div className="inner">
                        <div className="header flex justify-between border-b-2 border-gray-200 ">
                          <div className="text_product px-2.5 py-4">
                            PRODUCT
                          </div>
                          <div className="text_subtotal px-2.5 py-4">
                            SUBTOTAL
                          </div>
                        </div>
                        <div className="all_product">
                          <div className="inner_products max-h-48 overflow-y-auto">
                            {cartItems.map((item, index) => (
                              <div
                                key={index}
                                className="w-full product_container px-3 py-4 flex justify-between items-center border-b border-gray-200"
                              >
                                <div
                                  key={index}
                                  className="image_&_text flex items-center w-full"
                                >
                                  <div className="image me-2.5">
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      height={65}
                                      width={65}
                                      className="min-h-[65px] min-w-[65px]"
                                    />
                                  </div>
                                  <div className="sm:flex justify-between items-center w-full">
                                    <div className="text_&_amount">
                                      <p className="text-gray-500 text-sm font-normal">
                                        {item.name}-{item.color}
                                      </p>
                                      <div className="quantity_section mt-2.5 mb-2.5 sm:mb-0">
                                        <div className="inner flex">
                                          <div
                                            className="border border-2 px-2 py-1 hover:bg-gray-800 hover:text-white transition  hover:border-black text-gray-500 flex items-center justify-center cursor-pointer"
                                            onClick={() => {
                                              handleDecrementItem(item.colorId);
                                            }}
                                          >
                                            -
                                          </div>

                                          <span className="px-2 py-1  border-t-2 border-b-2 text-gray-500 text-sm flex items-center justify-center">
                                            {item.quantity}
                                          </span>

                                          <div
                                            className="border border-2 px-2 py-1 hover:bg-gray-800 hover:text-white transition  hover:border-black text-gray-500 flex items-center justify-center cursor-pointer"
                                            onClick={() => {
                                              handleIncrementItem(item.colorId);
                                            }}
                                          >
                                            +
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="price">
                                      <p className="text-gray-500 text-sm font-normal">
                                        $ {item.quantity * item.price}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="subtotal flex flex-wrap w-full justify-between items-center border-b border-gray-200 pt-4 md:pt-0  mb-4 md:mb-0 pb-4 md:pb-0">
                            <div className="h-full text text-sm text-gray-900 font-normal  md:px-2.5 md:py-4 ">
                              Subtotal
                            </div>
                            <div className="amount text-sm text-gray-500 font-normal  md:px-3 md:py-4">
                              $ {cartTotal}
                            </div>
                          </div>
                          <div className="shipping  flex flex-wrap md:flex-nowrap md:items-center border-b border-gray-200 justify-between mb-4 md:mb-0 pb-4 md:pb-0">
                            <div className="shipping_left flex flex-wrap md:px-2.5 md:py-4 text-gray-900 text-sm font-normal">
                              Shipping
                            </div>
                            <div className="shipping_right md:px-3 md:py-4">
                              <ul className="space-y-4">
                                <li className="flex items-start justify-end text-end space-x-2">
                                  <p className="text-sm text-black font-normal">
                                    Home Delivery - Chattogram City: $60.00
                                  </p>
                                  <input
                                    type="radio"
                                    name="shipping_method"
                                    value={60}
                                    checked={selectedShipping === 60}
                                    onChange={handleShippingChange}
                                    className="shipping_method mt-1"
                                  />
                                </li>
                                <li className="flex items-start justify-end text-end space-x-2">
                                  <p className="text-sm text-black font-normal">
                                    Home Delivery - Dhaka City: $100.00
                                  </p>
                                  <input
                                    type="radio"
                                    name="shipping_method"
                                    value={100}
                                    checked={selectedShipping === 100}
                                    onChange={handleShippingChange}
                                    className="shipping_method mt-1"
                                  />
                                </li>
                                <li className="flex items-start justify-end text-end space-x-2">
                                  <p className="text-sm text-black font-normal">
                                    Home Delivery - Outside District: $120.00
                                  </p>
                                  <input
                                    type="radio"
                                    name="shipping_method"
                                    value={120}
                                    checked={selectedShipping === 120}
                                    onChange={handleShippingChange}
                                    className="shipping_method mt-1"
                                  />
                                </li>
                              </ul>
                              <p className="mt-4 text-sm text-gray-700">
                                Selected Shipping Cost: ${selectedShipping}
                              </p>
                            </div>
                          </div>
                          <div className="total flex justify-between">
                            <div className="text md:px-2.5 md:py-4 text-gray-900 text-sm md:text-lg font-normal">
                              Total
                            </div>
                            <div className="amount md:px-3 md:py-4 text-gray-500 text-lg md:text-xl font-medium">
                              $ {cartTotal + selectedShipping}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="cash_on_delivery_text text-start  mb-5 text-gray-900 text sm font-normal">
                      Cash on delivery
                    </div>
                    <div className="delivery_method w-full bg-white p-4 mt-4">
                      <p className="text-sm text-gray-500 font-normal">
                        {" "}
                        Pay with cash upon delivery.
                      </p>
                    </div>
                    <div className="place_order_section mt-5 py-5 border-t border-gray-200">
                      <p className="text-gray-500 text-sm font-normal">
                        Your personal data will be used to process your order,
                        support your experience throughout this website, and for
                        other purposes described in our{" "}
                        <span className="text-black text-sm font-medium">
                          privacy policy.
                        </span>{" "}
                      </p>
                    </div>

                    <div className="place_order_button bg-black  text-white text-center">
                      <button
                        className="text-center w-full py-3 text-sm font-medium"
                        type="submit"
                      >
                        {isLoading ? "Processing..." : "PLACE ORDER"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </>
        ) : (
          <>
            {cartItems.length === 0 && (
              <>
                <div className="empty_cart_icon_text flex justify-center m-4 max-w-6xl mx-auto">
                  <div className="cart_icon text-center p-5 w-full">
                    <ProductionQuantityLimitsOutlinedIcon className="!text-[150px] md:!text-[200px] lg:!text-[250px] opacity-[0.08]" />
                    <div className="text text-center my-4">
                      <p className=" text-2xl md:text-3xl lg:text-4xl text-gray-900 font-medium mb-4">
                        Your cart is currently empty.
                      </p>
                      <p className=" text-xs md:text-sm text-gray-500 font-normal">
                        Before proceed to checkout you must add some products to
                        your shopping cart.
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 font-normal">
                        You will find a lot of interesting products on our
                        "Shop" page.{" "}
                      </p>
                    </div>

                    <div className="buttons_ADD_TO_CART bg-black text-white text-center w-full">
                      <Link href="/shop">
                        <button className="text-center py-3 text-md font-medium w-full cursor-pointer">
                          RETURN TO SHOP
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
