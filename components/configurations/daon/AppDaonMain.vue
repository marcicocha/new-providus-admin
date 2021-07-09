<template>
  <div class="animated fadeIn">
    <div class="page_header">
      <div class="search-bar">
        <AppButton :block="false" @click="toggleContextSearch()">
          <i class="fa fa-search" />
        </AppButton>
      </div>
    </div>
    <div v-if="isContextSearch" class="context-search-wrapper animated fadeIn">
      <a-row type="flex" :gutter="16">
        <a-col :span="8">
          <AppAdminInput
            v-model="contextSearchObject.fullName"
            label="Full Name"
            border
          />
        </a-col>
        <a-col :span="8">
          <AppAdminInput
            v-model="contextSearchObject.idType"
            label="ID Type"
            border
          />
        </a-col>
        <a-col :span="8">
          <AppAdminInput
            v-model="contextSearchObject.bvnToSelfie"
            label="BVN to Selfie"
            border
          />
        </a-col>
        <a-col :span="8">
          <AppAdminInput
            v-model="contextSearchObject.docToSelfie"
            label="Doc to Selfie"
            border
          />
        </a-col>
        <a-col :span="8">
          <AppAdminInput
            v-model="contextSearchObject.livenessToSelfie"
            label="Liveness to Selfie"
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
            @click="getDaonUserHandler()"
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
    <br />
    <a-table
      :columns="columns"
      :pagination="false"
      :data-source="dataSource"
      :loading="loading"
      :row-key="(record) => record.id"
    >
      <template slot="actions" slot-scope="text, record">
        <div style="text-align: right">
          <a
            href="javascript:;"
            style="color: #8c9090; font-size: 13px"
            @click="showModalHandler(record)"
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
    <AppManageDaon
      :is-modal-visible="isModalVisible"
      :currentDaonUserObject="currentDaonUserObject"
      @closeModal="closeModal"
    />
  </div>
</template>
<script>
import AppButton from '@/components/UI/AppButton.vue'
import AppAdminInput from '@/components/UI/AppAdminInput'
import AppPagination from '@/components/UI/AppPagination'
import AppManageDaon from '@/components/configurations/daon/AppManageDaon'

export default {
  name: 'AppBranchMain',
  components: {
    AppButton,
    AppAdminInput,
    AppPagination,
    AppManageDaon,
  },
  data() {
    return {
      loading: false,
      contextSearchObject: {},
      isContextSearch: false,
      pageNumber: 0,
      dataSource: [],
      isModalVisible: false,
      currentDaonUserObject: {},
      page: 0,
      totalElements: 0,
      columns: [
        {
          title: 'Daon ID',
          dataIndex: 'daonId',
        },
        {
          title: 'Full Name',
          dataIndex: 'fullName',
        },
        {
          title: 'Id Type',
          dataIndex: 'idType',
        },
        {
          title: '',
          dataIndex: 'actions',
          scopedSlots: { customRender: 'actions' },
        },
      ],
    }
  },
  mounted() {
    const contextSearchObject = {
      currentPage: 0,
    }
    this.fetchDaonUserHandler(contextSearchObject)
  },
  methods: {
    resetMethod() {
      this.contextSearchObject = {}
    },
    toggleContextSearch() {
      this.isContextSearch = !this.isContextSearch
    },
    showModalHandler(record) {
      this.currentDaonUserObject = record
      this.isModalVisible = true
    },
    getDaonUserHandler() {
      const contextSearchObject = {
        ...this.contextSearchObject,
        currentPage: 0,
      }
      this.fetchDaonUserHandler(contextSearchObject)
    },
    paginationChangeHandler(pageNumber, pageSize) {
      //
      const pageObject = {
        ...this.contextSearchObject,
        currentPage: pageNumber - 1,
        pageSize,
      }
      this.fetchDaonUserHandler(pageObject)
    },
    async fetchDaonUserHandler(obj) {
      const user = JSON.parse(localStorage.getItem('user'))
      const params = { ...obj }
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params,
      }
      this.loading = true
      try {
        const { response } = await this.$axios.$get('/daon/search', config)
        this.dataSource = response.content
        this.totalElements = response.totalElements
        this.pageNumber = response.pageable.pageNumber
        this.loading = false
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
    closeModal() {
      this.isModalVisible = false
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
