<template>
  <div class="animated fadeIn">
    <div class="page_header">
      <div class="search-bar">
        <AppButton :block="false" @click="toggleContextSearch">
          <i class="fa fa-search" />
        </AppButton>
      </div>
    </div>
    <div v-if="isContextSearch" class="context-search-wrapper animated fadeIn">
      <a-row type="flex" :gutter="16">
        <a-col :span="8">
          <AppAdminInput
            v-model="searchObject.requestId"
            label="RequestId"
            border
          />
        </a-col>
        <a-col :span="8">
          <AppAdminInput
            v-model="searchObject.branch"
            label="Branch Code"
            border
          />
        </a-col>
        <a-col :span="8">
          <AppAdminInput v-model="searchObject.bvn" label="BVN" border />
        </a-col>
        <a-col :span="8">
          <AppAdminInput
            v-model="searchObject.firstName"
            label="First Name"
            border
          />
        </a-col>
        <a-col :span="8">
          <AppAdminInput
            v-model="searchObject.lastName"
            label="Last Name"
            border
          />
        </a-col>
        <a-col :span="8">
          <AppAdminInput
            v-model="searchObject.maritalStatus"
            label="Marital Status"
            border
          />
        </a-col>
        <a-col :span="8">
          <AppAdminInput
            v-model="searchObject.nationality"
            label="Nationality"
            border
          />
        </a-col>
        <a-col :span="8">
          <AppSelect
            v-model="searchObject.individualWorkFlow"
            label="Individual Work Flow"
            :remote="false"
            :data="[
              'BVN',
              'BASIC_INFO',
              'KIN_DETAILS',
              'SELFIE',
              'DOC_UPLOAD',
              'LIVENESS_CHECK',
              'REFERENCE_UPLOAD',
              'COMPLETED',
            ]"
            border
          />
        </a-col>
      </a-row>
      <div class="context-search-btn-wrapper">
        <div>
          <AppButton
            class="search-btn"
            icon="search"
            :loading="loading"
            @click="getRequestHandler"
            >Search</AppButton
          >
        </div>
        <div style="margin-left: 1rem">
          <AppButton class="search-btn" icon="undo" @click="resetMethod()"
            >Reset</AppButton
          >
        </div>
      </div>
    </div>
    <br />
    <a-table
      :columns="columns"
      :pagination="false"
      :data-source="dataSource"
      :loading="loading"
      :row-key="(record) => record.id"
    >
      <template slot="category" slot-scope="text, record">
        <span
          v-if="record.category === 'R'"
          style="background: #fdb813; padding: 10px; color: #f8f8f8"
          >{{ record.category }}</span
        >
        <span
          v-if="record.category === 'C'"
          style="background: #2e434e; padding: 10px; color: #f8f8f8"
          >{{ record.category }}</span
        >
      </template>
      <!-- <template slot="individualWorkFlow" slot-scope="text, record">
        <span>{{
          record.individualWorkFlow === 'COMPLETED'
            ? record.individualWorkFlow
            : 'INCOMPLETE'
        }}</span>
      </template> -->
      <template slot="date" slot-scope="text, record">
        {{ formatDate(record.date) }}
      </template>
      <template slot="status" slot-scope="text, record">
        <span
          class="status"
          :style="
            record.status === 'PENDING'
              ? 'background: #FFFCE6; color: #A19101'
              : record.status === 'APPROVED'
              ? 'background: #D2F9D9; color: #18C139'
              : record.status === 'REJECTED'
              ? 'background: #FDF7F7; color: #CC4C4C'
              : ''
          "
          >{{ record.status }}</span
        >
      </template>
      <template slot="actions" slot-scope="text, record">
        <div>
          <a-button
            v-if="record.status === 'PENDING'"
            type="primary"
            style="font-weight: bold"
            @click="$emit('reviewRequest', record)"
          >
            REVIEW REQUEST
          </a-button>
          <a
            v-if="record.status === 'APPROVED' || record.status === 'REJECTED'"
            href="javascript:;"
            style="color: #8c9090; font-size: 13px"
            @click="$emit('fetchCommentHandler', record.requestId)"
          >
            <a-icon type="eye" />
          </a>
        </div>
      </template>
    </a-table>
    <br />
    <div class="paginationCover">
      <AppPagination
        :default-current="0"
        :total="totalElements"
        :page-number="pageNumber"
        @change="paginationChangeHandler"
      />
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import AppPagination from '@/components/UI/AppPagination'
import AppButton from '@/components/UI/AppButton.vue'
import AppAdminInput from '@/components/UI/AppAdminInput'
import AppSelect from '@/components/UI/AppSelect'

