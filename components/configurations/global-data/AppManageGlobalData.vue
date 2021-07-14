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
        Global Data
      </h1>
      <a-form>
        <ValidationObserver ref="observer" tag="div">
          <div>
            <AppInput
              v-model="globalDataObject.data"
              label="Data"
              placeholder="Enter Data"
              :disabled="!isCreateOnly"
              is-text
              required
              rules="required"
            />
          </div>
          <div>
            <AppInput
              v-model="globalDataObject.value"
              label="Value"
              is-text
              placeholder="Enter Value"
              required
              rules="required"
            />
          </div>
          <div>
            <AppInput
              v-model="globalDataObject.code"
              label="Code"
              is-number
              :space-allowed="false"
              :char-allowed="false"
              :text-allowed="false"
              placeholder="Enter Code"
              required
              rules="required"
            />
          </div>
          <div>
            <AppTextArea
              v-model="globalDataObject.description"
              label="Description"
              placeholder="Enter Description"
              :rows="3"
              required
              rules="required"
            />
          </div>
        </ValidationObserver>
      </a-form>
      <div>
        <AppButton :loading="loading" @click="userHandler()">Submit</AppButton>
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
  name: 'AppManageGlobalData',
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
    currentGlobalDataObject: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      globalDataObject: {},
      loading: false,
    }
  },
  computed: {
    isCreateOnly() {
      return this.mode === 'CREATE_MODE'
    },
  },
  watch: {
    currentGlobalDataObject: {
      handler(newCurrentGlobalDataObject) {
        if (!newCurrentGlobalDataObject || this.mode === 'CREATE_MODE') {
          this.globalDataObject = {}
        } else {
          this.globalDataObject = {
            ...newCurrentGlobalDataObject,
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
          await this.$axios.$post('/globalData', this.globalDataObject, config)
          this.$notification.success({
            message: 'Success',
            description: 'Global Data is created Successfully',
          })
        } else {
          await this.$axios.$put('/globalData', this.globalDataObject, config)
          this.$notification.success({
            message: 'Success',
            description: 'Global Data is updated Successfully ',
          })
        }
        requestAnimationFrame(() => {
          this.$refs.observer.reset()
          this.globalDataObject = {}
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
