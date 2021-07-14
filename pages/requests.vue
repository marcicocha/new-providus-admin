<template>
  <div class="animated fadeIn">
    <div class="page_header">
      <h1>Manage Requests</h1>
    </div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="All" force-render>
        <AppRequestTable />
      </a-tab-pane>
      <a-tab-pane key="2" tab="Pending">
        <AppRequestTable status="PENDING" @reviewRequest="reviewRequest" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="Approved">
        <AppRequestTable
          status="APPROVED"
          @fetchCommentHandler="fetchCommentHandler"
        />
      </a-tab-pane>
      <a-tab-pane key="4" tab="Rejected">
        <AppRequestTable
          status="REJECTED"
          @fetchCommentHandler="fetchCommentHandler"
        />
      </a-tab-pane>
    </a-tabs>
    <AppManageRequest
      :visible="visible"
      :user-object="userObject"
      :pending-spinner="pendingSpinner"
      @closeDrawer="closeDrawer"
    />
    <div>
      <a-modal
        :visible="commentModalIsVisible"
        width="70%"
        :footer="null"
        :destroy-on-close="true"
        centered
        @cancel="closeModal"
      >
        <div>
          <br />
          <a-table
            :columns="commentColumns"
            :data-source="commentLists"
            :loading="commentLoading"
          />
        </div>
      </a-modal>
    </div>
  </div>
</template>
<script>
import AppRequestTable from '@/components/request/AppRequestTable'
import AppManageRequest from '@/components/request/AppManageRequest'

const commentColumns = [
  {
    title: 'Request ID',
    dataIndex: 'requestId',
  },
  {
    title: 'Authorizer Username',
    dataIndex: 'authorizerUsername',
  },
  {
    title: 'Authorizer Role',
    dataIndex: 'authorizerRole',
  },
  {
    title: 'Comment',
    dataIndex: 'comment',
    width: '40%',
  },
]
export default {
  components: {
    AppRequestTable,
    AppManageRequest,
  },
  middleware: ['auth'],
  data() {
    return {
      loading: false,
      commentColumns,
      userObject: {
        customerKin: {},
        customerContact: {},
      },
      commentLists: [],
      commentModalIsVisible: false,
      commentLoading: false,
      pendingSpinner: false,
      activeKey: '1',
      visible: false,
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
  methods: {
    closeModal() {
      this.commentModalIsVisible = false
    },
    closeDrawer() {
      this.visible = false
      // this.userObject = {}
      //   this.isProspect = true
      //   this.isUploaded = false
      //   this.operation = ''
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
        this.commentLoading = false
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
    async reviewRequest(record) {
      const user = JSON.parse(localStorage.getItem('user'))
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      this.pendingSpinner = true
      this.visible = true
      try {
        const { response } = await this.$axios.$get(
          `/individualAdmin/${record.id}`,
          config
        )
        this.userObject = response
        this.pendingSpinner = false
      } catch (err) {
        this.pendingSpinner = false
        this.isLoading = false
        this.visible = false
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
  },
}
</script>
<style lang="scss" scoped>
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
        ul {
          list-style-type: none;
          padding-left: 0;
          li {
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
</style>
