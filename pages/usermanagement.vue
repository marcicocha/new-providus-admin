<template>
  <div class="animated fadeIn">
    <div class="page_header">
      <h1>User Management</h1>
      <div class="wrapper">
        <div class="add-button-wrapper">
          <AppButton
            class="add-button"
            color="primary"
            icon="plus"
            @click="showModal"
            >Add New User</AppButton
          >
        </div>
      </div>
    </div>
    <br />
    <AppUserManagementTable :key="counter" @editUser="editUser" />
    <!-- add modal -->
    <a-modal
      :visible="isModalVisible"
      width="500px"
      :confirm-loading="confirmLoading"
      :footer="null"
      :destroy-on-close="true"
      centered
      @cancel="closeModal"
    >
      <h1>
        {{ mode === 'CREATE_MODE' ? 'Add New' : 'Edit' }}
        User
      </h1>
      <AppUserManagementForm
        :current-user-object="currentUserObject"
        :mode="mode"
        @formSubmissionCompleted="closeModal"
      />
    </a-modal>
  </div>
</template>
<script>
import AppButton from '@/components/UI/AppButton.vue'
import AppUserManagementTable from '@/components/user-management/AppUserManagementTable'
import AppUserManagementForm from '@/components/user-management/AppUserManagementForm'

export default {
  components: {
    AppButton,
    AppUserManagementTable,
    AppUserManagementForm,
  },
  data() {
    return {
      isModalVisible: false,
      isContextSearch: false,
      loading: false,
      isLoading: false,
      mode: 'CREATE_MODE',
      contextSearchObject: {},
      dataSource: [],
      userObject: {
        firstName: '',
      },
      confirmLoading: false,
      currentUserObject: {},
      counter: 0,
    }
  },
  beforeMount() {
    const guard = JSON.parse(localStorage.getItem('user'))
    console.log(guard, 'GUARD')
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
    editUser(record) {
      this.isModalVisible = true
      this.currentUserObject = record
      this.mode = 'UPDATE_MODE'
    },
    showModal() {
      this.isModalVisible = true
      this.currentUserObject = {}
    },
    closeModal() {
      this.isModalVisible = false
      this.counter++
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
  padding: 5px 10px;
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
