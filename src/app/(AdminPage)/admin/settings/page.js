"use client";
import { Button, Card, CardBody, Field, Input, PageHeader, Select } from "@/components/admin/ui";
import { notify } from "@/lib/toast";

/**
 * Store settings.
 *
 * These are not persisted anywhere yet — there is no settings endpoint on the
 * backend. The form is honest about that rather than pretending to save.
 */
const FIELDS = [
  { name: "company_name", label: "Company name", type: "text", placeholder: "Leather For Luxury" },
  { name: "email", label: "Email", type: "email", placeholder: "store@example.com" },
  { name: "contact", label: "Contact number", type: "text", placeholder: "01700000000" },
  { name: "website", label: "Website", type: "text", placeholder: "https://…" },
  { name: "address", label: "Address", type: "text", placeholder: "Street, city" },
  { name: "post_code", label: "Post code", type: "text", placeholder: "1207" },
];

export default function SettingsPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    notify.info("Settings are not saved yet — there is no settings endpoint on the backend.");
  };

  return (
    <>
      <PageHeader title="Settings" description="Store details used on invoices and receipts." />

      <Card className="min-h-0 max-w-3xl flex-1 overflow-auto">
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {FIELDS.map((field) => (
                <Field key={field.name} label={field.label} htmlFor={field.name}>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    autoComplete="off"
                  />
                </Field>
              ))}

              <Field
                label="Images per product"
                htmlFor="number_of_image_per_product"
                hint="How many images the product form accepts."
              >
                <Input
                  id="number_of_image_per_product"
                  name="number_of_image_per_product"
                  type="number"
                  min="1"
                  defaultValue="4"
                />
              </Field>

              <Field label="Receipt width" htmlFor="receipt_size">
                <Select id="receipt_size" name="receipt_size" defaultValue="A4">
                  <option value="57-mm">57 mm</option>
                  <option value="80-mm">80 mm</option>
                  <option value="3-1/8">3 1/8&quot;</option>
                  <option value="2-1/4">2 1/4&quot;</option>
                  <option value="A4">A4</option>
                </Select>
              </Field>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-5 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Not connected to the backend yet.
              </p>
              <Button type="submit">Save settings</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
}
