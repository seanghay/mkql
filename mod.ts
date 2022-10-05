import { serve } from "std/http/server.ts";
import { createGFM, introspectAsMarkdown } from "./introspect.ts";

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

function notFound() {
  return new Response("[404] Not found", {
    status: 404,
    headers: {
      "content-type": "text/plain;",
    },
  });
}

async function homePage() {
	const readmeFile = new URL("./readme.md", import.meta.url);
	const content = await Deno.readTextFile(readmeFile);
	return new Response(createGFM(content, "An instant GraphQL doc viewer", false), { 
		headers: {
			'content-type': "text/html; charset=UTF-8"
		}
	})
}

async function handler(req: Request) {
	const url = new URL(req.url);

	if (req.method === "GET" && url.pathname === "/favicon.ico") {
		return notFound()
	}

	let graphqlUrl = url.searchParams.get("url") as string;

	if (!graphqlUrl && req.method === "GET" && url.pathname === "/") {
		return homePage();
	}


  const regex = /^\/([\w\.]+)\/?(.+)?/;
  const matches = regex.exec(url.pathname);
  
  if (matches) {
    const hostname = matches[1];
    const path = matches[2] ?? "graphql";
    graphqlUrl = `https://${hostname}/${path}`;
  }

	if (!graphqlUrl) {
    return notFound()
	}

	if (!graphqlUrl.startsWith("http://") && !graphqlUrl.startsWith("https://")) {
		graphqlUrl = "https://" + graphqlUrl;
	}

	if (!isURL(graphqlUrl)) {
    return notFound()
	}

	try {
		const html = createGFM(await introspectAsMarkdown(graphqlUrl), graphqlUrl, false, url.pathname);
		const response = new Response(html, {
			headers: {
				"content-type": "text/html; charset=UTF-8",
				"cache-control": "max-age=3600",
			},
		});
		return response;
	} catch {
    return notFound()
	}
}

console.log("Listening on http://localhost:8000");
serve(handler);
