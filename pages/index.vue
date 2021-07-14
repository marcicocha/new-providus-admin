<template>
  <div class="animated fadeIn">
    <AppTitleComponent
      :heading="descriptionsComputed.header"
      :description="descriptionsComputed.description"
    />
    <a-divider />
    <div v-if="!toggleForm">
      <a-form>
        <ValidationObserver ref="obs1" tag="div">
          <AppInput
            v-model="userObject.username"
            label="Username"
            name="username"
            input-type="email"
            placeholder="Enter Your Username"
            required
            rules="required"
          />
          <AppInput
            v-model.trim="userObject.password"
            label="Password"
            name="name"
            input-type="password"
            placeholder="Enter Your Password"
            required
            rules="required"
          />
        </ValidationObserver>
      </a-form>

      <div>
        <AppButton :loading="isLoading" size="large" @click="logIn"
          >Sign In</AppButton
        >
      </div>
      <p class="signUp-text" @click="toggleSignUpForm">Forgotten Password ?</p>
    </div>
    <div v-if="toggleForm" class="columns is-multiline">
      <a-form>
        <ValidationObserver ref="obs2" tag="div">
          <AppInput
            v-model.trim="email"
            label="Email address"
            name="Email address"
            input-type="email"
            placeholder="Please Input your email address"
            required
            rules="required"
          />
        </ValidationObserver>
      </a-form>
      <div>
        <AppButton :loading="isLoading" @click="resetPassword"
          >Reset Password</AppButton
        >
      </div>
      <p class="signUp-text" @click="toggleSignUpForm">Sign In ?</p>
    </div>
    <a-modal
      :visible="isModalVisible"
      width="500px"
      :confirm-loading="confirmLoading"
      :footer="null"
      :destroy-on-close="true"
      centered
      @cancel="closeModal"
    >
      <AppTitleComponent heading="Change Password" />
      <br />
      <div>
        <a-form>
          <ValidationObserver ref="obs3" tag="div">
            <AppInput
              v-model="changePasswordObject.newUsername"
              label="User Name"
            />
            <AppInput
              v-model="changePasswordObject.oldPassword"
              label="Enter Old Password"
              placeholder="Enter Old Password"
              required
              rules="required"
              input-type="password"
            />
            <AppInput
              v-model="changePasswordObject.password"
              label="Enter New Password"
              placeholder="Enter New Password"
              required
              rules="required"
              input-type="password"
            />

            <AppInput
              v-model="changePasswordObject.confirmPassword"
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
            :loading="btnloading"
            @click="changePassword()"
            >Submit</AppButton
          >
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { ValidationObserver } from 'vee-validate'
import AppTitleComponent from '@/components/UI/AppTitleComponent'
import AppInput from '@/components/UI/AppInput.vue'
import AppButton from '@/components/UI/AppButton.vue'
export default {
  components: {
    AppTitleComponent,
    AppInput,
    AppButton,
    ValidationObserver,
  },
  layout: 'signIn',
  data() {
    return {
      userObject: {
        username: '',
        password: '',
      },
      toggleForm: false,
      validateUser: {
        email_error: { 'form-error': false },
        password_error: { 'form-error': false },
      },
      isLoading: false,
      userDigest: {},
      token: '',
      isModalVisible: false,
      btnloading: false,
      changePasswordObject: {},
      confirmLoading: false,
      email: '',
    }
  },
  computed: {
    descriptionsComputed() {
      const header = this.toggleForm ? 'Forgotten Password' : 'Sign In'
      const description = this.toggleForm
        ? 'Please Input your email adress to reset your password'
        : 'Welcome to Future Forward Banking. We believe that the New World of fast, smart, personal and borderless banking relationship is here.'
      return {
        header,
        description,
      }
    },
  },
  beforeMount() {
    const guard = JSON.parse(localStorage.getItem('user'))
    if (!guard) {
      localStorage.clear()
      // route back to home
      this.$router.push('/')
    } else if (guard) {
      // eslint-disable-next-line no-prototype-builtins
      if (guard.hasOwnProperty('token')) {
        if (guard.token === '') {
          localStorage.clear()
          // route back to home
          this.$router.push('/')
        }
      }
    } else {
      this.$router.push('/')
    }
  },
  mounted() {},
  methods: {
    closeModal() {
      this.isModalVisible = false
    },
    toggleSignUpForm() {
      this.toggleForm = !this.toggleForm
    },
    async logIn() {
      const isValid = await this.$refs.obs1.validate()
      if (!isValid) {
        return
      }
      this.isLoading = true
      try {
        const { response } = await this.$axios.$post(
          '/jwt/authenticate',
          this.userObject
        )

        this.userDigest = response
        this.changePasswordObject.newUsername = this.userDigest.username
        localStorage.setItem('user', JSON.stringify(this.userDigest))
        if (this.userDigest.firstTimeLogin) {
          this.isModalVisible = true
        } else {
          const route = !this.userDigest.admin ? 'requests' : 'usermanagement'
          this.$router.push(`/${route}`)
        }
        this.isLoading = false
      } catch (err) {
        this.isLoading = false
        const { default: errorHandler } = await import('@/utils/errorHandler')
        errorHandler(err).forEach((msg) => {
          this.$notification.error({
            message: 'Error',
            description: msg,
          })
        })
      }
    },
    async changePassword() {
      const isValid = await this.$refs.obs3.validate()
      if (!isValid) {
        return
      }
      const user = JSON.parse(localStorage.getItem('user'))
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      const payload = {
        ...this.changePasswordObject,
        oldUsername: this.userDigest.username,
      }
      this.btnloading = true
      try {
        const { response } = await this.$axios.$post(
          '/user/updateCredentials',
          payload,
          config
        )

        if (response.loginAgain) {
          this.goHome()
        } else {
          const route = !this.userDigest.admin ? 'requests' : 'usermanagement'
          this.$router.push(`/${route}`)
        }
        this.$notification.success({
          message: 'Successful',
          description: 'Password Updated Successfully',
        })
        requestAnimationFrame(() => {
          this.$refs.obs3.reset()
          this.changePasswordObject = {}
          this.loading = false
          this.btnloading = false
          this.isModalVisible = false
        })
      } catch (err) {
        this.btnloading = false
        const { default: errorHandler } = await import('@/utils/errorHandler')
        errorHandler(err).forEach((msg) => {
          this.$notification.error({
            message: 'Error',
            description: msg,
          })
        })
      }
    },
    goHome() {
      this.$router.push('/')
    },
    async resetPassword() {
      const isValid = await this.$refs.obs2.validate()
      if (!isValid) {
        return
      }
      try {
        await this.$axios.$post('userNoAuth/passwordReset', null, {
          params: {
            username: this.email,
          },
        })

        this.$notification.success({
          message: 'Success',
          description: 'Pasword reset was successful',
        })
        requestAnimationFrame(() => {
          this.$refs.obs2.reset()
          this.email = ''
          this.isLoading = false
          this.toggleSignUpForm()
        })
      } catch (err) {
        this.isLoading = false
        const { default: errorHandler } = await import('@/utils/errorHandler')
        errorHandler(err).forEach((msg) => {
          this.$notification.error({
            message: 'Error',
            description: msg,
          })
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}
.signUp-text {
  margin: 10px 5px;
  font-size: 15px;
  font-family: 'GothamLight', sans-serif;
  font-style: normal;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    color: #fdb813;
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.fadeIn {
  animation-name: fadeIn;
}
</style>
