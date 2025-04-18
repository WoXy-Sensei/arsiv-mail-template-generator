import { defineStore } from "pinia";

export const useTemplateStore = defineStore("template", {
  state: () => ({
    rawTemplates: JSON.parse(localStorage.getItem("templates")) || [],
    selectedTemplateIndex: 0,
    selectedTemplate: {
      name: "",
      content: "",
    },
  }),
  getters: {
    getSelectedTemplateContent: (state) => state.selectedTemplate.content,
  },
  actions: {
    initialize() {
      this.selectTemplate(0);
    },
    createTemplate(name, content) {
      if (content === undefined) {
        content = "!{test}";
      }
      const template = { name, content };
      this.rawTemplates.push(template);
      localStorage.setItem("templates", JSON.stringify(this.rawTemplates));
    },
    deleteTemplate(index) {
      if (index === this.selectedTemplateIndex) {
        this.selectTemplate(
          this.selectedTemplateIndex >= 1 ? this.selectedTemplateIndex - 1 : 0,
        );
      } else if (index < this.selectedTemplateIndex) {
        this.selectedTemplateIndex--;
      }

      this.rawTemplates.splice(index, 1);
      localStorage.setItem("templates", JSON.stringify(this.rawTemplates));
    },

    selectTemplate(index) {
      this.selectedTemplateIndex = index;
      this.selectedTemplate = this.rawTemplates[index];
    },

    saveTemplateToLocalStorage() {
      localStorage.setItem("templates", JSON.stringify(this.rawTemplates));
    },
  },
});
