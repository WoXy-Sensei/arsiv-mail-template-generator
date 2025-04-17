<script setup>
import { reactive, computed, ref, onMounted, watch } from "vue";
import { toast } from "vue3-toastify";
import { motion, AnimatePresence } from "motion-v";

const rawTemplates = ref(
    localStorage.getItem("templates")
        ? JSON.parse(localStorage.getItem("templates"))
        : [
              {
                  name: "test",
                  content: "merhaba benim adim !{AD}",
              },
          ],
);

const selectedTemplateIndex = ref(0);
const selectedTemplateContent = ref("");
const inputs = reactive({});
const keys = ref([]);
const newTemplateName = ref("");

const detectAllKeys = (text) => {
    const regex = /!{([^}]+)}/g;
    const matches = text.match(regex);
    return matches ? matches.map((match) => match.slice(2, -1)) : [];
};

const replaceAll = (text, values) => {
    return text.replace(/!{([^}]+)}/g, (_, key) => values[key] || `!{${key}}`);
};

const detectKeysAndGenerateReactive = () => {
    keys.value = detectAllKeys(selectedTemplateContent.value);
    keys.value.forEach((key) => {
        inputs[key] = "";
    });
};

const selectTemplate = (templateIndex) => {
    selectedTemplateIndex.value = templateIndex;
    selectedTemplateContent.value = rawTemplates.value[templateIndex].content;
    detectKeysAndGenerateReactive();
};

const createNewTemplate = () => {
    if (!newTemplateName.value.trim()) return;
    rawTemplates.value.push({
        name: newTemplateName.value.trim(),
        content: "!{KEY}",
    });
    newTemplateName.value = "";
    saveTemplateToLocalStorage();
};

const removeTemplate = (templateIndex) => {
    rawTemplates.value.splice(templateIndex, 1);
    selectedTemplateIndex.value = Math.min(
        templateIndex,
        rawTemplates.value.length - 1,
    );
    selectedTemplateContent.value =
        rawTemplates.value[selectedTemplateIndex.value].content;
    saveTemplateToLocalStorage();
};

const saveTemplateToLocalStorage = () => {
    rawTemplates.value[selectedTemplateIndex.value].content =
        selectedTemplateContent.value;
    localStorage.setItem("templates", JSON.stringify(rawTemplates.value));
};

const generatedText = computed(() => {
    return replaceAll(selectedTemplateContent.value, inputs);
});

const copyGeneratedText = () => {
    navigator.clipboard.writeText(generatedText.value);
    toast.success("Copied to clipboard!", {
        duration: 2000,
        position: "top-center",
    });
};

watch(selectedTemplateContent, () => {
    detectKeysAndGenerateReactive();
});

onMounted(() => {
    selectTemplate(0);
});
const sidebarOpen = ref(false);
const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
};
</script>

<template>
    <div class="flex min-h-screen">
        <div
            class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            v-if="sidebarOpen"
            @click="toggleSidebar"
        ></div>
        <div
            :class="[
                'fixed lg:static z-50 bg-base-200 w-64 transition-transform duration-300 ease-in-out p-2',
                sidebarOpen ? 'translate-x-0 h-full' : '-translate-x-full',
                'lg:translate-x-0',
            ]"
        >
            <div class="divider divider-neutral">Templates</div>
            <ul class="menu menu-lg rounded-box w-full overflow">
                <li
                    v-for="(template, index) in rawTemplates"
                    :key="index"
                    @click="selectTemplate(index)"
                    style=""
                >
                    <motion.div
                        class="flex justify-between opacity-30"
                        :initial="{ opacity: 0 }"
                        :animate="{ opacity: 1 }"
                    >
                        <p
                            style="
                                width: 150px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            "
                        >
                            {{ template.name }}
                        </p>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6"
                            @click="removeTemplate(index)"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                        </svg>
                    </motion.div>
                </li>
            </ul>
            <div class="divider divider-neutral">Inputs</div>
            <div class="flex w-full justify-center items-center flex-col gap-2">
                <p class="text-center opacity-50" v-show="keys.length == 0">
                    No have inputs
                </p>
                <div v-for="key in keys" :key="key">
                    <input
                        type="text"
                        class="input"
                        v-model="inputs[key]"
                        :placeholder="'Type !{' + key + '}'"
                    />
                </div>
            </div>
            <div class="divider divider-neutral">Create</div>
            <div class="flex w-full justify-center items-center flex-col gap-2">
                <input
                    type="text"
                    placeholder="Tempalte Name"
                    class="input"
                    v-model="newTemplateName"
                />
                <button
                    class="btn btn-primary w-full"
                    @click="createNewTemplate"
                >
                    Create New Template
                </button>
            </div>
        </div>

        <div class="flex-1 p-6 w-full">
            <button
                class="lg:hidden mb-4 btn btn-outline"
                @click="toggleSidebar"
            >
                ☰ Menü
            </button>

            <textarea
                v-model="selectedTemplateContent"
                class="textarea textarea-bordered w-full mb-4"
                rows="6"
                @blur="saveTemplateToLocalStorage"
            />
            <div class="generated-text bg-base-200 p-4 rounded shadow">
                {{ generatedText }}
            </div>

            <button class="btn btn-neutral mt-5" @click="copyGeneratedText">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                    />
                </svg>
                Copy
            </button>
        </div>
    </div>
</template>

<style scoped>
textarea {
    resize: vertical;
}
</style>
