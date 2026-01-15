import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

type Bindings = {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
  ADMIN_PASSWORD: string;
  SESSION_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

const authMiddleware = createMiddleware(async (c, next) => {
  const session = getCookie(c, "admin_session");
  if (!session || session !== c.env.SESSION_SECRET) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
});

app.post("/api/auth/login", async (c) => {
  const { password } = await c.req.json();
  
  if (password === c.env.ADMIN_PASSWORD) {
    setCookie(c, "admin_session", c.env.SESSION_SECRET, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 86400,
    });
    return c.json({ success: true });
  }
  
  return c.json({ error: "Invalid credentials" }, 401);
});

app.post("/api/auth/logout", (c) => {
  setCookie(c, "admin_session", "", { maxAge: 0 });
  return c.json({ success: true });
});

app.post("/api/upload", authMiddleware, async (c) => {
  const formData = await c.req.formData();
  const file = formData.get("file") as File;
  
  if (!file || file.size > 25 * 1024 * 1024) {
    return c.json({ error: "File too large or missing" }, 400);
  }
  
  const key = `${Date.now()}-${file.name}`;
  await c.env.MEDIA_BUCKET.put(key, file.stream());
  
  return c.json({ url: `/media/${key}` });
});

app.get("/api/videos", async (c) => {
  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM media WHERE type = 'video' ORDER BY createdAt DESC").all();
    return c.json(results || []);
  } catch (e) {
    return c.json([]);
  }
});

app.post("/api/videos", authMiddleware, async (c) => {
  const formData = await c.req.formData();
  const file = formData.get("file") as File;
  const thumbnail = formData.get("thumbnail") as File;
  
  const mediaKey = `${Date.now()}-${file.name}`;
  await c.env.MEDIA_BUCKET.put(mediaKey, file.stream());
  
  let thumbnailUrl = null;
  if (thumbnail) {
    const thumbKey = `${Date.now()}-${thumbnail.name}`;
    await c.env.MEDIA_BUCKET.put(thumbKey, thumbnail.stream());
    thumbnailUrl = `/media/${thumbKey}`;
  }
  
  await c.env.DB.prepare(
    "INSERT INTO media (title, description, mediaUrl, thumbnailUrl, type) VALUES (?, ?, ?, ?, 'video')"
  ).bind(
    formData.get("title"),
    formData.get("description"),
    `/media/${mediaKey}`,
    thumbnailUrl
  ).run();
  
  return c.json({ success: true });
});

app.delete("/api/videos/:id", authMiddleware, async (c) => {
  await c.env.DB.prepare("DELETE FROM media WHERE id = ?").bind(c.req.param("id")).run();
  return c.json({ success: true });
});

app.get("/api/stills", async (c) => {
  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM media WHERE type = 'still' ORDER BY createdAt DESC").all();
    return c.json(results || []);
  } catch (e) {
    return c.json([]);
  }
});

app.post("/api/stills", authMiddleware, async (c) => {
  const formData = await c.req.formData();
  const file = formData.get("file") as File;
  
  const mediaKey = `${Date.now()}-${file.name}`;
  await c.env.MEDIA_BUCKET.put(mediaKey, file.stream());
  
  await c.env.DB.prepare(
    "INSERT INTO media (title, description, mediaUrl, type) VALUES (?, ?, ?, 'still')"
  ).bind(
    formData.get("title"),
    formData.get("description"),
    `/media/${mediaKey}`
  ).run();
  
  return c.json({ success: true });
});

app.delete("/api/stills/:id", authMiddleware, async (c) => {
  await c.env.DB.prepare("DELETE FROM media WHERE id = ?").bind(c.req.param("id")).run();
  return c.json({ success: true });
});

app.get("/api/announcements", async (c) => {
  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM announcements ORDER BY createdAt DESC").all();
    return c.json(results || []);
  } catch (e) {
    return c.json([]);
  }
});

app.post("/api/announcements", authMiddleware, async (c) => {
  const { title, content } = await c.req.json();
  await c.env.DB.prepare("INSERT INTO announcements (title, content) VALUES (?, ?)").bind(title, content).run();
  return c.json({ success: true });
});

app.delete("/api/announcements/:id", authMiddleware, async (c) => {
  await c.env.DB.prepare("DELETE FROM announcements WHERE id = ?").bind(c.req.param("id")).run();
  return c.json({ success: true });
});

app.get("/api/about", async (c) => {
  try {
    const result = await c.env.DB.prepare("SELECT content FROM about LIMIT 1").first();
    return c.json(result || { content: "" });
  } catch (e) {
    return c.json({ content: "" });
  }
});

app.post("/api/about", authMiddleware, async (c) => {
  const { content } = await c.req.json();
  await c.env.DB.prepare("UPDATE about SET content = ?, updatedAt = CURRENT_TIMESTAMP").bind(content).run();
  return c.json({ success: true });
});

app.post("/api/bgvideo", authMiddleware, async (c) => {
  const formData = await c.req.formData();
  const file = formData.get("file") as File;
  
  if (!file || file.size > 100 * 1024 * 1024) {
    return c.json({ error: "File too large or missing" }, 400);
  }
  
  await c.env.MEDIA_BUCKET.put("bg.mp4", file.stream());
  
  return c.json({ success: true });
});

app.get("/media/:key", async (c) => {
  const object = await c.env.MEDIA_BUCKET.get(c.req.param("key"));
  if (!object) return c.notFound();
  
  return new Response(object.body, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType || "application/octet-stream",
    },
  });
});

export default app;
