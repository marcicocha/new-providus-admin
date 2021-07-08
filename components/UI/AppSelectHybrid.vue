<template>
  <div class="full-input">
    <label id="name" for="name"
      >{{ label }} <span v-if="required" class="required">*</span></label
    >
    <div
      class="custom-select"
      :tabindex="tabindex"
      :disabled="disabled"
      @blur="open = false"
      @click="searchHandler"
    >
      <div class="selected" :class="{ open: open }" @click="open = !open">
        <span>{{ setSelected }}</span>
      </div>
      <div v-if="remote" class="items" :class="{ selectHide: !open }">
        <p
          v-for="(option, i) of dataRemote"
          :key="i"
          class="item"
          @click="
            selected = option
            open = false
            $emit('input', option.value)
          "
        >
          {{ option.text }}
        </p>
      </div>
      <div v-else class="items" :class="{ selectHide: !open }">
        <template v-if="data && data.length !== ''">
          <p
            v-for="(option, i) of data"
            :key="i"
            class="item"
            @click="
              selected = option
              open = false
              $emit('input', option)
            "
          >
            {{ option }}
          </p>
        </template>
      </div>
    </div>
    <!--    <select-->
    <!--      v-model="innerValue"-->
    <!--      :name="name"-->
    <!--      :class="{-->
    <!--        'is-loading': fetching,-->
    <!--      }"-->
    <!--      :disabled="disabled"-->
    <!--      @blur="blurHandler"-->
    <!--      @change="changeHandler"-->
    <!--      @focus="searchHandler"-->
    <!--      @select="selectHandler"-->
    <!--    >-->
    <!--      <template v-if="remote">-->
    <!--        <template>-->
    <!--          <option-->
    <!--            v-for="d in dataRemote"-->
    <!--            :key="d.value"-->
    <!--            :title="d.text"-->
    <!--            :value="d.text"-->
    <!--          >-->
    <!--            {{ d.text }}-->
    <!--          </option>-->
    <!--        </template>-->
    <!--      </template>-->
    <!--      <template v-else>-->
    <!--        <template v-if="data && data.length !== ''">-->
    <!--          <option v-for="(i, index) in data" :key="i + '-' + index" :value="i">-->
    <!--            {{ i }}-->
    <!--          </option>-->
    <!--        </template>-->
    <!--      </template>-->
    <!--    </select>-->
  </div>
