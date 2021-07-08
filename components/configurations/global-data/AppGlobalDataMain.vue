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
          >Add Global Data</AppButton
        >
      </div>
    </div>
    <div v-if="isContextSearch" class="context-search-wrapper animated fadeIn">
      <a-row type="flex" :gutter="16">
        <a-col :span="12">
          <AppAdminInput
            v-model="contextSearchObject.data"
            label="Data"
            border
          />
        </a-col>
        <a-col :span="12">
          <AppAdminInput
            v-model="contextSearchObject.value"
            label="Value"
            border
          />
        </a-col>
        <a-col :span="12">
          <AppAdminInput
            v-model="contextSearchObject.code"
            label="Code"
            border
          />
        </a-col>
        <a-col :span="12">
          <AppAdminInput
            v-model="contextSearchObject.description"
            label="Description"
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
            @click="getGlobalDataMethod()"
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
                    <a-icon type="edit" />&nbsp; Global Data
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a
                    href="javascript:;"
                    style="color: #f00; font-size: 13px"
                    @click="showDeleteConfirm(record)"
                  >
                    <a-icon type="delete" />&nbsp; Delete Global Data
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
    <AppManageGlobalData
      :is-modal-visible="isModalVisible"
      :current-global-data-object="currentGlobalDataObject"
      :mode="mode"
      @closeModal="closeModal"
    />
  </div>
</template>
<script>
import AppButton from '@/components/UI/AppButton.vue'
import AppAdminInput from '@/components/UI/AppAdminInput'
import AppPagination from '@/components/UI/AppPagination'
import AppManageGlobalData from '@/components/configurations/global-data/AppManageGlobalData'

export default {
  name: 'AppGlobalDataMain',
  components: {
    AppButton,
    AppAdminInput,
    AppPagination,
    AppManageGlobalData,
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
      currentGlobalDataObject: {},
      page: 0,
      totalElements: 0,
      columns: [
        {
          title: 'Data',
          dataIndex: 'data',
        },
        {
          title: 'Value',
          dataIndex: 'value',
        },
        {
          title: 'Code',
          dataIndex: 'code',
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
    this.fetchGlobalData(contextSearchObject)
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
        this.currentGlobalDataObject = record
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
      this.fetchGlobalData(pageObject)
    },
    getGlobalDataMethod() {
      const contextSearchObject = {
        ...this.contextSearchObject,
        currentPage: 0,
      }
      this.fetchGlobalData(contextSearchObject)
    },
    async fetchGlobalData(obj) {
      const user = JSON.parse(localStorage.getItem('user'))
      const params = { ...obj }
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params,
      }
      this.loading = true
      try {
        const { response } = await this.$axios.$get(
          '/globalData/search',
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
      this.fetchGlobalData(contextSearchObject)
    },
    showDeleteConfirm(record) {
      const user = JSON.parse(localStorage.getItem('user'))
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      const $this = this
      this.$confirm({
        title:
          'Are you sure you want to delete this Global Data? This action is irreversible.',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        async onOk() {
          // vm.showModal(false)
          try {
            await $this.$axios.$delete(
              `/globalData/entity/${record.id}`,
              config
            )
            $this.loading = false
            $this.$notification.success({
              message: 'Success',
              description: `Global Data ${record.data} Deleted Successfully `,
            })
            const contextSearchObject = {
              currentPage: 0,
            }
            $this.fetchGlobalData(contextSearchObject)
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
    margin-top: 15px;
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
.custom-btn {
  width: 100%;
}
.delete-message {
  font-family: GothamThin;
  font-weight: 600;
  font-size: 20px;
  color: #2e434e;
  opacity: 0.7;
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
