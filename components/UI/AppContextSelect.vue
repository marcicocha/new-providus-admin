<template>
  <div class="full-input select">
    <a-form-item
      :label="label"
      :required="required"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-select
        v-model="innerValue"
        mode="default"
        show-search
        style="width: 100%"
        :loading="fetching"
        :disabled="disabled"
        :placeholder="placeholder"
        :allow-clear="allowClear"
        :default-value="defaultValue"
        class="border"
        @blur="blurHandler"
        @change="changeHandler"
        @focus="searchHandler"
        @select="selectHandler"
      >
        <template v-if="remote && dataRemote">
          <a-select-option
            v-for="d in dataRemote"
            :key="d.value"
            :title="d.text"
            :value="d.text"
          >
            {{ d.text }}
          </a-select-option>
        </template>
        <template v-else>
          <template v-if="data && data.length !== ''">
            <a-select-option
              v-for="(i, index) in data"
              :key="i + '-' + index"
              :value="i"
            >
              {{ i }}
            </a-select-option>
          </template>
        </template>
      </a-select>
    </a-form-item>
  </div>
</template>
<script>
import { Select, Form, notification } from 'ant-design-vue'
import 'ant-design-vue/lib/select/style/index.less'
import 'ant-design-vue/lib/form/style/index.less'
export default {
  name: 'AppSelect',
  components: {
    'a-select': Select,
    'a-select-option': Select.Option,
    'a-form-item': Form.Item,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    allowClear: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'default',
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
    labelCol: {
      type: Object,
      default: () => {},
    },
    wrapperCol: {
      type: Object,
      default: () => {},
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
    required: {
      type: Boolean,
      default: false,
    },
    defaultValue: {
      type: [String, Number, Array],
      default: () => '',
    },
  },
  data() {
    return {
      lastFetchId: 0,
      innerValue: undefined,
      dataRemote: [],
      fetching: false,
    }
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        if (newVal && (newVal !== '' || newVal.length > 0)) {
          this.innerValue = newVal
        } else {
          this.innerValue = undefined
        }
      },
      immediate: true,
    },
    innerValue: {
      handler(newVal, oldVal) {
        this.$emit('input', newVal)
      },
      immediate: true,
    },
  },
  created() {
    if (this.value && this.value.length > 0) {
      this.innerValue = this.value
    } else {
      this.innerValue = undefined
    }
  },
  methods: {
    blurHandler(e) {
      this.$emit('blur', e)
    },
    changeHandler(e) {
      this.$emit('change', e)
    },
    searchHandler(e) {
      if (this.remote) {
        this.fetchDataHandler(e)
      }
    },
    selectHandler(e) {
      this.$emit('select', e)
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
          let errorMessage = 'Network Error'

          // Error Message from Backend
          // eslint-disable-next-line no-prototype-builtins
          if (err.hasOwnProperty('response')) {
            const res = err.response
            errorMessage = res.data.errorMessage

            notification.error({
              message: 'Error Message',
              description: errorMessage,
              duration: 4000,
            })
          }
        })
    },
  },
}
</script>
<style lang="scss" scoped>
.full-input {
  border: none;
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
  background: white;
  padding: 15px 20px;
}
.custom-select .selected {
  // background-color: #0a0a0a;
  border-radius: 6px;
  // border: 1px solid #666;
  color: #2e434e;
  // padding: 13px 0px;
  padding-top: 3px;
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
  top: 50%;
  right: 15px;
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
  position: relative;
  // background-color: #fff;
  margin: auto 0px;
  left: 0;
  right: 0;
  z-index: 2000000;
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
  .custom-select {
    font-size: 13px !important;
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
    // .full-input {
    //   height: 50px;
    // }
    label {
      font-size: 11px !important;
    }
  }
  @media only screen and (min-height: 900px) {
    .custom-select {
      font-size: 14px !important;
      line-height: 195%;
    }
    // .full-input {
    //   height: 60px;
    // }
    label {
      font-size: 13px !important;
    }
  }
}
.border {
  border: 1px solid #e2e2e2;
  -moz-box-shadow: 0px 0px 5px #ccc;
  -webkit-box-shadow: 0px 0px 5px #ccc;
  box-shadow: 0px 0px 5px #ccc;
}
</style>