</template>
<script>
export default {
  name: 'AppSelectHybrid',
  props: {
    value: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    remote: {
      type: Boolean,
      default: true,
    },
    url: {
      type: String,
      default: '',
    },
    data: {
      type: Array,
      default: () => [],
    },
    callBackFunc: {
      type: Function,
      default: () => 1,
    },
    name: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      lastFetchId: 0,
      innerValue: undefined,
      dataRemote: [],
      fetching: false,
      selected: '',
      open: false,
    }
  },
  computed: {
    setSelected() {
      return this.value
    },
  },
  // watch: {
  //   value: {
  //     handler(newVal, oldVal) {
  //       if (newVal && (newVal !== '' || newVal.length > 0)) {
  //         this.innerValue = newVal
  //       } else {
  //         this.innerValue = undefined
  //       }
  //     },
  //     immediate: true,
  //   },
  //   innerValue: {
  //     handler(newVal, oldVal) {
  //       this.$emit('input', newVal)
  //     },
  //     immediate: true,
  //   },
  // },
  // created() {
  //   if (this.value && this.value.length > 0) {
  //     this.innerValue = this.value
  //   } else {
  //     this.innerValue = undefined
  //   }
  // },
  methods: {
    blurHandler(e) {
      this.$emit('blur', e.target.value)
    },
    changeHandler(e) {
      this.$emit('change', e.target.value)
    },
    searchHandler(e) {
      if (this.remote) {
        this.fetchDataHandler(e.target.value)
      }
    },
    selectHandler(e) {
      this.$emit('select', e.target.value)
    },
    fetchDataHandler(value) {
      if (this.lastFetchId > 0) {
        return
      }
      const user = JSON.parse(localStorage.getItem('user'))
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      const callBackFunc = this.callBackFunc
      this.dataRemote = []
      this.fetching = true
      this.$axios
        .$get(this.url, config)
        .then((body) => {
          if (body.response && Array.isArray(body.response)) {
            const dataRemote = body.response.map(callBackFunc)
            this.$nextTick(() => {
              this.dataRemote = dataRemote
            })
          } else if (!body.response) {
            const dataRemote = body.map(callBackFunc)
            this.$nextTick(() => {
              this.dataRemote = dataRemote
            })
            // this.dataRemote = dataRemote
          } else {
            const dataRemote = body.response.content.map(callBackFunc)
            this.$nextTick(() => {
              this.dataRemote = dataRemote
            })
            this.dataRemote = dataRemote
          }
          this.fetching = false
          this.lastFetchId += 1
        })
        .catch((err) => {
          this.fetching = false
          let errorMessage = ''
          // Error Message from Backend
          // eslint-disable-next-line no-prototype-builtins
          if (err.hasOwnProperty('response')) {
            const res = err.response
            errorMessage = res.data.errorMessage
            this.$toast.open({
              message: `<p class="toast-title">Error Message</p>
                    <p class="toast-msg"> ${errorMessage} </p>`,
              type: 'error',
              duration: 4000,
              dismissible: true,
            })
          }
        })
    },
  },
}
</script>
<style lang="scss" scoped>
.full-input {
  display: inline-block;
  padding: 5px 10px;
  border: 1px solid #eaeaea;
  width: 100%;
  margin-bottom: 10px;
  height: 60px;
}
.custom-select {
  position: relative;
  width: 100%;
  text-align: left;
  outline: none;
  height: 150%;
  line-height: 150%;
  border: none;
  display: block;
  font-family: 'GothamLight', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  color: #2e434e;
  padding: 2px 1px;
}
.custom-select .selected {
  // background-color: #0a0a0a;
  border-radius: 6px;
  // border: 1px solid #666;
  color: #2e434e;
  // padding: 13px 0px;
  padding-top: 5px;
  padding-right: 1em;
  cursor: pointer;
  user-select: none;
}
// .custom-select .selected.open {
//  border: 1px solid #ad8225;
//  border-radius: 6px 6px 0px 0px;
// }
.custom-select .selected::after {
  position: absolute;
  content: '';
  top: 10%;
  right: 0em;
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-color: #2e434e transparent transparent transparent;
}
.custom-select .items {
  color: #2e434e;
  border-radius: 0px 0px 6px 6px;
  overflow-y: auto;
  overflow-wrap: anywhere;
  position: absolute;
  // background-color: #fff;
  margin: auto 0px;
  left: 0;
  right: 0;
  z-index: 1;
  max-height: 50vh;
  border: 1px solid #eaeaea;
}
.custom-select .items p {
  color: #2e434e;
  padding-top: 12px;
  padding-left: 1em;
  cursor: pointer;
  user-select: none;
  background-color: #fff;
  height: auto;
  font-family: 'GothamLight', sans-serif;
}
.custom-select .items p:hover {
  background-color: #f1b100;
  color: #fff;
}
.selectHide {
  display: none;
}
.required {
  color: red;
  font-size: 15px;
}
@media only screen and (max-width: 991px) {
  .custom-select,
  .custom-select .selected {
    padding-top: 0 !important;
    font-size: 13px !important;
    min-height: 1rem;
  }
}
@media only screen and (max-width: 600px) {
  label {
    font-size: 10px !important;
  }
}
@media only screen and (min-width: 1536px) {
  @media only screen and (min-height: 730px) {
    .custom-select {
      font-size: 12px !important;
      line-height: 100%;
    }
    .full-input {
      height: 50px;
    }
    label {
      font-size: 11px !important;
    }
  }
  @media only screen and (min-height: 900px) {
    .custom-select {
      font-size: 14px !important;
      line-height: 195%;
    }
    .full-input {
      height: 60px;
    }
    label {
      font-size: 13px !important;
    }
  }
}
</style>
