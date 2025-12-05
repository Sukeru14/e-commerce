import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import { cuid } from '@adonisjs/core/helpers'

import Product from '#models/product'
import ActivationCode from '#models/activation_code'

import { createProductValidator, updateProductValidator } from '#validators/product'
import app from '@adonisjs/core/services/app'
import Image from '#models/image'

export default class ProductsController {
  public async index({ view, request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = 12
    const q = (request.input('q', '') || '').toString().trim()

    const query = Product.query().preload('images')

    if (q.length > 0) {
      const like = `%${q}%`
      query.where((builder) => {
        builder.where('name', 'like', like)
        builder.orWhere('description', 'like', like)
        builder.orWhere('developer', 'like', like)
        builder.orWhere('publisher', 'like', like)
        builder.orWhere('genre', 'like', like)
      })
    }

    const products = await query.paginate(page, limit)

    products.baseUrl(request.url())

    return view.render('pages/products/index', { products, q })
  }

  public async show({ params, view, auth }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.load('images')

    let activationCodes: string[] = []
    let ownedQuantity = 0

    if (auth.isAuthenticated && !auth.user!.isAdmin) {
      const user = auth.user!
      const codes = await ActivationCode.query()
        .where('user_id', user.id)
        .andWhere('product_id', product.id)

      ownedQuantity = codes.length
      activationCodes = codes.map((c) => c.code)
    }

    const releaseDateFormatted = product.release_date
      ? DateTime.fromJSDate(product.release_date.toJSDate()).toFormat('dd/LL/yyyy')
      : null
    const createdAtFormatted = product.createdAt ? product.createdAt.toFormat('dd/LL/yyyy') : null

    return view.render('pages/products/show', {
      product,
      activationCodes,
      ownedQuantity,
      releaseDateFormatted,
      createdAtFormatted,
    })
  }

  public async create({ view }: HttpContext) {
    return view.render('pages/products/create')
  }

  public async edit({ params, view }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    return view.render('pages/products/create', { product })
  }

  public async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createProductValidator)

    const product = await Product.create({
      name: payload.name,
      description: payload.description,
      price: payload.price,
      developer: payload.developer,
      publisher: payload.publisher,
      genre: payload.genre,
      release_date: DateTime.fromJSDate(payload.release_date),
    })

    if (payload.image) {
      const image = new Image()
      image.name = `${cuid()}.${payload.image.extname}`
      image.productId = product.id

      try {
        await payload.image.move(app.makePath('tmp/uploads'), {
          name: image.name,
        })
      } catch (error) {
        await product.delete()
        session.flash('error', 'Falha ao salvar a imagem. Tente novamente.')
        return response.redirect().back()
      }

      await image.save()
    }

    return response.redirect().toRoute('products.show', { id: product.id })
  }

  public async update({ params, request, response, session }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    const payload = await request.validateUsing(updateProductValidator)

    const mergeData: any = {}
    if (payload.name) mergeData.name = payload.name
    if (payload.description) mergeData.description = payload.description
    if (payload.price !== undefined) mergeData.price = payload.price
    if (payload.developer) mergeData.developer = payload.developer
    if (payload.publisher) mergeData.publisher = payload.publisher
    if (payload.genre) mergeData.genre = payload.genre
    if (payload.release_date) mergeData.release_date = DateTime.fromJSDate(payload.release_date)

    product.merge(mergeData)
    await product.save()

    if (payload.image) {
      const image = new Image()
      image.name = `${cuid()}.${payload.image.extname}`
      image.productId = product.id

      try {
        await payload.image.move(app.makePath('tmp/uploads'), { name: image.name })
        await image.save()
      } catch (error) {
        session.flash('error', 'Falha ao salvar a nova imagem do produto.')
        return response.redirect().back()
      }
    }

    return response.redirect().toRoute('products.show', { id: product.id })
  }

  public async destroy({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)

    await product.delete()

    return response.redirect().toRoute('products.index')
  }
}
