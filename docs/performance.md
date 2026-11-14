# Homepage performance verification

The first hero heading and artwork render without scroll-reveal opacity gates. The hero uses an eager, high-priority native image with responsive WebP sources, retaining its dimensions and the original national-flower artwork. Below-the-fold images retain skeleton loading and lazy loading.

The 2,020,752-byte hero PNG is replaced on the homepage by 136,316-byte desktop and 54,478-byte mobile WebP files. Google Fonts CSS is no longer a render-blocking external request. Latin WOFF2 fonts are served locally with font-display: optional; slow first visits use the existing system fallback rather than waiting or causing a late font swap. Font sources and OFL licenses are in public/fonts.

One local cold-page production-build comparison using headless Edge at 1440x900, without network or CPU throttling, measured LCP at 3,392 ms before and 352 ms after. The optimized heading painted at 268 ms. These are single-run local diagnostics, not a guarantee or a reproduction of the reported 9.25-second measurement. A throttled baseline attempt timed out and is excluded from these results.

Browser checks: no page errors, loaded desktop artwork, mobile 375px document width equals viewport width, mobile source selection, visible heading with reduced motion, working carousel selection. Lint, 26 existing tests and production build pass.

After deploying, repeat multiple cold-load Lighthouse/DevTools measurements with the same device and network settings. Check the actual LCP element and layout shifts, test catalogue navigation, and measure INP using real interactions. Loading all content within 0.2 milliseconds is not achievable; field performance varies with network, caching and device capability.
