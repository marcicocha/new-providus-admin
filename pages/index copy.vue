<template>
  <div class="animated fadeIn">
    <AppTitleComponent
      :heading="descriptionsComputed.header"
      :description="descriptionsComputed.description"
    />
    <hr />
    <div v-if="!toggleForm" class="columns is-multiline">
      <div class="column is-full">
        <AppInput
          v-model="userObject.username"
          label="Username"
          input-type="email"
          placeholder="Enter Your Username"
          :class="validateUser.email_error"
        />
      </div>
      <div class="column is-full">
        <AppInput
          v-model.trim="userObject.password"
          label="Password"
          input-type="password"
          placeholder="Enter Your Password"
          :class="validateUser.password_error"
        />
      </div>
      <div class="column is-full">
        <AppButton
          title="Sign In"
          :loading="isLoading"
          style="padding: 30px"
          @click="logIn"
        />
      </div>
      <p class="signUp-text" @click="toggleSignUpForm">Forgotten Password ?</p>
    </div>
    <div v-if="toggleForm" class="columns is-multiline">
      <div class="column is-full">
        <AppInput
          v-model.trim="email"
          label="Email address"
          input-type="email"
          placeholder="Please Input your email address"
          :class="validateUser.password_error"
        />
      </div>
      <div class="column is-full">
        <AppButton
          title="Reset Password"
          :loading="isLoading"
          style="padding: 30px"
          @click="resetPassword"
        />
      </div>
      <p class="signUp-text" @click="toggleSignUpForm">Sign In ?</p>
    </div>
    <AppModal :is-visible="isModalVisible">
      <template slot="modal-title"><h1>Change Password</h1></template>
      <template slot="content">
        <div class="columns is-multiline">
          <div class="column is-full">
            <AppInput
              v-model="changePasswordObject.newUsername"
              label="User Name"
            />
          </div>
          <div class="column is-full">
            <AppInput
              v-model="changePasswordObject.oldPassword"
              label="Enter Old Password"
              placeholder="Enter Old Password"
              required
              input-type="password"
            />
          </div>
          <div class="column is-full">
            <AppInput
              v-model="changePasswordObject.password"
              label="Enter New Password"
              placeholder="Enter New Password"
              required
              input-type="password"
            />
          </div>
          <div class="column is-full">
            <AppInput
              v-model="changePasswordObject.confirmPassword"
              label="Confirm Password"
              placeholder="Confirm Password"
              required
              input-type="password"
            />
          </div>
          <div class="column">
            <AppButton
              class="custom-btn"
              title="Submit"
              style="padding: 20px"
              :loading="btnloading"
              @click="changePassword()"
            />
          </div>
        </div>
      </template>
    </AppModal>
  </div>
