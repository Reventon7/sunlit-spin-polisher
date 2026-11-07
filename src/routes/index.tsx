import { createFileRoute } from "@tanstack/react-router";
import { PolisherHero } from "@/components/PolisherHero";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TCP543204M Spiral Polisher — OTO" },
      {
        name: "description",
        content:
          "A 3D spiral dental polisher spins slowly through a warm sky while huge words wrap around it as you scroll.",
      },
      { property: "og:title", content: "TCP543204M Spiral Polisher — OTO" },
      {
        property: "og:description",
        content: "Medium grit spiral polisher, Ø 12.7 x 0.6 mm on a 204-RA shank.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <PolisherHero />;
}
