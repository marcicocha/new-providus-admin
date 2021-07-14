<template>
  <div>
    <a-modal
      :visible="isModalVisible"
      width="500px"
      :footer="null"
      :destroy-on-close="true"
      centered
      @cancel="closeModal"
    >
      <h1>
        {{ mode === 'CREATE_MODE' ? 'Add New' : 'Edit' }}
        Global Entity
      </h1>
      <a-form>
        <ValidationObserver ref="observer" tag="div">
          <AppInput
            v-model="globalEntityObject.name"
            label="Name"
            placeholder="Enter Name"
            is-text
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

export default {
  name: 'AppManageGlobalEntity',
  components: {
    AppButton,
    AppInput,
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
    currentGlobalEntityObject: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      globalEntityObject: {},
      loading: false,
    }
  },
  computed: {
    isCreateOnly() {
      return this.mode === 'CREATE_MODE'
    },
  },
  watch: {
    currentGlobalEntityObject: {
      handler(newCurrentGlobalEntityObject) {
        if (!newCurrentGlobalEntityObject || this.mode === 'CREATE_MODE') {
          this.globalEntityObject = {}
        } else {
          this.globalEntityObject = {
            ...newCurrentGlobalEntityObject,
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
            '/globalEntity',
            this.globalEntityObject,
            config
          )
          this.$notification.success({
            message: 'Success',
            description: 'Global Entity is Created Successfully ',
          })
        } else {
          await this.$axios.$put(
            '/globalEntity',
            this.globalEntityObject,
            config
          )
          this.$notification.success({
            message: 'Success',
            description: 'Global Entity is Updated Successfully',
          })
        }
        requestAnimationFrame(() => {
          this.$refs.observer.reset()
          this.globalEntityObject = {}
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
