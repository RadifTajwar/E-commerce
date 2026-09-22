"use client";

import SearchIcon from "@mui/icons-material/Search";
import { useMemo, useState } from "react";
import { DISTRICTS, PHONE_LENGTH, ZIP_LENGTH } from "@/config/constants";

/**
 * The billing / shipping address fields. Used by the checkout page and by
 * /myAccount/editAddress/billing, which used to hold a verbatim copy.
 */

export interface BillingFormValues {
  name: string;
  address: string;
  district: string;
  phone: string;
  email: string;
  additionalInfo: string;
  zip: string;
}

export type BillingFormErrors = Partial<Record<keyof BillingFormValues, string>>;

export const emptyBillingValues: BillingFormValues = {
  name: "",
  address: "",
  district: "",
  phone: "",
  email: "",
  additionalInfo: "",
  zip: "",
};

/** Validation messages are shown to Bengali-speaking customers; keep them verbatim. */
export function validateBilling(values: BillingFormValues): BillingFormErrors {
  const errors: BillingFormErrors = {};
  if (!values.name.trim()) errors.name = "Billing Full Name(আপনার সম্পূর্ণ নাম) is a required field";
  if (!values.address.trim()) errors.address = "Full Address (আপনার সম্পূর্ণ ঠিকানা লিখুন) is a required field.";
  if (!values.district.trim()) errors.district = "District (জেলা)  is a required field.";
  if (!values.phone.trim()) {
    errors.phone = "Phone (আপনার ফোন নাম্বারটি লিখুন) is a required field.";
  } else if (values.phone.length !== PHONE_LENGTH) {
    errors.phone = "Phone (আপনার ফোন নাম্বারটি লিখুন) must be 11 digits";
  }
  if (!values.zip.trim()) {
    errors.zip = "Zip Code (আপনার পোষ্টকোড) is a required field.";
  } else if (values.zip.length !== ZIP_LENGTH) {
    errors.zip = "Zip Code (আপনার পোষ্টকোড) must be 4 digits";
  }
  if (!values.email.trim()) errors.email = "Email address is a required field.";
  return errors;
}

interface BillingFormProps {
  values: BillingFormValues;
  errors: BillingFormErrors;
  onChange: (field: keyof BillingFormValues, value: string) => void;
  /** Checkout asks for "Email address Or Phone Number"; the account page words it differently. */
  emailLabel?: string;
  /** The account page has no order notes box. */
  showAdditionalInfo?: boolean;
  /** Prefix for input ids so two forms on one page cannot collide. */
  idPrefix?: string;
}

const fieldClass = (hasError: boolean) =>
  `border-2 px-4 py-2 placeholder:text-sm focus:outline-none mt-1 block w-full shadow-sm sm:text-sm ${
    hasError ? "border-red-500" : "border-gray-200"
  }`;

