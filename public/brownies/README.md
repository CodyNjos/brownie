# Brownie images

Drop image files here — that's it. Any `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, or `.avif`.

The filename (minus the extension) becomes the brownie id + display name.
`salted-caramel.jpg` → id `salted-caramel`, shown as "Salted Caramel".

The list is regenerated automatically on every `npm run dev` and `npm run build`
by `scripts/generate-brownies.mjs`. If you add files while dev server is running,
restart it to pick them up (or run `npm run generate:brownies` manually).

Recommended size: 800x600 or similar 4:3 ratio. Optimize to keep under ~200KB each.
