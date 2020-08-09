import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import Class from 'App/Models/Class'
import ClassSchedule from 'App/Models/ClassSchedule'
import ConvertHourToMinutes from 'App/Utils/ConvertHourToMinutes'

interface ScheduleItem {
  week_day: number
  from: string
  to: string
}

export default class ClassesController {
  public async index ({ request, response }: HttpContextContract) {
    const {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      week_day,
      time,
      subject } = request.only(['week_day', 'time', 'subject'])

    if (!subject || !time || !week_day) {
      return response.status(400).json({
        error: 'Missing parameters to search classes',
      })
    }

    const timeInMinutes = ConvertHourToMinutes(time)

    // filter classes
    const classes = await Class.query().where('subject', subject)

    // filter class_schedules
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const class_schedules = await ClassSchedule.query()
      .where('week_day', Number(week_day))
      .where('from', '<=', timeInMinutes)
      .where('to', '>', timeInMinutes)

    // compare both results
    const scheduleClassIds: number[] = []

    class_schedules.map(class_scheduleItem => {
      scheduleClassIds.push(class_scheduleItem.class_id)
    })

    const filteredScheduleClassIds = scheduleClassIds.filter((v,i) => scheduleClassIds.indexOf(v) === i)

    // create the object for response and search users to insert
    const filteredClasses: object[] = []
    const userIds: number[] = []

    classes.map(classItem => {
      if (filteredScheduleClassIds.includes(classItem.id)) {
        filteredClasses.push(classItem.toJSON())
        userIds.push(classItem['user_id'])
      }
    })

    const users = await User.findMany(userIds)

    // inserting users
    const mappedUsers = {}
    users.map(user => {
      mappedUsers[user.id] = user
    })

    filteredClasses.map(classItem => {
      classItem['user'] = mappedUsers[classItem['user_id']]
    })

    return filteredClasses
  }

  public async store ({ request }: HttpContextContract) {
    const {
      name,
      avatar,
      bio,
      whatsapp,
      subject,
      cost,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      class_schedule,
    } = request.only([ 'name', 'avatar', 'bio', 'whatsapp', 'subject', 'cost', 'class_schedule'])

    // create user
    const createdUser = await User.create({ name, avatar, bio, whatsapp })

    const userId = createdUser.id

    // create class
    const createdClass = await Class.create({ subject, cost, user_id: userId })

    const createdClassId = createdClass.id

    // create classSchedule
    const classSchedulesConverted = class_schedule.map((scheduleItem: ScheduleItem) => {
      return {
        class_id: createdClassId,
        week_day: scheduleItem.week_day,
        from: ConvertHourToMinutes(scheduleItem.from),
        to: ConvertHourToMinutes(scheduleItem.to),
      }
    })

    const classSchedules = ClassSchedule.createMany(classSchedulesConverted)

    return classSchedules
  }
}
