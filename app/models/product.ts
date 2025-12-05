import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import Image from '#models/image'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare price: number

  @column({ columnName: 'sales_count' })
  declare salesCount: number

  @column()
  declare description: string

  @column()
  declare developer: string | null

  @column()
  declare publisher: string | null

  @column()
  declare genre: string | null

  @column.date()
  declare release_date: DateTime | null

  @hasMany(() => Image)
  declare images: HasMany<typeof Image>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
