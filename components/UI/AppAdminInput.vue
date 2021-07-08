<template>
  <div class="full-input input">
    <a-form-item :label="label">
      <a-input
        v-model="innerValue"
        type="text"
        name="name"
        :class="{ border: border }"
        :placeholder="placeholder"
        :disabled="disabled"
        @blur="blurHandler"
      />
    </a-form-item>
  </div>
</template>

<script>
export default {
  name: 'AppInput',
  components: {},
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
    border: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
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
        this.innerValue = !newVal ? '' : newVal
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
  },
}
</script>
<style lang="scss" scoped>
.full-input {
  border: none;
}
.ant-form-item label {
  font-family: GothamLight;
  font-style: normal;
  font-weight: bold;
  font-size: 15px;
  line-height: 100%;
  color: #2e434e;
  opacity: 0.8;
  margin-bottom: 6px;
  padding: 0 !important;
}
input {
  outline: none;
  border: none;
  display: block;
  font-family: 'Gothamlight', sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  // line-height: 150%;
  color: #2e434e;
  padding: 6px 10px;
  width: 100%;
}
input[type='text']:disabled {
  background: #fff;
}
.border {
  border: 1px solid #e2e2e2;
  -moz-box-shadow: 0px 0px 5px 0px #e2e2dd;
  -webkit-box-shadow: 0px 0px 5px 0px #e2e2dd;
  box-shadow: 0px 0px 5px 0px #e2e2dd;
}
</style>
