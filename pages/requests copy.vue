<template>
  <div class="animated fadeIn">
    <div class="page_header">
      <h1>Manage Requests</h1>
    </div>
    <div class="tabs is-toggle">
      <ul>
        <li :class="{ 'is-active': tabsel == 'all' }" @click="tabsel = 'all'">
          <a>All</a>
        </li>
        <li
          :class="{ 'is-active': tabsel == 'pending' }"
          @click="tabsel = 'pending'"
        >
          <a>Pending</a>
        </li>
        <li
          :class="{ 'is-active': tabsel == 'approved' }"
          @click="tabsel = 'approved'"
        >
          <a>Approved</a>
        </li>
        <li
          :class="{ 'is-active': tabsel == 'remove' }"
          @click="tabsel = 'remove'"
        >
          <a>Rejected</a>
        </li>
      </ul>
    </div>

    <!-- Tab panes -->
    <div class="content">
      <div v-show="tabsel == 'all'">
        <!-- all table -->
        <AppTable
          :columns="columns"
          :data-source="dataSourceAll"
          :loading="loadingAll"
        >
          <template slot="category" slot-scope="{ record }">
            <span
              v-if="record.category === 'R'"
              style="background: #fdb813; padding: 10px; color: #f8f8f8"
              >{{ record.category }}</span
            >
            <span
              v-if="record.category === 'C'"
              style="background: #2e434e; padding: 10px; color: #f8f8f8"
              >{{ record.category }}</span
            >
          </template>
          <template slot="individualWorkFlow" slot-scope="{ record }">
            <span>{{
              record.individualWorkFlow === 'COMPLETED'
                ? record.individualWorkFlow
                : 'INCOMPLETE'
            }}</span>
          </template>
          <template slot="status" slot-scope="{ record }">
            <span
              class="status"
              :style="
                record.status === 'Pending'
                  ? 'background: #FFFCE6; color: #A19101'
                  : record.status === 'Approved'
                  ? 'background: #D2F9D9; color: #18C139'
                  : record.status === 'Rejected'
                  ? 'background: #FDF7F7; color: #CC4C4C'
                  : ''
              "
              >{{ record.status }}</span
            >
          </template>
        </AppTable>
        <vue-ads-pagination :total-items="totalElements" :page="page">
          <template slot-scope="props">
            <div class="vue-ads-pr-2 vue-ads-leading-loose">
              Items {{ props.start }} - {{ props.end }} of
              {{ props.total }} items
            </div>
          </template>
          <template slot="buttons" slot-scope="props" style="margin: 0px 30px">
            <vue-ads-page-button
              v-for="(button, key) in props.buttons"
              :key="key"
              v-bind="button"
              :class="{ 'bg-yellow-dark': button.active }"
              @page-change="pageChange(button.page)"
              @range-change="
                start = button.start
                end = button.end
              "
            />
          </template>
        </vue-ads-pagination>
      </div>
      <!-- pending table -->
      <div v-show="tabsel == 'pending'">
        <AppTable
          :columns="pendingColumns"
          :data-source="dataSourcePending"
          :loading="loadingPending"
        >
          <template slot="category" slot-scope="{ record }">
            <span
              v-if="record.category === 'R'"
              style="background: #fdb813; padding: 10px; color: #f8f8f8"
              >{{ record.category }}</span
            >
            <span
              v-if="record.category === 'C'"
              style="background: #2e434e; padding: 10px; color: #f8f8f8"
              >{{ record.category }}</span
            >
          </template>
          <template slot="individualWorkFlow" slot-scope="{ record }">
            <span>{{
              record.individualWorkFlow === 'COMPLETED'
                ? record.individualWorkFlow
                : 'INCOMPLETE'
            }}</span>
          </template>
          <template slot="actions" slot-scope="{ record }">
            <span
              style="
                background: #fdb813;
                padding: 10px;
                color: #282828;
                cursor: pointer;
              "
              @click="reviewRequest(record)"
            >
              Review
            </span>
          </template>
        </AppTable>
      </div>
      <!-- approved table -->
      <div v-show="tabsel == 'approved'">
        <AppTable
          :columns="approvedColumns"
          :data-source="dataSourceApproved"
          :loading="loadingApproved"
        >
          <template slot="category" slot-scope="{ record }">
            <span
              v-if="record.category === 'R'"
              style="background: #fdb813; padding: 10px; color: #f8f8f8"
              >{{ record.category }}</span
            >
            <span
              v-if="record.category === 'C'"
              style="background: #2e434e; padding: 10px; color: #f8f8f8"
              >{{ record.category }}</span
            >
          </template>
          <!-- <template slot="comment" slot-scope="{ record }">

          </template> -->
        </AppTable>
        <AppPagination :total-items="totalElements" :page="page" />
      </div>
      <!-- remove table -->
      <div v-show="tabsel == 'remove'">
        <AppTable
          :columns="approvedColumns"
          :data-source="dataSourceRemoved"
          :loading="loadingRejected"
        >
          <template slot="category" slot-scope="{ record }">
            <span
              v-if="record.category === 'R'"
              style="background: #fdb813; padding: 10px; color: #f8f8f8"
              >{{ record.category }}</span
            >
            <span
              v-if="record.category === 'C'"
              style="background: #2e434e; padding: 10px; color: #f8f8f8"
              >{{ record.category }}</span
            >
          </template>
        </AppTable>
        <AppPagination :total-items="totalElements" :page="page" />
      </div>
      <transition name="fade">
        <AppModal
          :is-visible="isModalVisible"
          is-full-screen
          @closeModal="closeModal"
        >
          <template slot="modal">
            <section
              class="modal-card-body"
              style="background: #f9fafb !important"
            >
              <div class="modal-wrapper">
                <div class="modal-sidebar">
                  <div class="card image-wrapper">
                    <div class="card-image">
                      <figure class="image is-5by3" style="text-align: center">
                        <img
                          :src="`data:image/png;base64, ${userObject.selfie}`"
                          alt="Placeholder image"
                          class="selfie"
                        />
                        <span>R</span>
                      </figure>
                    </div>
                  </div>
                  <div class="link-wrapper">
                    <ul>
                      <li
                        :class="{ 'is-toggle-active': isProspect }"
                        @click="toggleMethod('prospect')"
                      >
                        Prospect Information
                      </li>
                      <li
                        :class="{ 'is-toggle-active': isUploaded }"
                        @click="toggleMethod('upload')"
                      >
                        Uploaded
                      </li>
                    </ul>
                  </div>
                  <div class="button-wrapper columns is-multiline">
                    <div class="column">
                      <AppButton
                        class="custom-btn"
                        title="Reject"
                        style="padding: 10px; width: 100%"
                        color="red-outline"
                        @click="toggleMethod('REJECT')"
                      />
                    </div>
                    <div class="column">
                      <AppButton
                        class="custom-btn"
                        title="Accept"
                        style="padding: 10px; width: 100%"
                        color="success"
                        @click="toggleMethod('ACCEPT')"
                      />
                    </div>
                  </div>
                </div>
                <div class="modal-main-content">
                  <button
                    class="delete custom-close-btn"
                    aria-label="close"
                    @click="closeModal"
                  >
                    <i class="fa fa-times"></i>
                  </button>
                  <br />
                  <AppAccountDetailsComponent
                    v-if="isProspect"
                    :user-object="userObject"
                    style="width: 100%"
                  />
                  <AppUploadedDocumentComponent
                    v-if="isUploaded"
                    :user-object="userObject"
                  />
                  <AppAcceptRejectComponent
                    v-if="operation"
                    style="padding: 0px 200px"
                    :action="operation"
                    :request-id="
                      userObject.requestId ? userObject.requestId : ''
                    "
                    @success="closeModal('success')"
                    @cancel="toggleMethod('prospect')"
                  />
                </div>
              </div>
            </section>
          </template>
        </AppModal>
      </transition>
    </div>
  </div>
