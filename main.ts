// main.ts
// Deno High-Performance Server for Qihang Consulting

/**
 * 接口：规范留学意向咨询数据
 */
interface ConsultRequest {
  name: string;
  phone: string;
  targetCountry: string;
  projectIntent: string;
}

/**
 * 安全响应头 (Security Headers)
 * 体现专业金融级安全性
 */
const SECURITY_HEADERS = new Headers({
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  // 内容安全策略 (CSP) 允许 Tailwind CDN, Lucide Icons, Google Fonts 等必需资源
  "Content-Security-Policy": 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://unpkg.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com data:; " +
    "img-src 'self' data: https://images.unsplash.com; " +
    "connect-src 'self';",
});

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".ico": "image/x-icon"
};

/**
 * 日志记录工具
 * 将日志带上时间戳并追加到 server.log 文件中
 */
async function appendLog(message: string) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  try {
    await Deno.writeTextFile("./server.log", logEntry, { append: true });
    // 同时在控制台输出
    console.log(`[${timestamp}] ${message}`);
  } catch (error) {
    console.error("Failed to write to log file:", error);
  }
}

/**
 * 处理静态文件请求
 */
async function serveStaticFile(req: Request): Promise<Response> {
  const url = new URL(req.url);
  let pathname = url.pathname;

  // 1. 强制无后缀路由：重定向 .html 结尾的请求到无后缀路径 (index.html 重定向到 /)
  if (pathname.endsWith(".html")) {
    const cleanPath = pathname === "/index.html" ? "/" : pathname.slice(0, -5);
    return new Response(null, {
      status: 301,
      headers: { "Location": cleanPath }
    });
  }

  // 2. 移除末尾的斜杠 (例如 /about/ -> /about)
  if (pathname !== "/" && pathname.endsWith("/")) {
    return new Response(null, {
      status: 301,
      headers: { "Location": pathname.slice(0, -1) }
    });
  }

  // 3. 映射到本地文件路径
  let filePath = pathname;
  if (filePath === "/" || filePath === "") {
    filePath = "/index.html";
  } else if (!filePath.includes(".")) {
    // 无后缀路由：追加 .html 以在文件系统中查找
    filePath += ".html";
  }

  // 防止路径遍历攻击
  if (filePath.includes("..")) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const file = await Deno.readFile("." + filePath);
    const headers = new Headers(SECURITY_HEADERS);
    
    // 根据扩展名设置 Content-Type
    const ext = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    headers.set("Content-Type", contentType);
    
    return new Response(file, { status: 200, headers });
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      return new Response("Not Found", { status: 404 });
    }
    console.error(`Failed to read ${filePath}:`, e);
    return new Response(`Internal Server Error`, { status: 500 });
  }
}

/**
 * 处理 API 咨询请求
 */
async function handleConsultAPI(req: Request): Promise<Response> {
  // 只允许 POST 请求
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const data: ConsultRequest = await req.json();

    // 基础验证
    if (!data.name || !data.phone) {
      await appendLog(`[Error] Validation failed - Name: ${data.name}, Phone: ${data.phone}`);
      return new Response(JSON.stringify({ error: "姓名和电话是必填项" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 记录到本地日志文件
    await appendLog(`[New Consult Request] Name: ${data.name}, Phone: ${data.phone}, Target: ${data.targetCountry}, Intent: ${data.projectIntent}`);

    return new Response(JSON.stringify({ success: true, message: "Consultation received successfully." }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    await appendLog(`[Error] processing request: ${error}`);
    return new Response(JSON.stringify({ error: "无效的请求数据格式" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}

/**
 * Deno 服务器核心请求处理
 */
Deno.serve(async (req: Request) => {
  const url = new URL(req.url);

  // 路由分发
  if (url.pathname.startsWith("/api/consult")) {
    const response = await handleConsultAPI(req);
    // 注入安全头
    SECURITY_HEADERS.forEach((value, key) => response.headers.set(key, value));
    return response;
  }

  // 静态页面服务
  return serveStaticFile(req);
});

console.log("Server is running. Access it at http://localhost:8000/");