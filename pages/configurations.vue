<template>
  <div class="animated fadeIn">
    <div class="page_header">
      <h1>Configuration Settings</h1>
    </div>
    <div>
      <AppContextSelect
        v-model="config"
        label="Configuration"
        :remote="false"
        :data="configData"
      />
      <br />
      <br />
      <div>
        <AppSystemConfigMain v-if="config === 'SYSTEM CONFIG'" />
        <AppGlobalEntityMain v-if="config === 'GLOBAL ENTITY'" />
        <AppGlobalDataMain v-if="config === 'GLOBAL DATA'" />
        <AppCountryMain v-if="config === 'COUNTRY'" />
        <AppStateMain v-if="config === 'STATE'" />
        <AppBranchMain v-if="config === 'BRANCH'" />
        <AppDaonMain v-if="config === 'DAON USER'" />
      </div>
    </div>
  </div>
</template>
<script>
import AppContextSelect from '@/components/UI/AppContextSelect'
import AppSystemConfigMain from '@/components/configurations/system-config/AppSystemConfigMain'
import AppGlobalEntityMain from '@/components/configurations/global-entity/AppGlobalEntityMain'
import AppGlobalDataMain from '@/components/configurations/global-data/AppGlobalDataMain'
import AppCountryMain from '@/components/configurations/country/AppCountryMain'
import AppStateMain from '@/components/configurations/state/AppStateMain'
import AppBranchMain from '@/components/configurations/branch/AppBranchMain'
import AppDaonMain from '@/components/configurations/daon/AppDaonMain'
export default {
  components: {
    AppContextSelect,
    AppSystemConfigMain,
    AppGlobalEntityMain,
    AppGlobalDataMain,
    AppCountryMain,
    AppStateMain,
    AppBranchMain,
    AppDaonMain,
  },
  data() {
    return {
      config: 'SYSTEM CONFIG',
      configData: [
        'SYSTEM CONFIG',
        'GLOBAL DATA',
        'GLOBAL ENTITY',
        'COUNTRY',
        'STATE',
        'BRANCH',
        'DAON USER',
      ],
    }
  },
}
</script>
<style lang="scss" scoped>
.page_header {
  margin-bottom: 25px;
  h1 {
    font-family: GothamLight;
    font-style: normal;
    font-weight: 500;
    font-size: 25px;
    line-height: 150%;
    color: #2e434e;
  }
}
</style>
