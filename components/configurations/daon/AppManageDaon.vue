<template>
  <div>
    <a-drawer
      :visible="isModalVisible"
      :closable="false"
      :destroy-on-close="true"
      width="50%"
      @close="closeModal"
    >
      <h1>View Daon User</h1>
      <a-form>
        <a-row type="flex" :gutter="16">
          <a-col :span="8">
            <AppInput
              v-model="daonUserObject.daonId"
              label="Daon ID"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="daonUserObject.fullName"
              label="Full Name"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="daonUserObject.idType"
              label="ID Type"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="daonUserObject.bvnCheckId"
              label="Bvn Check Id"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="daonUserObject.challengeId"
              label="Challenge Id"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="daonUserObject.bvnToSelfie"
              label="BVN To Selfie"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="daonUserObject.docCheckId"
              label="Doc Check Id"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput v-model="daonUserObject.docId" label="Doc Id" disabled />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="daonUserObject.docNumber"
              label="Doc Number"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="daonUserObject.docToSelfie"
              label="Doc To Selfie"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="daonUserObject.issueDate"
              label="Issue Date"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="daonUserObject.expiryDate"
              label="Expiry Date"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="daonUserObject.livenessToSelfie"
              label="Liveness To Selfie"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="daonUserObject.processingStatus"
              label="Processing Status"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppSwitchComponent
              v-model="daonUserObject.deleted"
              label="Deleted"
              disabled
            />
          </a-col>
        </a-row>
      </a-form>
    </a-drawer>
  </div>
</template>
<script>
import moment from 'moment'
import AppInput from '@/components/UI/AppInput.vue'
import AppSwitchComponent from '@/components/UI/AppSwitchComponent.vue'

export default {
  name: 'AppManageBranch',
  components: {
    AppInput,
    AppSwitchComponent,
  },
  props: {
    isModalVisible: {
      type: Boolean,
      default: false,
    },
    currentDaonUserObject: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      daonUserObject: {},
      loading: false,
    }
  },
  watch: {
    currentDaonUserObject: {
      handler(newCurrentDaonUserObject) {
        if (!newCurrentDaonUserObject) {
          this.daonUserObject = {}
        } else {
          this.daonUserObject = {
            ...newCurrentDaonUserObject,
            issueDate: newCurrentDaonUserObject.issueDate
              ? moment(newCurrentDaonUserObject.issueDate).format('YYYY-MM-DD')
              : null,
            expiryDate: newCurrentDaonUserObject.expiryDate
              ? moment(newCurrentDaonUserObject.expiryDate).format('YYYY-MM-DD')
              : null,
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
  },
}
</script>
