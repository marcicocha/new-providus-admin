<template>
  <div>
    <div class="tabs">
      <ul>
        <li :class="{ 'is-active': key == '1' }" @click="key = '1'">
          <a>Personal Info</a>
        </li>
        <li :class="{ 'is-active': key == '2' }" @click="key = '2'">
          <a>Contact Details</a>
        </li>
        <li :class="{ 'is-active': key == '3' }" @click="key = '3'">
          <a>Account Info</a>
        </li>
        <li :class="{ 'is-active': key == '4' }" @click="key = '4'">
          <a>Next of Kin Details</a>
        </li>
      </ul>
    </div>

    <!-- Tab panes -->
    <div class="content">
      <div v-show="key == '1'">
        <div class="columns is-multiline">
          <div class="column is-full">
            <AppAdminInput
              v-model="userDetailsObject.title"
              label="Title"
              placeholder="MR."
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="userDetailsObject.surname"
              label="Surname"
              placeholder=""
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="userDetailsObject.firstName"
              label="First Name"
              placeholder=""
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="userDetailsObject.middleName"
              label="Middle Name"
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="userDetailsObject.gender"
              label="Gender"
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="userDetailsObject.maritalStatus"
              label="Marrital Status"
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="userDetailsObject.dateOfBirth"
              label="Date Of Birth"
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="userDetailsObject.religion"
              label="Religion"
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="userDetailsObject.nationality"
              label="Nationality"
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="userDetailsObject.maidenName"
              label="Mother's Maiden Name"
              disabled
            />
          </div>
          <div class="column is-half">
            <AppAdminInput
              v-model="userDetailsObject.stateOfOrigin"
              label="State"
              disabled
            />
          </div>
          <div class="column is-half">
            <AppAdminInput
              v-model="userDetailsObject.nationality"
              label="Nationality"
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="userDetailsObject.taxPayerId"
              label="Tax Payer ID"
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="userDetailsObject.dualCitizenship"
              label="Dual Citizenship"
              disabled
            />
          </div>
          <!-- <div class="column is-one-third">
            <AppAdminInput v-model="userDetailsObject.dualCitizenship" label="Country" />
          </div> -->
        </div>
      </div>
      <div v-show="key == '2'">
        <div class="columns is-multiline">
          <div class="column is-full">
            <AppAdminInput
              v-model="customerContact.email"
              label="Email Address"
              placeholder=""
              disabled
            />
          </div>
          <div class="column is-half">
            <AppAdminInput
              v-model="customerContact.phoneNumber"
              label="Phone Number"
              placeholder=""
              disabled
            />
          </div>
          <div class="column is-half">
            <AppAdminInput
              v-model="customerContact.altPhoneNumber"
              label="Alternative Phone Number"
              placeholder=""
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="customerContact.landmark"
              label="Closest Landmark"
              placeholder=""
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="customerContact.residentialAddress"
              label="Residential Address"
              placeholder=""
              disabled
            />
          </div>
          <!-- <div class="column is-one-third">
            <AppAdminInput
              v-model="customerContact.residentCity"
              label="City/town"
              placeholder=""
              disabled
            />
          </div> -->
          <div class="column is-one-third">
            <AppAdminInput
              v-model="customerContact.residentState"
              label="State"
              placeholder=""
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="customerContact.residentLga"
              label="Local govt Area"
              placeholder=""
              disabled
            />
          </div>
        </div>
      </div>
      <div v-show="key == '3'">
        <div class="columns is-multiline">
          <div class="column is-full">
            <AppAdminInput
              v-model="userDetailsObject.bvn"
              label="BVN"
              placeholder=""
              disabled
            />
          </div>
          <!-- <div class="column is-half">
            <AppAdminInput
              v-model="userDetailsObject.accountCategory"
              label="Account Category"
              placeholder=""
              disabled
            />
          </div> -->
          <div class="column is-half">
            <AppAdminInput
              v-model="userDetailsObject.accountType"
              label="Account Type"
              placeholder=""
              disabled
            />
          </div>
          <div class="column is-half">
            <AppAdminInput
              v-model="userDetailsObject.currency"
              label="Account Currency"
              placeholder=""
              disabled
            />
          </div>
        </div>
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
        <!-- <div id="bvn" style="display: none">
          <img id="bvnWrapper" :src="printSource" alt="" />
        </div> -->
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
      </div>
      <div v-show="key == '4'">
        <div class="columns is-multiline">
          <div class="column is-full">
            <AppAdminInput
              v-model="customerKin.title"
              label="Title"
              placeholder="MR."
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="customerKin.surname"
              label="Surname"
              placeholder=""
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="customerKin.firstName"
              label="First Name"
              placeholder=""
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="customerKin.middleName"
              label="Middle Name"
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="customerKin.gender"
              label="Gender"
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="customerKin.maritalStatus"
              label="Marrital Status"
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="customerKin.dateOfBirth"
              label="Date Of Birth"
              disabled
            />
          </div>
          <div class="column is-half">
            <AppAdminInput
              v-model="customerKin.relationship"
              label="Relationship"
              disabled
            />
          </div>
          <div class="column is-half">
            <AppAdminInput
              v-model="customerKin.email"
              label="Email Address"
              disabled
            />
          </div>
          <div class="column is-half">
            <AppAdminInput
              v-model="customerKin.phoneNumber"
              label="Phone Number"
              disabled
            />
          </div>
          <div class="column is-half">
            <AppAdminInput
              v-model="customerKin.altPhoneNumber"
              label="Alternative Phone"
              disabled
            />
          </div>
          <div class="column is-full">
            <AppAdminInput
              v-model="customerKin.residentCountry"
              label="Country of Residence"
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="customerKin.houseNo"
              label="House Number"
              placeholder=""
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="customerKin.streetName"
              label="Street Name"
              placeholder=""
              disabled
            />
          </div>
          <div class="column is-one-third">
            <AppAdminInput
              v-model="customerKin.landMark"
              label="Closest Landmark"
              placeholder=""
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppAdminInput from '@/components/UI/AppAdminInput.vue'
export default {
  name: 'AppAccountDetailsComponent',
  components: {
    AppAdminInput,
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
      customerContact: {
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
          const { customerKin, customerContact } = newVal
          this.customerKin = customerKin || {}
          this.customerContact = customerContact || {}
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

          this.$htmlToPaper('bvn')
          console.log('IT IS AT THE PRINTER')
          this.isBvnDetails = false
          this.loading = false
        }, 1000)
      } catch (err) {
        this.loading = false
        let errorMessage = ''

        // Error Message from Backend
        // eslint-disable-next-line no-prototype-builtins
        if (err.hasOwnProperty('response')) {
          const res = err.response.data

          errorMessage = res.errorMessage

          this.$toast.open({
            message: `<p class="toast-title">Error Message</p>
                    <p class="toast-msg"> ${errorMessage} </p>`,
            type: 'error',
            duration: 4000,
            dismissible: true,
          })
        }
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
