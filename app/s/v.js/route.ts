// Umami's tracker served from rapto.app: blocker lists block the umami.is domains, not this site
export const runtime = "edge";

export async function GET() {
  const upstream = await fetch("https://cloud.umami.is/script.js");
  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
