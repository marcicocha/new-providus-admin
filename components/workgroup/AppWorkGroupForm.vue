<template>
  <div>
    <a-form>
      <ValidationObserver ref="observer" tag="div">
        <a-row type="flex" :gutter="16">
          <a-col :span="12">
            <AppInput
              v-model="workGroupObject.order"
              label="Order"
              is-number
              :text-allowed="false"
              :char-allowed="false"
              :space-allowed="false"
              placeholder="order"
              required
              :disabled="!isCreateOnly"
              rules="required"
            />
          </a-col>
          <a-col :span="12">
            <AppInput
              v-model="workGroupObject.userWorkFlow"
              label="User WorkFlow"
              placeholder="Enter User’s WorkFlow"
              required
              rules="required"
            />
          </a-col>
          <a-col :span="24">
            <AppTextArea
              v-model="workGroupObject.userWorkFlowDescription"
              label="WorkFlow Description"
              placeholder="Enter WorkFlow Description"
              :rows="1"
              required
              rules="required"
            />
          </a-col>
          <a-col :span="12">
            <AppSwitchComponent
              v-model="workGroupObject.freeWorkFlow"
              label="Free WorkFlow ?"
            />
          </a-col>
          <a-col :span="12">
            <AppSelect
              v-model="workGroupObject.groupId"
              url="/systemConfiguration/resourceKeys"
              :call-back-func="
                (resp) => ({
                  text: resp,
                  value: resp,
                })
              "
              label="Group Id"
              placeholder="GroupId"
              :disabled="!isCreateOnly"
              required
              rules="required"
            />
          </a-col>
          <a-col :span="24">
            <AppTextArea
              v-model="workGroupObject.groupDescription"
              label="Group Description"
              placeholder="Group Description"
              :rows="1"
            />
          </a-col>
        </a-row>
      </ValidationObserver>
      <br />
      <AppButton :loading="isLoading" size="large" @click="workGroupHandler"
        >Submit</AppButton
      >
    </a-form>
  </div>
</template>
<script>
import { ValidationObserver } from 'vee-validate'
import AppButton from '@/components/UI/AppButton.vue'
import AppInput from '@/components/UI/AppInput.vue'
import AppSelect from '@/components/UI/AppSelect'
import AppTextArea from '@/components/UI/AppTextArea'
import AppSwitchComponent from '@/components/UI/AppSwitchComponent.vue'
export default {
  name: 'AppWorkGroupForm',
  components: {
    ValidationObserver,
    AppButton,
    AppInput,
    AppSwitchComponent,
    AppTextArea,
    AppSelect,
  },
  props: {
    currentWorkGroupObject: {
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
      roleObject: {},
      workGroupObject: {
        freeWorkFlow: false,
      },
    }
  },
  computed: {
    isCreateOnly() {
      return this.mode === 'CREATE_MODE'
    },
  },
  watch: {
    currentWorkGroupObject: {
      handler(newCurrentWorkGroupObject) {
        if (!newCurrentWorkGroupObject || this.mode === 'CREATE_MODE') {
          this.workGroupObject = {
            freeWorkFlow: false,
          }
        } else {
          this.workGroupObject = { ...newCurrentWorkGroupObject }
        }
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    async workGroupHandler() {
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
          await this.$axios.$post(
            '/workFlowGroup',
            this.workGroupObject,
            config
          )
          this.$notification.success({
            message: 'Success',
            description: 'Work Group Created Successfully',
          })
        } else {
          await this.$axios.$put('/workFlowGroup', this.workGroupObject, config)
          this.$notification.success({
            message: 'Success',
            description: 'Work Group Edited Successfully ',
          })
        }

        requestAnimationFrame(() => {
          this.$refs.observer.reset()
          this.workGroupObject = {}
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
