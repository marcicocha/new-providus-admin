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
          >Add state</AppButton
        >
      </div>
    </div>
    <div v-if="isContextSearch" class="context-search-wrapper animated fadeIn">
      <a-row type="flex" :gutter="16">
        <a-col :span="12">
          <AppContextSelect
            v-model="contextSearchObject.stateName"
            label="State"
            url="/country/states?name=NIGERIA"
            :call-back-func="
              (resp) => ({
                text: resp,
                value: resp,
              })
            "
            border
          />
        </a-col>
        <a-col :span="12">
          <AppAdminInput v-model="contextSearchObject.lga" label="LGA" border />
        </a-col>
      </a-row>
      <div class="context-search-btn-wrapper">
        <div>
          <AppButton
            class="search-btn"
            icon="search"
            :loading="loading"
            @click="getStateHandler()"
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
                <a-menu-item>
                  <a
                    href="javascript:;"
                    style="color: #f00; font-size: 13px"
                    @click="showDeleteConfirm(record)"
                  >
                    <a-icon type="delete" />&nbsp; Delete Config
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
    <AppManageState
      :is-modal-visible="isModalVisible"
      :current-lga-object="currentLgaObject"
      :mode="mode"
      @closeModal="closeModal"
    />
  </div>
</template>
<script>
import AppButton from '@/components/UI/AppButton.vue'
import AppAdminInput from '@/components/UI/AppAdminInput'
import AppPagination from '@/components/UI/AppPagination'
import AppManageState from '@/components/configurations/state/AppManageState'
import AppContextSelect from '@/components/UI/AppContextSelect'
export default {
  name: 'AppCountryMain',
  components: {
    AppButton,
    AppAdminInput,
    AppPagination,
    AppManageState,
    AppContextSelect,
  },
  data() {
    return {
      isLoading: false,
      loading: false,
      pageNumber: 0,
      mode: 'CREATE_MODE',
      contextSearchObject: {},
      isContextSearch: false,
      dataSource: [],
      isModalVisible: false,
      currentLgaObject: {},
      totalElements: 0,
      columns: [
        {
          title: 'LGA',
          dataIndex: 'lga',
        },
        {
          title: 'State',
          dataIndex: 'stateName',
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
    this.fetchLgaHandler(contextSearchObject)
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
        this.currentLgaObject = record
        this.isModalVisible = true
      }
    },
    getStateHandler() {
      const contextSearchObject = {
        ...this.contextSearchObject,
        currentPage: 0,
      }
      this.fetchLgaHandler(contextSearchObject)
    },
    paginationChangeHandler(pageNumber, pageSize) {
      //
      const pageObject = {
        ...this.contextSearchObject,
        currentPage: pageNumber - 1,
        pageSize,
      }
      this.fetchLgaHandler(pageObject)
    },
    async fetchLgaHandler(obj) {
      const user = JSON.parse(localStorage.getItem('user'))
      const params = { ...obj }
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params,
      }
      this.loading = true
      try {
        const { response } = await this.$axios.$get('/state/search', config)
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
      this.fetchLgaHandler(contextSearchObject)
    },
    showDeleteConfirm(record) {
      const user = JSON.parse(localStorage.getItem('user'))
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      const $this = this
      this.$confirm({
        title:
          'Are you sure you want to delete this LGA? This action is irreversible.',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        async onOk() {
          // vm.showModal(false)
          try {
            await $this.$axios.$delete(`/state/${record.id}`, config)
            $this.loading = false
            $this.$notification.success({
              message: 'Success',
              description: `LGA ${record.lga} Deleted Successfully `,
            })
            const contextSearchObject = {
              currentPage: 0,
            }
            $this.fetchLgaHandler(contextSearchObject)
          } catch (e) {
            $this.loading = false
            const { default: errorHandler } = await import(
              '@/utils/errorHandler'
            )
            errorHandler(e).forEach((msg) => {
              $this.$notification.error({
                message: 'Error',
                description: msg,
              })
            })
          }
        },
        onCancel() {},
      })
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
