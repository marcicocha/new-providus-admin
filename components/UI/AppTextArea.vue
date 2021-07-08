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
        :validate-status="resolveState({ errors, flags })"
        :help="showErrors ? errors[0] : ''"
      >
        <a-textarea
          v-model="innerValue"
          type="text"
          :placeholder="placeholder"
          :size="size"
          :rows="rows"
          cols="50"
          :disabled="disabled"
          @blur="blurHandler"
        />
      </a-form-item>
    </ValidationProvider>
  </div>
</template>
<script>
import { ValidationProvider } from 'vee-validate'

export default {
  name: 'AppInput',
  components: {
    ValidationProvider,
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
    placeholder: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    rows: {
      type: Number,
      default: 4,
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'default',
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
      innerValue: '',
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
  methods: {
    blurHandler(e) {
      this.$emit('blur', e.target.value)
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
  },
}
</script>
<style lang="scss" scoped>
label {
  font-family: 'GothamThin', sans-serif;
}
textarea {
  outline: none;
  border: none;
  display: block;
  font-family: 'GothamLight', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
  color: #2e434e;
  padding: 2px 1px;
  width: 100%;
}
.required {
  color: red;
  font-size: 15px;
}
@media only screen and (max-width: 600px) {
  label {
    font-size: 10px !important;
  }
}
@media only screen and (max-width: 991px) {
  textarea {
    font-size: 13px !important;
  }
}
</style>
