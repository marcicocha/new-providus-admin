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
    width: 100%;
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

.context-search-btn-wrapper {
  display: flex;
  justify-content: flex-end;
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
