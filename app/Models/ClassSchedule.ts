import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'

import Class from 'App/Models/Class'

export default class ClassSchedule extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public week_day: number

  @column()
  public from: number

  @column()
  public to: number

  @column()
  public class_id: number

  @belongsTo(() => Class)
  public class: BelongsTo<typeof Class>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
