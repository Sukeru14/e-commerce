import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    const exists = await User.findBy('email', 'admin@labor.com')

    if (!exists) {
      await User.create({
        fullName: 'Administrador Labor',
        email: 'admin@labor.com',
        password: 'admin123',
        isAdmin: true,
      })
      console.log('👑 Usuário Admin criado: admin@labor.com / admin123')
    }
  }
}
