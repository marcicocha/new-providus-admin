<template>
  <div>
    <a-modal
      :visible="visible"
      :closable="false"
      :footer="null"
      :destroy-on-close="true"
      :dialog-style="{ top: '20px' }"
      width="80%"
      @cancel="closeDrawer"
    >
      <div v-if="pendingSpinner" class="loader">
        <i class="fas fa-spinner fa-pulse" style="color: #fdb813"></i>
      </div>
      <div>
        <a-row type="flex" :gutter="16">
          <a-col :span="6">
            <div class="card image-wrapper">
              <div class="card-image">
                <figure style="width: 100%">
                  <img
                    :src="`data:image/png;base64, ${userObject.selfie}`"
                    alt="Placeholder image"
                    class="selfie"
                    style="width: 100%"
                  />
                </figure>
              </div>
            </div>
            <div class="link-wrapper">
              <ul>
                <li
                  :class="{ 'is-toggle-active': isProspect }"
                  @click="toggleMethod('prospect')"
                >
                  View Prospect Information
                </li>
                <li
                  :class="{ 'is-toggle-active': isUploaded }"
                  @click="toggleMethod('upload')"
                >
                  View Uploaded Documents
                </li>
              </ul>
            </div>
            <br />
            <a-row type="flex" :gutter="16">
              <a-col :span="12">
                <AppButton
                  :ghost="operation !== 'REJECT'"
                  type="danger"
                  @click="toggleMethod('REJECT')"
                  >Reject</AppButton
                >
              </a-col>
              <a-col :span="12">
                <AppButton @click="toggleMethod('ACCEPT')">Accept</AppButton>
              </a-col>
            </a-row>
          </a-col>
          <a-col v-if="!pendingSpinner" :span="18">
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
              @closeDrawer="closeDrawer"
              @cancel="toggleMethod('prospect')"
            />
          </a-col>
        </a-row>
      </div>
    </a-modal>
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
    pendingSpinner: {
      type: Boolean,
      default: false,
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
<style lang="scss" scoped>
.link-wrapper {
  margin-top: 15px;
  ul {
    list-style-type: none;
    padding-left: 0;
    li {
      //   background: yellow;
      margin: 0px;
      padding: 15px 10px;
      cursor: pointer;
      font-family: GothamMedium;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 100%;
      color: #2e434e;
      transition: all 0.5s;

      &:hover {
        background: #eff3f6;
      }
    }
  }
}
.is-toggle-active {
  background: #eff3f6;
}
.loader {
  position: absolute;
  display: flex;
  width: 90%;
  height: 90%;
  background: rgba(255, 255, 255, 0.589);
  justify-content: center;
  align-items: center;
  z-index: 1000;
  i {
    font-size: 350%;
  }
}
</style>
