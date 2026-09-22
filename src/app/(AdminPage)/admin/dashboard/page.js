import DashboardStats from "@/components/ui/components/admin/dashboard/dashboardStats";
import HighestSellingProducts from "@/components/ui/components/admin/dashboard/highestSellingProducts";
import OrderStats from "@/components/ui/components/admin/dashboard/orderStats";

export default function DashboardPage() {
  return (
    <div className="max-w-4xl lg:max-w-7xl grid px-6 mx-auto">
      <div className="dashBoard">
        <h1 className="my-6 text-lg font-bold text-gray-800 ">Dashboard Overview</h1>

        <div className="orderStats">
          <OrderStats />
        </div>

        <div className="dashboardStats">
          <DashboardStats />
        </div>

        <div className="grid gap-4 md:grid-cols-2 my-8 mx-auto">
          <div className="higestSellingProducts  flex justify-center w-full">
            <HighestSellingProducts />
          </div>
        </div>
      </div>
    </div>
  );
}
