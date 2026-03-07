import { d as defineEventHandler } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const n8nStatus_get = defineEventHandler(async () => {
  const n8nBaseUrl = process.env.N8N_INTERNAL_URL;
  const n8nApiKey = process.env.N8N_API_KEY;
  if (!n8nBaseUrl || !n8nApiKey) {
    return {
      connected: false,
      error: "N8N_INTERNAL_URL or N8N_API_KEY not configured",
      configured: false
    };
  }
  const cleanBase = n8nBaseUrl.replace(/\/+$/, "");
  try {
    const response = await fetch(`${cleanBase}/api/v1/workflows?limit=1`, {
      method: "GET",
      headers: {
        "X-N8N-API-KEY": n8nApiKey,
        Accept: "application/json"
      }
    });
    if (response.ok) {
      const data = await response.json();
      return {
        connected: true,
        configured: true,
        workflowCount: Array.isArray(data == null ? void 0 : data.data) ? data.data.length : 0
      };
    } else {
      return {
        connected: false,
        configured: true,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }
  } catch (err) {
    return {
      connected: false,
      configured: true,
      error: err instanceof Error ? err.message : "Unknown error"
    };
  }
});

export { n8nStatus_get as default };
//# sourceMappingURL=n8n-status.get.mjs.map
