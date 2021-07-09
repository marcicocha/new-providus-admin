<template>
  <a-layout id="components-layout-demo-responsive">
    <AppAdminSideBar @showChangePasswordModal="showChangePasswordModal" />
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
        :style="{
          margin: '24px 16px 0',
          'margin-top': '5rem',
          'margin-bottom': '3rem',
        }"
      >
        <Nuxt />
      </a-layout-content>
    </a-layout>
    <a-modal
      :visible="isModalIsVisible"
      width="500px"
      :footer="null"
      :destroy-on-close="true"
      centered
      @cancel="closeModal"
    >
      <h1>Change Password</h1>
      <a-form>
        <ValidationObserver ref="observer" tag="div">
          <AppInput v-model="userObject.newUsername" label="User Name" />
          <AppInput
            v-model="userObject.oldPassword"
            label="Enter Old Password"
            placeholder="Enter Old Password"
            required
            rules="required"
            input-type="password"
          />
          <AppInput
            v-model="userObject.password"
            label="Enter New Password"
            placeholder="Enter New Password"
            required
            rules="required"
            input-type="password"
          />
          <AppInput
            v-model="userObject.confirmPassword"
            label="Confirm Password"
            placeholder="Confirm Password"
            required
            rules="required"
            input-type="password"
          />
        </ValidationObserver>
      </a-form>
      <div>
        <AppButton
          class="custom-btn"
          :loading="loading"
          @click="changePassword()"
          >Submit</AppButton
        >
      </div>
    </a-modal>
  </a-layout>
</template>
<script>
import AppAdminSideBar from '@/components/AppAdminSideBar.vue'
import AppButton from '@/components/UI/AppButton.vue'
import AppInput from '@/components/UI/AppInput.vue'
export default {
  components: {
    AppAdminSideBar,
    AppInput,
    AppButton,
  },
  middleware: ['auth'],
  data() {
    return {
      userDigest: {},
      isModalIsVisible: false,
      loading: false,
      userObject: {},
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
    showChangePasswordModal() {
      this.isModalIsVisible = true
    },
    closeModal() {
      this.isModalIsVisible = false
    },
    async changePassword() {
      const isValid = await this.$refs.observer.validate()
      if (!isValid) {
        return
      }
      const user = JSON.parse(localStorage.getItem('user'))
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      const payload = {
        ...this.userObject,
        oldUsername: this.userDigest.username,
      }
      this.loading = true
      try {
        const { response } = await this.$axios.$post(
          '/user/updateCredentials',
          payload,
          config
        )

        if (response.loginAgain) {
          this.goHome()
        }
        this.$notification.success({
          message: 'Success',
          description: 'Password Updated Successfully',
          duration: 4000,
        })
        requestAnimationFrame(() => {
          this.$refs.observer.reset()
          this.userObject = {}
          this.loading = false
          this.closeModal()
        })
      } catch (err) {
        this.loading = false
        const { default: errorHandler } = await import('@/utils/errorHandler')
        errorHandler(err).forEach((msg) => {
          this.$notification.error({
            message: 'Error',
            description: msg,
            duration: 0,
          })
        })
      }
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
