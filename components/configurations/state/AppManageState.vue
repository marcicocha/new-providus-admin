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
        LGA
      </h1>
      <a-form>
        <ValidationObserver ref="observer" tag="div">
          <AppInput
            v-model="lgaObject.lga"
            label="LGA"
            placeholder="Enter LGA name"
            is-text
            required
          />

          <AppSelect
            v-model="lgaObject.stateName"
            label="State"
            url="/country/states?name=NIGERIA"
            :call-back-func="
              (resp) => ({
                text: resp,
                value: resp,
              })
            "
            required
            placeholder="Enter State Name"
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
import AppSelect from '@/components/UI/AppSelect'

export default {
  name: 'AppManageGlobalEntity',
  components: {
    AppButton,
    AppInput,
    AppSelect,
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
    currentLgaObject: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      lgaObject: {
        countryName: 'NIGERIA',
      },
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
    currentLgaObject: {
      handler(newCurrentLgaObject) {
        if (!newCurrentLgaObject || this.mode === 'CREATE_MODE') {
          this.lgaObject = {
            countryName: 'NIGERIA',
          }
        } else {
          this.lgaObject = {
            ...newCurrentLgaObject,
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
      const user = JSON.parse(localStorage.getItem('user'))
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      this.loading = true
      try {
        if (this.mode === 'CREATE_MODE') {
          await this.$axios.$post('/state', this.lgaObject, config)
          this.$notification.success({
            message: 'Success',
            description: 'LGA is Created Successfully ',
            duration: 4000,
          })
        } else {
          await this.$axios.$put('/state', this.lgaObject, config)
          this.$notification.success({
            message: 'Success',
            description: 'LGA is Updated Successfully',
            duration: 4000,
          })
        }
        requestAnimationFrame(() => {
          this.$refs.observer.reset()
          this.lgaObject = {}
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
