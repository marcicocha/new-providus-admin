<template>
  <div>
    <a-form>
      <ValidationObserver ref="observer" tag="div">
        <a-row type="flex" :gutter="16">
          <a-col :span="24">
            <AppInput
              v-model="roleObject.roleName"
              label="Role Name"
              placeholder="Enter Role Name"
              required
              rules="required"
            />
          </a-col>
          <a-col :span="24">
            <AppTextArea
              v-model="roleObject.description"
              label="Role Description"
              placeholder="Enter Role Description"
              :rows="1"
              required
            />
          </a-col>
          <a-col :span="24">
            <AppSwitchComponent v-model="roleObject.isAdmin" label="Is Admin" />
          </a-col>
          <a-col :span="24">
            <AppMultiSelectComponent
              v-model="roleObject.addPermissions"
              label="Permissions"
              placeholder="Please Select Permissions"
              :is-admin="roleObject.isAdmin"
              required
              @removedRecord="getDeletedrecords"
            />
          </a-col>
        </a-row>
      </ValidationObserver>
      <br />
      <AppButton :loading="isLoading" size="large" @click="roleHandler"
        >Submit</AppButton
      >
    </a-form>
  </div>
</template>
<script>
import { ValidationObserver } from 'vee-validate'
import AppButton from '@/components/UI/AppButton.vue'
import AppInput from '@/components/UI/AppInput.vue'
import AppTextArea from '@/components/UI/AppTextArea'
import AppMultiSelectComponent from '@/components/UI/AppMultiSelectComponent.vue'
import AppSwitchComponent from '@/components/UI/AppSwitchComponent.vue'
export default {
  name: 'AppRolesForm',
  components: {
    ValidationObserver,
    AppButton,
    AppInput,
    AppSwitchComponent,
    AppMultiSelectComponent,
    AppTextArea,
  },
  props: {
    currentRoleObject: {
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
      roleObject: {
        isAdmin: false,
      },
    }
  },
  watch: {
    currentRoleObject: {
      handler(newCurrentRoleObject) {
        if (!newCurrentRoleObject || this.mode === 'CREATE_MODE') {
          this.roleObject = {
            isAdmin: false,
          }
        } else {
          this.roleObject = { ...newCurrentRoleObject }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    getDeletedrecords(record) {
      if (record) {
        this.deletedPermissions.push({ permSysName: record })
      }
    },
    async roleHandler() {
      const isValid = await this.$refs.observer.validate()
      if (!isValid) {
        return
      }
      const user = JSON.parse(localStorage.getItem('user'))
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      this.isLoading = true
      try {
        if (this.mode === 'CREATE_MODE') {
          await this.$axios.$post('/role', this.roleObject, config)
          this.$notification.success({
            message: 'Success',
            description: 'Role Created Successfully ',
            duration: 4000,
          })
        } else {
          await this.$axios.$put('/role', this.roleObject, config)
          this.$notification.success({
            message: 'Success',
            description: 'Role Edited Successfully ',
            duration: 4000,
          })
        }

        requestAnimationFrame(() => {
          this.$refs.observer.reset()
          this.roleObject = {}
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
