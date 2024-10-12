
export default function stockStatus() {
    return (
        <>
            <div className="stockStatus w-full">
                <p className="text-md text-black font-medium my-2">STOCK STATUS</p>

                
                <div className="flex flex-col space-y-4 mt-5 ">
                    
                    <label className="flex items-center cursor-pointer group">
                        <input
                            type="checkbox"
                            className="w-4 h-4 accent-gray-700 mr-2 group-hover:border-black"
                            name="inStock"
                        />
                        <p className='text-sm font-light text-gray-600 group-hover:text-black'>In Stock</p>
                    </label>

                  
                    <label className="flex items-center cursor-pointer group">
                        <input
                            type="checkbox"
                            className="w-4 h-4 accent-gray-700 mr-2 group-hover:border-black"
                            name="inStock"
                        />
                        <p className='text-sm font-light text-gray-600 group-hover:text-black'>On Sale</p>
                    </label>
                </div>
            </div>

        </>
    )
}
