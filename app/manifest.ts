import type { MetadataRoute } from "next";
import { site } from "@/data/links";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: "Vijayaragavan",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#07090D",
    theme_color: "#07090D",
    lang: "en",
    categories: ["portfolio", "technology"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
