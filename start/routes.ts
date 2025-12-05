import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import Product from '#models/product'

const ProductsController = () => import('#controllers/products_controller')
const ImagesController = () => import('#controllers/images_controller')
const AuthController = () => import('#controllers/users_controller')
const CartController = () => import('#controllers/cart_controller')
const AdminController = () => import('#controllers/admin_controller')

router
  .get('/', async ({ view }) => {
    const products = await Product.query().preload('images').limit(8)
    return view.render('pages/home', { products })
  })
  .as('home')

router
  .group(() => {
    router.get('/register', [AuthController, 'create']).as('register.create')
    router.post('/register', [AuthController, 'store']).as('register.store')
    router.get('/login', [AuthController, 'showLogin']).as('login.create')
    router.post('/login', [AuthController, 'login']).as('login.store')
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('/logout', [AuthController, 'logout']).as('logout')

    router.get('/profile/edit', [AuthController, 'edit']).as('profile.edit')
    router.put('/profile/update', [AuthController, 'update']).as('profile.update')

    router.get('/cart', [CartController, 'index']).as('cart.index')
    router.post('/cart', [CartController, 'store']).as('cart.store')
    router.delete('/cart/:id', [CartController, 'destroy']).as('cart.destroy')
    router.post('/checkout', [CartController, 'checkout']).as('cart.checkout')

    router
      .resource('/products', ProductsController)
      .as('products')
      .only(['create', 'store', 'edit', 'update', 'destroy'])
      .use(['create', 'store', 'edit', 'update', 'destroy'], middleware.admin())

    router.get('/orders', [CartController, 'history']).as('orders.index')
    router.get('/library', [CartController, 'library']).as('library.index')

    router.get('/admin', [AdminController, 'index']).as('admin.index').use(middleware.admin())
    router
      .get('/admin/orders', [AdminController, 'orders'])
      .as('admin.orders')
      .use(middleware.admin())
  })
  .use(middleware.auth())

router.resource('/products', ProductsController).as('products').only(['index', 'show'])

router.get('/images/:name', [ImagesController, 'show']).as('images.show')
