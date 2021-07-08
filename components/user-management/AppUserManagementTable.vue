<template>
  <div>
    <div class="search-bar">
      <AppButton
        class="custom-search-btn"
        :block="false"
        @click="toggleContextSearch()"
      >
        <i class="fa fa-search" />
      </AppButton>
    </div>
    <br />
    <div v-if="isContextSearch" class="context-search-wrapper animated fadeIn">
      <a-row type="flex" :gutter="16">
        <a-col :span="8">
          <AppAdminInput
            v-model="contextSearchObject.email"
            label="Email"
            border
          />
        </a-col>
        <a-col :span="8">
          <AppAdminInput
            v-model="contextSearchObject.firstName"
            label="First Name"
            border
          />
        </a-col>
        <a-col :span="8">
          <AppAdminInput
            v-model="contextSearchObject.lastName"
            label="Last Name"
            border
          />
        </a-col>
        <a-col :span="8">
          <AppAdminInput
            v-model="contextSearchObject.userId"
            label="User Id"
            border
          />
        </a-col>
        <a-col :span="8">
          <AppAdminInput
            v-model="contextSearchObject.username"
            label="Username"
            border
          />
        </a-col>
      </a-row>
      <div class="context-search-btn-wrapper">
        <div>
          <AppButton
            class="search-btn"
            color="primary"
            icon="search"
            :block="false"
            @click="getUsersHandler()"
            >Search</AppButton
          >
        </div>
        <div style="margin-left: 1rem">
          <AppButton
            class="search-btn"
            color="red-outline"
            icon="undo"
            :block="false"
            @click="resetMethod()"
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
                    @click="$emit('editUser', record)"
                  >
                    <a-icon type="edit" />&nbsp; Edit User
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a
                    href="javascript:;"
                    style="color: #f00; font-size: 13px"
                    @click="showDeleteConfirm(record)"
                  >
                    <a-icon type="delete" />&nbsp; Delete User
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
  </div>
</template>
<script>
import AppPagination from '@/components/UI/AppPagination'
import AppAdminInput from '@/components/UI/AppAdminInput.vue'
import AppButton from '@/components/UI/AppButton.vue'

export default {
  name: 'AppUserManagementTable',
  components: {
    AppAdminInput,
    AppPagination,
    AppButton,
  },
  data() {
    return {
      contextSearchObject: {
        currentPage: 0,
      },
      isContextSearch: false,
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
          title: 'User ID',
          dataIndex: 'userId',
        },
        {
          title: 'Username',
          dataIndex: 'email',
        },
        {
          title: 'Role',
          dataIndex: 'role',
        },
        {
          title: 'Date Assigned',
          dataIndex: 'dateAssigned',
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
        const { response } = await this.$axios.$get('/user/search', config)
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
          'Are you sure you want to delete this user? This action is irreversible.',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        async onOk() {
          // vm.showModal(false)
          try {
            await $this.$axios.$delete(`/user/${record.id}`, config)
            $this.loading = false
            $this.$notification.success({
              message: 'Success',
              description: `User ${record.username} Deleted Successfully `,
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
