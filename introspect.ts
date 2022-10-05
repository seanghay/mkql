import renderSchema from "./render-schema.js";
import graphql from "npm:graphql";
import { CSS, render } from "https://deno.land/x/gfm@0.1.26/mod.ts";

export function createGFM(markdown: string) {
	const body = render(markdown);
	return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      main {
        max-width: 800px;
        margin: 0 auto;
				padding: 1em;
			}
      ${CSS}
    </style>
  </head>
  <body>
    <main data-color-mode="light" data-light-theme="light" data-dark-theme="dark" class="markdown-body">
      ${body}
    </main>
  </body>
</html>
`;
}

export async function introspectAsMarkdown(url: string) {
	const response = await fetch(url, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: graphql.getIntrospectionQuery(),
		}),
	});
	const { data: schema } = await response.json();
	let markdown = "";
  renderSchema(schema, {
		printer: (value: string) => {
			markdown += value + "\n";
		},
	});
	return markdown;
}
