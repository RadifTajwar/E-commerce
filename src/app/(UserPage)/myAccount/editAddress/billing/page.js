"use client";
import BillingForm, {
  emptyBillingValues,
  validateBilling,
} from "@/components/storefront/checkout/BillingForm";
import { useState } from "react";

/**
 * Saved billing address. There is no backend endpoint for storing an address
 * yet, so the form validates but has nothing to submit to.
 */
export default function BillingAddressPage() {
  const [formState, setFormState] = useState(emptyBillingValues);
  const [errors, setErrors] = useState({});

  const handleFieldChange = (field, value) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
    setErrors((prevErrors) => {
      if (!value.trim()) return prevErrors;
      const { [field]: _removed, ...remainingErrors } = prevErrors;
      return remainingErrors;
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateBilling(formState);
    setErrors(newErrors);
    // TODO: persist the address once the backend exposes an endpoint for it.
  };

  return (
    <div className="right w-full md:w-2/3 lg:w-3/4  px-8 py-2.5">
      <div className="text mb-5">
        <p className="text-2xl txt-black">BILLING ADDRESS</p>
      </div>

      <form onSubmit={handleFormSubmit}>
        <BillingForm
          values={formState}
          errors={errors}
          onChange={handleFieldChange}
          emailLabel="Email address (optional)"
          showAdditionalInfo={false}
          idPrefix="account-billing"
        />
      </form>
    </div>
  );
}
