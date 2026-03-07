import { d as defineEventHandler, c as createError, s as setHeader } from '../../../nitro/nitro.mjs';
import { f as fileExists, g as getFile } from '../../../_/storage.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@aws-sdk/client-s3';

const ____path__get = defineEventHandler(async (event) => {
  var _a;
  const path = (_a = event.context.params) == null ? void 0 : _a.path;
  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: "File path is required"
    });
  }
  const sanitizedPath = path.replace(/\.\./g, "").replace(/\/\//g, "/");
  const exists = await fileExists(sanitizedPath);
  if (!exists) {
    throw createError({
      statusCode: 404,
      statusMessage: "File not found"
    });
  }
  const file = await getFile(sanitizedPath);
  if (!file.body) {
    throw createError({
      statusCode: 404,
      statusMessage: "File not found"
    });
  }
  setHeader(event, "Content-Type", file.contentType);
  if (file.contentLength) {
    setHeader(event, "Content-Length", file.contentLength);
  }
  setHeader(event, "Cache-Control", "public, max-age=31536000, immutable");
  return file.body.transformToByteArray();
});

export { ____path__get as default };
//# sourceMappingURL=_...path_.get.mjs.map
