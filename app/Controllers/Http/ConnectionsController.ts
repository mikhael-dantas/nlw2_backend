import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Connection from 'App/Models/Connection'

export default class ConnectionsController {
  public async index ({response}: HttpContextContract) {
    const connections = await Connection.query().count('* as total')

    const {total} = connections[0]

    return response.status(200).json({ total })
  }

  public async store ({request , response}: HttpContextContract) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { user_id } = request.only(['user_id'])
    if(!user_id) {
      return response.status(400).json({ message: 'missing parameter'})
    }
    try {
      await Connection.create({user_id})
      return response.status(201)
    } catch (error) {
      return response.status(400)
    }
  }
}
