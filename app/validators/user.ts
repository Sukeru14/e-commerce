import vine from '@vinejs/vine'
import type { FieldContext } from '@vinejs/vine/types'
import db from '@adonisjs/lucid/services/db'

const emailIsUnique = vine.createRule(async (value: unknown, _options: any, field: FieldContext) => {
  if (typeof value !== 'string') {
    return
  }

  const user = await db.from('users').where('email', value).first()
  if (!user) {
    return
  }

  const currentUserId = field.meta.currentUserId

  if (user.id === currentUserId) {
    return
  }

  field.report('Este email já está em uso por outra conta.', 'unique', field)
})

export const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3),
    email: vine
      .string()
      .trim()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    password: vine
      .string()
      .minLength(8)
      .confirmed()
  })
)

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string()
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().minLength(3),
    email: vine
      .string()
      .trim()
      .email()
      .use(emailIsUnique()),
    password: vine
      .string()
      .minLength(8)
      .confirmed()
      .optional()
  })
)