export default {
  name: 'AppRequestTable',
  components: {
    AppPagination,
    AppButton,
    AppSelect,
    AppAdminInput,
  },
  props: {
    dataSource: {
      type: Array,
      default: () => [],
    },
    totalElements: {
      type: [String, Number],
      default: 0,
    },
    pageNumber: {
      type: [String, Number],
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchObject: {
        currentPage: 0,
      },
      isContextSearch: false,
    }
  },
  computed: {
    columns() {
      const allColumns = [
        {
          title: 'Request ID',
          dataIndex: 'requestId',
        },
        {
          title: 'Account Type',
          dataIndex: 'accountType',
        },
        {
          title: 'Date of Request',
          dataIndex: 'createdDate',
          scopedSlots: { customRender: 'date' },
        },
        {
          title: 'Status',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: 'WorkFlow',
          dataIndex: 'individualWorkFlow',
        },
        {
          title: 'Initiator ID',
          dataIndex: 'createdBy',
        },
      ]
      const pendingColumns = [
        {
          title: 'Request ID',
          dataIndex: 'requestId',
        },
        {
          title: 'Account Type',
          dataIndex: 'accountType',
        },
        {
          title: 'Date of Request',
          dataIndex: 'createdDate',
          scopedSlots: { customRender: 'date' },
        },
        {
          title: 'Status',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: 'WorkFlow',
          dataIndex: 'individualWorkFlow',
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          scopedSlots: { customRender: 'actions' },
        },
      ]
      const approvedColumns = [
        {
          title: 'Request ID',
          dataIndex: 'requestId',
        },
        {
          title: 'Account Type',
          dataIndex: 'accountType',
        },
        {
          title: 'Date of Request',
          dataIndex: 'createdDate',
          scopedSlots: { customRender: 'date' },
        },
        {
          title: 'Date Of Review',
          dataIndex: 'lastModifiedDate',
          scopedSlots: { customRender: 'date' },
        },
        {
          title: 'Initiator ID',
          dataIndex: 'createdBy',
        },
        {
          title: 'Comment',
          dataIndex: 'actions',
          scopedSlots: { customRender: 'actions' },
        },
      ]
      if (this.status === 'PENDING') {
        return pendingColumns
      }
      if (this.status === 'APPROVED' || this.status === 'REJECTED') {
        return approvedColumns
      }
      return allColumns
    },
  },
  methods: {
    resetMethod() {
      this.searchObject = {
        currentPage: 0,
      }
    },
    formatDate(date) {
      return moment(date).format('YYYY-MM-DD')
    },
    toggleContextSearch() {
      this.isContextSearch = !this.isContextSearch
    },
    getRequestHandler() {
      this.searchObject = {
        ...this.searchObject,
        currentPage: 0,
      }
      this.$emit('getRequestHandler', this.searchObject)
      this.isContextSearch = false
    },
    paginationChangeHandler(pageNumber, pageSize) {
      //
      const pageObject = {
        ...this.searchObject,
        currentPage: pageNumber - 1,
        pageSize,
      }
      this.$emit('getRequestHandler', pageObject)
    },
    onShowSizeChange(current, pageSize) {
      const pageObject = {
        ...this.searchObject,
        currentPage: current === 0 ? 0 : current - 1,
        pageSize,
      }
      this.$emit('getRequestHandler', pageObject)
    },
  },
}
</script>
<style lang="scss" scoped>
.context-search-btn-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
