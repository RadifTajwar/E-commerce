'use client';
import { fetchColors } from '@/redux/color/getColorSlice';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import EachColorBar from './eachColorBar';
import './scrollbar.css';
export default function ColorBar({productsFetched, setProductsFetched}) {
    const dispatch = useDispatch();
    const searchParams = useSearchParams(); 
    const filter_color = searchParams.get('filter_color');
    const [filteredColorCounts, setFilteredColorCounts] = useState([]);
    const [colors, setColors] = useState([]);
    useEffect(() => {
        const getColors = async () => {
          const result = await dispatch(fetchColors()).unwrap();
         setColors(result);
        };
    
        getColors();
      }, [dispatch]);



    return (
        <>

            <p className='text-md text-black font-medium my-2'>FILTER BY COLOR</p>
            <div className="rangeBar max-h-56 flex flex-col justify-between gap-y-4 overflow-y-auto mt-5">
                {colors?.length > 0 ? (
                    colors?.map((items,index) => (
                        <EachColorBar key={index} colorName={items?.colorName} count={items?.productCount} hex={items?.Hex} productsFetched={productsFetched} setProductsFetched={setProductsFetched}/>
                    ))
                ) : (
                    <div className="sss">
                        No colors available for the selected stock status.
                    </div>
                )}
            </div>

        </>
    );
}
