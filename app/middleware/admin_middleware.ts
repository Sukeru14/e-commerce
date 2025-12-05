import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle({ auth, response, session }: HttpContext, next: NextFn) {
    const user = auth.user

    if (!user || !user.isAdmin) {
      session.flash('error', 'Acesso negado. Apenas administradores podem acessar esta área.')
      return response.redirect().toRoute('home')
    }

    await next()
  }
}
