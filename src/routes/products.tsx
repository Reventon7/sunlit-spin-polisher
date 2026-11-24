import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { ProductPreview } from "@/components/ProductPreview";
import { RequestDialog } from "@/components/RequestDialog";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/products")({
  head: () => ({ meta: [{ title: "Soft & Hard Spiral Polishers — OTO" }, { name: "description", content: "Explore OTO spiral polishers in Soft and Hard variants." }] }),
  component: Products,
});

function Products() {
  return <div className="products-page">
    <header className="products-header">
      <Link to="/" aria-label="OTO home"><Logo /></Link>
      <nav aria-label="Main"><Link to="/products" aria-current="page">Products</Link><a href="#ph-foot">Contact</a></nav>
    </header>
    <main className="products-main">
      <div className="products-intro"><p className="eyebrow">THE OTO COLLECTION / 01—02</p>
        <h1>Two shades.<br /><span>One brilliant finish.</span></h1>
        <p className="products-lede">Meet our spiral polishers. Choose your model.</p>
      </div>
      <div className="product-grid">
        {(["Soft", "Hard"] as const).map((variant) => <article className="product-card" key={variant}>
          <ProductPreview variant={variant} />
          <div className="product-details"><div><h2>{variant}</h2><p>{variant === "Soft" ? "Light olive finish" : "Dark charcoal finish"}</p></div>
          <RequestDialog model={variant} /></div>
        </article>)}
      </div>
    </main>
    <SiteFooter />
  </div>;
}
