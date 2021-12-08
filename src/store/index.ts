import { createStore } from 'vuex';
// import { QiniuService } from "@/services/";
import { SET_QINIU_TOKEN, SET_QINIU_DOMAIN } from "./mutation_types";

export default createStore({
  state: {
    qiniuToken: undefined,
    qiniuDomain: undefined,
  },
  mutations: {
    [SET_QINIU_TOKEN](state, qiniuToken) {
      state.qiniuToken = qiniuToken;
    },
    [SET_QINIU_DOMAIN](state, qiniuDomain) {
      state.qiniuDomain = qiniuDomain;
    },
  },
  actions: {
    getQiniuToken(context) {
      // QiniuService.getToken()
      //   .then((response) => {
      //     context.commit(SET_QINIU_TOKEN, response.data);
      //   })
      //   .catch(() => {});
    },
    getQiniuDomain(context) {
      // QiniuService.getDomain()
      //   .then((response) => {
      //     context.commit(SET_QINIU_DOMAIN, response.data);
      //   })
      //   .catch(() => {});
    },
  },
  getters: {
    qiniuToken: (state) => state.qiniuToken,
    qiniuDomain: (state) => state.qiniuDomain,
  },
});
