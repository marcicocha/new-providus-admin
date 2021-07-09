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
  margin-top: 1rem;
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
