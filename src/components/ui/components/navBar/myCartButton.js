import { useSelector } from "react-redux";

export default function MyCartButton({ handleShoppingCartClicked }) {
    const cartItems = useSelector((state) => state.cart.items);
    const totalCartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    return (
        <button
            
            type="button"
            className="relative inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white"
            onClick={handleShoppingCartClicked} // Removed parentheses here
        >
            <span className="sr-only">Cart</span>

            <div className="relative">
                <svg className="w-5 h-5 lg:me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
                </svg>

                <span className="absolute -top-1 -left-1 flex items-center justify-center h-4 w-4 text-xs font-bold text-white bg-red-500  rounded-full">
                   {totalCartQuantity}
                </span>
            </div>

            <span className="hidden sm:flex">My Cart</span>
            <svg className="hidden sm:flex w-4 h-4 text-gray-900 dark:text-white ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
            </svg>
        </button>
    );
}
