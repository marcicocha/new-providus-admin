<template>
  <div>
    <a-modal
      :visible="isModalVisible"
      width="500px"
      :confirm-loading="confirmLoading"
      :footer="null"
      :destroy-on-close="true"
      centered
      @cancel="closeModal"
    >
      <h1>
        {{ mode === 'CREATE_MODE' ? 'Add New' : 'Edit' }}
        System Config
      </h1>
      <a-form>
        <ValidationObserver ref="observer" tag="div">
          <AppInput
            v-model="systemConfigObject.configKey"
            label="Config Key"
            placeholder="Enter System Config Key"
            :disabled="!isCreateOnly"
            is-text
            required
            rules="required"
          />
          <AppInput
            v-model="systemConfigObject.configValue"
            label="Config Value"
            is-text
            placeholder="Enter Config Value"
            required
            rules="required"
          />
          <AppTextArea
            v-model="systemConfigObject.description"
            label="Description"
            placeholder="Enter Description"
            :rows="3"
            required
            rules="required"
          />
        </ValidationObserver>
      </a-form>
      <div>
        <AppButton :loading="loading" @click="userHandler">Submit</AppButton>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { ValidationObserver } from 'vee-validate'
import AppButton from '@/components/UI/AppButton.vue'
import AppInput from '@/components/UI/AppInput.vue'
import AppTextArea from '@/components/UI/AppTextArea.vue'

export default {
  name: 'AppManageSystemConfig',
  components: {
    AppButton,
    AppInput,
    AppTextArea,
    ValidationObserver,
  },
  props: {
    isModalVisible: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: '',
    },
    currentConfigObject: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      systemConfigObject: {},
      loading: false,
      confirmLoading: false,
    }
  },
  computed: {
    isCreateOnly() {
      return this.mode === 'CREATE_MODE'
    },
  },
  watch: {
    currentConfigObject: {
      handler(newCurrentConfigObject) {
        if (!newCurrentConfigObject || this.mode === 'CREATE_MODE') {
          this.systemConfigObject = {}
        } else {
          this.systemConfigObject = {
            ...newCurrentConfigObject,
          }
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
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
      this.loading = true

      try {
        if (this.mode === 'CREATE_MODE') {
          await this.$axios.$post(
            '/systemConfiguration',
            this.systemConfigObject,
            config
          )
          this.$notification.success({
            message: 'Success',
            description: 'System Config is Created Successfully',
            duration: 4000,
          })
        } else {
          await this.$axios.$put(
            '/systemConfiguration',
            this.systemConfigObject,
            config
          )
          this.$notification.success({
            message: 'Success',
            description: 'System Config is Updated Successfully',
            duration: 4000,
          })
        }

        requestAnimationFrame(() => {
          this.$refs.observer.reset()
          this.systemConfigObject = {}
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
