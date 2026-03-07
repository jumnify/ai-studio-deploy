import { d as defineEventHandler, b as readMultipartFormData, c as createError } from '../../../nitro/nitro.mjs';
import { u as uploadFile, a as getPublicUrl } from '../../../_/storage.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@aws-sdk/client-s3';

const ALLOWED_TYPES = /* @__PURE__ */ new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
  "video/mp4",
  "audio/mpeg",
  "audio/wav"
]);
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const upload_post = defineEventHandler(async (event) => {
  var _a;
  const formData = await readMultipartFormData(event);
  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "No file uploaded"
    });
  }
  const results = [];
  for (const part of formData) {
    if (part.name === "file" || part.name === "files") {
      const contentType = part.type || "application/octet-stream";
      const fileName = part.filename || "unnamed";
      if (!ALLOWED_TYPES.has(contentType)) {
        throw createError({
          statusCode: 400,
          statusMessage: `File type "${contentType}" is not allowed. Allowed types: ${[...ALLOWED_TYPES].join(", ")}`
        });
      }
      if (part.data.length > MAX_FILE_SIZE) {
        throw createError({
          statusCode: 400,
          statusMessage: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024} MB`
        });
      }
      const dirPart = formData.find((p) => p.name === "directory");
      const directory = ((_a = dirPart == null ? void 0 : dirPart.data) == null ? void 0 : _a.toString()) || "uploads";
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const extension = fileName.includes(".") ? fileName.substring(fileName.lastIndexOf(".")) : "";
      const safeFileName = `${timestamp}-${random}${extension}`;
      const key = `public/${directory}/${safeFileName}`;
      const { url } = await uploadFile(key, part.data, contentType);
      results.push({
        key,
        url,
        publicUrl: getPublicUrl(key),
        originalName: fileName,
        contentType,
        size: part.data.length
      });
    }
  }
  if (results.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "No valid file found in upload"
    });
  }
  return results.length === 1 ? results[0] : results;
});

export { upload_post as default };
//# sourceMappingURL=upload.post.mjs.map
