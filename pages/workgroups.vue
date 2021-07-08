<template>
  <div class="animated fadeIn">
    <div class="page_header">
      <h1>Work Group</h1>
      <div class="wrapper">
        <div class="search-bar"></div>
        <div class="add-button-wrapper">
          <AppButton
            class="add-button"
            title="Add Work Group"
            color="primary"
            icon="fa fa-plus"
            @click="toggleModal('CREATE_MODE', {})"
          />
        </div>
      </div>
    </div>
    <AppTable
      :columns="columns"
      :data-source="dataSource"
      :loading="loadingTable"
    >
      <template slot="actions" slot-scope="{ record }">
        <div class="dropdown is-hoverable">
          <div class="dropdown-trigger">
            <i
              class="custom-table-btn fas fa-ellipsis-v"
              aria-controls="dropdown-menu"
            >
            </i>
          </div>
          <div id="dropdown-menu" class="dropdown-menu" role="menu">
            <div class="dropdown-content">
              <a
                class="dropdown-item"
                @click="toggleModal('UPDATE_MODE', record)"
              >
                <i class="fas fa-pencil-alt" /> Edit Work Group
              </a>
              <a
                class="dropdown-item"
                @click="toggleModal('DELETE_MODE', record)"
              >
                <i class="fas fa-trash-alt" /> Delete Work Group
              </a>
            </div>
          </div>
        </div>
      </template>
    </AppTable>
    <AppPagination :total-items="totalElements" :page="page" />
    <AppModal :is-visible="isModalVisible" @closeModal="closeModal">
      <template slot="modal-title"
        ><h1>
          {{
            mode === 'CREATE_MODE'
              ? 'Add New'
              : mode === 'UPDATE_MODE'
              ? 'Edit'
              : mode === 'DELETE_MODE'
              ? 'Delete'
              : ''
          }}
          Work Group
        </h1></template
      >
      <template slot="content">
        <div v-if="mode !== 'DELETE_MODE'" class="columns is-multiline">
          <div class="column is-half">
            <AppInput
              v-model="workGroupObject.order"
              label="Order"
              is-number
              placeholder="order"
              required
              :disabled="!isCreateOnly"
            />
          </div>
          <div class="column is-half">
            <AppInput
              v-model="workGroupObject.userWorkFlow"
              label="User WorkFlow"
              placeholder="Enter User’s WorkFlow"
              required
            />
          </div>
          <div class="column is-full">
            <AppTextArea
              v-model="workGroupObject.userWorkFlowDescription"
              label="WorkFlow Description"
              placeholder="Enter WorkFlow Description"
              :rows="1"
              required
            />
          </div>
          <div class="column">
            <AppSwitchComponent
              v-model="workGroupObject.freeWorkFlow"
              label="Free WorkFlow ?"
            />
          </div>
          <div class="column is-half">
            <AppSelectHybrid
              v-model="workGroupObject.groupId"
              url="/systemConfiguration/resourceKeys"
              :call-back-func="
                (resp) => ({
                  text: resp,
                  value: resp,
                })
              "
              label="Group Id"
              placeholder="GroupId"
              :disabled="!isCreateOnly"
              required
            />
          </div>
          <div class="column is-full">
            <AppTextArea
              v-model="workGroupObject.groupDescription"
              label="Group Description"
              placeholder="Group Description"
              :rows="1"
            />
          </div>
          <div class="column is-full">
            <AppButton
              title="Submit"
              style="padding: 30px"
              :loading="loading"
              @click="actionHandler(mode)"
            />
          </div>
        </div>
        <div v-if="mode === 'DELETE_MODE'" class="columns is-multiline">
          <div class="column is-full">
            <p class="delete-message">
              Are you sure you want to delete this workgroup? This action is
              irreversible.
            </p>
          </div>
          <div class="column">
            <AppButton
              class="custom-btn"
              title="No"
              style="padding: 20px"
              @click="isModalVisible = false"
            />
          </div>
          <div class="column">
            <AppButton
              class="custom-btn"
              title="Yes"
              style="padding: 20px"
              @click="actionHandler()"
            />
          </div>
        </div>
      </template>
    </AppModal>
  </div>
