import {setToken, removeToken} from '@/util/auth'
import {setStore, getStore} from '@/util/store'
import {isURL, validatenull} from '@/util/validate'
import {deepClone} from '@/util/util'
import webiste from '@/config/website'
import {Message} from 'element-ui'
import {loginByUsername, loginBySocial, getUserInfo, getMenu, getTopMenu, logout, refreshToken, getButtons} from '@/api/user'


function addPath(ele, first) {
  const menu = webiste.menu;
  const propsConfig = menu.props;
  const propsDefault = {
    label: propsConfig.label || 'name',
    path: propsConfig.path || 'path',
    icon: propsConfig.icon || 'icon',
    children: propsConfig.children || 'children'
  };
  const icon = ele[propsDefault.icon];
  ele[propsDefault.icon] = validatenull(icon) ? menu.iconDefault : icon;
  const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0;
  if (!isChild) ele[propsDefault.children] = [];
  if (!isChild && first && !isURL(ele[propsDefault.path])) {
    ele[propsDefault.path] = ele[propsDefault.path] + '/index'
  } else {
    ele[propsDefault.children].forEach(child => {
      addPath(child);
    })
  }

}
const menuObj= {
  "id": "1123598815738675397",
  "parentId": "0",
  "code": "account",
  "name": "账户管理",
  "alias": "menu",
  "path": "/account",
  "source": "iconfont icon-bofangqi-suoping",
  "sort": 98,
  "category": 1,
  "action": 0,
  "isOpen": 1,
  "remark": "",
  "isDeleted": 1,
  "children": [
    {
      "id": "1123598815738675398",
      "parentId": "1123598815738675397",
      "code": "role",
      "name": "用户列表(管理员)",
      "alias": "menu",
      "path": "/account/customer",
      "source": "iconfont iconicon_boss",
      "sort": 1,
      "category": 1,
      "action": 0,
      "isOpen": 1,
      "remark": "",
      "isDeleted": 0,
      "hasChildren": false,
      "parentName": "",
      "categoryName": "",
      "actionName": "",
      "isOpenName": ""
    },
    {
      "id": "1123598815738675391",
      "parentId": "1123598815738675397",
      "code": "role",
      "name": "账户明细(用户)",
      "alias": "menu",
      "path": "/account/accountuser",
      "source": "iconfont iconicon_boss",
      "sort": 1,
      "category": 1,
      "action": 0,
      "isOpen": 1,
      "remark": "",
      "isDeleted": 1,
      "hasChildren": false,
      "parentName": "",
      "categoryName": "",
      "actionName": "",
      "isOpenName": ""
    },
    {
      "id": "1123598815738675390",
      "parentId": "1123598815738675397",
      "code": "role",
      "name": "充值(用户)",
      "alias": "menu",
      "path": "/account/recharge",
      "source": "iconfont iconicon_boss",
      "sort": 1,
      "category": 1,
      "action": 0,
      "isOpen": 1,
      "remark": "",
      "isDeleted": 1,
      "hasChildren": false,
      "parentName": "",
      "categoryName": "",
      "actionName": "",
      "isOpenName": "",
      "hidden": true,
    },
  ],
  "hasChildren": false,
  "parentName": "",
  "categoryName": "",
  "actionName": "",
  "isOpenName": ""
}
 
