// Umami tracker data, forwarded with the visitor's IP and browser so location and bot detection stay correct
export const runtime = "edge";

export async function POST(request: Request) {
  const ip = request.headers.get("cf-connecting-ip") ?? "";
  const upstream = await fetch("https://gateway.umami.is/api/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": request.headers.get("user-agent") ?? "",
      "Accept-Language": request.headers.get("accept-language") ?? "",
      "X-Client-IP": ip,
      "X-Forwarded-For": ip,
    },
    body: await request.text(),
  });
  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