</template>
<script>
import AppTable from '@/components/UI/AppTable.vue'
import AppModal from '@/components/UI/AppModal.vue'
import AppUploadedDocumentComponent from '@/components/AppUploadedDocumentComponent.vue'
import AppAccountDetailsComponent from '@/components/AppAccountDetailsComponent.vue'
import AppAcceptRejectComponent from '@/components/AppAcceptRejectComponent.vue'
import AppPagination from '@/components/UI/AppPagination'
import AppButton from '@/components/UI/AppButton.vue'
const columns = [
  {
    name: 'Request ID',
    dataIndex: 'requestId',
    // style: 'width: auto',
  },
  {
    name: 'Account Type',
    dataIndex: 'accountType',
    style: 'text-align: center',
  },
  {
    name: 'Date of Request',
    dataIndex: 'createdDate',
  },
  // {
  //   name: 'Date Of Review',
  //   dataIndex: 'dateOfReview',
  // },
  {
    name: 'Status',
    dataIndex: 'individualWorkFlow',
    scopedSlots: { customRender: 'individualWorkFlow' },
  },
  {
    name: 'Initiator ID',
    dataIndex: 'createdBy',
  },
  // {
  //   name: 'Status',
  //   dataIndex: 'status',
  //   style: 'text-align: center',
  // },
  {
    name: '',
    dataIndex: 'actions',
  },
]
const pendingColumns = [
  {
    name: 'Request ID',
    dataIndex: 'requestId',
    // style: 'width: auto',
  },
  {
    name: 'Account Type',
    dataIndex: 'accountType',
    style: 'text-align: center',
  },
  {
    name: 'Date of Request',
    dataIndex: 'createdDate',
  },
  {
    name: 'Status',
    dataIndex: 'individualWorkFlow',
    scopedSlots: { customRender: 'individualWorkFlow' },
  },
  {
    name: 'Actions',
    dataIndex: 'actions',
    style: 'text-align: left',
  },
]
const approvedColumns = [
  {
    name: 'Request ID',
    dataIndex: 'requestId',
    // style: 'width: auto',
  },
  {
    name: 'Account Type',
    dataIndex: 'accountType',
    style: 'text-align: center',
  },
  {
    name: 'Date of Request',
    dataIndex: 'createdDate',
  },
  {
    name: 'Date Of Review',
    dataIndex: 'lastModifiedDate',
  },
  {
    name: 'Initiator ID',
    dataIndex: 'createdBy',
  },
  {
    name: 'comment',
    dataIndex: 'comment',
  },
  {
    name: '',
    dataIndex: 'actions',
  },
]
export default {
  components: {
    AppTable,
    AppModal,
    AppAccountDetailsComponent,
    AppUploadedDocumentComponent,
    AppAcceptRejectComponent,
    AppPagination,
    AppButton,
  },
  middleware: ['auth'],
  data() {
    return {
      tabsel: 'all',
      isModalVisible: false,
      isUploaded: false,
      isProspect: true,
      loadingAll: false,
      loadingRejected: false,
      loadingApproved: false,
      loadingPending: false,
      operation: '',
      // paginationAll:['10', '20', '30']
      dataSourceAll: [],
      dataSourcePending: [],
      dataSourceApproved: [],
      dataSourceRemoved: [],
      columns,
      pendingColumns,
      approvedColumns,
      page: 0,
      pageReject: 0,
      pageApprove: 0,
      pagePending: 0,
      totalElements: 0,
      totalElementsRejected: 0,
      totalElementsApproved: 0,
      totalElementsPending: 0,
      userObject: {
        customerKin: {},
        customerContact: {},
      },
      commentLists: [],
      commentModalIsVisible: false,
    }
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
    this.fetchAllRequestMethod()
    this.fetchApproveRequestMethod()
    this.fetchPendingRequestMethod()
    this.fetchRejectedRequestMethod()
  },
  methods: {
    closeModal(message) {
      if (this.isModalVisible) {
        this.isModalVisible = !this.isModalVisible
        this.userObject = {}
        this.isProspect = true
        this.isUploaded = false
        this.operation = ''
      }
      if (message === 'success') {
        this.fetchAllRequestMethod()
        this.fetchApproveRequestMethod()
        this.fetchPendingRequestMethod()
        this.fetchRejectedRequestMethod()
      }
      if (this.commentModalIsVisible) {
        this.commentModalIsVisible = false
      }
    },
    async fetchCommentHandler(requestId) {
      try {
        const { response } = await this.$axios.$post(
          '/user/fetchComments',
          requestId
        )
        this.commentLists = response
        this.commentModalIsVisible = true
      } catch (err) {
        let errorMessage = ''
        if (String(err).includes('Network')) {
          errorMessage = err
          this.$toast.open({
            message: `<p class="toast-title">Error Message</p>
                    <p class="toast-msg"> Network Error </p>`,
            type: 'error',

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

            dismissible: true,
          })
        }
      }
    },
    async reviewRequest(record) {
      const user = JSON.parse(localStorage.getItem('user'))
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      this.loadingPending = true
      try {
        const { response } = await this.$axios.$get(
          `/individualAdmin/${record.id}`,
          config
        )
        this.userObject = response
        this.loadingPending = false
        this.isModalVisible = true
      } catch (err) {
        let errorMessage = ''

        this.isLoading = false
        this.loadingPending = false

        // Network Error
        if (String(err).includes('Network')) {
          errorMessage = err
          this.$toast.open({
            message: `<p class="toast-title">Error Message</p>
                    <p class="toast-msg"> Network Error </p>`,
            type: 'error',

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

            dismissible: true,
          })
        }
      }
    },
    toggleMethod(str) {
      if (str) {
        if (str === 'prospect') {
          this.isProspect = true
          this.isUploaded = false
          this.operation = ''
        } else if (str === 'upload') {
          this.isProspect = false
          this.operation = ''
          this.isUploaded = true
        } else {
          this.operation = str
          this.isProspect = false
          this.isUploaded = false
        }
      }
    },
    pageChange(page) {
      this.page = page

      this.fetchAllRequestMethod()
    },
    pageChangeApproved(page) {
      this.pageApprove = page

      this.fetchApproveRequestMethod()
    },
    pageChangePending(page) {
      this.pagePending = page

      this.fetchPendingRequestMethod()
    },
    pageChangeReject(page) {
      this.pageReject = page

      this.fetchRejectedRequestMethod()
    },
    async fetchAllRequestMethod() {
      const user = JSON.parse(localStorage.getItem('user'))
      const params = { currentPage: this.page }
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params,
      }
      this.loadingAll = true
      try {
        const { response } = await this.$axios.$get(
          '/individualAdmin/search',
          config
        )
        this.dataSourceAll = response.content
        this.totalElements = response.totalElements
        this.loadingAll = false
      } catch (err) {
        let errorMessage = ''

        this.loadingAll = false

        // Network Error
        if (String(err).includes('Network')) {
          errorMessage = err
          this.$toast.open({
            message: `<p class="toast-title">Error Message</p>
                    <p class="toast-msg"> Network Error </p>`,
            type: 'error',

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

            dismissible: true,
          })
        }
      }
    },
    async fetchPendingRequestMethod() {
      const user = JSON.parse(localStorage.getItem('user'))
      const params = { status: 'PENDING', currentPage: this.pagePending }
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params,
      }
      this.loadingPending = true
      try {
        const { response } = await this.$axios.$get(
          '/individualAdmin/search',
          config
        )
        this.dataSourcePending = response.content
        this.totalElementsPending = response.totalElements
        this.loadingPending = false
      } catch (err) {
        let errorMessage = ''
        this.loadingPending = false
        // Network Error
        if (String(err).includes('Network')) {
          errorMessage = err
          this.$toast.open({
            message: `<p class="toast-title">Error Message</p>
                    <p class="toast-msg"> Network Error </p>`,
            type: 'error',

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

            dismissible: true,
          })
        }
      }
    },
    async fetchApproveRequestMethod() {
      const params = { status: 'APPROVED', currentPage: this.pageApprove }
      const user = JSON.parse(localStorage.getItem('user'))
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params: {
          ...params,
        },
      }
      this.loadingApproved = true
      try {
        const { response } = await this.$axios.$get(
          '/individualAdmin/search',
          config
        )
        this.dataSourceApproved = response.content
        this.totalElementsApproved = response.totalElements
        this.loadingApproved = false
      } catch (err) {
        let errorMessage = ''

        this.isLoading = false
        this.loadingApproved = false

        // Network Error
        if (String(err).includes('Network')) {
          errorMessage = err
          this.$toast.open({
            message: `<p class="toast-title">Error Message</p>
                    <p class="toast-msg"> Network Error </p>`,
            type: 'error',

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

            dismissible: true,
          })
        }
      }
    },
    async fetchRejectedRequestMethod() {
      const params = { status: 'REJECTED' }
      const user = JSON.parse(localStorage.getItem('user'))
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params: {
          ...params,
        },
      }
      this.loadingRejected = true
      try {
        const { response } = await this.$axios.$get(
          '/individualAdmin/search',
          config
        )
        this.dataSourceRemoved = response.content
        this.totalElementsRejected = response.totalElements
        this.loadingRejected = false
      } catch (err) {
        this.loadingRejected = false
        let errorMessage = ''

        this.isLoading = false

        // Network Error
        if (String(err).includes('Network')) {
          errorMessage = err
          this.$toast.open({
            message: `<p class="toast-title">Error Message</p>
                    <p class="toast-msg"> Network Error </p>`,
            type: 'error',

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
}

.tabs {
  margin-bottom: 0px;
}

.status {
  padding: 10px 12px;
  border-radius: 5px;
}

li {
  margin: 0px 3px;

  a {
    padding: 10px 50px;
  }

  &:first-child {
    margin-left: 0px;
  }
}

.tabs.is-toggle li a {
  background: #eff3f6;
  font-family: GothamLight;
  font-weight: 600;
}

.tabs.is-toggle li.is-active a {
  background-color: #fff;
  border-color: #dbdbdb;
  color: #000;
  transform: scale(1.2);
  font-family: GothamMedium;
  font-weight: 500;
}

.modal-card-body {
  padding: 0px;
  .modal-wrapper {
    display: flex;
    width: 100%;
    height: 100%;

    .modal-sidebar {
      position: relative;
      width: 25%;
      max-width: 700px;
      background: #fff;
      height: 85%;
      transition: all 0.5s;
      @media screen and (max-height: 780px) {
        height: 99%;
      }

      .image-wrapper,
      .button-wrapper {
        padding: 0px 5%;
      }

      .image-wrapper span {
        text-align: start;
        position: relative;
        right: 40%;
        bottom: 20px;
        background: #fdb813;
        padding: 10px;
        font-size: 15px;
        color: #fff;
      }
      // .selfie {
      //   min-height: 100px;
      //   min-width: 100%;
      // }
      .link-wrapper {
        margin-top: 15px;
        padding-left: 5%;
        ul li {
          //   background: yellow;
          margin: 0px;
          padding: 15px 10px;
          cursor: pointer;
          font-family: GothamMedium;
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 100%;
          color: #2e434e;
          transition: all 0.5s;

          &:hover {
            background: #eff3f6;
          }
        }
      }

      .button-wrapper {
        position: absolute;
        margin: 0px;
        bottom: 0px;
        width: 100%;
        left: 0;
        right: 0;
      }
    }

    .modal-main-content {
      width: 75%;
      padding: 50px 50px;

      .custom-close-btn {
        border: none;
        background: transparent;
        cursor: pointer;
        float: right;
        display: block;
        margin-bottom: 70px !important;

        &:active,
        &:focus {
          border: none;
          outline: none;
        }

        i {
          font-size: 16px;
        }
      }
    }
  }
}

.is-toggle-active {
  background: #eff3f6;
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
