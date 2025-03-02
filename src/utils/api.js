/**
 * Makes an API call through the proxy
 * @param {string} method - The API method/path to call
 * @param {string} httpMethod - HTTP method (GET, POST, etc.)
 * @param {object} [data] - Optional request body for POST requests
 * @returns {Promise<any>} The parsed response data
 */
export async function callProxy(method, httpMethod = "GET", data = null) {
  const proxyUrl = `${
    process.env.NEXT_PUBLIC_PROXY_URL || "http://localhost:8080"
  }/${method}`;

  const options = {
    method: httpMethod,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data && httpMethod === "POST") {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(proxyUrl, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
