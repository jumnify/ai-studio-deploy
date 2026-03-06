import { d as defineEventHandler, g as getMethod, a as getHeader, c as createError, r as readBody } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const ____path_ = defineEventHandler(async (event) => {
  var _a;
  const method = getMethod(event);
  const path = ((_a = event.context.params) == null ? void 0 : _a.path) || "";
  const n8nBaseUrl = getHeader(event, "x-n8n-base-url");
  const n8nApiKey = getHeader(event, "x-n8n-api-key");
  if (!n8nBaseUrl || !n8nApiKey) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing x-n8n-base-url or x-n8n-api-key headers"
    });
  }
  const cleanBase = n8nBaseUrl.replace(/\/+$/, "");
  const targetUrl = `${cleanBase}/api/v1/${path}`;
  const url = new URL(event.node.req.url || "", "http://localhost");
  const queryString = url.search;
  const fullTargetUrl = `${targetUrl}${queryString}`;
  const headers = {
    "X-N8N-API-KEY": n8nApiKey,
    Accept: "application/json"
  };
  const fetchOptions = {
    method,
    headers
  };
  if (["POST", "PUT", "PATCH"].includes(method)) {
    try {
      const body = await readBody(event);
      fetchOptions.body = JSON.stringify(body);
      headers["Content-Type"] = "application/json";
    } catch {
    }
  }
  try {
    const response = await fetch(fullTargetUrl, fetchOptions);
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: response.statusText,
        data
      });
    }
    return data;
  } catch (err) {
    if (err && typeof err === "object" && "statusCode" in err) {
      throw err;
    }
    throw createError({
      statusCode: 502,
      statusMessage: `Failed to connect to N8N: ${err instanceof Error ? err.message : "Unknown error"}`
    });
  }
});

export { ____path_ as default };
//# sourceMappingURL=_...path_.mjs.map
