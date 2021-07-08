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
        Branch
      </h1>
      <a-form>
        <ValidationObserver ref="observer" tag="div">
          <AppInput
            v-model="branchObject.branchCode"
            label="Branch Code"
            placeholder="Enter Branch Code"
            is-number
            :spaceAllowed="false"
            :charAllowed="false"
            :textAllowed="false"
            required
            rules="required"
          />
          <AppInput
            v-model="branchObject.branchName"
            label="Branch Name"
            placeholder="Enter Branch Name"
            is-text
            required
            rules="required"
          />
          <AppInput
            v-model="branchObject.address"
            label="Address"
            placeholder="Enter Addres"
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
  name: 'AppManageBranch',
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
    currentBranchObject: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      branchObject: {},
      loading: false,
    }
  },
  computed: {
    isCreateOnly() {
      return this.mode === 'CREATE_MODE'
    },
  },
  watch: {
    currentBranchObject: {
      handler(newCurrentBranchObject) {
        if (!newCurrentBranchObject || this.mode === 'CREATE_MODE') {
          this.branchObject = {}
        } else {
          this.branchObject = {
            ...newCurrentBranchObject,
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
          await this.$axios.$post('/branch', this.branchObject, config)
          this.$notification.success({
            message: 'Success',
            description: 'Branch is Created Successfully',
            duration: 4000,
          })
        } else {
          await this.$axios.$put('/branch', this.branchObject, config)
          this.$notification.success({
            message: 'Success',
            description: 'Branch is Updated Successfully',
            duration: 4000,
          })
        }
        requestAnimationFrame(() => {
          this.$refs.observer.reset()
          this.branchObject = {}
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
