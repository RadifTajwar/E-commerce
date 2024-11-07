import Rating from '@mui/material/Rating';
import Image from 'next/image';
import { useState } from 'react';
export default function topRatedProducts() {
    const [value, setValue] = useState(5);
    return (
        <>

            <p className='text-md text-black font-medium my-2'>TOP RATED PRODUCTS</p>
            <div className="topRatedProducts w-full mt-5">
                <div className="flex w-full gap-x-2">
                    <div className="w-2/6 ">
                        <Image src="/topRated.jpg" width={65} height={65}></Image>
                    </div>
                    <div className="w-4/6 " >
                        <p className="text-gray-900 text-sm font-normal cursor-pointer hover:text-gray-600">Classic Bifold Series 2</p>
                        <p className='text-sm'> <Rating name="read-only " value={value} size="small" readOnly />
                        </p>
                        <p>
                            <span style={{ textDecoration: 'line-through', color: '#a9a9a9' }} className='text-xs'>$1350.00</span>
                            <span className="text-sm text-gray-900 font-medium" style={{ marginLeft: '8px' }}>$3500.00</span>
                        </p>
                    </div>
                </div>
                <div className="line w-full h-px bg-gray-300 my-6">
                </div>
                <div className="flex w-full gap-x-2">
                    <div className="w-2/6 ">
                        <Image src="/topRated.jpg" width={65} height={65}></Image>
                    </div>
                    <div className="w-4/6 " >
                        <p className="text-gray-900 text-sm font-normal cursor-pointer hover:text-gray-600">Classic Bifold Series 2</p>
                        <p className='text-sm'> <Rating name="read-only " value={value} size="small" readOnly />
                        </p>
                        <p>
                            <span style={{ textDecoration: 'line-through', color: '#a9a9a9' }} className='text-xs'>$1350.00</span>
                            <span className="text-sm text-gray-900 font-medium" style={{ marginLeft: '8px' }}>$3500.00</span>
                        </p>
                    </div>
                </div>
                <div className="line w-full h-px bg-gray-300 my-6">
                </div>
                <div className="flex w-full gap-x-2">
                    <div className="w-2/6 ">
                        <Image src="/topRated.jpg" width={65} height={65}></Image>
                    </div>
                    <div className="w-4/6 " >
                        <p className="text-gray-900 text-sm font-normal cursor-pointer hover:text-gray-600">Classic Bifold Series 2</p>
                        <p className='text-sm'> <Rating name="read-only " value={value} size="small" readOnly />
                        </p>
                        <p>
                            <span style={{ textDecoration: 'line-through', color: '#a9a9a9' }} className='text-xs'>$1350.00</span>
                            <span className="text-sm text-gray-900 font-medium" style={{ marginLeft: '8px' }}>$3500.00</span>
                        </p>
                    </div>
                </div>


            </div>
        </>
    )
}
