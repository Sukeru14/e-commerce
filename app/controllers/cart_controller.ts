import type { HttpContext } from '@adonisjs/core/http'
import CartItem from '#models/cart_item'
import Product from '#models/product'
import Order from '#models/order'
import OrderItem from '#models/order_item'
import ActivationCode from '#models/activation_code'
import { randomBytes } from 'node:crypto'

export default class CartController {
  public async index({ view, auth }: HttpContext) {
    const user = auth.user!
    if (user.isAdmin) {
      return view.render('pages/home')
    }

    const items = await CartItem.query()
      .where('user_id', user.id)
      .preload('product', (productQuery) => {
        productQuery.preload('images')
      })

    let total = 0
    items.forEach((item) => {
      total += item.product.price * item.quantity
    })

    return view.render('pages/cart/index', { items, total })
  }

  public async store({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    if (user.isAdmin) {
      return response.redirect().toRoute('home')
    }
    const productId = request.input('productId')
    const quantity = Number(request.input('quantity', 1))

    const existingItem = await CartItem.query()
      .where('user_id', user.id)
      .where('product_id', productId)
      .first()

    if (existingItem) {
      existingItem.quantity += quantity
      await existingItem.save()
    } else {
      await CartItem.create({
        userId: user.id,
        productId: productId,
        quantity: quantity,
      })
    }

    session.flash('success', 'Produto adicionado ao carrinho!')
    return response.redirect().toRoute('cart.index')
  }

  public async destroy({ params, response, auth, session }: HttpContext) {
    const user = auth.user!
    if (user.isAdmin) {
      return response.redirect().toRoute('home')
    }
    const id = params.id

    const item = await CartItem.query().where('id', id).where('user_id', user.id).firstOrFail()

    await item.delete()

    session.flash('success', 'Item removido do carrinho.')
    return response.redirect().back()
  }

  public async checkout({ response, auth, session }: HttpContext) {
    const user = auth.user!

    if (user.isAdmin) {
      return response.redirect().toRoute('home')
    }

    const items = await CartItem.query().where('user_id', user.id)

    if (items.length === 0) {
      session.flash('error', 'Seu carrinho está vazio.')
      return response.redirect().back()
    }
    let order: any = null
    const productsMap: Record<number, Product> = {}
    const updatedProducts: Array<{ product: Product; quantity: number }> = []

    try {
      let total = 0
      for (const item of items) {
        const product = await Product.findOrFail(item.productId)
        productsMap[item.productId] = product
        total += product.price * item.quantity
      }

      order = await Order.create({ userId: user.id, total })

      for (const item of items) {
        const product = productsMap[item.productId]
        const orderItem = await OrderItem.create({
          orderId: order.id,
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price,
        })

        product.salesCount = (product.salesCount || 0) + item.quantity
        await product.save()
        updatedProducts.push({ product, quantity: item.quantity })

        for (let i = 0; i < item.quantity; i++) {
          const buf = randomBytes(4).toString('hex').toUpperCase()
          const code = `LAB-${buf.slice(0, 4)}-${buf.slice(4, 8)}`
          await ActivationCode.create({
            code,
            userId: user.id,
            productId: product.id,
            orderId: order.id,
            orderItemId: orderItem.id,
            used: false,
          })
        }
      }

      await CartItem.query().where('user_id', user.id).delete()

      session.flash('success', 'Compra realizada com sucesso! Seus jogos estão na sua biblioteca.')
      return response.redirect().toRoute('orders.index')
    } catch (error) {
      try {
        if (order) {
          await ActivationCode.query().where('order_id', order.id).delete()
          await OrderItem.query().where('order_id', order.id).delete()
          await Order.query().where('id', order.id).delete()
        }

        for (const upd of updatedProducts) {
          upd.product.salesCount = (upd.product.salesCount || 0) - upd.quantity
          if (upd.product.salesCount < 0) upd.product.salesCount = 0
          await upd.product.save()
        }
      } catch (cleanupError) {}

      session.flash('error', 'Ocorreu um erro ao processar sua compra. Tente novamente.')
      return response.redirect().toRoute('cart.index')
    }
  }

  public async history({ view, auth, request }: HttpContext) {
    const user = auth.user!

    if (user.isAdmin) {
      return view.render('pages/home')
    }

    const page = Number(request.input('page', 1)) || 1
    const perPage = 10

    const query = Order.query()
      .where('user_id', user.id)
      .preload('items', (q) => q.preload('product'))
      .orderBy('created_at', 'desc')

    const orders = await query.paginate(page, perPage)
    orders.baseUrl(request.url())

    return view.render('pages/orders/index', { orders })
  }

  public async library({ view, auth, request }: HttpContext) {
    const user = auth.user!

    if (user.isAdmin) {
      return view.render('pages/home')
    }

    const orders = await Order.query().where('user_id', user.id).select('id')
    const orderIds = orders.map((o) => o.id)

    if (orderIds.length === 0) {
      return view.render('pages/library/index', { items: [], page: 1, totalPages: 0 })
    }

    const codes = await ActivationCode.query()
      .where('user_id', user.id)
      .preload('product', (productQuery) => productQuery.preload('images'))

    const productsMap: Record<number, { product: any; quantity: number; codes: string[] }> = {}
    codes.forEach((c) => {
      if (c.product) {
        const pid = c.product.id
        if (!productsMap[pid]) productsMap[pid] = { product: c.product, quantity: 0, codes: [] }
        productsMap[pid].quantity += 1
        productsMap[pid].codes.push(c.code)
      }
    })

    const allItems = Object.values(productsMap).map((entry) => ({
      product: entry.product,
      quantity: entry.quantity,
      codes: entry.codes,
    }))

    const page = Number(request.input('page', 1)) || 1
    const perPage = 8
    const total = allItems.length
    const totalPages = Math.max(1, Math.ceil(total / perPage))
    const start = (page - 1) * perPage
    const end = start + perPage
    const items = allItems.slice(start, end)

    return view.render('pages/library/index', { items, page, totalPages })
  }
}
