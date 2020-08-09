import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'

import User from 'App/Models/User'
import ClassSchedule from 'App/Models/ClassSchedule'

export default class Class extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public subject: string

  @column()
  public cost: number

  @column()
  public user_id: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => ClassSchedule)
  public posts: HasMany<typeof ClassSchedule>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
