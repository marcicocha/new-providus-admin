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
        State
      </h1>
      <a-form>
        <ValidationObserver ref="observer" tag="div">
          <AppInput
            v-model="countryObject.state"
            label="State Name"
            placeholder="Enter State Name"
            is-text
            required
            rules="required"
          />
          <AppInput
            v-model="countryObject.countryName"
            label="Country Name"
            placeholder="Enter Country Name"
            is-text
            required
            rules="required"
          />
        </ValidationObserver>
      </a-form>
      <div>
        <AppButton :loading="loading" @click="userHandler(mode)"
          >Submit</AppButton
        >
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
    currentCountryObject: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      countryObject: {
        countryName: 'NIGERIA',
      },
      loading: false,
    }
  },
  computed: {
    isCreateOnly() {
      return this.mode === 'CREATE_MODE'
    },
  },
  watch: {
    currentCountryObject: {
      handler(newCurrentCountryObject) {
        if (!newCurrentCountryObject || this.mode === 'CREATE_MODE') {
          this.countryObject = {
            countryName: 'NIGERIA',
          }
        } else {
          this.countryObject = {
            ...newCurrentCountryObject,
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
          await this.$axios.$post('/country', this.countryObject, config)
          this.$notification.success({
            message: 'Success',
            description: 'State is Created Successfully',
            duration: 4000,
          })
        } else {
          await this.$axios.$put('/country', this.countryObject, config)
          this.$notification.success({
            message: 'Success',
            description: 'State is Updated Successfully',
            duration: 4000,
          })
        }
        requestAnimationFrame(() => {
          this.$refs.observer.reset()
          this.countryObject = {}
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
