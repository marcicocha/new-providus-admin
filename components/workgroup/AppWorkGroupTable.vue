<template>
  <div>
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
                    @click="$emit('editWorkGroup', record)"
                  >
                    <a-icon type="edit" />&nbsp; Edit Work Group
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a
                    href="javascript:;"
                    style="color: #f00; font-size: 13px"
                    @click="showDeleteConfirm(record)"
                  >
                    <a-icon type="delete" />&nbsp; Delete Work Group
                  </a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a-button-group>
        </div>
      </template>
    </a-table>
    <br />
    <!-- <div class="paginationCover">
      <AppPagination
        :default-current="0"
        :total="totalElements"
        :page-number="pageNumber"
        @change="paginationChangeHandler"
      />
    </div> -->
  </div>
</template>
<script>
// import AppPagination from '@/components/UI/AppPagination'

export default {
  name: 'AppWorkGroupTable',
  components: {
    // AppPagination,
  },
  data() {
    return {
      contextSearchObject: {
        currentPage: 0,
      },
      dataSource: [],
      loading: false,
      totalElements: 0,
      pageNumber: 0,
    }
  },
  computed: {
    columns() {
      const columns = [
        {
          title: 'Group Id',
          dataIndex: 'groupId',
        },
        {
          title: 'Flow',
          dataIndex: 'userWorkFlow',
        },
        {
          title: 'Group Description',
          dataIndex: 'groupDescription',
        },
        {
          title: 'Flow Description',
          dataIndex: 'userWorkFlowDescription',
        },
        {
          title: '',
          dataIndex: 'actions',
          scopedSlots: { customRender: 'actions' },
        },
      ]
      return columns
    },
  },
  mounted() {
    const contextSearchObject = {
      currentPage: 0,
    }
    this.getUsersMethod(contextSearchObject)
  },
  methods: {
    toggleContextSearch() {
      this.isContextSearch = !this.isContextSearch
    },
    paginationChangeHandler(pageNumber, pageSize) {
      //
      const pageObject = {
        ...this.contextSearchObject,
        currentPage: pageNumber - 1,
        pageSize,
      }
      this.getUsersMethod(pageObject)
    },
    onShowSizeChange(current, pageSize) {
      const pageObject = {
        ...this.contextSearchObject,
        currentPage: current === 0 ? 0 : current - 1,
        pageSize,
      }
      this.getUsersMethod(pageObject)
    },
    getUsersHandler() {
      this.getUsersMethod(this.contextSearchObject)
    },
    async getUsersMethod(obj) {
      console.log(this.contextSearchObject, 'TEST')
      const user = JSON.parse(localStorage.getItem('user'))
      const params = { ...obj }
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params,
      }
      this.loading = true
      try {
        const { response } = await this.$axios.$get(
          '/workFlowGroup/getAllWorkGroup',
          config
        )
        // this.dataSource = response.content
        this.dataSource = response
        // this.totalElements = response.totalElements
        // this.pageNumber = response.pageable.pageNumber
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
    resetMethod() {
      this.contextSearchObject = {}
    },
    showDeleteConfirm(record) {
      const user = JSON.parse(localStorage.getItem('user'))
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      const $this = this
      this.$confirm({
        title:
          'Are you sure you want to delete this Workgroup? This action is irreversible.',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        async onOk() {
          // vm.showModal(false)
          try {
            const { response } = await $this.$axios.$get(
              '/systemConfiguration/resourceKeys',
              config
            )
            await $this.$axios.$delete(
              `/workFlowGroup/deleteWorkFlowGroupByUserWorkFLow?userWorkFlow=${record.userWorkFlow}&workGroupFLow=${response[0]}`,
              config
            )
            $this.loading = false
            $this.$notification.success({
              message: 'Success',
              description: `Workgroup ${record.userWorkFlow} Deleted Successfully `,
            })
            const contextSearchObject = {
              currentPage: 0,
            }
            $this.getUsersMethod(contextSearchObject)
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
