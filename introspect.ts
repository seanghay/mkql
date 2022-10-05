import renderSchema from "./render-schema.js";
import { CSS, render } from "https://deno.land/x/gfm@0.1.26/mod.ts";

const Q = `
query IntrospectionQuery {
	__schema {
		
		queryType { name }
		mutationType { name }
		subscriptionType { name }
		types {
			...FullType
		}
		directives {
			name
			description
			
			locations
			args {
				...InputValue
			}
		}
	}
}

fragment FullType on __Type {
	kind
	name
	description
	
	fields(includeDeprecated: true) {
		name
		description
		args {
			...InputValue
		}
		type {
			...TypeRef
		}
		isDeprecated
		deprecationReason
	}
	inputFields {
		...InputValue
	}
	interfaces {
		...TypeRef
	}
	enumValues(includeDeprecated: true) {
		name
		description
		isDeprecated
		deprecationReason
	}
	possibleTypes {
		...TypeRef
	}
}

fragment InputValue on __InputValue {
	name
	description
	type { ...TypeRef }
	defaultValue
	
	
}

fragment TypeRef on __Type {
	kind
	name
	ofType {
		kind
		name
		ofType {
			kind
			name
			ofType {
				kind
				name
				ofType {
					kind
					name
					ofType {
						kind
						name
						ofType {
							kind
							name
							ofType {
								kind
								name
							}
						}
					}
				}
			}
		}
	}
}`;

export function createGFM(
	markdown: string,
	title: string,
	href: string,
	showHead = false,
	path = "/",
) {
	const body = render(markdown);
	const head = showHead
		? `<h4>Found URL</h4> 
	<a target="_blank" href="${href}"><code>${title}</code></a>	
	<br>`
		: "";

	return `
<!DOCTYPE html>
<html lang="en">
  <head>
		<title>mkql - ${title}</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="color-scheme" content="dark">
		<meta property="og:title" content="mkql - ${title}" />
		<meta property="og:type" content="website" />
		<meta property="og:url" content="https://mkql.deno.dev${path}" />
		<meta property="og:image" content="https://raw.githubusercontent.com/seanghay/mkql/main/mkql-og.jpg" />

		<meta name="twitter:card" content="summary_large_image">
		<meta name="twitter:site" content="@seanghay_yath">
		<meta name="twitter:creator" content="@seanghay_yath">
		<meta name="twitter:title" content="mkql - ${title}">
		<meta name="twitter:description" content="mkql - ${title}">
		<meta name="twitter:image" content="https://raw.githubusercontent.com/seanghay/mkql/main/mkql-og.jpg">

		<style>
			body {background: black;}
      main {
				max-width: 800px;
        margin: 0 auto;
				padding: 1em;
			}
      ${CSS}
			.markdown-body {
				background: black;
			}
			table{
        border-collapse: collapse; /* Remove cell spacing */
    	}
    </style>
  </head>
  <body>
    <main data-color-mode="dark" data-light-theme="light" data-dark-theme="dark" class="markdown-body">
			${head}
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
			query: Q,
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
