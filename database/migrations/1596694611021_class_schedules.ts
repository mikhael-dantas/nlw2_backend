import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ClassSchedules extends BaseSchema {
  protected tableName = 'class_schedules'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table.integer('week_day').notNullable()
      table.integer('from').notNullable()
      table.integer('to').notNullable()

      table.integer('class_id').notNullable()
        .references('id')
        .inTable('classes')
        .notNullable()
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
