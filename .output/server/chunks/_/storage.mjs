import { HeadObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

let _client = null;
function getStorageConfig() {
  return {
    endpoint: process.env.S3_ENDPOINT || "",
    bucket: process.env.S3_BUCKET || "ai-studio",
    region: process.env.S3_REGION || "us-east-1",
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
    publicUrl: process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT || ""
  };
}
function getClient() {
  if (!_client) {
    const config = getStorageConfig();
    if (!config.endpoint || !config.accessKeyId || !config.secretAccessKey) {
      throw new Error("S3 storage not configured. Set S3_ENDPOINT, S3_ACCESS_KEY, and S3_SECRET_KEY.");
    }
    _client = new S3Client({
      endpoint: config.endpoint,
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey
      },
      forcePathStyle: true
    });
  }
  return _client;
}
async function uploadFile(key, body, contentType) {
  const config = getStorageConfig();
  const client = getClient();
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: body,
      ContentType: contentType
    })
  );
  const url = `${config.publicUrl}/${config.bucket}/${key}`;
  return { key, url };
}
async function getFile(key) {
  const config = getStorageConfig();
  const client = getClient();
  const response = await client.send(
    new GetObjectCommand({
      Bucket: config.bucket,
      Key: key
    })
  );
  return {
    body: response.Body,
    contentType: response.ContentType || "application/octet-stream",
    contentLength: response.ContentLength
  };
}
async function fileExists(key) {
  const config = getStorageConfig();
  const client = getClient();
  try {
    await client.send(
      new HeadObjectCommand({
        Bucket: config.bucket,
        Key: key
      })
    );
    return true;
  } catch {
    return false;
  }
}
function getPublicUrl(key) {
  const config = getStorageConfig();
  return `${config.publicUrl}/${config.bucket}/${key}`;
}

export { getPublicUrl as a, fileExists as f, getFile as g, uploadFile as u };
//# sourceMappingURL=storage.mjs.map
