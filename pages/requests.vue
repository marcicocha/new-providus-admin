<template>
  <div class="animated fadeIn">
    <div class="page_header">
      <h1>Manage Requests</h1>
    </div>
    <div class="tabs is-toggle">
      <ul>
        <li
          :class="{ 'is-active': tabsel == 'all' }"
          @click="fetchRequestHandler('all')"
        >
          <a>All</a>
        </li>
        <li
          :class="{ 'is-active': tabsel == 'pending' }"
          @click="fetchRequestHandler('pending')"
        >
          <a>Pending</a>
        </li>
        <li
          :class="{ 'is-active': tabsel == 'approved' }"
          @click="fetchRequestHandler('approved')"
        >
          <a>Approved</a>
        </li>
        <li
          :class="{ 'is-active': tabsel == 'remove' }"
          @click="fetchRequestHandler('remove')"
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
          :loading="loading"
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
          :loading="loading"
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
              <!-- <i v-if="pendingSpinner" class="fas fa-spinner fa-spin"></i> -->
              Review
            </span>
          </template>
        </AppTable>
        <AppPagination :total-items="totalElements" :page="page" />
      </div>
      <!-- approved table -->
      <div v-show="tabsel == 'approved'">
        <AppTable
          :columns="approvedColumns"
          :data-source="dataSourceApproved"
          :loading="loading"
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
          <template slot="comment" slot-scope="{ record }">
            <div style="text-align: center">
              <i
                class="custom-table-btn fas fa-eye"
                aria-controls="dropdown-menu"
                @click="fetchCommentHandler(record.requestId)"
              >
              </i>
            </div>
          </template>
        </AppTable>
        <AppPagination :total-items="totalElements" :page="page" />
      </div>
      <!-- remove table -->
      <div v-show="tabsel == 'remove'">
        <AppTable
          :columns="approvedColumns"
          :data-source="dataSourceRemoved"
          :loading="loading"
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
          <template slot="comment" slot-scope="{ record }">
            <div style="text-align: center">
              <i
                class="custom-table-btn fas fa-eye"
                aria-controls="dropdown-menu"
                @click="fetchCommentHandler(record.requestId)"
              >
              </i>
            </div>
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
              <div v-if="pendingSpinner" class="loader">
                <i class="fas fa-spinner fa-pulse" style="color: #fdb813"></i>
              </div>
              <div v-else class="modal-wrapper">
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
                  <div
                    class="button-wrapper columns is-multiline"
                    :style="operation ? 'opacity: 0' : ''"
                  >
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
      <transition name="fade">
        <AppModal
          :is-visible="commentModalIsVisible"
          is-full-screen
          @closeModal="closeModal"
        >
          <template slot="modal">
            <section
              class="modal-card-body"
              style="background: #f9fafb !important; padding: 7% 5%"
            >
              <button
                class="delete custom-close-btn"
                aria-label="close"
                style="float: right"
                @click="closeModal"
              >
                <i class="fa fa-times"></i>
              </button>
              <br />
              <div>
                <AppTable
                  :columns="commentColumns"
                  :data-source="commentLists"
                  :loading="commentLoading"
                >
                </AppTable>
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
    name: 'Comment',
    dataIndex: 'comment',
  },
  {
    name: '',
    dataIndex: 'actions',
  },
]
const commentColumns = [
  {
    name: 'Request ID',
    dataIndex: 'requestId',
  },
  {
    name: 'Authorizer Username',
    dataIndex: 'authorizerUsername',
  },
  {
    name: 'Authorizer Role',
    dataIndex: 'authorizerRole',
  },
  {
    name: 'Comment',
    dataIndex: 'comment',
    style: 'width: 40%',
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
      loading: false,
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
      commentColumns,
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
      commentLoading: false,
      pendingSpinner: false,
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
    this.fetchRequestHandler('all')
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
        this.fetchRequestHandler('pending')
      }
      if (this.commentModalIsVisible) {
        this.commentModalIsVisible = false
      }
    },
    async fetchCommentHandler(requestId) {
      const user = JSON.parse(localStorage.getItem('user'))
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      try {
        this.commentLoading = true
        const { response } = await this.$axios.$get(
          `/user/fetchComments?requestId=${requestId}`,
          config
        )
        this.commentLists = response
        this.commentModalIsVisible = true
        this.commentLoading = false
      } catch (err) {
        let errorMessage = ''
        this.commentLoading = false
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
    async reviewRequest(record) {
      const user = JSON.parse(localStorage.getItem('user'))
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      this.loadingPending = true
      this.pendingSpinner = true
      this.isModalVisible = true
      try {
        const { response } = await this.$axios.$get(
          `/individualAdmin/${record.id}`,
          config
        )
        this.userObject = response
        this.loadingPending = false
        this.pendingSpinner = false
      } catch (err) {
        let errorMessage = ''
        this.pendingSpinner = false
        this.isLoading = false
        this.loadingPending = false
        this.isModalVisible = false
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

      this.fetchRequestHandler('all')
    },
    pageChangeApproved(page) {
      this.pageApprove = page

      this.fetchRequestHandler('approved')
    },
    pageChangePending(page) {
      this.pagePending = page

      this.fetchRequestHandler('pending')
    },
    pageChangeReject(page) {
      this.pageReject = page

      this.fetchRequestHandler('remove')
    },
    async fetchRequestHandler(requestType) {
      const user = JSON.parse(localStorage.getItem('user'))
      let params
      if (requestType === 'all') {
        params = { currentPage: this.page }
        this.tabsel = 'all'
      }
      if (requestType === 'pending') {
        params = { status: 'PENDING', currentPage: this.pagePending }
        this.tabsel = 'pending'
      }
      if (requestType === 'approved') {
        params = { status: 'APPROVED', currentPage: this.pageApprove }
        this.tabsel = 'approved'
      }
      if (requestType === 'remove') {
        params = { status: 'REJECTED', currentPage: this.pageReject }
        this.tabsel = 'remove'
      }
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params,
      }
      this.loading = true
      try {
        const { response } = await this.$axios.$get(
          '/individualAdmin/search',
          config
        )
        if (requestType === 'all') {
          this.dataSourceAll = response.content
          this.totalElements = response.totalElements
        }
        if (requestType === 'pending') {
          this.dataSourcePending = response.content
          this.totalElementsPending = response.totalElements
        }
        if (requestType === 'approved') {
          this.dataSourceApproved = response.content
          this.totalElementsApproved = response.totalElements
        }
        if (requestType === 'remove') {
          this.dataSourceRemoved = response.content
          this.totalElementsRejected = response.totalElements
        }
        this.loading = false
      } catch (err) {
        let errorMessage = ''

        this.loading = false

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
.loader {
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.589);
  justify-content: center;
  align-items: center;
  z-index: 1000;
  i {
    font-size: 350%;
  }
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
