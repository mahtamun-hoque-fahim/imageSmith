import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const reviews = pgTable('reviews', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Review = typeof reviews.$inferSelect
export type NewReview = typeof reviews.$inferInsert
