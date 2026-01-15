-- Media table for videos and stills
CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  mediaUrl TEXT NOT NULL,
  thumbnailUrl TEXT,
  type TEXT NOT NULL CHECK(type IN ('video', 'still')),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- About table
CREATE TABLE IF NOT EXISTS about (
  id INTEGER PRIMARY KEY CHECK(id = 1),
  content TEXT NOT NULL,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Initialize about with empty content
INSERT OR IGNORE INTO about (id, content) VALUES (1, '');
