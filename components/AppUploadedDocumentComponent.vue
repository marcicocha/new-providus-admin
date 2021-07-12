<template>
  <div>
    <h1>Uploaded Documents</h1>
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
                <a-menu-item
                  ><a @click="printMethod('idCard')">
                    <i class="fas fa-print" /> Print
                  </a></a-menu-item
                >
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
                    <i class="fas fa-pencil-alt" /> Print
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
        <div class="card">
          <div class="card-content">
            <div id="signature" class="content">
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
                  <a class="dropdown-item" @click="printMethod('signature')">
                    <i class="fas fa-pencil-alt" /> Print
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a
                    class="dropdown-item"
                    @click="
                      previewImages(
                        `data:image/jpg;base64,` +
                          userObjectComputed.reference1,
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
        <div class="card">
          <div class="card-content">
            <div id="signature" class="content">
              <img
                :src="`data:image/png;base64,` + userObjectComputed.reference2"
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
                  <a class="dropdown-item" @click="printMethod('signature')">
                    <i class="fas fa-pencil-alt" /> Print
                  </a>
                </a-menu-item>
                <a-menu-item>
                  <a
                    class="dropdown-item"
                    @click="
                      previewImages(
                        `data:image/jpg;base64,` +
                          userObjectComputed.reference2,
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
    </a-row>
    <a-modal
      :visible="previewIsVisible"
      :footer="null"
      :destroy-on-close="true"
      :dialog-style="{ top: '20px' }"
      width="80%"
      @cancel="closePreviewDrawer"
    >
      <div class="previewContainer">
        <h2>Previewing {{ previewTitle }}</h2>
        <hr />
        <div class="image-wrapper">
          <img :src="previewSrc" class="previewSrc" alt="" />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'AppUploadedDocumentComponent',
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
    previewImages(imageSorce, action) {
      this.previewSrc = imageSorce
      this.previewTitle = action
      this.previewIsVisible = true
    },
    printMethod(imgId) {
      // const utilityPrint = document.getElementById('utility')
      this.$htmlToPaper(imgId)
    },
    closePreviewDrawer() {
      this.previewIsVisible = false
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
  .card-content {
    padding: 10px;
    overflow: hidden;
    text-align: center;
    border-bottom: 0.5px solid #ddddddcb;
    img {
      max-height: 250px;
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
    }
  }
}
</style>
