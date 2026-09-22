import ProductionQuantityLimitsOutlinedIcon from "@mui/icons-material/ProductionQuantityLimitsOutlined";
import Link from "next/link";
import { ROUTES } from "@/config/constants";

/** The "your cart is empty" panel shown on both the cart and the checkout page. */
export default function EmptyCart() {
  return (
    <div className="empty_cart_icon_text flex justify-center m-4 max-w-6xl mx-auto">
      <div className="cart_icon text-center p-5 w-full">
        <ProductionQuantityLimitsOutlinedIcon className="!text-[150px] md:!text-[200px] lg:!text-[250px] opacity-[0.08]" />
        <div className="text text-center my-4">
          <p className=" text-2xl md:text-3xl lg:text-4xl text-gray-900 font-medium mb-4">
            Your cart is currently empty.
          </p>
          <p className=" text-xs md:text-sm text-gray-500 font-normal">
            Before proceed to checkout you must add some products to your shopping cart.
          </p>
          <p className="text-xs md:text-sm text-gray-500 font-normal">
            You will find a lot of interesting products on our &quot;Shop&quot; page.{" "}
          </p>
        </div>

        <div className="buttons_ADD_TO_CART bg-black text-white text-center w-full">
          <Link href={ROUTES.shop}>
            <button className="text-center py-3 text-md font-medium w-full cursor-pointer">RETURN TO SHOP</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
