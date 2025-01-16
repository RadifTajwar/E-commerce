// components/DashboardStats.js

const StatCard = ({ icon, title, amount }) => {
    return (
        <div className="min-w-0 rounded-lg  ring-opacity-4 overflow-hidden bg-white dark:bg-gray-800 flex justify-center h-full shadow-lg">
            <div className="p-4 border border-gray-200 dark:border-gray-800 w-full p-6 rounded-lg text-black dark:text-white dark:bg-dark-800">
                <div className="text-center xl:mb-0 mb-3">
                    <div className="text-center inline-block text-3xl text-black dark:text-white dark:bg-dark-800">
                        {icon}
                    </div>
                    <div>
                        <p className="mb-3 text-base font-medium">{title}</p>
                        <p className="text-2xl font-bold leading-none">{amount}</p>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

const DashboardStats = () => {
    return (
        <div className="grid gap-4 md:grid-cols-4 xl:grid-cols-4">
            <StatCard
                icon={
                    <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        version="1.1"
                        viewBox="0 0 16 16"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M16 5l-8-4-8 4 8 4 8-4zM8 2.328l5.345 2.672-5.345 2.672-5.345-2.672 5.345-2.672zM14.398 7.199l1.602 0.801-8 4-8-4 1.602-0.801 6.398 3.199zM14.398 10.199l1.602 0.801-8 4-8-4 1.602-0.801 6.398 3.199z"></path>
                    </svg>
                }
                title="Today Orders"
                amount="₹0.00"
              
            />
            <StatCard
                icon={
                    <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        version="1.1"
                        viewBox="0 0 16 16"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M16 5l-8-4-8 4 8 4 8-4zM8 2.328l5.345 2.672-5.345 2.672-5.345-2.672 5.345-2.672zM14.398 7.199l1.602 0.801-8 4-8-4 1.602-0.801 6.398 3.199zM14.398 10.199l1.602 0.801-8 4-8-4 1.602-0.801 6.398 3.199z"></path>
                    </svg>
                }
                title="Yesterday Orders"
                amount="₹0.00"
               
            />
            <StatCard
                icon={
                    <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                }
                title="This Month"
                amount="₹0.00"
            />
            <StatCard
                icon={
                    <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        version="1.1"
                        viewBox="0 0 16 16"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M14.5 2h-13c-0.825 0-1.5 0.675-1.5 1.5v9c0 0.825 0.675 1.5 1.5 1.5h13c0.825 0 1.5-0.675 1.5-1.5v-9c0-0.825-0.675-1.5-1.5-1.5zM1.5 3h13c0.271 0 0.5 0.229 0.5 0.5v1.5h-14v-1.5c0-0.271 0.229-0.5 0.5-0.5zM14.5 13h-13c-0.271 0-0.5-0.229-0.5-0.5v-4.5h14v4.5c0 0.271-0.229 0.5-0.5 0.5zM2 10h1v2h-1zM4 10h1v2h-1zM6 10h1v2h-1z"></path>
                    </svg>
                }
                title="All-Time Sales"
                amount="₹4856.80"
            />
        </div>
    );
};

export default DashboardStats;
