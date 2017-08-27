

export default class VueRouterGuard {

  constructor(options = {}) {

  }

  RouterAuthority (to, from, next) {
    let { pageOperations } = store.state.login

    if (to.path === '/' || to.path === '/welcome') {
      toggleLoading()
      next()
      return
    }

    if (pageOperations.length === 0) {
      if (from.name !== null) {
        toggleLoading()
        next('/welcome')
        return
      } else {
        // 刷新页面，这时还没获得权限内容，需要在这里手动调权限接口来获得
        loginApi.getOperation().then(response => {
          const { code, data } = response
          if (code === '00000') {
            pageOperations = data.pageOperations
            toggleLoading()
            routerHandler(to, from, next, pageOperations)
          } else {
            pageOperations = []
            toggleLoading()
            next()
          }
        })
      }
    } else {
      routerHandler(to, from, next, pageOperations)
    }
  })
}

function routerHandler(to, from, next, pageOperations) {
  let hasAccess = false
  pageOperations.forEach(v => {
    if (v === to.name) {
      hasAccess = true
    }
  })

  if (hasAccess) {
    next()
  } else {
    Message.info({
      message: '没有权限'
    })
    if (from.name) {
      next(from.path)
    } else {
      next('/welcome')
    }
  }
}
