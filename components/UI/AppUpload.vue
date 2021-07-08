<template>
  <div class="full-input">
    <div class="file">
      <label class="file-label">
        <input class="file-input" type="file" name="resume" />
        <span class="file-cta" :style="{ height: height }">
          <div class="file_label__display">
            <span class="file-icon">
              <img src="@/assets/images/upload.svg" alt="upload icon" />
            </span>
            <span class="file-label">Upload {{ label }} </span>
          </div>
          <slot name="caption">
            <span> {{ caption }} </span>
          </slot>
        </span>
      </label>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AppUpload',
  props: {
    label: {
      type: String,
      default: '',
    },
    caption: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '4.5em',
    },
  },
}
</script>
<style lang="scss" scoped>
.file-cta {
  background-color: transparent;
  color: #4a4a4a;
  width: 100% !important;
  border: 1px dashed #dcdcdc !important;
  border-radius: 0;
  // min-height: 4.5em;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}
.file_label__display {
  display: flex;
}
.file-label {
  width: 100%;
}
.file-icon {
  width: 2em;
}
label {
  opacity: 1;
  display: block;
  font-family: 'GothamLight', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 150%;
  color: #2e434e;
  padding: 2px 1px;
  width: 100%;
}
.full-input {
  margin-bottom: 5px;
  width: 100%;
}
@media only screen and (max-width: 991px) {
  label {
    font-size: 13px !important;
  }
}
</style>
