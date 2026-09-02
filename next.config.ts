import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All photography is loaded from the Pexels CDN and centralised in
    // lib/images.ts (Pexels licence: free commercial use, no attribution).
    // To ship Tejbidya's own photography, swap the URLs there — or drop files
    // into /public/img and change the entries to local paths, then delete this
    // remotePatterns entry. No component needs to change either way.
    remotePatterns: [{ protocol: "https", hostname: "images.pexels.com" }],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400, // 31 days — the stock photos never change.
  },

  /**
   * Permanent redirects from the previous WordPress/WooCommerce URLs, so the
   * old pages keep their search equity instead of turning into 404s.
   *
   * `/product/black-tea-2` is a confirmed old URL. The remaining `/product/*`
   * paths are sent to the collection rather than guessed at individually —
   * add exact mappings above the catch-all as old slugs are confirmed.
   */
  async redirects() {
    return [
      { source: "/product/black-tea-2", destination: "/teas/black-tea", permanent: true },
      { source: "/product/black-tea", destination: "/teas/black-tea", permanent: true },
      { source: "/product/green-tea", destination: "/teas/green-tea", permanent: true },
      { source: "/product/white-tea", destination: "/teas/white-tea", permanent: true },
      { source: "/product/oolong-tea", destination: "/teas/oolong-tea", permanent: true },
      { source: "/product/masala-chai", destination: "/teas/masala-chai", permanent: true },
      { source: "/product/:slug*", destination: "/teas", permanent: true },
      { source: "/shop", destination: "/teas", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/our-products", destination: "/teas", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
