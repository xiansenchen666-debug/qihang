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

/**
 * 处理静态文件请求 (.html)
 */
async function serveStaticFile(req: Request): Promise<Response> {
  const url = new URL(req.url);
  
  // 默认首页
  let filePath = url.pathname;
  if (filePath === "/" || filePath === "") {
    filePath = "/index.html";
  }

  // 限制仅允许访问根目录下的 .html 文件，增强安全性
  if (filePath.endsWith(".html") && !filePath.includes("..")) {
    try {
      const file = await Deno.readFile("." + filePath);
      const headers = new Headers(SECURITY_HEADERS);
      headers.set("Content-Type", "text/html; charset=utf-8");
      
      return new Response(file, { status: 200, headers });
    } catch (e) {
      console.error(`Failed to read ${filePath}:`, e);
      return new Response(`Internal Server Error - Missing ${filePath}`, { status: 404 });
    }
  }

  // 其他路径返回 404
  return new Response("Not Found", { status: 404 });
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
      return new Response(JSON.stringify({ error: "姓名和电话是必填项" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 在实际生产环境中，此处可以集成发送邮件或存入数据库逻辑
    console.log(`[New Consult Request] Name: ${data.name}, Phone: ${data.phone}, Target: ${data.targetCountry}, Intent: ${data.projectIntent}`);

    return new Response(JSON.stringify({ success: true, message: "Consultation received successfully." }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error processing request:", error);
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