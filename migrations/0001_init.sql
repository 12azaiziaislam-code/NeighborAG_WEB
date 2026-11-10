-- NeighborAGI_WEB database (Cloudflare D1 / SQLite).
--
-- An account IS the per-user key: it is bound to the one device it was first used on, and the admin controls
-- for how long it may use the program. All times are epoch milliseconds.

CREATE TABLE IF NOT EXISTS users (
  id              TEXT PRIMARY KEY,                 -- uuid
  email           TEXT NOT NULL UNIQUE COLLATE NOCASE,
  username        TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash   TEXT NOT NULL,                    -- "pbkdf2$<iter>$<salt_b64>$<hash_b64>"
  created_at      INTEGER NOT NULL,
  signup_ip       TEXT,
  signup_country  TEXT,                             -- from Cloudflare request.cf
  signup_city     TEXT,
  device_id       TEXT,                             -- the bound device fingerprint (NULL until the app's first login)
  device_name     TEXT,                             -- e.g. "DESKTOP-ABC"
  device_bound_at INTEGER,
  activated_until INTEGER,                          -- the program may be used until this time (NULL = not activated)
  banned_until    INTEGER,                          -- NULL = not banned; a time, or 4102444800000 (~year 2100) for "forever"
  last_login_at   INTEGER,
  is_admin        INTEGER NOT NULL DEFAULT 0
);

-- Login tokens, for the website ('web'), the desktop program ('app') and the admin panel ('admin').
-- No FK on user_id: the admin session uses a sentinel id ('__admin__') that is not a real user, and
-- sessions are ephemeral anyway. A user's sessions are removed explicitly when the account is deleted.
CREATE TABLE IF NOT EXISTS sessions (
  token       TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  kind        TEXT NOT NULL DEFAULT 'web',
  created_at  INTEGER NOT NULL,
  expires_at  INTEGER NOT NULL
);

-- The support thread between a user and the admin. An admin message is also the user's in-app notification.
CREATE TABLE IF NOT EXISTS support_messages (
  id            TEXT PRIMARY KEY,
  user_id       TEXT NOT NULL,
  sender        TEXT NOT NULL,                      -- 'user' or 'admin'
  body          TEXT,
  image_key     TEXT,                               -- R2 object key when an image was attached
  created_at    INTEGER NOT NULL,
  read_by_user  INTEGER NOT NULL DEFAULT 0,
  read_by_admin INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user  ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_exp   ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_support_user   ON support_messages(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_users_device   ON users(device_id);
