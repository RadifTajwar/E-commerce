import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { User } from 'lucide-react';
import Link from 'next/link';
import { useState } from "react";
import SearchIcon from "../icon/searchIcon";
export default function SideBar({ toggleSideBar, isVisibleSideBar ,toggleLogInForm}) {
    const [searchBar, setSearchBar] = useState("");
    const [isSelected, setIsSelected] = useState(true);
    const changeSearchBarText = (e) => {
        setSearchBar(e.target.value);
    }
    const handleToggleSideBar = () => {
        setTimeout(() => {
            toggleSideBar();
        }, 500);
    }

    const handleLoginClicked = () => {
        toggleSideBar();
        toggleLogInForm();
        
    }

    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <>


            <section
                className={`bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center overflow-y-auto z-50  transition-transform duration-300 ${isVisibleSideBar ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex flex-col items-center h-screen justify-center  mx-auto w-full sm:max-w-xs ">
                    <div className="w-full bg-white h-screen rounded-lg dark:border dark:bg-gray-800 dark:border-gray-700 overflow-y-auto">
                        <div className="ps-5 pe-12 py-2 relative">
                            <input
                                type="text"
                                value={searchBar}
                                onChange={changeSearchBarText}
                                placeholder="Search for products"
                                className="border-none px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm sm:text-sm"
                            />
                            <div className="absolute top-3 right-2 mt-1 mr-1">
                                <SearchIcon />
                            </div>
                        </div>

                        <div className="menu flex text-sm font-medium text-gray-500 dark:text-gray-400 bg-[#F5F5F5] cursor-pointer border-b border-gray-300">
                            {/* MENU Tab */}
                            <div
                                className={`menu w-1/2 text-center px-4 py-5 relative group transition-colors duration-300 hover:text-black ${isSelected ? 'bg-[#E8E8E8] text-black' : 'bg-[#F5F5F5]'
                                    }`}
                                onClick={() => setIsSelected(true)}
                            >
                                MENU
                                <span className={`absolute bottom-0 right-0 w-0 h-0.5 bg-black transition-all duration-300  ${isSelected ? `w-full ` : `group-hover:w-full group-hover:right-0 `}`}></span>
                            </div>

                            {/* CATEGORIES Tab */}
                            <div
                                className={`categories w-1/2 text-center px-4 py-5 relative group transition-colors duration-300 hover:text-black ${!isSelected ? 'bg-[#E8E8E8] text-black' : 'bg-[#F5F5F5]'
                                    }`}
                                onClick={() => setIsSelected(false)}
                            >
                                CATEGORIES
                                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300  ${!isSelected ? `w-full` : `group-hover:w-full group-hover:left-0`}`}></span>
                            </div>
                        </div>
                        <div>
                            {/* Main Category Item */}
                            {/* mapping start */}
                            <div
                                className="categoryItem flex justify-between text-gray-800 dark:text-gray-400 border-b border-gray-300 cursor-pointer text-[13px] font-semibold">
                                {/* mapping start  */}
                                <div className={`transition-all duration-200 category w-10/12 py-3 ps-5 border-e border-gray-300 ${isExpanded ? `bg-[#F7F7F7]` : ``}`} >
                                    BAGS
                                </div>
                                <div className={`icon w-2/12 py-3 flex justify-center items-center space-x-2 transition-all duration-200 ${isExpanded ? 'bg-[#4C4C4C]' : 'bg-[#F5F5F5]'}`} onClick={() => setIsExpanded(!isExpanded)}>
                                    <ChevronRightIcon
                                        fontSize="medium"
                                        className={` transition-transform duration-200 ${isExpanded ? 'rotate-90 text-white' : 'text-gray-500'
                                            }`}
                                        style={{ strokeWidth: 1 }}
                                    />
                                </div>

                                {/* mapping end */}




                            </div>

                            {/* Collapsible Content */}
                            <div
                                className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-40' : 'max-h-0'
                                    }`}
                            >
                                <div className="py-4 px-5 text-gray-400 dark:text-gray-300 border-b border-gray-300 cursor-pointer text-[13px] font-regular transition-all duration-300 hover:text-gray-800">
                                    Backpack
                                </div>

                            </div>
                            {/* mapping end  */}

                           <Link href="/shop">
                           <div className="transition-all duration-200 category w-full py-3 ps-5  border-b border-gray-300 cursor-pointer text-[13px] font-semibold" onClick={handleToggleSideBar} >
                                SHOP
                            </div >
                           </Link>

                            <div className="transition-all duration-200 category w-full py-3 ps-5  border-b border-gray-300 cursor-pointer text-[13px] font-semibold" >
                                ABOUT US
                            </div>

                            <div className="transition-all duration-200 category w-full py-3 ps-5 border-b border-gray-300 cursor-pointer text-[13px] font-semibold flex items-center space-x-2" onClick={handleLoginClicked}>
                                <User className="w-5 h-5" />
                                <span>LOGIN / REGISTER</span>
                            </div>
                        </div>



                    </div>
                </div>
            </section>
        </>
    );
}
