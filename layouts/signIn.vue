<template>
  <div class="wrapper">
    <div class="wrapper_container">
      <header>
        <img src="../assets/images/logo.svg" alt="logo" />
      </header>
      <div class="main_container">
        <Nuxt />
      </div>
      <div class="footer">
        <img src="../assets/images/footer-pattern.png" alt="footer-pattern" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import './assets/styles/base/mixins';

.wrapper_container {
  display: grid;
  grid-template-rows: 15% auto 13%;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 90vw;
  height: 95vh;
  margin: auto;
  background-color: #fff;
  overflow-y: hidden;
  @include breakpoint-up(large) {
    width: 35vw;
    height: 80vh;
  }
}
.wrapper {
  // position: relative;
  // width: auto;
  // flex-grow: 1;
  // margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #2e434e;
}
header {
  text-align: right;
  max-height: 200px;
  padding: 30px;
  img {
    height: 100%;
  }
}
.main_container {
  padding: 1rem 2rem;
  @include breakpoint-up(large) {
    padding: 1% 15%;
  }
}
.footer {
  width: 100%;
  height: 100%;
  background-image: url('../assets/images/footer-pattern.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
