<script setup>
import { ref, reactive, watch, onMounted, onUpdated } from "vue";
import { motion } from "motion-v";
import { useTemplateStore } from "../stores/templateStore";
import { useMainStore } from "../stores/mainStore";

const templateStore = useTemplateStore();
const mainStore = useMainStore();

const sidebarOpen = ref(false);

const newTemplateName = ref("");

const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
};

const replaceAll = (text, values) => {
    return text.replace(/!{([^}]+)}/g, (_, key) => values[key] || `!{${key}}`);
};

const detectAllKeys = (text) => {
    const regex = /!{([^}]+)}/g;
    const matches = text.match(regex);
    return matches ? matches.map((match) => match.slice(2, -1)) : [];
};

const detectKeysAndGenerateReactive = () => {
    let keys;
    let inputs = {};
    keys = detectAllKeys(templateStore.selectedTemplate.content);
    keys.forEach((key) => {
        inputs[key] = "";
    });

    mainStore.setKeys(keys);
    mainStore.setInputs(inputs);
};

watch(
    () => templateStore.selectedTemplateIndex,
    () => {
        detectKeysAndGenerateReactive();
    },
    { immediate: true },
);

onMounted(() => {
    templateStore.initialize();
    detectKeysAndGenerateReactive();
});

onUpdated(() => {
    console.log("udapte");
});
</script>

<template>
    <div
        class="lg:hidden fixed inset-0 bg-black opacity-70 z-40 transition-opacity"
        v-if="sidebarOpen"
        @click="toggleSidebar"
    ></div>
    <button class="lg:hidden mb-4 btn btn-outline" @click="toggleSidebar">
        ☰ Menü
    </button>
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
                v-for="(template, index) in templateStore.rawTemplates"
                :key="index"
                style=""
            >
                <motion.div
                    class="flex justify-between opacity-30"
                    :class="{
                        'bg-red-500':
                            templateStore.selectedTemplateIndex == index,
                    }"
                    :initial="{ opacity: 0 }"
                    :animate="{ opacity: 1 }"
                >
                    <p
                        style="
                            width: 150px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            font-size: 16px;
                        "
                        @click="templateStore.selectTemplate(index)"
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
                        @click="templateStore.deleteTemplate(index)"
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
            <p
                class="text-center opacity-50"
                v-show="mainStore.keys.length == 0"
            >
                No have inputs
            </p>
            <div v-for="key in mainStore.keys" :key="key">
                <input
                    type="text"
                    class="input"
                    v-model="mainStore.inputs[key]"
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
                @click="templateStore.createTemplate(newTemplateName)"
            >
                Create New Template
            </button>
            <button
                class="btn btn-primary w-full"
                onclick="my_modal_2.showModal()"
            >
                Create Template With AI
            </button>
        </div>
    </div>
</template>
<style scoped></style>
