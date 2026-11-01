import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
export const inquiries = sqliteTable("inquiries", {
 id: text("id").primaryKey(), firstName:text("first_name").notNull(), lastName:text("last_name").notNull(),
 email:text("email").notNull(), phone:text("phone").notNull(), matter:text("matter").notNull(),
 message:text("message").notNull(), meeting:text("meeting").notNull(), status:text("status").notNull().default("new"),
 createdAt:integer("created_at").notNull(), ipHash:text("ip_hash").notNull(),
}, t=>[index("inquiries_created_at_idx").on(t.createdAt),index("inquiries_ip_hash_idx").on(t.ipHash,t.createdAt)]);
