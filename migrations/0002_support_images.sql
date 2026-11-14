-- Support-chat image attachments kept in D1 when no R2 bucket is bound, so attachments work out of the box.
-- Images are compressed in the browser before upload (resized + JPEG), so a row is tens of KB, not megabytes.
CREATE TABLE IF NOT EXISTS support_images (
  key          TEXT PRIMARY KEY,
  content_type TEXT NOT NULL,
  data         TEXT NOT NULL,       -- base64 of the (already compressed) image bytes
  created_at   INTEGER NOT NULL
);
