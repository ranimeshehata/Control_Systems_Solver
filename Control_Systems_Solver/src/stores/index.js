// store/index.js
import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      adjacencyMatrix: [], 
    };
  },
  mutations: {
    setAdjacencyMatrix(state, matrix) {
      state.adjacencyMatrix = matrix;
    },
  },
  actions: {
    updateAdjacencyMatrix({ commit }, matrix) {
      commit('setAdjacencyMatrix', matrix);
    },
  },
  getters: {
    getAdjacencyMatrix(state) {
      return state.adjacencyMatrix;
    },
  },
});

export default store;
