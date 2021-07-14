<template>
  <div>
    <h1>{{ action === 'ACCEPT' ? 'Accept' : 'Reject' }} Application</h1>
    <a-divider />
    <p>Add Comment Below</p>
    <div class="">
      <div>
        <div class="field">
          <div class="control">
            <ValidationObserver ref="observer" tag="div">
              <AppTextArea
                v-model="payloadObject.comment"
                class="textarea"
                placeholder="Type in comments here"
                :rows="10"
                :required="action === 'REJECT'"
                :rules="action === 'REJECT' ? 'required' : ''"
              ></AppTextArea>
            </ValidationObserver>
          </div>
        </div>
      </div>
      <a-row type="flex" :gutter="16" class="button-wrapper">
        <a-col :span="12">
          <AppButton
            class="custom-btn"
            style="width: 100%"
            @click="acceptRejectHandler()"
            >Submit</AppButton
          >
        </a-col>
        <a-col :span="12">
          <AppButton
            class="custom-btn"
            style="width: 100%"
            ghost
            type="danger"
            @click="cancelFunc"
            >Cancel</AppButton
          >
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import { ValidationObserver } from 'vee-validate'
import AppButton from '@/components/UI/AppButton.vue'
import AppTextArea from '@/components/UI/AppTextArea'
export default {
  name: 'AppAcceptRejectComponent',
  components: {
    AppButton,
    AppTextArea,
    ValidationObserver,
  },
  props: {
    action: {
      type: String,
      default: 'ACCEPT',
    },
    requestId: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {
      payloadObject: {},
    }
  },
  computed: {
    actionComputed() {
      return this.action
    },
  },
  methods: {
    cancelFunc() {
      this.$emit('cancel')
    },

    async acceptRejectHandler() {
      const isValid = await this.$refs.observer.validate()
      if (!isValid) {
        return
      }
      const user = JSON.parse(localStorage.getItem('user'))
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      const payload = { ...this.payloadObject, requestId: this.requestId }
      try {
        if (this.action === 'ACCEPT') {
          const { response } = await this.$axios.$post(
            '/individualAdmin/approveIndividual',
            payload,
            config
          )
          this.$notification.success({
            message: 'Success',
            description: response,
          })
        } else {
          const { response } = await this.$axios.$post(
            '/individualAdmin/rejectIndividual',
            payload,
            config
          )
          this.$notification.success({
            message: 'Success',
            description: response,
          })
        }
        requestAnimationFrame(() => {
          this.$refs.observer.reset()
          this.payloadObject = {}
          this.isLoading = false
          this.$emit('closeDrawer')
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
<style lang="scss" scoped>
label {
  display: block !important;
}
h1 {
  margin-bottom: 35px;
  font-family: 'GothamMedium', sans-serif;
  font-style: normal;
  font-weight: bold;
}
p {
  font-family: 'GothamLight', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
}
.button-wrapper {
  margin-top: 10px;
}
</style>
