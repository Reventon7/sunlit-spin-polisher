import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export type PolisherVariant = "Soft" | "Hard";

// Delivery remains disabled until a request destination is supplied.
export function RequestDialog({ model }: { model?: PolisherVariant }) {
  const [selected, setSelected] = useState<PolisherVariant>(model ?? "Soft");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="ph-btn">Submit a request <ArrowUpRight aria-hidden="true" /></button>
      </DialogTrigger>
      <DialogContent className="request-dialog">
        <p className="eyebrow">OTO / PRODUCT ENQUIRY</p>
        <DialogTitle className="request-title">Submit a request</DialogTitle>
        <DialogDescription>Tell us about yourself and the polisher you are interested in.</DialogDescription>
        <form className="request-form" onSubmit={(event) => event.preventDefault()}>
          <div className="request-fields">
            <label>Full name<input name="fullName" autoComplete="name" placeholder="Your full name" required /></label>
            <label>Email<input name="email" type="email" autoComplete="email" placeholder="you@practice.com" required /></label>
            <label>City<input name="city" autoComplete="address-level2" placeholder="Where you live" required /></label>
            <label>Phone <span>(optional)</span><input name="phone" type="tel" autoComplete="tel" /></label>
          </div>
        <fieldset className="model-options">
          <legend>Interested in</legend>
          {(["Soft", "Hard"] as const).map((variant) => (
            <label key={variant} className={selected === variant ? "selected" : ""}>
              <input type="radio" name="model" value={variant} checked={selected === variant} onChange={() => setSelected(variant)} />
              <span className={`model-swatch ${variant.toLowerCase()}`} />
              <span>{variant}</span>
              {selected === variant && <Check size={18} aria-hidden="true" />}
            </label>
          ))}
        </fieldset>
          <label className="request-notes">Anything we should know? <span>(optional)</span>
            <textarea name="notes" rows={3} placeholder="Tell us about your polishing needs, preferred model, or any questions." />
          </label>
          <button type="submit" className="request-submit" disabled>Submit my request</button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
