<template>
  <div class="animated fadeIn">
    <div class="page_header">
      <div class="search-bar">
        <AppButton :block="false" @click="toggleContextSearch()">
          <i class="fa fa-search" />
        </AppButton>
      </div>
      <div class="add-button-wrapper">
        <AppButton
          class="add-button"
          icon="plus"
          @click="toggleModal('CREATE_MODE', {})"
          >Add System Config</AppButton
        >
      </div>
    </div>
    <div v-if="isContextSearch" class="context-search-wrapper animated fadeIn">
      <a-row type="flex" :gutter="16">
        <a-col :span="12">
          <AppAdminInput
            v-model="contextSearchObject.configKey"
            label="Config Key"
            border
          />
        </a-col>
        <a-col :span="12">
          <AppAdminInput
            v-model="contextSearchObject.configValue"
            label="Config Value"
            border
          />
        </a-col>
      </a-row>
      <div class="context-search-btn-wrapper">
        <div>
          <AppButton
            icon="search"
            :block="false"
            :loading="loading"
            @click="getConfigMethod()"
            >Search</AppButton
          >
        </div>
        <div style="margin-left: 1rem">
          <AppButton :block="false" title="" icon="undo" @click="resetMethod()"
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
      <template slot="actions" slot-scope="text, record">
        <div style="text-align: right">
          <a-button-group class="link-group">
            <a-dropdown placement="bottomRight">
              <a-button type="primary" icon="switcher" class="table__btn" />
              <a-menu slot="overlay">
                <a-menu-item>
                  <a
                    href="javascript:;"
                    style="color: #8c9090; font-size: 13px"
                    @click="toggleModal('UPDATE_MODE', record)"
                  >
                    <a-icon type="edit" />&nbsp; Edit Config
                  </a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-button-group>
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
    <AppManageSystemConfig
      :is-modal-visible="isModalVisible"
      :current-config-object="currentConfigObject"
      :mode="mode"
      @closeModal="closeModal"
    />
  </div>
</template>
<script>
import AppButton from '@/components/UI/AppButton.vue'
import AppAdminInput from '@/components/UI/AppAdminInput'
import AppPagination from '@/components/UI/AppPagination'
import AppManageSystemConfig from '@/components/configurations/system-config/AppManageSystemConfig'

export default {
  name: 'AppSystemConfigMain',
  components: {
    AppButton,
    AppAdminInput,
    AppPagination,
    AppManageSystemConfig,
  },
  data() {
    return {
      isLoading: false,
      pageNumber: 0,
      loading: false,
      mode: 'CREATE_MODE',
      contextSearchObject: {
        currentPage: 0,
      },
      isContextSearch: false,
      dataSource: [],
      isModalVisible: false,
      currentConfigObject: {},
      totalElements: 0,
      columns: [
        {
          title: 'Config Key',
          dataIndex: 'configKey',
        },
        {
          title: 'Config Value',
          dataIndex: 'configValue',
        },
        {
          title: 'Description',
          dataIndex: 'description',
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
    this.fetchConfig(contextSearchObject)
  },
  methods: {
    resetMethod() {
      this.contextSearchObject = {}
    },
    toggleContextSearch() {
      this.isContextSearch = !this.isContextSearch
    },
    toggleModal(mode, record) {
      if (mode) {
        this.mode = mode
        this.currentConfigObject = record
        this.isModalVisible = true
      }
    },
    paginationChangeHandler(pageNumber, pageSize) {
      //
      const pageObject = {
        ...this.contextSearchObject,
        currentPage: pageNumber - 1,
        pageSize,
      }
      this.fetchConfig(pageObject)
    },
    getConfigMethod() {
      const contextSearchObject = {
        ...this.contextSearchObject,
        currentPage: 0,
      }
      this.fetchConfig(contextSearchObject)
    },
    async fetchConfig(obj) {
      const user = JSON.parse(localStorage.getItem('user'))
      const params = { ...obj }
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params,
      }
      this.loading = true
      try {
        const { response } = await this.$axios.$get(
          '/systemConfiguration/search',
          config
        )
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
      const contextSearchObject = {
        ...this.contextSearchObject,
        currentPage: 0,
      }
      this.fetchConfig(contextSearchObject)
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
