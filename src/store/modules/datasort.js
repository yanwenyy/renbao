import httpRequest from '@/utils/httpRequest'
export default {
//   namespaced: true,
  state: {
    //table高度
    dataSortName:'', //name
    dataSortId:'',//id
    baseCodes:{}
  },
  mutations: {
     SET_DATA_SORTNAME (state, name) {
      state.dataSortName = name
    },
     SET_DATA_SORTID(state, data) {
      state.dataSortId = data
    },
    SET_BASE_CODE(state,data){
      state.baseCodes = data
    }
    
  },
  actions: {
    setDataSortName({commit},status){
      commit('SET_DATA_SORTNAME', status)
    },
    setDataSortId({commit},status){
      commit('SET_DATA_SORTID', status)
    },
    setBaseCode({commit},status){
      commit('SET_BASE_CODE', status)
    }
    // changeProjectList({commit},userId) {
    //   httpRequest({
    //     isLoading:false,
    //     url: httpRequest.adornUrl('/xmProject/projectList'),
    //     method: 'get',
    //     params: {userId:userId}
    //   }).then(({data}) => {
    //     if (data.code == 200) {
    //       commit('updateProjectList', data.result)
    //     }
    //   })

    // },
  },
}
