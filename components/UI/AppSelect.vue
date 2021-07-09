<template>
  <div class="full-input">
    <ValidationProvider
      :vid="$attrs.name"
      :name="name"
      :rules="rules"
      tag="div"
    >
      <a-form-item
        slot-scope="{ errors, flags }"
        :label="label"
        :required="required"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :validate-status="resolveState({ errors, flags })"
        :help="showErrors ? errors[0] : ''"
      >
        <!-- <label for="name">{{ label }}</label> -->
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
    </ValidationProvider>
  </div>
</template>
<script>
import { ValidationProvider } from 'vee-validate'

export default {
  name: 'AppSelect',
  components: { ValidationProvider },
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
    rules: {
      type: [Object, String],
      default: '',
    },
    showErrors: {
      type: Boolean,
      default: true,
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
    resolveState({ errors, flags }) {
      if (errors[0]) {
        return 'error'
      }

      // if (flags.pending) {
      //   return 'validating'
      // }

      // if (flags.valid) {
      //   return 'success'
      // }

      return ''
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

            this.$notification.error({
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
