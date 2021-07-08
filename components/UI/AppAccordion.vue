<template>
  <div>
    <vsa-list :init-active="true">
      <vsa-item>
        <vsa-heading
          ><span class="accordion_heading">{{ `${heading} ${counter}` }}</span>
        </vsa-heading>
        <vsa-icon>
          <span class="open"></span>
          <span class="close"></span>
        </vsa-icon>
        <vsa-content><slot name="content"></slot></vsa-content>
      </vsa-item>
    </vsa-list>
  </div>
</template>
<script>
import {
  VsaList,
  VsaItem,
  VsaHeading,
  VsaContent,
  VsaIcon,
} from 'vue-simple-accordion'
export default {
  name: 'AppAccordion',
  components: {
    VsaList,
    VsaItem,
    VsaHeading,
    VsaContent,
    VsaIcon,
  },
  props: {
    heading: {
      type: String,
      default: '',
    },
    counter: {
      type: Number,
      default: 1,
    },
  },
}
</script>
<style lang="scss" scoped>
.open {
  display: none;
}
.close {
  display: none;
}
.accordion_heading {
  font-family: 'GothamBold', sans-serif;
  font-size: 20px;
  display: flex;
  width: 100%;
}
.accordion_heading::after {
  content: '';
  flex: 1;
  margin-left: 1rem;
  margin-top: 10px;
  vertical-align: bottom;
  height: 1.5px;
  background-color: #fdb813;
}
@media only screen and (max-width: 600px) {
  .accordion_heading {
    font-family: 'GothamBold', sans-serif;
    font-size: 17px;
    display: flex;
    width: 100%;
  }
  .accordion_heading::after {
    content: '';
    height: 1.2px;
  }
}
</style>
