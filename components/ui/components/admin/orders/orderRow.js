import { useState } from "react";
import { FiPrinter } from "react-icons/fi";
import { LiaSearchPlusSolid } from "react-icons/lia";
export default function orderRow({ order, handleTrackCode, handleUpdate, handleOrderClick }) {

    const [trackingNumber, setTrackingNumber] = useState('');

    const handleInputChange = (e) => {
        setTrackingNumber(e.target.value); // Update the state with the input value
    };
    return (
        <tr key={order._id} id={order._id} className="border-b border-gray-200 text-black">
            <td className="px-4 py-3">
                <span className="font-semibold uppercase text-xs text-black">{order._id}</span>
            </td>

            <td className="px-4 py-3">
                <span className="text-sm text-black">
                    {new Date(order.dateOrdered).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                    })}
                </span>
            </td>

            <td className="px-4 py-3 text-xs">
                <span className="text-sm text-black">{order.email}</span>
            </td>

            <td className="px-4 py-3 ">
                {order.trackCode ? (
                     <span className="text-sm font-semibold text-black">{order.trackCode}</span>
                ) : (
                    <>
                    
                        <input
                            type="text"
                            className={`text-sm font-semibold text-black border border-gray-300 rounded px-2 py-1 w-40 block ${order.status === "Delivered" || order.status=="Cancel" ? "opacity-30 cursor-not-allowed" : ""}`}

                            value={trackingNumber}  // Bind the input field to the state
                            onChange={handleInputChange}
                            disabled={order.status === "Delivered" || order.status === "Cancel"}   // Update the state on input change
                        />
                        <button
                            onClick={() => handleTrackCode(order._id, trackingNumber)} // Pass the order ID and tracking number
                            className={`mt-2 text-white bg-blue-500 text-xs px-2 py-1 rounded ${order.status === "Delivered" || order.status=="Cancel" ? "opacity-30 cursor-not-allowed" : ""}`}
                        >
                            ENTER
                        </button>
                    </>
                )}
            </td>

            <td className="px-4 py-3">
                <span className="text-sm font-semibold text-black">$ {order.totalPrice}</span>
            </td>

            <td className="px-4 py-3 text-xs">
                <span className="font-serif">
                    <span
                        className={`inline-flex px-2 text-sm font-medium leading-5 rounded-full 
              ${order.status === "Pending" ? "text-yellow-500 bg-yellow-100" : ""}
              ${order.status === "Cancel" ? "text-red-500 bg-red-100" : ""}
              ${order.status === "Processing" ? "text-blue-500 bg-blue-100" : ""}
              ${order.status === "Delivered" ? "text-green-500 bg-green-100" : ""}`}
                    >
                        {order.status}
                    </span>
                </span>
            </td>

            <td className="px-4 py-3 text-center">
                <select
                    className={`block w-full px-2 py-1 text-sm dark:text-gray-300 focus:outline-none rounded-md form-select focus:border-gray-200 border-gray-200 dark:border-gray-600 focus:shadow-none focus:ring focus:ring-green-300 dark:focus:border-gray-500 dark:focus:ring-gray-300 dark:bg-gray-700 leading-5 border border-gray-200 bg-gray-50 dark:border-gray-700 h-8 rounded-md text-xs focus:border-blue-500 focus:outline-none 
            ${order.status === "Cancel" || order.status==="Delivered" ? "opacity-30 cursor-not-allowed" : ""}`}
                    value={order.status} // Set the initial value to the current status
                    onChange={(e) => handleUpdate(e, order._id)} // Pass both the event and order ID
                    disabled={order.status === "Cancel" || order.status==="Delivered"} // Disable if the status is "Cancel"
                >
                    <option value="Pending">Pending</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Processing">Processing</option>
                    <option value="Cancel">Cancel</option>
                </select>
            </td>

            <td className="px-4 py-3">
                <div className="flex justify-end gap-x-2">
                    <FiPrinter className="cursor-pointer" />
                    <LiaSearchPlusSolid
                        className="-rotate-90 cursor-pointer"
                        onClick={() => {
                            handleOrderClick(order._id);
                        }}
                    />
                </div>
            </td>
        </tr>
    )
}
