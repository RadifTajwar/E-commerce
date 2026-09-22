"use client";
import BillingForm, {
  emptyBillingValues,
  validateBilling,
} from "@/components/storefront/checkout/BillingForm";
import EmptyCart from "@/components/storefront/checkout/EmptyCart";
import OrderSummary from "@/components/storefront/checkout/OrderSummary";
import { useSelectedShipping } from "@/components/storefront/checkout/useSelectedShipping";
import { DEFAULT_COUNTRY, ORDER_STATUS, ROUTES } from "@/config/constants";
import { notify } from "@/lib/toast";
import { decrementItem, incrementItem, resetCart } from "@/store/slices/cart.slice";
import { createOrder, resetOrder } from "@/store/slices/order.slice";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CheckoutPage() {
  const router = useRouter();

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.total);
  const { isLoading } = useSelector((state) => state.createOrderItem);

  const [selectedShipping, selectShipping] = useSelectedShipping();
  const [showCoupon, setShowCoupon] = useState(false);
  const [coupon, setCoupon] = useState("");

  const [formState, setFormState] = useState(emptyBillingValues);
  const [errors, setErrors] = useState({});

  // Update one billing field and clear its error once it has a value.
  const handleFieldChange = (field, value) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
    setErrors((prevErrors) => {
      if (!value.trim()) return prevErrors;
      const { [field]: _removed, ...remainingErrors } = prevErrors;
      return remainingErrors;
    });
  };

  const handleIncrementItem = (id) => {
    dispatch(incrementItem({ id }));
  };
  const handleDecrementItem = (id) => {
    dispatch(decrementItem({ id }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateBilling(formState);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const orderData = {
      orderItems: cartItems.map((item) => ({
        quantity: item.quantity,
        product: item.id, // 'product' is the product ID (not the cart line id)
        color: item.color,
      })),
      shippingAddress: formState.address,
      name: formState.name,
      email: formState.email,
      city: formState.district,
      zip: formState.zip,
      country: DEFAULT_COUNTRY,
      phone: formState.phone,
      status: ORDER_STATUS.pending,
      totalPrice: cartTotal + selectedShipping,
      additionalDetails: formState.additionalInfo,
    };

    try {
      const order = await dispatch(createOrder(orderData)).unwrap();
      router.push(ROUTES.orderReceived(order._id));
      dispatch(resetOrder());
      dispatch(resetCart());
    } catch (err) {
      // Keep the form filled so the customer can retry. Rejected thunks carry
      // either an Error or the message string itself.
      notify.error(typeof err === "string" ? err : err?.message || "Could not place your order.");
    }
  };

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
                      id="coupon"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="border-2 border-gray-200 px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm sm:text-sm"
                      placeholder="Coupon Code"
                    />
                    <div className="Apply_coupon_button bg-black  text-white text-center inline-block">
                      <button className="text-center  py-3 px-4 text-sm font-medium">APPLY</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {Object.keys(errors).length > 0 && (
              <div className="coupon_section px-4 w-auto">
                <div className="flex items-center justify-start bg-red-500 p-2 rounded">
                  <div className="icon mr-2">
                    <ErrorOutlineIcon className="text-white" />
                  </div>
                  <div className="texts">
                    {Object.entries(errors).map(([field, message]) => (
                      <div key={field} className="text-white text-sm">
                        {message}
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
                      <p className="text-xl font-normal text-gray-900">BILLING &amp; SHIPPING</p>
                    </div>
                    <BillingForm
                      values={formState}
                      errors={errors}
                      onChange={handleFieldChange}
                      idPrefix="checkout"
                    />
                  </div>
                </div>
                <div className="w-full md:w-7/12 lg:w-1/2  px-4">
                  <OrderSummary
                    items={cartItems}
                    cartTotal={cartTotal}
                    selectedShipping={selectedShipping}
                    onShippingChange={selectShipping}
                    onIncrement={handleIncrementItem}
                    onDecrement={handleDecrementItem}
                    isSubmitting={isLoading}
                  />
                </div>
              </div>
            </form>
          </>
        ) : (
          <EmptyCart />
        )}
      </div>
    </>
  );
}