</template>
<script>
import AppTitleComponent from '@/components/UI/AppTitleComponent'
import AppInput from '@/components/UI/AppInput.vue'
import AppButton from '@/components/UI/AppButton.vue'
import AppModal from '@/components/UI/AppModal'
export default {
  components: {
    AppTitleComponent,
    AppInput,
    AppButton,
    AppModal,
  },
  layout: 'adminSignUp',
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
    toggleSignUpForm() {
      this.toggleForm = !this.toggleForm
    },
    async logIn() {
      // eslint-disable-next-line no-useless-escape
      // const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
      let proceed = false
      // this.validEmail = reg.test(this.userObject.username)
      if (!this.userObject.username) {
        this.validateUser.email_error = { 'form-error': true }
        this.$toast.open({
          message: `<p class="toast-title">Validation Message</p>
                    <p class="toast-msg"> Username / Email Field Required </p>`,
          type: 'error',
          duration: 4000,
          dismissible: true,
        })
        proceed = false
        return
      }
      if (this.userObject.username) {
        this.validateUser.email_error = { 'form-error': false }
        proceed = true
      }
      // if (this.validEmail === false) {
      //   this.validateUser.email_error = { 'form-error': true }
      //   this.$toast.open({
      //     message: `<p class="toast-title">Validation Message</p>
      //               <p class="toast-msg"> Email Entered is Invalid </p>`,
      //     type: 'error',
      //     duration: 4000,
      //     dismissible: true,
      //   })
      //   proceed = false
      // } else {
      //   this.validateUser.email_error = { 'form-error': false }
      //   proceed = true
      // }
      if (this.userObject.password === '') {
        this.validateUser.password_error = { 'form-error': true }
        this.$toast.open({
          message: `<p class="toast-title">Validation Message</p>
                    <p class="toast-msg"> Password Field Required </p>`,
          type: 'error',
          duration: 4000,
          dismissible: true,
        })
        proceed = false
      } else {
        this.validateUser.password_error = { 'form-error': false }
        proceed = true
      }
      if (this.userObject.password !== '' && proceed) {
        this.isLoading = true
        try {
          const { response } = await this.$axios.$post(
            '/jwt/authenticate',
            this.userObject
          )

          this.userDigest = response

          localStorage.setItem('user', JSON.stringify(this.userDigest))
          // this.token = token
          // this.$cookies.set('token', token)

          console.log('IT NOT THERE YET')
          if (this.userDigest.firstTimeLogin) {
            console.log('IT CAME HERE')
            this.isModalVisible = true
          } else {
            const route = !this.userDigest.admin ? 'requests' : 'usermanagement'
            this.$router.push(`/${route}`)
          }
          this.isLoading = false
        } catch (err) {
          let errorMessage = ''

          this.isLoading = false

          // Network Error
          if (String(err).includes('Network')) {
            errorMessage = err
            this.$toast.open({
              message: `<p class="toast-title">Error Message</p>
                    <p class="toast-msg"> Network Error </p>`,
              type: 'error',
              duration: 4000,
              dismissible: true,
            })
            return
          }

          // Error Message from Backend
          // eslint-disable-next-line no-prototype-builtins
          if (err.hasOwnProperty('response')) {
            const res = err.response.data
            errorMessage = res.errorMessage

            this.$toast.open({
              message: `<p class="toast-title">Error Message</p>
                    <p class="toast-msg"> ${errorMessage} </p>`,
              type: 'error',
              duration: 4000,
              dismissible: true,
            })
          }
        }
      }
    },
    async changePassword() {
      if (
        this.changePasswordObject.newUsername &&
        this.changePasswordObject.oldPassword &&
        this.changePasswordObject.newUsername &&
        this.changePasswordObject.password &&
        this.changePasswordObject.confirmPassword
      ) {
        const user = JSON.parse(localStorage.getItem('user'))
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        }
        const payload = {
          ...this.changePasswordObject,
          oldUsername: this.userDigest.username,
        }
        try {
          const { response } = await this.$axios.$post(
            '/user/updateCredentials',
            payload,
            config
          )
          this.btnloading = false
          this.isModalVisible = false
          if (response.loginAgain) {
            this.goHome()
          } else {
            const route = !this.userDigest.admin ? 'requests' : 'usermanagement'
            this.$router.push(`/${route}`)
          }
          this.$toast.open({
            message: `<p class="toast-title">Success</p>
                    <p class="toast-msg"> Password Updated Successfully </p>`,
            type: 'success',
            duration: 4000,
            dismissible: true,
          })
          this.changePasswordObject = {}
        } catch (err) {
          let errorMessage = ''

          this.btnloading = false

          // Network Error
          if (String(err).includes('Network')) {
            errorMessage = err
            this.$toast.open({
              message: `<p class="toast-title">Error</p>
                    <p class="toast-msg"> Network Error </p>`,
              type: 'error',
              duration: 4000,
              dismissible: true,
            })
            return
          }

          // Error Message from Backend
          // eslint-disable-next-line no-prototype-builtins
          if (err.hasOwnProperty('response')) {
            const res = err.response.data

            errorMessage = res.errorMessage

            this.$toast.open({
              message: `<p class="toast-title">Error</p>
                    <p class="toast-msg"> ${errorMessage} </p>`,
              type: 'error',
              duration: 4000,
              dismissible: true,
            })
          }
        }
      } else {
        this.$toast.open({
          message: `<p class="toast-title">Warning</p>
                    <p class="toast-msg"> please fill the required filled </p>`,
          type: 'warning',
          duration: 4000,
          dismissible: true,
        })
      }
    },
    goHome() {
      this.$router.push('/')
    },
    async resetPassword() {
      try {
        await this.$axios.$post('userNoAuth/passwordReset', null, {
          params: {
            username: this.email,
          },
        })
        this.isLoading = false
        this.toggleSignUpForm()
        this.$toast.open({
          message: `<p class="toast-title">Success</p>
                    <p class="toast-msg">Password reset Successful</p>`,
          type: 'success',
          duration: 4000,
          dismissible: true,
        })
      } catch (err) {
        let errorMessage = ''

        this.isLoading = false

        // Network Error
        if (String(err).includes('Network')) {
          errorMessage = err
          this.$toast.open({
            message: `<p class="toast-title">Error</p>
                    <p class="toast-msg"> Network Error </p>`,
            type: 'error',
            duration: 4000,
            dismissible: true,
          })
          return
        }

        // Error Message from Backend
        // eslint-disable-next-line no-prototype-builtins
        if (err.hasOwnProperty('response')) {
          const res = err.response.data
          errorMessage = res.errorMessage

          this.$toast.open({
            message: `<p class="toast-title">Error</p>
                    <p class="toast-msg"> ${errorMessage} </p>`,
            type: 'error',
            duration: 4000,
            dismissible: true,
          })
        }
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
