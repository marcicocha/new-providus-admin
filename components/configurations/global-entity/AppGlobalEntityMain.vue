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
          >Add Global Entity</AppButton
        >
      </div>
    </div>
    <div v-if="isContextSearch" class="context-search-wrapper animated fadeIn">
      <a-row type="flex" :gutter="16">
        <a-col :span="24">
          <AppAdminInput
            v-model="contextSearchObject.name"
            label="Name"
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
            @click="getGlobalEntityMethod()"
            >Search</AppButton
          >
        </div>
        <div style="margin-left: 1rem">
          <AppButton icon="undo" @click="resetMethod()">Reset</AppButton>
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
                    <a-icon type="edit" />&nbsp; Edit Global Entity
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a
                    href="javascript:;"
                    style="color: #f00; font-size: 13px"
                    @click="showDeleteConfirm(record)"
                  >
                    <a-icon type="delete" />&nbsp; Delete Global Entity
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
    <AppManageGlobalEntity
      :is-modal-visible="isModalVisible"
      :current-global-entity-object="currentGlobalEntityObject"
      :mode="mode"
      @closeModal="closeModal"
    />
  </div>
</template>
<script>
import AppButton from '@/components/UI/AppButton.vue'
import AppAdminInput from '@/components/UI/AppAdminInput'
import AppPagination from '@/components/UI/AppPagination'
import AppManageGlobalEntity from '@/components/configurations/global-entity/AppManageGlobalEntity'

export default {
  name: 'AppGlobalEntityMain',
  components: {
    AppButton,
    AppAdminInput,
    AppPagination,
    AppManageGlobalEntity,
  },
  data() {
    return {
      isLoading: false,
      loading: false,
      pageNumber: 0,
      mode: 'CREATE_MODE',
      contextSearchObject: {
        currentPage: 0,
      },
      isContextSearch: false,
      dataSource: [],
      isModalVisible: false,
      currentGlobalEntityObject: {},
      page: 0,
      totalElements: 0,
      columns: [
        {
          title: 'Name',
          dataIndex: 'name',
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
    this.fetchGlobalEntity(contextSearchObject)
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
        this.currentGlobalEntityObject = record
        this.isModalVisible = true
      }
    },
    paginationChangeHandler(pageNumber, pageSize) {
      const pageObject = {
        ...this.contextSearchObject,
        currentPage: pageNumber - 1,
        pageSize,
      }
      this.fetchGlobalEntity(pageObject)
    },
    getGlobalEntityMethod() {
      const contextSearchObject = {
        ...this.contextSearchObject,
        currentPage: 0,
      }
      this.fetchGlobalEntity(contextSearchObject)
    },
    async fetchGlobalEntity(obj) {
      const user = JSON.parse(localStorage.getItem('user'))
      const params = { ...obj }
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params,
      }
      this.loading = true
      try {
        const { response } = await this.$axios.$get(
          '/globalEntity/search',
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
      this.fetchGlobalEntity(contextSearchObject)
    },
    showDeleteConfirm(record) {
      const user = JSON.parse(localStorage.getItem('user'))
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      const $this = this
      this.$confirm({
        title:
          'Are you sure you want to delete this Global Entity? This action is irreversible.',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        async onOk() {
          // vm.showModal(false)
          try {
            await $this.$axios.$delete(
              `/globalEntity/entity/${record.id}`,
              config
            )
            $this.loading = false
            $this.$notification.success({
              message: 'Success',
              description: `Global Entity ${record.name} Deleted Successfully `,
            })
            const contextSearchObject = {
              currentPage: 0,
            }
            $this.fetchGlobalEntity(contextSearchObject)
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
