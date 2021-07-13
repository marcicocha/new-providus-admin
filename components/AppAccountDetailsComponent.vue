<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="Personal Info">
        <a-row type="flex" :gutter="16">
          <a-col :span="8">
            <AppInput
              v-model="userDetailsObject.title"
              label="Title"
              placeholder=""
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="userDetailsObject.lastName"
              label="Surname"
              placeholder=""
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="userDetailsObject.firstName"
              label="First Name"
              placeholder=""
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="userDetailsObject.middleName"
              label="Middle Name"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="userDetailsObject.gender"
              label="Gender"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="userDetailsObject.maritalStatus"
              label="Marrital Status"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="userDetailsObject.dateOfBirth"
              label="Date Of Birth"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="userDetailsObject.religion"
              label="Religion"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="userDetailsObject.occupation"
              label="Occuaption"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="userDetailsObject.maidenName"
              label="Mother's Maiden Name"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="userDetailsObject.stateOfOrigin"
              label="State"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="userDetailsObject.taxPayerId"
              label="Tax Payer ID"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="userDetailsObject.employeeIdNo"
              label="Employee ID No"
              disabled
            />
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Contact Details">
        <a-row type="flex" :gutter="16">
          <a-col :span="16">
            <AppInput
              v-model="userDetailsObject.email"
              label="Email Address"
              placeholder=""
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="userDetailsObject.phoneNumber"
              label="Phone Number"
              placeholder=""
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="userDetailsObject.altPhoneNumber"
              label="Alternative Phone Number"
              placeholder=""
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="userDetailsObject.stateOfOrigin"
              label="State"
              placeholder=""
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="userDetailsObject.lga"
              label="Local govt Area"
              placeholder=""
              disabled
            />
          </a-col>
          <a-col :span="24">
            <AppInput
              v-model="userDetailsObject.contactAddress"
              label="Residential Address"
              placeholder=""
              disabled
            />
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane key="3" tab="Account Info">
        <a-row type="flex" :gutter="16">
          <a-col :span="8">
            <AppInput
              v-model="userDetailsObject.bvn"
              label="BVN"
              placeholder=""
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="userDetailsObject.accountType"
              label="Account Type"
              placeholder=""
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="userDetailsObject.branch"
              label="BRANCH"
              placeholder=""
              disabled
            />
          </a-col>
        </a-row>
        <button class="print-btn" @click="printMethod">
          <i
            :class="{
              fa: true,
              'fa-print': !loading,
              'fa-spinner': loading,
              'fa-pulse': loading,
            }"
            style="padding: 10px"
          ></i>
          Print BVN Information
        </button>
        <div
          v-if="isBvnDetails"
          id="bvn"
          ref="bvn"
          class="bvn__details"
          style="display: none"
        >
          <div class="bvn__details-image" style="margin-bottom: 2rem">
            <img
              :src="getImgUrl(bvnDetails.base64Image)"
              alt="bvn owner image"
            />
          </div>
          <div class="bvn__details-text">
            <div>
              <small>BVN</small>
              <p style="font-weight: bold">{{ bvnDetails.bvn }}</p>
            </div>
            <div>
              <small>Name</small>
              <p style="font-weight: bold">
                {{
                  `${bvnDetails.firstName} ${bvnDetails.lastName} ${bvnDetails.middleName}`
                }}
              </p>
            </div>
            <div>
              <small>Date of Birth</small>
              <p style="font-weight: bold">{{ bvnDetails.dateOfBirth }}</p>
            </div>
            <div>
              <small>Gender</small>
              <p style="font-weight: bold">{{ bvnDetails.gender }}</p>
            </div>
            <div>
              <small>Marital Status</small>
              <p style="font-weight: bold">{{ bvnDetails.maritalStatus }}</p>
            </div>
            <div>
              <small>Nationality</small>
              <p style="font-weight: bold">{{ bvnDetails.nationality }}</p>
            </div>
            <div>
              <small>State Of Origin</small>
              <p style="font-weight: bold">{{ bvnDetails.stateOfOrigin }}</p>
            </div>
            <div>
              <small>Lga Of Origin</small>
              <p style="font-weight: bold">{{ bvnDetails.lgaOfOrigin }}</p>
            </div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="4" tab="Next of Kin Details">
        <a-row type="flex" :gutter="16">
          <a-col :span="8">
            <AppInput
              v-model="customerKin.title"
              label="Title"
              placeholder="MR."
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="customerKin.surname"
              label="Surname"
              placeholder=""
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="customerKin.firstName"
              label="First Name"
              placeholder=""
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="customerKin.middleName"
              label="Middle Name"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="customerKin.relationship"
              label="Relationship"
              disabled
            />
          </a-col>
          <a-col :span="8">
            <AppInput
              v-model="customerKin.phoneNumber"
              label="Phone Number"
              disabled
            />
          </a-col>
          <a-col :span="24">
            <AppInput
              v-model="customerKin.contact"
              label="Contact Address"
              placeholder=""
              disabled
            />
          </a-col>
        </a-row>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import AppInput from '@/components/UI/AppInput.vue'
