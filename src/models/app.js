import { query, logout } from '../services/app'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import { config, setLoactionOrigin, hashPathInfo } from '../utils'
const { prefix } = config

/**
 * 没登录跳转
 */
const notLoginJump = (pathname) => {
  if (pathname !== '/login') {
    let from = pathname
    if (pathname === '/dashboard') {
      from = '/dashboard'
    }
    setLoactionOrigin()
    // window.location = `${location.origin}/login?from=${from}`
    window.location = `${location.origin}/#/login?from=${from}`
  }
}
export default {
  namespace: 'app',
  state: {
    user: {},
    loginButtonLoading: false,
    menuPopoverVisible: false,
    siderFold: localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem(`${prefix}navOpenKeys`)) || [],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      dispatch({ type: 'queryUser' })
      history.listen(location => {
        let islogin = localStorage.getItem('userinfo')
        console.log('islogin', islogin)
        if (!islogin) {
          notLoginJump(hashPathInfo().pathname)
        }
      });
      window.onresize = () => {
        dispatch({ type: 'changeNavbar' })
      }
    }
  },
  effects: {
    *queryUser ({
      payload,
    }, { call, put }) {
      const data = yield call(query, parse(payload))
      let pathname = hashPathInfo().pathname
      if (data.success && data.user) {
        yield put({
          type: 'queryUserSuccess',
          payload: data.user,
        })
        if (pathname === '/login') {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        notLoginJump(pathname)
      }
    },
    *logout ({
      payload,
    }, { call, put }) {
      const data = yield call(logout, parse(payload))
      if (data.success) {
        localStorage.setItem('userinfo', '')
        yield put({ type: 'queryUser' })
      } else {
        throw (data)
      }
    },
    *switchSider ({
      payload,
    }, { put }) {
      yield put({
        type: 'handleSwitchSider',
      })
    },
    *changeTheme ({
      payload,
    }, { put }) {
      yield put({
        type: 'handleChangeTheme',
      })
    },
    *changeNavbar ({
      payload,
    }, { put }) {
      if (document.body.clientWidth < 769) {
        yield put({ type: 'showNavbar' })
      } else {
        yield put({ type: 'hideNavbar' })
      }
    },
    *switchMenuPopver ({
      payload,
    }, { put }) {
      yield put({
        type: 'handleSwitchMenuPopver',
      })
    },
  },
  reducers: {
    queryUserSuccess (state, { payload: user }) {
      return {
        ...state,
        user,
      }
    },
    showLoginButtonLoading (state) {
      return {
        ...state,
        loginButtonLoading: true,
      }
    },
    handleSwitchSider (state) {
      localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },
    handleChangeTheme (state) {
      localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },
    showNavbar (state) {
      return {
        ...state,
        isNavbar: true,
      }
    },
    hideNavbar (state) {
      return {
        ...state,
        isNavbar: false,
      }
    },
    handleSwitchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },
    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}
