import Link from "next/link";

/**
 * Saved addresses. Address storage is not wired to the backend yet; this page
 * only links to the billing form.
 */
export default function EditAddressPage() {
  return (
    <div className="right w-full md:w-2/3 lg:w-3/4  px-8 py-2.5">
      <div className="upper_text">
        <p className="text-gray-500 text-sm mb-5">
          The following addresses will be used on the checkout page by default.
        </p>
      </div>
      <div className="text mb-5 ">
        <Link href="/myAccount/editAddress/billing">
          <p className="text-2xl txt-black">
            BILLING ADDRESS <span className="text-xs cursor-pointer font-medium">Edit</span>
          </p>
        </Link>
      </div>
      <div className="details mb-5 text-sm space-y-2">
        <p className="text-gray-700">You have not set up this type of address yet.</p>
      </div>
    </div>
  );
}