export default {
  name: 'AppAccountDetailsComponent',
  components: {
    AppInput,
  },
  props: {
    userObject: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      key: '1',
      printSource: '',
      userDetailsObject: {},
      customerKin: {
        email: '',
      },
      loading: false,
      bvnDetails: {},
      isBvnDetails: false,
    }
  },
  watch: {
    userObject: {
      handler(newVal, oldVal) {
        if (newVal && newVal !== {}) {
          const { customerKin } = newVal
          this.customerKin = customerKin || {}
          this.userDetailsObject = newVal
        }
      },
      immediate: true,
    },
  },
  methods: {
    getImgUrl(pic) {
      return `data:image/png;base64,${pic}`
    },
    async printMethod() {
      const user = JSON.parse(localStorage.getItem('user'))
      const params = { bvn: this.userDetailsObject.bvn }
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
        params,
      }
      this.loading = true
      try {
        const { response } = await this.$axios.$get(
          '/individualAdmin/retrieveBvnDetails',
          config
        )
        this.bvnDetails = response
        this.isBvnDetails = true
        // const el = this.$refs.bvn
        // const options = {
        //   type: 'dataURL',
        // }
        console.log('CANVAS BEFORE PRINT')

        // const data = document.querySelector('bvn').toDataURL()
        setTimeout(() => {
          console.log('ALMOST AT THE PRINTER')
          // this.printSource = this.$html2canvas(el, options)

          this.$htmlToPaper('bvn', response)
          console.log('IT IS AT THE PRINTER')
          this.isBvnDetails = false
          this.loading = false
        }, 1000)
      } catch (err) {
        this.loading = false
        const { default: errorHandler } = await import('@/utils/errorHandler')
        errorHandler(err).forEach((msg) => {
          this.$notification.error({
            message: 'Error',
            description: msg,
            duration: 0,
          })
        })
      }
    },
  },
}
</script>
<style lang="scss" scoped>
// .tab li a {
//   border: none;
// }
.tabs li {
  border: none;
  //   border-width: 5px;
  //   border-bottom: 5px solid #000;
  position: relative;
  top: 5px;
  z-index: 1000;
  padding: 10px 20px;
  a {
    border-bottom-style: none;
    font-family: 'GothamMedium', sans-serif;
    font-style: normal;
    font-weight: bold;
    transition: all 0.1s;
    opacity: 0.5;
    &:hover {
      border: none;
    }
  }
}
.is-active {
  border-width: 5px;
  border-bottom: 5px solid #fdb813 !important;
}
.tabs li.is-active a {
  color: #282828;
  font-family: 'GothamMedium', sans-serif;
  font-style: normal;
  font-weight: bold;
  animation: forwards;
  transition: all 0.1s;
  opacity: 1;
}
.tabs ul {
  border-width: 5px;
  align-items: baseline;
}
.print-btn {
  background: transparent;
  border: none;
  font-family: 'GothamLight', sans-serif;
  font-style: normal;
  font-weight: 600;
  cursor: pointer;
  outline: none;
}
.column {
  margin-top: 15px;
}
.bvn__details {
  display: flex;
  &-image {
    width: 40%;
    margin-right: 2rem;
  }
  &-text {
    div {
      margin-bottom: 1rem;
      p {
        font-weight: bold;
        color: black;
      }
      small {
        font-size: 14px;
      }
    }
  }
}
</style>
