<template>
  <div>
    <a-form>
      <ValidationObserver ref="observer" tag="div">
        <a-row type="flex" :gutter="16">
          <a-col :span="12">
            <AppInput
              v-model="userObject.firstName"
              label="First Name"
              placeholder="Enter User’s First Name"
              is-text
              required
            />
          </a-col>
          <a-col :span="12">
            <AppInput
              v-model="userObject.lastName"
              label="Last Name"
              is-text
              placeholder="Enter User’s Last Name"
              required
            />
          </a-col>
          <a-col :span="24">
            <AppInput
              v-model="userObject.email"
              label="Email Address"
              placeholder="Enter User’s company email address"
              required
            />
          </a-col>
          <a-col :span="24">
            <AppSelect
              v-model="userObject.role"
              label="Role"
              url="/role/getRoleList"
              :call-back-func="
                (resp) => ({
                  text: resp,
                  value: resp,
                })
              "
              required
              placeholder="Select a role to promote user to"
            />
          </a-col>
          <a-col :span="12">
            <AppSwitchComponent
              v-model="userObject.admin"
              label="Is Admin"
              @change="changeWorkflowHandler"
            />
          </a-col>
          <a-col v-if="!userObject.admin" :span="12">
            <AppSwitchComponent
              v-model="userObject.freeWorkFlow"
              label="Free Work Flow"
              :disabled="userObject.admin"
            />
          </a-col>
          <a-col v-if="!userObject.admin" :span="12">
            <AppSelect
              v-model="userObject.workFlowGroup"
              label="Work Flow Group"
              url="/systemConfiguration/resourceKeys"
              :call-back-func="
                (resp) => ({
                  text: resp,
                  value: resp,
                })
              "
              required
              placeholder="Select a role to promote user to"
            />
          </a-col>
          <a-col v-if="!userObject.admin" :span="12">
            <AppSelect
              v-model="userObject.userWorkFlow"
              label="User WorkFlow"
              :url="`/workFlowGroup/findUserWorksFlowByGroupId?workFlowGroup=${userObject.workFlowGroup}`"
              :call-back-func="
                (resp) => ({
                  text: resp,
                  value: resp,
                })
              "
              required
              placeholder="Select a role to promote user to"
            />
          </a-col>
        </a-row>
      </ValidationObserver>
      <AppButton :loading="isLoading" size="large" @click="userHandler(mode)"
        >Submit</AppButton
      >
    </a-form>
  </div>
</template>
<script>
import { ValidationObserver } from 'vee-validate'
import AppButton from '@/components/UI/AppButton.vue'
import AppInput from '@/components/UI/AppInput.vue'
import AppSelect from '@/components/UI/AppSelect.vue'
import AppSwitchComponent from '@/components/UI/AppSwitchComponent.vue'
export default {
  name: 'AppUserManagementForm',
  components: {
    ValidationObserver,
    AppButton,
    AppInput,
    AppSelect,
    AppSwitchComponent,
  },
  props: {
    currentUserObject: {
      type: Object,
      default: () => {},
    },
    mode: {
      type: String,
      default: 'CREATE_MODE',
    },
  },
  data() {
    return {
      isLoading: false,
      userObject: {},
    }
  },
  watch: {
    currentUserObject: {
      handler(newCurrentUserObject) {
        if (!newCurrentUserObject || this.mode === 'CREATE_MODE') {
          this.userObject = {}
        } else {
          this.userObject = { ...newCurrentUserObject }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    validateEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(email).toLowerCase())
    },
    changeWorkflowHandler(value) {
      this.userObject = {
        ...this.userObject,
        freeWorkFlow: false,
        workFlowGroup: undefined,
        userWorkFlow: undefined,
      }
    },
    async userHandler() {
      const isValid = await this.$refs.observer.validate()
      if (!isValid) {
        return
      }
      const user = JSON.parse(localStorage.getItem('user'))
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      // if (!this.validateEmail(this.userObject.email)) {
      //   this.$notification.error({
      //     message: 'Warning',
      //     description: 'Email Entered is Invalid',
      //
      //   })
      //   return
      // }
      this.isLoading = true
      try {
        if (this.mode === 'CREATE_MODE') {
          await this.$axios.$post('/user', this.userObject, config)
          this.$notification.success({
            message: 'Success',
            description: 'User Created Successfully ',
          })
        } else {
          await this.$axios.$put('/user', this.userObject, config)
          this.$notification.success({
            message: 'Success',
            description: 'User Edited Successfully ',
          })
        }

        requestAnimationFrame(() => {
          this.$refs.observer.reset()
          this.userObject = {}
          this.isLoading = false
          this.$emit('formSubmissionCompleted')
        })
      } catch (err) {
        this.isLoading = false
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
