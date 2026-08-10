import { cp, mkdir } from "node:fs/promises";

await mkdir("dist/prisma", { recursive: true });

await cp("prisma/schema.prisma", "dist/prisma/schema.prisma");
await cp("prisma/migrations", "dist/prisma/migrations", {
  recursive: true,
});

console.log("Prisma schema and migrations copied to dist/prisma");