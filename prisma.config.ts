import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    provider: "postgresql",
    url: "postgresql://neondb_owner:npg_hgC08WtuoNGX@ep-billowing-poetry-auyq36hx-pooler.c-10.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require",
  },
});
