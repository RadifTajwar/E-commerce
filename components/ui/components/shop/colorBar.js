import DoneIcon from '@mui/icons-material/Done';
import "./scrollbar.css";
export default function colorBar() {
    return (
        <>
            <p className='text-md text-black font-medium my-2'>FILTER BY COLOR</p>
            <div className="rangeBar max-h-56   flex flex-col justify-between gap-y-4 overflow-y-auto mt-5">
            
                <div className="flex space-between w-full gap-x-4 items-center group cursor-pointer">
                    <div className="w-5/6 ">
                        <div className="color_palette_&_text flex gap-x-3 items-center">
                            <div className="color_palette w-[62px] h-[62px] bg-[#740224] rounded-3xl flex items-center justify-center">
                                <div className="tick_icon hidden group-hover:block ">
                                <DoneIcon className='text-white'/>
                                </div>
                            </div>
                            <div className="text">
                                <p className='text-sm font-light text-gray-600 group-hover:text-black'>Red Brown</p>
                            </div>
                        </div>

                    </div>
                    <div className="w-1/6 text-center flex justify-center ">
                        <p className="w-8  h-6 rounded-full  border border-gray-300 text-sm font-light text-gray-600 group-hover:bg-gray-700 group-hover:border-black group-hover:text-white">11</p>
                    </div>
                </div>

                <div className="flex space-between w-full gap-x-4 items-center">
                    <div className="w-5/6 ">
                        <div className="color_palette_&_text flex gap-x-3 items-center">
                            <div className="color_palette w-[62px] h-[62px] bg-[#b7195e] rounded-3xl">

                            </div>
                            <div className="text">
                                <p className='text-sm font-light text-gray-600'>Red Wine</p>
                            </div>
                        </div>

                    </div>
                    <div className="w-1/6 text-center flex justify-center ">
                        <p className="w-8  h-6 rounded-full  border border-gray-300 text-sm font-light text-gray-600">11</p>
                    </div>
                </div>
                <div className="flex space-between w-full gap-x-4 items-center">
                    <div className="w-5/6 ">
                        <div className="color_palette_&_text flex gap-x-3 items-center">
                            <div className="color_palette w-[62px] h-[62px] bg-[#000000] rounded-3xl">

                            </div>
                            <div className="text">
                                <p className='text-sm font-light text-gray-600'>Black</p>
                            </div>
                        </div>

                    </div>
                    <div className="w-1/6 text-center flex justify-center ">
                        <p className="w-8  h-6 rounded-full  border border-gray-300 text-sm font-light text-gray-600">11</p>
                    </div>
                </div>
                <div className="flex space-between w-full gap-x-4 items-center">
                    <div className="w-5/6 ">
                        <div className="color_palette_&_text flex gap-x-3 items-center">
                            <div className="color_palette w-[62px] h-[62px] bg-[#740224] rounded-3xl">

                            </div>
                            <div className="text">
                                <p className='text-sm font-light text-gray-600'>Red Brown</p>
                            </div>
                        </div>

                    </div>
                    <div className="w-1/6 text-center flex justify-center cursor-pointer">
                        <p className="w-8  h-6 rounded-full  border border-gray-300 text-sm font-light text-gray-600">11</p>
                    </div>
                </div>

                <div className="flex space-between w-full gap-x-4 items-center">
                    <div className="w-5/6 ">
                        <div className="color_palette_&_text flex gap-x-3 items-center">
                            <div className="color_palette w-[62px] h-[62px] bg-[#b7195e] rounded-3xl">

                            </div>
                            <div className="text">
                                <p className='text-sm font-light text-gray-600'>Red Wine</p>
                            </div>
                        </div>

                    </div>
                    <div className="w-1/6 text-center flex justify-center ">
                        <p className="w-8  h-6 rounded-full  border border-gray-300 text-sm font-light text-gray-600">11</p>
                    </div>
                </div>
                <div className="flex space-between w-full gap-x-4 items-center">
                    <div className="w-5/6 ">
                        <div className="color_palette_&_text flex gap-x-3 items-center">
                            <div className="color_palette w-[62px] h-[62px] bg-[#000000] rounded-3xl">

                            </div>
                            <div className="text">
                                <p className='text-sm font-light text-gray-600'>Black</p>
                            </div>
                        </div>

                    </div>
                    <div className="w-1/6 text-center flex justify-center ">
                        <p className="w-8  h-6 rounded-full  border border-gray-300 text-sm font-light text-gray-600">11</p>
                    </div>
                </div>
            </div>
        </>
    )
}
