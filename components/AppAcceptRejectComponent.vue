<template>
  <div>
    <h1>{{ actionComputed === 'ACCEPT' ? 'Accept' : 'Reject' }} Application</h1>
    <hr />
    <p>Add Comment Below</p>
    <div class="">
      <!-- <div class="column is-full">
        <label class="checkbox">
          <input type="checkbox" />
          Reason 2
        </label>
      </div>
      <div class="column is-full">
        <label class="checkbox">
          <input type="checkbox" />
          Reason 3
        </label>
      </div>
      <div class="column is-full">
        <label class="checkbox">
          <input type="checkbox" />
          Reason 4
        </label>
      </div>
      <div class="column is-full">
        <label class="checkbox">
          <input type="checkbox" />
          Reason 5
        </label>
      </div>
      <div class="column is-full">
        <label class="checkbox">
          <input type="checkbox" />
          Other
        </label>
      </div> -->
      <div class="column is-full">
        <div class="field">
          <div class="control">
            <textarea
              v-model="payloadObject.comment"
              class="textarea"
              placeholder="Type in comments here"
              rows="10"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="button-wrapper columns is-multiline">
        <div class="column">
          <AppButton
            class="custom-btn"
            title="Submit"
            style="padding: 15px; width: 100%"
            color="dark"
            @click="acceptRejectHandler(actionComputed)"
          />
        </div>
        <div class="column">
          <AppButton
            class="custom-btn"
            title="Cancel"
            style="padding: 15px; width: 100%"
            color="dark-outline"
            @click="cancelFunc"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import AppButton from '@/components/UI/AppButton.vue'
export default {
  name: 'AppAcceptRejectComponent',
  components: {
    AppButton,
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
    requestIdComputed() {
      return this.requestId
    },
    actionComputed() {
      return this.action
    },
  },
  methods: {
    cancelFunc() {
      this.$emit('cancel')
    },
    acceptRejectHandler(action) {
      if (action === 'ACCEPT') {
        this.acceptMethod(this.requestIdComputed)
      } else if (action === 'REJECT') {
        this.rejectMethod(this.requestIdComputed)
      }
    },
    async acceptMethod(requestId) {
      if (requestId) {
        const user = JSON.parse(localStorage.getItem('user'))
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        }
        const payload = { ...this.payloadObject, requestId }
        try {
          const { response } = await this.$axios.$post(
            '/individualAdmin/approveIndividual',
            payload,
            config
          )
          this.$toast.open({
            message: `<p class="toast-title">Success</p>
                    <p class="toast-msg"> ${response} </p>`,
            type: 'success',
            duration: 4000,
            dismissible: true,
          })
          this.$emit('success')
        } catch (err) {
          let errorMessage = ''

          this.isLoading = false

          // Network Error
          if (String(err).includes('Network')) {
            errorMessage = err
            this.$toast.open({
              message: `<p class="toast-title">Error</p>
                    <p class="toast-msg"> Network Error </p>`,
              type: 'error',
              duration: 10000,
              dismissible: true,
            })
            return
          }

          // Error Message from Backend
          // eslint-disable-next-line no-prototype-builtins
          if (err.hasOwnProperty('response')) {
            const res = err.response.data

            errorMessage = res.errorMessage

            this.$toast.open({
              message: `<p class="toast-title">Error</p>
                    <p class="toast-msg"> ${errorMessage} </p>`,
              type: 'error',
              duration: 10000,
              dismissible: true,
            })
          }
        }
      }
    },
    async rejectMethod(requestId) {
      if (requestId) {
        const user = JSON.parse(localStorage.getItem('user'))
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        }
        const payload = { ...this.payloadObject, requestId }
        try {
          const { response } = await this.$axios.$post(
            '/individualAdmin/rejectIndividual',
            payload,
            config
          )
          this.$toast.open({
            message: `<p class="toast-title">Success</p>
                    <p class="toast-msg"> ${response} </p>`,
            type: 'success',
            duration: 10000,
            dismissible: true,
          })
          this.$emit('success')
        } catch (err) {
          let errorMessage = ''

          this.isLoading = false

          // Network Error
          if (String(err).includes('Network')) {
            errorMessage = err
            this.$toast.open({
              message: `<p class="toast-title">Error</p>
                    <p class="toast-msg"> Network Error </p>`,
              type: 'error',
              duration: 10000,
              dismissible: true,
            })
            return
          }

          // Error Message from Backend
          // eslint-disable-next-line no-prototype-builtins
          if (err.hasOwnProperty('response')) {
            const res = err.response.data

            errorMessage = res.errorMessage

            this.$toast.open({
              message: `<p class="toast-title">Error</p>
                    <p class="toast-msg"> ${errorMessage} </p>`,
              type: 'error',
              duration: 10000,
              dismissible: true,
            })
          }
        }
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
