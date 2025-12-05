import vine from '@vinejs/vine'

export const createProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    price: vine.number(),
    description: vine.string().minLength(3).trim(),
    image: vine.file({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
    }),
    developer: vine.string().trim().minLength(2),
    publisher: vine.string().trim().minLength(2),
    genre: vine.string().trim().minLength(3),
    release_date: vine.date({ formats: ['YYYY-MM-DD'] }),
  })
)

export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    price: vine.number().optional(),
    description: vine.string().minLength(3).trim().optional(),
    image: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
      })
      .optional(),
    developer: vine.string().trim().minLength(2).optional(),
    publisher: vine.string().trim().minLength(2).optional(),
    genre: vine.string().trim().minLength(3).optional(),
    release_date: vine.date({ formats: ['YYYY-MM-DD'] }).optional(),
  })
)
