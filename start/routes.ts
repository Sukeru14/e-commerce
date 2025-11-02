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

// --- ROTAS DE PERFIL DE USUÁRIO ---
router
  .group(() => {
    router.get('/profile/edit', [AuthController, 'edit']).as('profile.edit')
    router.put('/profile/update', [AuthController, 'update']).as('profile.update')
  })
  .use(middleware.auth())

// --- ROTAS DE PRODUTOS ---

// Rotas que EXIGEM autenticação (declaradas primeiro)
router
  .group(() => {
    router
      .resource('/products', ProductsController)
      .as('products')
      .only(['create', 'store', 'edit', 'update', 'destroy'])
  })
  .use(middleware.auth()) 

// Rotas públicas (declaradas depois)
router
  .resource('/products', ProductsController)
  .as('products')
  .only(['index', 'show'])

router.get('/images/:name', [ImagesController, 'show']).as('images.show')