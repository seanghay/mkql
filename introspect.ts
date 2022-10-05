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
}`

export function createGFM(markdown: string, title: string, showHead: boolean = false) {
	const body = render(markdown);
	const head = showHead ? `<h4>Found URL</h4> 
	<a target="_blank" href="${title}"><code>${title}</code></a>	
	<br>` : ''

	return `
<!DOCTYPE html>
<html lang="en">
  <head>
		<title>GraphQL Markdown - ${title}</title>
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
