import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const reviews = pgTable('reviews', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  rating: integer('rating').notNull().default(5),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Review = typeof reviews.$inferSelect
export type NewReview = typeof reviews.$inferInsert
