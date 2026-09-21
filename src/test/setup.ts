// Vitest global setup. Provide a minimal, valid environment so config/env.ts
// can be imported in unit tests without a real .env file.
process.env.BACKEND_API_URL ??= "https://backend.test/api/v1";
process.env.ALLOWED_ORIGINS ??= "http://localhost:4000";
process.env.NEXT_PUBLIC_APP_URL ??= "http://localhost:4000";
process.env.NEXT_PUBLIC_IMAGE_HOSTS ??= "res.cloudinary.com";
process.env.CLOUDINARY_CLOUD_NAME ??= "test-cloud";
process.env.CLOUDINARY_UPLOAD_PRESET ??= "test-preset";
process.env.LOG_LEVEL ??= "silent";
