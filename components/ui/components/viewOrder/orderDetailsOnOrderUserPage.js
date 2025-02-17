
export default function orderDetailsOnOrderUserPage({order}) {
    const subtotal = order?.orderItems?.reduce((total, item) => {
        return total + item?.quantity * item?.product?.discountedPrice;
    }, 0);
  return (
    <div className="max-w-3xl mx-auto p-6">
    {/* Success Message */}
    <div className="border-2 border-dashed border-green-600 p-4 mb-8 text-center">
      <h1 className="text-green-600 text-xl">Thank you. Your order has been received.</h1>
    </div>

    {/* Order Summary Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="p-4 bg-gray-50 text-center">
        <div className="text-sm text-gray-600">Order number:</div>
        <div className="font-medium text-xs break-words">#{order?._id}</div>
      </div>
      <div className="p-4 bg-gray-50 text-center">
        <div className="text-sm text-gray-600">Date:</div>
        <div className="font-medium text-xs"> {new Date(order?.dateOrdered).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })}</div>
      </div>
      <div className="p-4 bg-gray-50 text-center">
        <div className="text-sm text-gray-600">Total:</div>
        <div className="font-medium"> ৳ {order?.totalPrice}</div>
      </div>
      <div className="p-4 bg-gray-50 text-center">
        <div className="text-sm text-gray-600">Payment method:</div>
        <div className="font-medium">Cash on delivery</div>
      </div>
    </div>

    <p className="text-gray-600 mb-8">Pay with cash upon delivery.</p>

    {/* Order Details Section */}
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-6">ORDER DETAILS</h2>

      <div className="border-t border-gray-200">
        <div className="flex justify-between py-4 border-b border-gray-200">
          <div className="text-gray-600">PRODUCT</div>
          <div className="text-gray-600">TOTAL</div>
        </div>
        {
order?.orderItems?.map((item)=>(

  <div key={item?._id} className="flex justify-between py-4 border-b border-gray-200">
          <div>
            <div>{item?.product?.name} × {item?.quantity}</div>
            <div className="text-sm text-gray-600">Color: {item?.color}</div>
          </div>
          <div> ৳ {item?.product?.discountedPrice*item?.quantity}</div>
        </div>
)
)
}
        

        <div className="flex justify-between py-4 border-b border-gray-200">
          <div>Subtotal:</div>
          <div>৳ {subtotal}</div>
        </div>

        <div className="flex justify-between py-4 border-b border-gray-200">
          <div>Shipping:</div>
          <div className="text-right">
            <div>₹ 60.00</div>
            <div className="text-sm text-gray-600">via Home Delivery-Chattogram City</div>
          </div>
        </div>

        <div className="flex justify-between py-4 border-b border-gray-200">
          <div>Payment method:</div>
          <div>Cash on delivery</div>
        </div>

        <div className="flex justify-between py-4 font-semibold">
          <div>TOTAL:</div>
          <div>৳ {order?.totalPrice}</div>
        </div>
      </div>
    </div>
  </div>
  )
}
