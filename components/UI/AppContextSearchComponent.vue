<template>
  <div class="mt-60">
    <div>
      <div style="margin-bottom: 10px">
        <button icon="search" type="primary" @click="openContextSearchForm">
          <i class="fa fa-search" />
        </button>
      </div>
    </div>
    <transition name="slide">
      <div v-if="visible" style="padding: 15px 0">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AppContextSearchComponent',
  props: {
    openSearchByDefault: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      visible: this.openSearchByDefault,
      drawerIsVisible: false,
    }
  },
  methods: {
    openContextSearchForm() {
      if (this.mode === 'default') {
        this.visible = !this.visible
        if (!this.visible) {
          this.$emit('contextSearchClose')
        }
      } else {
        this.drawerIsVisible = !this.drawerIsVisible
        if (!this.drawerIsVisible) {
          this.$emit('contextSearchClose')
        }
      }
    },
    closeContextSearchForm() {
      this.drawerIsVisible = false
      this.$emit('contextSearchClose')
    },
  },
}
</script>
