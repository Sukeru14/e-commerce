import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel' 

const ProductsController = () => import('#controllers/products_controller')
const ImagesController = () => import('#controllers/images_controller')
const AuthController = () => import('#controllers/users_controller') 

router.get('/', ({ view }) => {
  return view.render('pages/home')
}).as('home') 

// --- ROTAS DE AUTENTICAÇÃO ---
router
  .get('/register', [AuthController, 'create'])
  .as('register.create')
  .use(middleware.guest()) 

router
  .post('/register', [AuthController, 'store'])
  .as('register.store')
  .use(middleware.guest()) 

router
  .get('/login', [AuthController, 'showLogin'])
  .as('login.create')
  .use(middleware.guest())

router
  .post('/login', [AuthController, 'login'])
  .as('login.store')
  .use(middleware.guest())

router
  .post('/logout', [AuthController, 'logout'])
  .as('logout')
  .use(middleware.auth())

// --- ROTAS DE PRODUTOS ---
router
  .resource('/products', ProductsController)
  .as('products')
  .except(['create', 'store', 'edit', 'update', 'destroy']) 

router
  .group(() => {
    router
      .resource('/products', ProductsController)
      .as('products')
      .only(['create', 'store', 'edit', 'update', 'destroy'])
  })
  .use(middleware.auth()) 

router.get('/images/:name', [ImagesController, 'show']).as('images.show')