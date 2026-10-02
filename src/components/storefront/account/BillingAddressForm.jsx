"use client";

import BillingForm, {
  emptyBillingValues,
  validateBilling,
} from "@/components/storefront/checkout/BillingForm";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Saved billing address.
 *
 * The upstream keeps one address per user on the account itself, so the
 * district and zip are packed into `location` and the street into
 * `shippingAddress`. Email is shown read-only: changing it would orphan the
 * verification state, so that belongs on the account page.
 */
/**
 * @param {{ initialAddress?: import("@/server/account").SavedAddress | null }} props
 *   `initialAddress` is read on the server, so the saved values are in the
 *   first paint instead of appearing after a client round trip.
 */
export default function BillingAddressForm({ initialAddress }) {
  const router = useRouter();
  const [formState, setFormState] = useState({ ...emptyBillingValues, ...(initialAddress ?? {}) });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // { type: "ok" | "error", text }

  const handleFieldChange = (field, value) => {
    setStatus(null);
    setFormState((prevState) => ({ ...prevState, [field]: value }));
    setErrors((prevErrors) => {
      if (!value.trim()) return prevErrors;
      const { [field]: _removed, ...remainingErrors } = prevErrors;
      return remainingErrors;
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateBilling(formState);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setStatus({ type: "error", text: "Please correct the highlighted fields." });
      return;
    }

    setSaving(true);
    setStatus(null);
    try {
      await authService.updateProfile({
        name: formState.name,
        phone: formState.phone,
        shippingAddress: formState.address,
        location: `${formState.district}|${formState.zip}`,
      });
      setStatus({ type: "ok", text: "Your billing address has been saved." });
      // So the addresses page and checkout see it without a hard reload.
      router.refresh();
    } catch (err) {
      setStatus({ type: "error", text: err?.message || "Could not save your address." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="right w-full md:w-2/3 lg:w-3/4 px-4 sm:px-8 py-2.5">
      <div className="text mb-5">
        <p className="text-2xl txt-black">BILLING ADDRESS</p>
      </div>

      <form onSubmit={handleFormSubmit}>
          <BillingForm
            values={formState}
            errors={errors}
            onChange={handleFieldChange}
            emailLabel="Email address"
            showAdditionalInfo={false}
            idPrefix="account-billing"
          />

          {status && (
            <p
              className={`mt-5 text-sm ${
                status.type === "ok" ? "text-green-700" : "text-red-600"
              }`}
            >
              {status.text}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="mt-6 rounded-md bg-gray-900 px-10 py-3.5 text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? "SAVING…" : "SAVE ADDRESS"}
          </button>
      </form>
    </div>
  );
}