const btnobj=  {
  "id": "1123598815738675396",
  "parentId": "1123598815738675397",
  "code": "role",
  "name": "角色管理",
  "alias": "menu",
  "path": "/userbalance/userbalancelist",
  "source": "iconfont iconicon_boss",
  "sort": 1,
  "category": -1,
  "action": 0,
  "isOpen": -1,
  "remark": "",
  "isDeleted": -1,
  "children": [
      {
          "id": "1123598815738675395",
          "parentId": "1123598815738675396",
          "code": "role_add",
          "name": "新增",
          "alias": "add",
          "path": "/authority/role/add",
          "source": "plus",
          "sort": 1,
          "category": -1,
          "action": 1,
          "isOpen": -1,
          "remark": "",
          "isDeleted": -1,
          "hasChildren": false,
          "parentName": "",
          "categoryName": "",
          "actionName": "",
          "isOpenName": ""
      },
      {
          "id": "1123598815738675394",
          "parentId": "1123598815738675396",
          "code": "role_edit",
          "name": "修改",
          "alias": "edit",
          "path": "/authority/role/edit",
          "source": "form",
          "sort": 2,
          "category": -1,
          "action": 2,
          "isOpen": -1,
          "remark": "",
          "isDeleted": -1,
          "hasChildren": false,
          "parentName": "",
          "categoryName": "",
          "actionName": "",
          "isOpenName": ""
      },
      {
          "id": "1123598815738675393",
          "parentId": "1123598815738675396",
          "code": "role_delete",
          "name": "删除",
          "alias": "delete",
          "path": "/api/blade-system/role/remove",
          "source": "delete",
          "sort": 3,
          "category": -1,
          "action": 3,
          "isOpen": -1,
          "remark": "",
          "isDeleted": -1,
          "hasChildren": false,
          "parentName": "",
          "categoryName": "",
          "actionName": "",
          "isOpenName": ""
      },
      {
          "id": "1123598815738675392",
          "parentId": "1123598815738675396",
          "code": "role_view",
          "name": "查看",
          "alias": "view",
          "path": "/authority/role/view",
          "source": "file-text",
          "sort": 4,
          "category": -1,
          "action": 2,
          "isOpen": -1,
          "remark": "",
          "isDeleted": -1,
          "hasChildren": false,
          "parentName": "",
          "categoryName": "",
          "actionName": "",
          "isOpenName": ""
      }
  ],
  "hasChildren": false,
  "parentName": "",
  "categoryName": "",
  "actionName": "",
  "isOpenName": ""
}
const user = {
  state: {
    userInfo: getStore({name: 'userInfo'}) || [],
    permission: getStore({name: 'permission'}) || {},
    roles: [],
    menu: getStore({name: 'menu'}) || [],
    menuAll: [],
    token: getStore({name: 'token'}) || '',
  },
  actions: {
    //根据用户名登录
    LoginByUsername({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo.tenantId, userInfo.username, userInfo.password, userInfo.type, userInfo.key, userInfo.code).then(res => {
          const data = res.data.data;
          setToken(data.accessToken)
          console.log("登录成功",data.accessToken)
          commit('SET_TOKEN', data.accessToken);
          commit('SET_USER_INFO', data);
          commit('DEL_ALL_TAG');
          commit('CLEAR_LOCK');
          resolve();
        }).catch(error => {
          reject(error);
        })
      })
    },
    //根据第三方信息登录
    LoginBySocial({ commit }, userInfo) {
      return new Promise((resolve) => {
        loginBySocial(userInfo.tenantId, userInfo.source, userInfo.code, userInfo.state).then(res => {
          const data = res.data;
          if (data.success) {
            commit('SET_TOKEN', data.data.accessToken);
            commit('SET_REFRESH_TOKEN', data.data.refreshToken);
            commit('SET_USER_INFO', data.data);
            commit('DEL_ALL_TAG');
            commit('CLEAR_LOCK');
          } else {
            Message({
              message: data.msg,
              type: 'error'
            })
          }
          resolve();
        })
      })
    },
    //根据手机号登录
    LoginByPhone({commit}, userInfo) {
      return new Promise((resolve) => {
        loginByUsername(userInfo.phone, userInfo.code).then(res => {
          const data = res.data.data;
          commit('SET_TOKEN', data);
          commit('DEL_ALL_TAG');
          commit('CLEAR_LOCK');
          resolve();
        })
      })
    },
    GetUserInfo({commit}) {
      return new Promise((resolve, reject) => {
        getUserInfo().then((res) => {
          const data = res.data.data;
          commit('SET_ROLES', data.roles);
          resolve(data);
        }).catch(err => {
          reject(err);
        })
      })
    },
    //刷新token
    RefreshToken({state, commit}) {
      return new Promise((resolve, reject) => {
        refreshToken(state.refreshToken).then(res => {
          const data = res.data.data;
          commit('SET_TOKEN', data);
          resolve(data);
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    LogOut({commit}) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '');
          commit('SET_MENU', [])
          commit('SET_MENU_ALL', []);
          commit('SET_ROLES', []);
          commit('DEL_ALL_TAG');
          commit('CLEAR_LOCK');
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    //注销session
    FedLogOut({commit}) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_MENU', []);
        commit('SET_MENU_ALL', []);
        commit('SET_ROLES', []);
        commit('DEL_ALL_TAG');
        commit('CLEAR_LOCK');
        removeToken()
        resolve()
      })
    },
    GetTopMenu() {
      return new Promise(resolve => {
        getTopMenu().then((res) => {
          const data = res.data.data || []
          resolve(data)
        })
      })
    },
    //获取系统菜单
    GetMenu({commit, dispatch}, parentId) {
      return new Promise(resolve => {
        getMenu(parentId).then((res) => { 
          console.log('66666获取系统菜单',res);
          const data = res.data.data
          let menu = deepClone(data);
          menu.push(menuObj) 
          menu.forEach(ele => {
            addPath(ele, true);
          })
         
          commit('SET_MENU', menu);
          commit('SET_MENU_ALL', menu);
          dispatch('GetButtons');
          resolve(menu)
        })
      })
    },
    GetButtons({commit}) {
      return new Promise((resolve) => {
        getButtons().then(res => { 
          const data = res.data.data; 
          console.log('66666获取data系统菜单',data);
          // data.push(btnobj)
          commit('SET_PERMISSION', data);
          resolve();
        })
      })
    },
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      setToken(token)
      state.token = token;
      setStore({name: 'token', content: state.token, type: 'session'})
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo;
      setStore({name: 'userInfo', content: state.userInfo})
    },
    SET_MENU_ALL: (state, menuAll) => {
      state.menuAll = menuAll
      setStore({name: 'menuAll', content: state.menuAll, type: 'session'})
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
      setStore({name: 'menu', content: state.menu, type: 'session'})
      if (validatenull(menu)) return;
      //合并动态路由去重
      let menuAll = state.menuAll;
      menuAll = menuAll.concat(menu).reverse();
      let newMenu = [];
      for (let item1 of menuAll) {
        let flag = true;
        for (let item2 of newMenu) {
          if (item1.name === item2.name || item1.path === item2.path) {
            flag = false;
          }
        }
        if (flag) newMenu.push(item1);
      }
      state.menuAll = newMenu;
      setStore({name: 'menuAll', content: state.menuAll, type: 'session'})
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_PERMISSION: (state, permission) => {
      let result = [];

      function getCode(list) {
        list.forEach(ele => {
          if (typeof (ele) === 'object') {
            const chiildren = ele.children;
            const code = ele.code;
            if (chiildren) {
              getCode(chiildren)
            } else {
              result.push(code);
            }
          }

        })
      }

      getCode(permission);
      state.permission = {};
      result.forEach(ele => {
        state.permission[ele] = true;
      });
      setStore({name: 'permission', content: state.permission, type: 'session'})
    }
  }

}
export default user
