<template>
  <div class="switch" style="margin-bottom: 1rem">
    <a-form-item :label="label" :required="required">
      <a-switch :disabled="disabled" @change="onChange" />
    </a-form-item>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
      required: true,
    },
    label: {
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
  },
  computed: {
    backgroundStyles() {
      if (this.disabled) {
        return
      }
      return {
        'gold-mid': this.value,
        'gray-lighter': !this.value,
      }
    },
    indicatorStyles() {
      return { transform: this.value ? 'translateX(14px)' : 'translateX(0)' }
    },
  },
  methods: {
    onChange(checked) {
      // this.checked = checked;
      this.$emit('change', checked)
    },
  },
}
</script>

<style lang="scss" scoped>
.gold-mid {
  background-color: #666;
}
.gray-lighter {
  background-color: #c2c2c2;
}
.toggle-wrapper {
  display: inline-block;
  position: relative;
  cursor: pointer;
  width: 50px;
  height: 28px;
  border-radius: 9999px;
}

.toggle-wrapper:focus {
  outline: 0;
}

.toggle-background {
  display: inline-block;
  border-radius: 9999px;
  height: 100%;
  width: 100%;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.4s ease;
}

.toggle-indicator {
  position: absolute;
  height: 24px;
  width: 25px;
  left: 5px;
  bottom: 1.5px;
  background-color: #fff;
  border-radius: 9999px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.4s ease;
}
</style>
