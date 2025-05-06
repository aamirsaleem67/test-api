export function onRequest(context) {
  return new Response(JSON.stringify({
    message: "Hello from muhammad-aamir.com API!",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  }), {
    headers: {
      "Content-Type": "application/json"
    }
  });
} 