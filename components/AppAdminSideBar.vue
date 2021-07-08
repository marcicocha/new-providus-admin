<template>
  <a-layout-sider
    breakpoint="lg"
    collapsed-width="0"
    @collapse="onCollapse"
    @breakpoint="onBreakpoint"
  >
    <div class="logo">
      <img src="../assets/images/logowhitetext.svg" alt="" />
    </div>
    <a-menu theme="dark" mode="inline" :default-selected-keys="['1']">
      <a-menu-item v-for="(menu, index) in menuList" :key="index">
        <span class="nav-text"
          ><NuxtLink :to="menu.path">{{ menu.name }}</NuxtLink></span
        >
      </a-menu-item>
    </a-menu>
    <a-menu theme="dark" mode="inline" style="position: absolute; bottom: 2rem">
      <a-menu-item key="1">
        <li><a @click="showChangePassword">Change Password</a></li>
      </a-menu-item>
      <a-menu-item key="2">
        <a @click="logOutMethod">Logout</a>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>
<script>
export default {
  name: 'AppInput',
  components: {},
  props: {},
  data() {
    return {
      clientMenu: [
        {
          key: 'user_management',
          name: 'User Management',
          path: '/admin/usermanagement',
          children: [],
        },
        {
          key: 'settings',
          name: 'Settings',
          path: '/admin/setting',
          children: [],
        },
        {
          key: 'request_management',
          name: 'Requests',
          path: '/admin/requests',
          children: [],
        },
        {
          key: 'role_management',
          name: 'Roles',
          path: '/admin/roles',
          children: [],
        },
        {
          key: 'team_management',
          name: 'Teams',
          path: '/admin/team',
          children: [],
        },
        {
          key: 'configuration',
          name: 'Configuration',
          path: '/admin/configuration',
          children: [],
        },
      ],
    }
  },
  computed: {
    menuList() {
      const menu = []
      if (process.browser) {
        const currentUser = JSON.parse(localStorage.getItem('user'))
        if (currentUser) {
          if (currentUser.modules) {
            const modules = currentUser.modules
            modules.forEach((module) => {
              if (module.moduleName === 'user_management') {
                menu.push({
                  key: 'user_management',
                  name: 'Manage Users',
                  path: '/usermanagement',
                  children: [],
                })
              }

              if (module.moduleName === 'role_management') {
                menu.push({
                  key: 'role_management',
                  name: 'Manage Roles',
                  path: '/roles',
                  children: [],
                })
              }

              if (module.moduleName === 'requests_management') {
                menu.push({
                  key: 'request_management',
                  name: 'Manage Requests',
                  path: '/requests',
                  children: [],
                })
              }

              if (module.moduleName === 'settings') {
                menu.push({
                  key: 'settings',
                  name: 'Settings',
                  path: '/settings',
                  children: [],
                })
              }

              if (module.moduleName === 'workGroup_management') {
                menu.push({
                  key: 'team_management',
                  name: 'Manage WorkGroups',
                  path: '/workgroups',
                  children: [],
                })
              }

              if (module.moduleName === 'teams') {
                menu.push({
                  key: 'team_management',
                  name: 'Teams',
                  path: '/teams',
                  children: [],
                })
              }
              if (module.moduleName === 'configuration') {
                menu.push({
                  key: 'configuration',
                  name: 'Configuration',
                  path: 'configurations',
                  children: [],
                })
              }
            })
          }
        }
      }
      return menu
    },
  },
  watch: {},
  methods: {
    onCollapse(collapsed, type) {
      console.log(collapsed, type)
    },
    onBreakpoint(broken) {
      console.log(broken)
    },
    showChangePassword() {
      this.$emit('showChangePasswordModal')
    },
    async logOutMethod() {
      const user = JSON.parse(localStorage.getItem('user'))

      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      // clear local storage regardless
      localStorage.clear()
      // route back to home
      this.$router.push('/')
      try {
        await this.$axios.$post('/jwt/sign_out', {}, config)
        // clear local storage
        localStorage.clear()
        // route back to home
        this.$router.push('/')
      } catch (err) {
        // clear local storage
        localStorage.clear()
        // route back to home
        this.$router.push('/')
        this.isLoading = false
        const { default: errorHandler } = await import('@/utils/errorHandler')
        errorHandler(err).forEach((msg) => {
          this.$notification.error({
            message: 'Error',
            description: msg,
            duration: 4000,
          })
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.ant-layout-sider {
  background: #2e434e;
  // height: 100vh;
  color: #fff;
  border-right: 5px solid #fdb813;
  box-shadow: 1px 0.1px 15px -6px rgba(51, 51, 51, 1);
  -webkit-box-shadow: 1px 0.1px 15px -6px rgba(51, 51, 51, 1);
  -moz-box-shadow: 1px 0.1px 15px -6px rgba(51, 51, 51, 1);
  .ant-layout-sider-children {
    position: relative;
    margin-top: 1rem !important;
    .logo {
      background: transparent !important;
      height: 3rem !important;
      margin-bottom: 1rem;

      // margin: 0.5rem !important;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .ant-menu-dark {
      background: transparent;
    }
  }

  .ant-menu-item a {
    font-family: 'GothamLight', sans-serif;
    font-style: normal;
    font-size: 14px;
    line-height: 150%;
    color: #fff;
    transition: all 0.3s;

    &:hover {
      color: #2e434e;
      background: #fdb813;
      font-weight: bold;
    }

    &:focus {
      color: red;
      background: #fdb813;
    }
  }

  .log-out {
    position: absolute;
    bottom: 10%;
    width: 100%;
  }
}
</style>
