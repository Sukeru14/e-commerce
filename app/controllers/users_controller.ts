import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator, loginValidator, updateUserValidator } from '#validators/user'

export default class AuthController {
  public async create({ view }: HttpContext) {
    return view.render('pages/users/register')
  }

  public async store({ request, response, auth }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)
    const user = await User.create(payload)
    await auth.use('web').login(user)
    return response.redirect().toRoute('home')
  }

  public async showLogin({ view }: HttpContext) {
    return view.render('pages/users/login')
  }

  public async login({ request, response, auth, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      return response.redirect().toRoute('home')
    } catch (error) {
      session.flash('errors.auth', 'Email ou senha incorretos.')
      return response.redirect().back()
    }
  }

  public async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('home')
  }

  public async edit({ view, auth }: HttpContext) {
    return view.render('pages/users/edit', { user: auth.user })
  }

  public async update({ request, response, auth, session }: HttpContext) {
    const user = auth.user!

    const payload = await request.validateUsing(updateUserValidator, {
      meta: {
        currentUserId: user.id,
      },
    })

    user.merge({
      fullName: payload.fullName,
    })

    if (payload.password) {
      user.password = payload.password
    }

    await user.save()

    session.flash('success', 'Perfil atualizado com sucesso!')
    return response.redirect().back()
  }
}
