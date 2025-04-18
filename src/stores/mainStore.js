import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({
    inputs: [],
    keys: [],
  }),

  actions: {
    setInputs(inputs) {
      this.inputs = inputs;
    },
    setKeys(keys) {
      this.keys = keys;
    },
  },
});
