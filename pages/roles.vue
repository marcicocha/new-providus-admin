<template>
  <div>
    <div class="page_header">
      <h1>Roles</h1>
      <div class="wrapper">
        <div class="add-button-wrapper">
          <AppButton class="add-button" icon="plus" @click="showModal"
            >Add New Role</AppButton
          >
        </div>
      </div>
    </div>
    <br />
    <AppRolesTable :key="counter" @editRole="editRole" />

    <a-modal
      :visible="isModalVisible"
      width="500px"
      :footer="null"
      :destroy-on-close="true"
      centered
      @cancel="closeModal"
    >
      <h1>
        {{ mode === 'CREATE_MODE' ? 'Add New' : 'Edit' }}
        Role
      </h1>
      <AppRolesForm
        :current-role-object="currentRoleObject"
        :mode="mode"
        @formSubmissionCompleted="closeModal"
      />
    </a-modal>
  </div>
</template>

<script>
import AppButton from '@/components/UI/AppButton.vue'
import AppRolesTable from '@/components/roles/AppRolesTable'
import AppRolesForm from '@/components/roles/AppRolesForm'
export default {
  components: {
    AppButton,
    AppRolesTable,
    AppRolesForm,
  },
  data() {
    return {
      isModalVisible: false,
      roleObject: {
        addPermissions: [],
        isAdmin: false,
      },
      mode: 'CREATE_MODE',
      loading: false,
      btnloading: false,
      isAdmin: false,
      deletedPermissions: [],
      page: 0,
      totalElements: 0,
      currentRoleObject: {},
      counter: '',
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
    editRole(record) {
      this.mode = 'UPDATE_MODE'
      this.isModalVisible = true
      this.currentRoleObject = record
      this.currentRoleObject.addPermissions =
        this.mode === 'UPDATE_MODE' ? record.queryPermissionDTOS : []
    },
    showModal() {
      this.isModalVisible = true
      this.currentRoleObject = {}
      this.mode = 'CREATE_MODE'
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
