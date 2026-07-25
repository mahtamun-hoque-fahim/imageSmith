import { pgTable, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core'

export const reviews = pgTable('reviews', {
  id: text('id').primaryKey(),
  content: text('content').notNull(),
  rating: integer('rating').notNull().default(5),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const contacts = pgTable('contacts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Review = typeof reviews.$inferSelect
export type NewReview = typeof reviews.$inferInsert
export type Contact = typeof contacts.$inferSelect
export type NewContact = typeof contacts.$inferInsert
