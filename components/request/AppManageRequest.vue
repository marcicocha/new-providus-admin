<template>
  <div>
    <a-drawer
      :visible="visible"
      :closable="false"
      :destroy-on-close="true"
      width="70%"
      @close="closeDrawer"
    >
      <a-row type="flex" :gutter="16">
        <a-col :span="6">
          <div class="card image-wrapper">
            <div class="card-image">
              <figure class="image is-5by3" style="text-align: center">
                <img
                  :src="`data:image/png;base64, ${userObject.selfie}`"
                  alt="Placeholder image"
                  class="selfie"
                />
                <span>R</span>
              </figure>
            </div>
          </div>
          <div class="link-wrapper">
            <ul>
              <li
                :class="{ 'is-toggle-active': isProspect }"
                @click="toggleMethod('prospect')"
              >
                Prospect Information
              </li>
              <li
                :class="{ 'is-toggle-active': isUploaded }"
                @click="toggleMethod('upload')"
              >
                Uploaded
              </li>
            </ul>
          </div>
          <div
            class="button-wrapper columns is-multiline"
            :style="operation ? 'opacity: 0' : ''"
          >
            <div class="column">
              <AppButton
                class="custom-btn"
                title="Reject"
                style="padding: 10px; width: 100%"
                color="red-outline"
                @click="toggleMethod('REJECT')"
              />
            </div>
            <div class="column">
              <AppButton
                class="custom-btn"
                title="Accept"
                style="padding: 10px; width: 100%"
                color="success"
                @click="toggleMethod('ACCEPT')"
              />
            </div>
          </div>
        </a-col>
        <a-col :span="18">
          <AppAccountDetailsComponent
            v-if="isProspect"
            :user-object="userObject"
            style="width: 100%"
          />
          <AppUploadedDocumentComponent
            v-if="isUploaded"
            :user-object="userObject"
          />
          <AppAcceptRejectComponent
            v-if="operation"
            style="padding: 0px 200px"
            :action="operation"
            :request-id="userObject.requestId ? userObject.requestId : ''"
            @success="closeModal('success')"
            @cancel="toggleMethod('prospect')"
          />
        </a-col>
      </a-row>
    </a-drawer>
  </div>
</template>
<script>
import AppUploadedDocumentComponent from '@/components/AppUploadedDocumentComponent.vue'
import AppAccountDetailsComponent from '@/components/AppAccountDetailsComponent.vue'
import AppAcceptRejectComponent from '@/components/AppAcceptRejectComponent.vue'
import AppButton from '@/components/UI/AppButton.vue'
export default {
  name: 'AppManageRequest',
  components: {
    AppAccountDetailsComponent,
    AppUploadedDocumentComponent,
    AppAcceptRejectComponent,
    AppButton,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    userObject: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      operation: '',
      isUploaded: false,
      isProspect: true,
    }
  },
  methods: {
    closeDrawer() {
      this.$emit('closeDrawer')
    },
    toggleMethod(str) {
      if (str) {
        if (str === 'prospect') {
          this.isProspect = true
          this.isUploaded = false
          this.operation = ''
        } else if (str === 'upload') {
          this.isProspect = false
          this.operation = ''
          this.isUploaded = true
        } else {
          this.operation = str
          this.isProspect = false
          this.isUploaded = false
        }
      }
    },
  },
}
</script>
