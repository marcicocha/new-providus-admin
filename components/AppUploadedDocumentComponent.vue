<template>
  <div>
    <div style="display: flex; justify-content: space-between">
      <h1>Uploaded Documents</h1>
      <AppButton :block="false" @click="printAllHandler()">Print All</AppButton>
    </div>
    <a-row type="flex" :gutter="16">
      <a-col :span="8">
        <div class="card">
          <div class="card-content">
            <div id="utility" class="content">
              <img
                :src="`data:image/jpg;base64,` + userObjectComputed.utility"
                alt=""
              />
            </div>
          </div>
          <footer class="card-footer">
            <p>Utility Bill</p>
            <a-dropdown>
              <i
                class="custom-table-btn fas fa-ellipsis-v"
                aria-controls="dropdown-menu"
              >
              </i>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a class="dropdown-item" @click="printMethod('utility')">
                    <i class="fas fa-print" /> Print
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a
                    class="dropdown-item"
                    @click="
                      previewImages(
                        `data:image/jpg;base64,` + userObjectComputed.utility,
                        'Utility Bill'
                      )
                    "
                  >
                    <i class="fas fa-eye" /> View
                  </a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </footer>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="card">
          <div class="card-content">
            <div id="idCard" class="content">
              <img
                :src="`data:image/png;base64,` + userObjectComputed.idCard"
                alt=""
              />
            </div>
          </div>
          <footer class="card-footer">
            <p>ID Card</p>
            <a-dropdown>
              <i
                class="custom-table-btn fas fa-ellipsis-v"
                aria-controls="dropdown-menu"
              >
              </i>
              <a-menu slot="overlay">
                <a-menu-item>
                  <!-- <a @click="printMethod('idCard')">
                    <i class="fas fa-print" /> Print
                  </a> -->
                  <a class="dropdown-item" @click="printMethod('idCard')">
                    <i class="fas fa-print" /> Print
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a
                    class="dropdown-item"
                    @click="
                      previewImages(
                        `data:image/jpg;base64,` + userObjectComputed.idCard,
                        'ID Card'
                      )
                    "
                  >
                    <i class="fas fa-eye" /> View
                  </a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </footer>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="card">
          <div class="card-content">
            <div id="signature" class="content">
              <img
                :src="`data:image/png;base64,` + userObjectComputed.signature"
                alt=""
              />
            </div>
          </div>
          <footer class="card-footer">
            <p>Signature</p>
            <a-dropdown>
              <i
                class="custom-table-btn fas fa-ellipsis-v"
                aria-controls="dropdown-menu"
              >
              </i>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a class="dropdown-item" @click="printMethod('signature')">
                    <i class="fas fa-print" /> Print
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a
                    class="dropdown-item"
                    @click="
                      previewImages(
                        `data:image/jpg;base64,` + userObjectComputed.signature,
                        'Signature'
                      )
                    "
                  >
                    <i class="fas fa-eye" /> View
                  </a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </footer>
        </div>
      </a-col>
      <a-col :span="8">
        <div id="ref1" class="card">
          <div class="card-content">
            <div class="content">
              <img
                :src="`data:image/png;base64,` + userObjectComputed.reference1"
                alt=""
              />
            </div>
          </div>
          <footer class="card-footer">
            <p>Reference 1</p>
            <a-dropdown>
              <i
                class="custom-table-btn fas fa-ellipsis-v"
                aria-controls="dropdown-menu"
              >
              </i>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a class="dropdown-item" @click="printMethod('ref1')">
                    <i class="fas fa-print" /> Print
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a
                    class="dropdown-item"
                    @click="
                      previewImages(
                        `data:image/jpg;base64,` +
                          userObjectComputed.reference1,
                        'reference 1'
                      )
                    "
                  >
                    <i class="fas fa-eye" /> View
                  </a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </footer>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="card">
          <div class="card-content">
            <div id="ref2" class="content">
              <img
                :src="`data:image/png;base64,` + userObjectComputed.reference2"
                alt=""
              />
            </div>
          </div>
          <footer class="card-footer">
            <p>Reference 2</p>
            <a-dropdown>
              <i
                class="custom-table-btn fas fa-ellipsis-v"
                aria-controls="dropdown-menu"
              >
              </i>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a class="dropdown-item" @click="printMethod('ref2')">
                    <i class="fas fa-print" /> Print
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a
                    class="dropdown-item"
                    @click="
                      previewImages(
                        `data:image/jpg;base64,` +
                          userObjectComputed.reference2,
                        'reference 2'
                      )
                    "
                  >
                    <i class="fas fa-eye" /> View
                  </a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </footer>
        </div>
      </a-col>
    </a-row>
    <a-modal
      :visible="previewIsVisible"
      :footer="null"
      :destroy-on-close="true"
      :dialog-style="{ top: '50px' }"
      width="80%"
      @cancel="closePreviewDrawer"
    >
      <div class="previewContainer">
        <h2>Previewing {{ previewTitle }}</h2>
        <a-divider />
        <div class="image-wrapper">
          <img :src="previewSrc" class="previewSrc" alt="" />
        </div>
      </div>
    </a-modal>
    <div v-show="false" id="printAll">
      <img
        :src="`data:image/jpg;base64,` + userObjectComputed.utility"
        alt=""
      />
      <br />
      <img :src="`data:image/png;base64,` + userObjectComputed.idCard" alt="" />
      <br />
      <img
        :src="`data:image/png;base64,` + userObjectComputed.signature"
        alt=""
      />
      <br />
      <img
        :src="`data:image/png;base64,` + userObjectComputed.reference1"
        alt=""
      />
      <br />
      <img
        :src="`data:image/png;base64,` + userObjectComputed.reference2"
        alt=""
      />
      <br />
    </div>
  </div>
