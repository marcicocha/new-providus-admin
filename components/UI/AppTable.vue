<template>
  <div class="table-wrapper">
    <div v-if="isLoading" class="loader">
      <i class="fas fa-spinner fa-pulse" style="color: #fdb813"></i>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>No.</th>
          <th
            v-for="(column, index) in columns"
            :key="index"
            :name="column.dataindex"
            :style="column.style"
          >
            {{ column.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in dataSourceComputed" :key="index">
          <td>{{ index + 1 }}</td>
          <td v-for="(column, i) in columns" :key="i" :style="column.style">
            <slot
              v-if="column.dataIndex !== 'actions'"
              :name="column.dataIndex"
              :record="record"
            >
              <span>{{ record[column.dataIndex] }}</span>
            </slot>
            <span v-else>
              <slot name="actions" :record="record"> </slot>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'AppTable',
  components: {},
  props: {
    dataSource: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    dataSourceComputed() {
      return this.dataSource
    },
    isLoading() {
      return this.loading
    },
  },
  watch: {},
  methods: {},
}
</script>
<style lang="scss" scoped>
.table-wrapper {
  position: relative;
  top: 40px;
}
.table {
  width: 100%;
  padding: 100px;
  -webkit-box-shadow: 0px 0px 5px 0px rgba(130, 130, 130, 0.671);
  -moz-box-shadow: 0px 0px 5px 0px rgba(130, 130, 130, 0.671);
  box-shadow: 0px 0px 5px 0px rgba(130, 130, 130, 0.671);
  th {
    font-family: GothamMedium;
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 100%;
    color: #2e434e;
    opacity: 0.5;
    padding-top: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f8f8f8;
    &:first-child {
      padding-left: 30px;
    }
  }
  td {
    font-family: GothamLight;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 100%;
    color: #2e434e;
    padding-top: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f8f8f8;
    &:first-child {
      padding-left: 30px;
    }
  }
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
</style>
