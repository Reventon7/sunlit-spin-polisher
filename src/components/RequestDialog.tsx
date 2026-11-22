import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export type PolisherVariant = "Soft" | "Hard";

// The remaining request fields and delivery destination await the user's form reference.
export function RequestDialog({ model }: { model?: PolisherVariant }) {
  const [selected, setSelected] = useState<PolisherVariant>(model ?? "Soft");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="ph-btn">Submit a request <ArrowUpRight aria-hidden="true" /></button>
      </DialogTrigger>
      <DialogContent className="request-dialog">
        <p className="eyebrow">OTO / PRODUCT ENQUIRY</p>
        <DialogTitle className="request-title">Your next brilliant finish.</DialogTitle>
        <DialogDescription>Select the polisher for your request.</DialogDescription>
        <fieldset className="model-options">
          <legend>Product model</legend>
          {(["Soft", "Hard"] as const).map((variant) => (
            <label key={variant} className={selected === variant ? "selected" : ""}>
              <input type="radio" name="model" value={variant} checked={selected === variant} onChange={() => setSelected(variant)} />
              <span className={`model-swatch ${variant.toLowerCase()}`} />
              <span>{variant}</span>
              {selected === variant && <Check size={18} aria-hidden="true" />}
            </label>
          ))}
        </fieldset>
      </DialogContent>
    </Dialog>
  );
}
