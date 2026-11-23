-- Rows seeded before #11 keep "coffee (1).avif"; the seed skips a non-empty table, so fix them here.
UPDATE "Product"
SET "imageUrl" = '/images/' || regexp_replace("imageUrl", ' \((\d+)\)\.avif$', '-\1.avif')
WHERE "imageUrl" NOT LIKE '/images/%';
