import { serve } from "std/http/server.ts";
import { introspectAsMarkdown, createGFM } from "./introspect.ts";

// const CACHE = await caches.open("v2");

function isURL(url?: string) {
	if (typeof url !== "string") {
		return false;
	}
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

async function handler(req: Request) {
	// const res = await CACHE.match(req);
	// if (res) {
	// 	res.headers.set("x-cache-hit", "true");
	// 	return res;
	// }
  
	const url = new URL(req.url);
	let graphqlUrl = url.searchParams.get("url") as string;

	if (!graphqlUrl) {
		return new Response("Not found", {
			headers: {
				"content-type": "text/plain",
			},
		});
	}

	if (!graphqlUrl.startsWith("http://") && !graphqlUrl.startsWith("https://")) {
		graphqlUrl = "https://" + graphqlUrl;
	}

	if (!isURL(graphqlUrl)) {
		return new Response("Not found", {
			headers: {
				"content-type": "text/plain",
			},
		});
	}

	const html = createGFM(await introspectAsMarkdown(graphqlUrl));
	const response = new Response(html, {
		headers: {
			"content-type": "text/html; charset=UTF-8",
		},
	});

	// await CACHE.put(req, response.clone());
	
  return response;
}

console.log("Listening on http://localhost:8000");
serve(handler);
