<template>
  <div class="paginationCover">
    <div>Items {{ startPage }} - {{ endPage }} of {{ total }} items</div>
    <a-pagination
      :default-current="defaultCurrent"
      :total="totalComputed"
      :disabled="disabled"
      @change="paginationChangeHandler"
    />
  </div>
</template>
<script>
export default {
  name: 'AppPagination,',
  props: {
    pageSizeOptions: {
      type: Array,
      default: () => ['10', '20', '30', '40', '50'],
    },
    defaultCurrent: {
      type: Number,
      default: 0,
    },
    current: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    defaultPageSize: {
      type: Number,
      default: 10,
    },
    total: {
      type: [Number, String],
      default: 0,
    },
    pageNumber: {
      type: [Number, String],
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    totalComputed() {
      return parseInt(this.total)
    },
    pageSizeComputed() {
      return parseInt(this.pageSize)
    },
    currentComputed() {
      return parseInt(this.current)
    },
    startPage() {
      if (this.totalComputed === 0) {
        return 0
      }
      const start = this.pageNumber * this.pageSize + 1
      return start
    },
    endPage() {
      if (this.startPage + 9 < this.total) {
        return this.startPage + 9
      }
      return this.total
    },
  },
  methods: {
    paginationChangeHandler(pageNumber, pageSize) {
      this.$emit('change', pageNumber, pageSize)
    },
    onShowSizeChange(current, pageSize) {
      this.$emit('showSizeChange', current, pageSize)
    },
  },
}
</script>
<style lang="scss" scoped>
.paginationCover {
  display: flex;
  justify-content: space-between;
  font-family: 'GothamLight', sans-serif;
  font-weight: bold;
}
</style>