</template>
<script>
// import AppMultiSelectComponent from '@/components/UI/AppMultiSelectComponent.vue'
import AppTable from '@/components/UI/AppTable.vue'
import AppModal from '@/components/UI/AppModal.vue'
import AppTextArea from '@/components/UI/AppTextArea.vue'
import AppSwitchComponent from '@/components/UI/AppSwitchComponent.vue'
import AppButton from '@/components/UI/AppButton.vue'
import AppPagination from '@/components/UI/AppPagination'
import AppSelectHybrid from '@/components/UI/AppSelectHybrid'
import AppInput from '@/components/UI/AppInput.vue'

export default {
  components: {
    // AppMultiSelectComponent,
    AppTable,
    AppModal,
    AppTextArea,
    AppSwitchComponent,
    AppPagination,
    AppButton,
    AppSelectHybrid,
    AppInput,
  },
  middleware: ['auth'],
  data() {
    return {
      isModalVisible: false,
      isContextSearch: false,
      loading: false,
      loadingTable: false,
      mode: 'CREATE_MODE',
      contextSearchObject: {},
      workGroupObject: {},
      dataSource: [],
      columns: [
        {
          name: 'Group Id',
          dataIndex: 'groupId',
        },
        {
          name: 'Flow',
          dataIndex: 'userWorkFlow',
        },
        {
          name: 'Group Description',
          dataIndex: 'groupDescription',
        },
        {
          name: 'Flow Description',
          dataIndex: 'userWorkFlowDescription',
        },
        {
          name: '',
          dataIndex: 'actions',
        },
      ],
      page: 0,
      totalElements: 0,
    }
  },
  computed: {
    isCreateOnly() {
      return this.mode === 'CREATE_MODE'
    },
  },
  beforeMount() {
    const guard = JSON.parse(localStorage.getItem('user'))
    if (!guard) {
      localStorage.clear()
      // route back to home
      this.$router.push('/')
    } else if (guard) {
      // eslint-disable-next-line no-prototype-builtins
      if (guard.hasOwnProperty('token')) {
        if (guard.token === '') {
          localStorage.clear()
          // route back to home
          this.$router.push('/')
        }
      }
    } else {
      this.$router.push('/')
    }
  },
  mounted() {
    this.getWorkGroupMethod()
  },
  methods: {
    resetMethod() {
      this.contextSearchObject = {}
    },
    pageChange(page) {
      this.page = page

      this.getWorkGroupMethod()
    },
    toggleModal(mode, record) {
      if (mode) {
        this.mode = mode
        this.workGroupObject = record
        this.isModalVisible = true
      }
    },
    closeModal() {
      if (this.isModalVisible) {
        this.isModalVisible = false
      }
    },
    toggleContextSearch() {
      this.isContextSearch = !this.isContextSearch
    },
    isValid() {
      if (
        this.workGroupObject.order &&
        this.workGroupObject.userWorkFlow &&
        this.workGroupObject.groupId &&
        this.workGroupObject.userWorkFlowDescription
      ) {
        return true
      } else {
        return false
      }
    },
    actionHandler() {
      if (this.mode === 'CREATE_MODE') {
        if (this.isValid()) {
          this.createWorkGroup()
        } else {
          this.$toast.open({
            message: `<p class="toast-title">Warning</p>
                    <p class="toast-msg">please fill all required fields</p>`,
            type: 'warning',
            duration: 4000,
            dismissible: true,
          })
        }
      } else if (this.mode === 'UPDATE_MODE') {
        if (this.isValid()) {
          this.editWorkGroup()
        } else {
          this.$toast.open({
            message: `<p class="toast-title">Warning</p>
                    <p class="toast-msg">please fill all required fields</p>`,
            type: 'warning',
            duration: 4000,
            dismissible: true,
          })
        }
      } else if (this.mode === 'DELETE_MODE') {
        this.deleteWorkGroup()
      }
    },
    async deleteWorkGroup() {
      const user = JSON.parse(localStorage.getItem('user'))
      const params = {
        userWorkFlow: this.workGroupObject.userWorkFlow,
        workGroupFLow: this.workGroupObject.groupId,
      }
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params,
      }
      this.loading = true
      try {
        await this.$axios.$delete(
          '/workFlowGroup/deleteWorkFlowGroupByUserWorkFLow',
          config
        )
        this.loading = false
        this.closeModal()
        this.$toast.open({
          message: `<p class="toast-title">Success</p>
                    <p class="toast-msg"> Work Group Successfully Deleted </p>`,
          type: 'success',
          duration: 4000,
          dismissible: true,
        })
        this.getWorkGroupMethod()
      } catch (err) {
        this.loading = false
        let errorMessage = ''

        this.isLoading = false

        // Network Error
        if (String(err).includes('Network')) {
          errorMessage = err
          this.$toast.open({
            message: `<p class="toast-title">Error</p>
                    <p class="toast-msg"> Network Error </p>`,
            type: 'error',
            duration: 4000,
            dismissible: true,
          })
          return
        }

        // Error Message from Backend
        // eslint-disable-next-line no-prototype-builtins
        if (err.hasOwnProperty('response')) {
          const res = err.response.data

          errorMessage = res.errorMessage

          this.$toast.open({
            message: `<p class="toast-title">Error</p>
                    <p class="toast-msg"> ${errorMessage} </p>`,
            type: 'error',
            duration: 4000,
            dismissible: true,
          })
        }
      }
    },
    async editWorkGroup() {
      const user = JSON.parse(localStorage.getItem('user'))
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      this.loading = true
      try {
        await this.$axios.$put('/workFlowGroup', this.workGroupObject, config)
        this.loading = false
        this.closeModal()
        this.$toast.open({
          message: `<p class="toast-title">Success</p>
                    <p class="toast-msg"> Work Group Edited Successfully </p>`,
          type: 'success',
          duration: 4000,
          dismissible: true,
        })
        this.getWorkGroupMethod()
      } catch (err) {
        this.loading = false
        let errorMessage = ''

        this.isLoading = false

        // Network Error
        if (String(err).includes('Network')) {
          errorMessage = err
          this.$toast.open({
            message: `<p class="toast-title">Error Message</p>
                    <p class="toast-msg"> Network Error </p>`,
            type: 'error',
            duration: 4000,
            dismissible: true,
          })
          return
        }

        // Error Message from Backend
        // eslint-disable-next-line no-prototype-builtins
        if (err.hasOwnProperty('response')) {
          const res = err.response.data

          errorMessage = res.errorMessage

          this.$toast.open({
            message: `<p class="toast-title">Error Message</p>
                    <p class="toast-msg"> ${errorMessage} </p>`,
            type: 'error',
            duration: 4000,
            dismissible: true,
          })
        }
      }
    },
    async createWorkGroup() {
      const user = JSON.parse(localStorage.getItem('user'))
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      this.loading = true
      try {
        await this.$axios.$post('/workFlowGroup', this.workGroupObject, config)
        this.loading = false
        this.closeModal()
        this.$toast.open({
          message: `<p class="toast-title">Success</p>
                    <p class="toast-msg"> Work Group Created Successfully </p>`,
          type: 'success',
          duration: 4000,
          dismissible: true,
        })
        this.getWorkGroupMethod()
      } catch (err) {
        this.loading = false
        let errorMessage = ''

        this.isLoading = false

        // Network Error
        if (String(err).includes('Network')) {
          errorMessage = err
          this.$toast.open({
            message: `<p class="toast-title">Error</p>
                    <p class="toast-msg"> Network Error </p>`,
            type: 'error',
            duration: 4000,
            dismissible: true,
          })
          return
        }

        // Error Message from Backend
        // eslint-disable-next-line no-prototype-builtins
        if (err.hasOwnProperty('response')) {
          const res = err.response.data

          errorMessage = res.errorMessage

          this.$toast.open({
            message: `<p class="toast-title">Error Message</p>
                    <p class="toast-msg"> ${errorMessage} </p>`,
            type: 'error',
            duration: 4000,
            dismissible: true,
          })
        }
      }
    },
    async getWorkGroupMethod() {
      const user = JSON.parse(localStorage.getItem('user'))
      const params = { ...this.contextSearchObject, currentPage: this.page }
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params,
      }
      this.loadingTable = true
      try {
        const { response } = await this.$axios.$get(
          '/workFlowGroup/getAllWorkGroup',
          config
        )
        this.dataSource = response
        this.totalElements = response.totalElements || 0
        this.loadingTable = false
      } catch (err) {
        this.loadingTable = false
        let errorMessage = ''

        // Network Error
        if (String(err).includes('Network')) {
          errorMessage = err
          this.$toast.open({
            message: `<p class="toast-title">Error Message</p>
                    <p class="toast-msg"> Network Error </p>`,
            type: 'error',
            duration: 4000,
            dismissible: true,
          })
          return
        }

        // Error Message from Backend
        // eslint-disable-next-line no-prototype-builtins
        if (err.hasOwnProperty('response')) {
          const res = err.response.data

          errorMessage = res.errorMessage

          this.$toast.open({
            message: `<p class="toast-title">Error Message</p>
                    <p class="toast-msg"> ${errorMessage} </p>`,
            type: 'error',
            duration: 4000,
            dismissible: true,
          })
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.page_header {
  margin-bottom: 25px;
  h1 {
    font-family: GothamLight;
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    line-height: 150%;
    color: #2e434e;
  }
  .wrapper {
    margin: 15px 0px;
    position: relative;
    div {
      display: inline-block;
    }
    .search-bar {
      width: auto;
    }
    .add-button-wrapper {
      width: auto;
      height: auto;
      float: right;
      .add-button {
        width: auto;
      }
    }
  }
}
.custom-table-btn {
  margin: 0px 21px;
  color: #c4c4c4;
  opacity: 0.8;
}
.custom-search-btn {
  background: #fdb813;
  color: #fff;
  padding: 15px;
  border: none;
  outline: none;
  cursor: pointer;
  i {
    margin: 0px;
  }
}
.dropdown-content {
  padding: 0px;
  a {
    border-bottom: 1px solid #f8f8f8;
    padding: 15px 10px;
    font-family: 'GothamLight', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 100%;
    &:hover {
      background: transparent;
    }
    &:last-child {
      border: none;
    }
    i {
      color: #c4c4c4;
      opacity: 0.8;
      padding: 0px 5px;
    }
  }
}
.context-search-wrapper {
  margin-top: 30px;
  background: transparent;
  // padding: 1.5% 0px;
  // -moz-box-shadow: 0px 0px 5px #ccc;
  // -webkit-box-shadow: 0px 0px 5px #ccc;
  // box-shadow: 0px 0px 5px #ccc;
  .context-search-btn-wrapper {
    display: flex;
    width: 19.5%;
    float: right;
    .column {
      .search-btn {
        width: 100%;
      }
      &:first-child {
        padding-left: 0px;
      }
      &:last-child {
        padding-right: 0px;
      }
    }
  }
}
.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.fadeIn {
  animation-name: fadeIn;
}
.vue-ads-leading-loose {
  font-size: 1.3rem;
  color: #000;
  font-weight: bold;
}
.vue-ads-flex {
  margin-top: 3rem;
  .vue-ads-leading-loose {
    font-size: 1rem;
    color: #282828;
  }
  button {
    border: 0px;
    font-size: 1rem;
    color: #000;
    border-radius: 4px;
    margin: 0px 10px;
    // padding: 10px;
  }
  .bg-yellow-dark {
    background: #fdb813;
    // color: #000;
    margin: 0px;
    font-weight: bold;
  }
}
</style>
