# Featured flower artwork

The four homepage category images are AI-generated editorial botanical artwork,
created with the built-in imagegen tool. They illustrate categories, rather than
documenting a particular Sri Lankan farm, actual listing, or cultivar.

Delivered assets: `public/images/featured-{rose,orchid,anthurium,sunflower}-{360,720,1080}.webp`.
Each has a 4:5 portrait ratio; the existing card crops handle square mobile cards.
Responsive sources, lazy loading and asynchronous decoding keep the new artwork
out of the homepage's initial critical image path. Existing third-party images and
their license notices are retained for their other uses.

## Final generation prompts

Shared prompt, followed by each subject below:

> Use case: photorealistic-natural. Asset type: premium botanical website category card. Create a high-resolution portrait 4:5 editorial macro photograph, natural believable botanical details, softly diffused morning light, refined contemporary garden photography, rich but natural colors, crisp flower detail against softly blurred deep green foliage. Central flower fills 65% of frame, fully visible with breathing room for portrait and square crops. No text, borders, logos, watermarks, people, collage or graphic overlays. Subject:

- Rose: a lush coral pink garden rose with many layered petals, a second subtle bud and natural rose leaves
- Orchid: an elegant spray of fresh white and pale lilac Phalaenopsis orchids with realistic yellow-magenta centers on a gently curved stem
- Anthurium: two glossy red and blush coral anthurium spathes with realistic pale cream spadices and sculptural heart shaped dark green leaves
- Sunflower: one radiant golden yellow sunflower with a detailed dark seed center, slightly angled towards the camera, natural green leaves