export default function BillingForm({
  values,
  errors,
  onChange,
  emailLabel = "Email address Or Phone Number",
  showAdditionalInfo = true,
  idPrefix = "billing",
}: BillingFormProps) {
  const [showDistrictOption, setShowDistrictOption] = useState(false);
  const [districtSearch, setDistrictSearch] = useState("");

  const filteredDistricts = useMemo(
    () => DISTRICTS.filter((district) => district.toLowerCase().includes(districtSearch.toLowerCase())),
    [districtSearch],
  );

  const id = (field: string) => `${idPrefix}-${field}`;

  const handleDistrictSelect = (district: string) => {
    onChange("district", district);
    setDistrictSearch("");
    setShowDistrictOption(false);
  };

  return (
    <div className="name_address_district_phone_email_&_additionalInformation">
      <div className="w-1/2 pb-5">
        <label htmlFor={id("name")} className="block text-sm font-normal text-gray-700 pb-1">
          Full Name (আপনার সম্পূর্ণ নাম) <span className="text-sm text-red-600">*</span>
        </label>
        <input
          type="text"
          id={id("name")}
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
          className={fieldClass(Boolean(errors.name))}
        />
      </div>

      <div className="w-full pb-5">
        <label htmlFor={id("address")} className="block text-sm font-normal text-gray-700 pb-1">
          Full Address (আপনার সম্পূর্ণ ঠিকানা লিখুন) <span className="text-sm text-red-600">*</span>
        </label>
        <input
          type="text"
          id={id("address")}
          value={values.address}
          onChange={(e) => onChange("address", e.target.value)}
          className={fieldClass(Boolean(errors.address))}
        />
      </div>

      <div className="w-full pb-5">
        <label htmlFor={id("district")} className="block text-sm font-normal text-gray-700 pb-1">
          District (জেলা) <span className="text-sm text-red-600">*</span>
        </label>
        <div className="relative">
          <div className={fieldClass(Boolean(errors.district))}>
            <button
              type="button"
              id={id("district")}
              className="w-full text-left flex justify-between items-center focus:outline-none"
              onClick={() => setShowDistrictOption(!showDistrictOption)}
            >
              {values.district || "Select District"}
              <svg
                className={`w-4 h-4 ml-2 ${showDistrictOption ? "rotate-180" : "rotate-0"}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {showDistrictOption && (
            <div className="absolute z-10 left-0 right-0 bg-white border-2 shadow-md">
              <div className="relative w-full p-4 bg-gray-200">
                <input
                  type="text"
                  placeholder="Search District"
                  value={districtSearch}
                  onChange={(e) => setDistrictSearch(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 focus:outline-none text-sm"
                />
                <SearchIcon className="absolute right-7 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
              </div>
              <ul className="max-h-[200px] overflow-scroll">
                {filteredDistricts.length > 0 ? (
                  filteredDistricts.map((district) => (
                    <li
                      key={district}
                      onClick={() => handleDistrictSelect(district)}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-700 hover:text-white text-sm"
                    >
                      {district}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-sm text-gray-500">No results found</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="sm:flex sm:space-x-4">
        <div className="w-full sm:w-1/2 pb-5">
          <label htmlFor={id("phone")} className="block text-sm font-normal text-gray-700 pb-1">
            Phone (আপনার ফোন নাম্বারটি লিখুন) <span className="text-sm text-red-600">*</span>
          </label>
          <input
            type="tel"
            id={id("phone")}
            value={values.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className={fieldClass(Boolean(errors.phone))}
          />
        </div>
        <div className="w-full sm:w-1/2 pb-5">
          <label htmlFor={id("zip")} className="block text-sm font-normal text-gray-700 pb-1">
            Zip Code (আপনার পোষ্টকোড) <span className="text-sm text-red-600">*</span>
          </label>
          <input
            type="text"
            id={id("zip")}
            value={values.zip}
            onChange={(e) => onChange("zip", e.target.value)}
            className={fieldClass(Boolean(errors.zip))}
          />
        </div>
      </div>

      <div className="w-full pb-5">
        <label htmlFor={id("email")} className="block text-sm font-normal text-gray-700 pb-1">
          {emailLabel} <span className="text-sm text-red-600">*</span>
        </label>
        <input
          type="text"
          id={id("email")}
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
          className={fieldClass(Boolean(errors.email))}
        />
      </div>

      {showAdditionalInfo && (
        <div className="w-full pb-5">
          <label htmlFor={id("additionalInfo")} className="block text-sm font-normal text-gray-700 pb-1">
            Additional Information
          </label>
          <textarea
            id={id("additionalInfo")}
            rows={3}
            value={values.additionalInfo}
            onChange={(e) => onChange("additionalInfo", e.target.value)}
            className="border-2 border-gray-200 px-4 py-2 focus:outline-none mt-1 block w-full shadow-sm sm:text-sm resize-none"
            placeholder="Notes about your order, e.g. special notes for delivery."
          ></textarea>
        </div>
      )}
    </div>
  );
}
