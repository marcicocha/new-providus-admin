<template>
  <div class="loader">
    <img class="loader-img" src="../../assets/images/logo.svg" alt="logo" />
  </div>
</template>

<script>
export default {
  name: 'AppLoader',
}
</script>

<style scoped>
.loader {
  display: table;
  background: #fff;
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden !important;
  z-index: 999999999999999;
}
.loader-img {
  margin: 42vh auto auto auto;
  display: table-cell;
  vertical-align: middle;
  position: relative;
  width: 155px;
  height: auto;
}
</style>
