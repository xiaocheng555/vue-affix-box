import Vue from 'vue'
import VueRouter from 'vue-router'
// import Test from '../docs/test.md'

Vue.use(VueRouter)

// 获取 `src/docs` 目录下的路由
function getMdRoutes () {
  const routes = []
  const modulesFiles = require.context('../docs', true, /\.md$/)
  modulesFiles.keys().reduce((modules, modulePath) => {
    const fileName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    const component = modulesFiles(modulePath).default
    routes.push({
      name: fileName,
      path: `/${fileName}`,
      component: component
    })
  }, {})
  return routes
}

const routes = [
  {
    path: '/',
    rediect: {
      path: '/home'
    }
  },
  ...getMdRoutes()
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