</template>

<script>
import AppButton from '@/components/UI/AppButton'
export default {
  name: 'AppUploadedDocumentComponent',
  components: {
    AppButton,
  },
  props: {
    userObject: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      previewSrc: '',
      previewTitle: '',
      previewIsVisible: false,
    }
  },
  computed: {
    userObjectComputed() {
      return this.userObject
    },
  },
  methods: {
    previewImages(imageSource, action) {
      this.previewSrc = imageSource
      this.previewTitle = action
      this.previewIsVisible = true
    },
    async printMethod(imgId) {
      // const utilityPrint = document.getElementById('utility')
      await this.$htmlToPaper(imgId)
    },
    closePreviewDrawer() {
      this.previewIsVisible = false
    },
    printAllHandler() {
      this.$htmlToPaper('printAll')
    },
  },
}
</script>
<style lang="scss" scoped>
h1 {
  margin-bottom: 35px;
  font-family: 'GothamMedium', sans-serif;
  font-style: normal;
  font-weight: bold;
}
.print-btn {
  background: transparent;
  border: none;
  font-family: 'GothamLight', sans-serif;
  font-style: normal;
  font-weight: 600;
  cursor: pointer;
  margin-top: 25px;
}
.card {
  background: white;
  border: 0.5px solid #ddddddcb;
  margin-bottom: 2rem;
  .card-content {
    padding: 10px;
    overflow: hidden;
    text-align: center;
    border-bottom: 0.5px solid #ddddddcb;
    height: 250px;
    .content {
      height: 100%;
      width: 100%;
      img {
        height: 100%;
        width: 100%;
        object-fit: contain;
      }
    }
  }
  .card-footer {
    display: flex;
    width: 100%;
    padding: 15px 15px;
    p {
      width: 95%;
    }
    .action-btn {
      width: 5%;
    }
  }
}
i {
  padding: 0px 10px;
}
.previewContainer {
  h2 {
    margin: 1rem 1rem 0rem;
  }
  hr {
    margin: 0.2rem 0rem 0.5rem !important;
  }
  .image-wrapper {
    .previewSrc {
      max-width: 800px;
      height: 70vh;
      display: block;
      margin: 0 auto;
    }
    .previewPdfSrc {
      max-width: 100%;
      height: 70vh;
      display: block;
      margin: 0 auto;
    }
  }
}
</style>
