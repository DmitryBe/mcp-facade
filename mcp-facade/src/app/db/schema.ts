import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const mcpServers = pgTable('mcp_servers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  url: text('url').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const accessRules = pgTable('access_rules', {
  id: serial('id').primaryKey(),
  toolName: text('tool_name').notNull(),
  ruleType: text('rule_type', {
    enum: ['USER_ID', 'SCOPE', 'WILDCARD']
  }).notNull(),
  value: text('value')
});

export type AccessRule = typeof accessRules.$inferSelect;