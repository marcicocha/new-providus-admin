import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const createStore = () => {
  return new Vuex.Store({
    state: () => ({
      pageFlag: '',
    }),
    getters,
    mutations,
    actions,
    modules: {},
  })
}
export default createStore
