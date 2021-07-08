<template>
  <a-layout id="components-layout-demo-responsive">
    <AppAdminSideBar />
    <a-layout>
      <a-layout-header>
        <div class="userInfo">
          <img src="../assets/images/mheader.png" alt="" />
          <div class="details">
            <p>{{ firstName }} {{ lastName }}</p>
            <p>{{ transformRole(userRole) }}</p>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px 0', 'margin-top': '5rem' }"
      >
        <Nuxt />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import AppAdminSideBar from '@/components/AppAdminSideBar.vue'

export default {
  components: {
    AppAdminSideBar,
  },
  middleware: ['auth'],
  data() {
    return {
      userDigest: {},
    }
  },
  computed: {
    firstName() {
      return this.userDigest.firstName || null
    },
    lastName() {
      return this.userDigest.lastName || null
    },
    userRole() {
      return this.userDigest.role || null
    },
  },
  watch: {},
  mounted() {
    this.userDigest = JSON.parse(localStorage.getItem('user'))
  },
  methods: {
    transformRole(role) {
      let newRole = ''
      if (role && role.length > 0) {
        newRole = role
        newRole = newRole.includes('_') ? newRole.replace(/_/g, ' ') : newRole
      }
      return newRole
    },
  },
}
</script>

<style lang="scss" scoped>
#components-layout-demo-responsive .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
.ant-layout {
  position: relative;
  min-height: 100vh;
}
.ant-layout-header {
  width: 87%;
  height: auto;
  background: #f0f2f5;
  position: fixed;
  z-index: 1000;
  padding: 1rem 2rem;
}
.userInfo {
  display: flex;
  justify-content: flex-end;
  img {
    border-radius: 100%;
    border: 3px solid #e8e8e8;
    margin-right: 15px;
  }
  .details p {
    line-height: 150%;
    color: #2e434e;
    margin-bottom: 2px;
    &:first-child {
      font-family: 'GothamMedium', sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 15px;
    }
  }
  .details p:last-child {
    font-family: 'GothamLight', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
  }
}
</style>
