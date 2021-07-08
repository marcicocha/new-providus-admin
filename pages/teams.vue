<template>
  <div>
    <div class="page_header">
      <h1>Manage Teams</h1>
      <div class="wrapper">
        <div class="search-bar">
          <AppSearchInput placeholder="Search Users" />
        </div>
      </div>
    </div>
    <AppTable :columns="columns" :data-source="dataSource">
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
                <i class="fas fa-pencil-alt" /> Edit User
              </a>
              <a
                class="dropdown-item"
                @click="toggleModal('DELETE_MODE', record)"
              >
                <i class="fa fa-trash-alt" /> Delete User
              </a>
            </div>
          </div>
        </div>
      </template>
    </AppTable>
  </div>
</template>

<script>
import AppTable from '@/components/UI/AppTable.vue'

const columns = [
  {
    name: 'No.',
    dataIndex: 'id',
  },
  {
    name: 'Staff ID',
    dataIndex: 'staffID',
  },
  {
    name: 'Username',
    dataIndex: 'name',
  },
  {
    name: 'Email Address',
    dataIndex: 'email',
  },
  {
    name: 'Role',
    dataIndex: 'role',
  },
  {
    name: '',
    dataIndex: 'actions',
  },
]
const dataSource = [
  {
    id: '01.',
    name: 'Wasif',
    staffID: '#2894021',
    email: 'wasif@email.com',
    role: 'admin',
    date: '10-10-2019',
  },
  {
    id: '02.',
    name: 'Ali',
    staffID: '#3234324',
    email: 'ali@email.com',
    role: 'admin',
    date: '10-10-2019',
  },
  {
    id: '03.',
    name: 'Saad',
    staffID: '#4982304',
    email: 'saad@email.com',
    role: 'admin',
    date: '10-10-2019',
  },
  {
    id: '04.',
    name: 'Asad',
    staffID: '#53436',
    email: 'asad@email.com',
    role: 'admin',
    date: '10-10-2019',
  },
]

export default {
  components: {
    AppTable,
  },
  layout: 'dashboard',
  middleware: ['auth'],
  data() {
    return {
      columns,
      dataSource,
    }
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
    font-size: 30px;
    line-height: 150%;
    color: #2e434e;
  }
  .wrapper {
    margin-top: 15px;
    div {
      display: inline-block;
    }
    .search-bar {
      width: 350px;
    }
  }
}
</style>
