import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Product from '#models/product'
import Order from '#models/order'
import User from '#models/user'

export default class AdminController {
  public async index({ view }: HttpContext) {
    const topProducts = await Product.query()
      .orderBy('sales_count', 'desc')
      .limit(5)
      .preload('images')

    const recentOrders = await Order.query()
      .preload('user')
      .preload('items', (q) => q.preload('product'))
      .orderBy('created_at', 'desc')
      .limit(6)

    recentOrders.forEach((o) => {
      try {
        ;(o as any).formattedDate = (o.createdAt as DateTime)
          .setLocale('pt-BR')
          .toLocaleString(DateTime.DATETIME_MED)
      } catch (err) {
        ;(o as any).formattedDate = o.createdAt ? String(o.createdAt) : ''
      }
    })

    const prodCountRow = await Product.query().count('* as total')
    const orderCountRow = await Order.query().count('* as total')
    const nonAdminUsersRow = await User.query().where('is_admin', false).count('* as total')

    const readNumeric = (row: any) => {
      if (!row) return 0
      if (row.$extras && row.$extras.total !== undefined) return Number(row.$extras.total)
      if (row.total !== undefined) return Number(row.total)
      const vals = Object.values(row)
      return Number(vals[0] ?? 0)
    }

    const totalProducts = readNumeric(prodCountRow[0])
    const totalOrders = readNumeric(orderCountRow[0])
    const totalUsers = readNumeric(nonAdminUsersRow[0])

    const revenueRow = await Order.query().sum('total as total')
    const totalRevenue = (() => {
      const row = revenueRow && revenueRow[0]
      if (!row) return 0
      if (row.$extras && row.$extras.total !== undefined) return Number(row.$extras.total)
      if (row.total !== undefined) return Number(row.total)
      const vals = Object.values(row)
      return Number(vals[0] ?? 0)
    })()

    return view.render('pages/admin/index', {
      topProducts,
      recentOrders,
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
    })
  }

  public async orders({ view, request }: HttpContext) {
    const page = Number(request.input('page', 1)) || 1
    const perPage = 12

    const ordersQuery = Order.query()
      .preload('user')
      .preload('items', (q) => q.preload('product'))
      .orderBy('created_at', 'desc')

    const orders = await ordersQuery.paginate(page, perPage)
    orders.baseUrl(request.url())

    orders.forEach((o: any) => {
      try {
        o.formattedDate = (o.createdAt as DateTime)
          .setLocale('pt-BR')
          .toLocaleString(DateTime.DATETIME_MED)
      } catch (err) {
        o.formattedDate = o.createdAt ? String(o.createdAt) : ''
      }
    })

    return view.render('pages/admin/orders', { orders })
  }
}
