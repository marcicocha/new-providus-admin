<template>
  <div>
    <div class="multiselect-wrapper">
      <label for=""
        >{{ label }} <span v-if="required" class="required">*</span></label
      >
      <div class="selected-list">
        <span
          v-for="(item, index) in selectListComputed"
          :key="index"
          class="animated bounceIn"
          >{{ item }} <i class="fa fa-times" @click="selectMethod(item)"
        /></span>
        <span v-if="selectedList.length > 2" class="animated bounceIn"
          >+ {{ selectedList.length - 2 }} More</span
        >
      </div>
      <div class="select-list-wrapper">
        <div v-if="loading" class="list-shade">
          <i class="fas fa-spinner fa-pulse" style="color: #fdb813"></i>
        </div>
        <a-checkbox
          style="margin-left: 0.5rem; margin-bottom: 0.5rem"
          @change="onChange"
          >Check All</a-checkbox
        >
        <ul>
          <li
            v-for="(data, i) in remoteList"
            :key="i"
            :class="{ isSelected: isSelectedMethod(data) }"
            @click="selectMethod(data)"
          >
            {{ data }} <i class="fa fa-check" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedList: [],
      remoteList: [],
      loading: false,
    }
  },
  computed: {
    selectListComputed() {
      const list =
        this.selectedList.length > 2
          ? this.selectedList.slice(0, 2)
          : this.selectedList
      return list
    },
  },
  watch: {
    selectedList: {
      handler(newVal, oldVal) {
        const data = []
        newVal.forEach((record) => {
          data.push({ permSysName: record })
        })
        this.$emit('input', data)
      },
      immediate: true,
    },
    isAdmin: {
      handler(newVal) {
        this.selectedList = []
        this.searchMethod(newVal)
      },
      immediate: true,
    },
    value: {
      handler(newVal, oldVal) {
        const data = []
        newVal.forEach((record) => {
          data.push(record.permSysName)
        })
        const selectedList = Array.from(this.selectedList)
        this.selectedList =
          selectedList.toString() === data.toString() ? this.selectedList : data
      },
      immediate: true,
    },
  },
  mounted() {
    this.searchMethod(this.isAdmin)
  },
  methods: {
    onChange(e) {
      if (e.target.checked) {
        this.selectedList = [...this.remoteList]
      } else {
        this.selectedList = []
      }
    },
    isSelectedMethod(record) {
      return this.selectedList.includes(record)
    },
    selectMethod(record) {
      if (record && !this.selectedList.includes(record)) {
        this.selectedList.push(record)
      } else if (record && this.selectedList.includes(record)) {
        const index = this.selectedList.indexOf(record)
        if (index !== -1) {
          this.selectedList.splice(index, 1)
          this.$emit('removedRecord', record)
        }
      }
    },
    async searchMethod(isAdmin) {
      this.loading = true
      const user = JSON.parse(localStorage.getItem('user'))
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      const url = isAdmin
        ? '/role/adminPermissions'
        : '/role/accountOpeningPermissions'
      try {
        const { response } = await this.$axios.$get(url, config)
        this.remoteList = response
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
  },
}
</script>
<style lang="scss" scoped>
.multiselect-wrapper {
  label {
    font-family: 'GothamThin', sans-serif;
  }
  .selected-list {
    height: 60px;
    border: 1px solid #eaeaea;
    display: flex;
    align-items: center;
    width: 100%;
    span {
      background: #fdb813;
      padding: 5px 10px;
      margin: 0px 3px;
      color: #fff;
      border-radius: 20px;
      width: auto;
      font-size: 14px;
      i {
        color: #fff;
        cursor: pointer;
        padding: 0px 20px imp !important;
      }

      p {
        color: #d8d8d8;
        width: 100%;
        text-align: center;
      }
    }
  }
  .select-list-wrapper {
    margin-top: 5px;
    height: 250px;
    border: 1px solid #eaeaea;
    overflow-y: scroll;
    overflow-x: hidden;
    position: relative;
    ul {
      padding-left: 0;
      list-style-type: none;
      li {
        padding: 5px 10px;
        transition: all 0.5s;
        i {
          display: none;
        }
        &:hover {
          background: #f8f8f8;
          cursor: pointer;
        }
      }
    }
    .list-shade {
      position: absolute;
      height: 100%;
      width: 100%;
      background: #ffffffbe;
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        font-size: 20px;
      }
    }
    .isSelected {
      background: #f8f8f8;
      i {
        float: right;
        display: block;
        color: #fdb813;
      }
    }
    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar {
      width: 6px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #fdb813;
    }
  }
}
.fa {
  margin: 0px;
}
.required {
  color: red;
  font-size: 15px;
}
@keyframes bounceIn {
  from,
  20%,
  40%,
  60%,
  80%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }

  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }

  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }

  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }

  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }

  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

.bounceIn {
  animation-name: bounceIn;
}
.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}
</style>
