import { serve } from "std/http/server.ts";

function handler(_req: Request) {
  return new Response(
    JSON.stringify({ message: "Hello", }), {
      headers: {
        'content-type': 'application/json'
      }
    }
  )
}

console.log("Listening on http://localhost:8000");
serve(handler);
