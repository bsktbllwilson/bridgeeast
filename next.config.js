/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Typekit (`use.typekit.net/cub1hgl.css`) is host-locked, so Next's build-time
  // stylesheet inlining hits a 403 ("Host not in allowlist") and prints a noisy
  // warning. Disable so the <link> ships untouched and the browser fetches it
  // from the (allowlisted) production domain at runtime.
  optimizeFonts: false,
}

module.exports = nextConfig
