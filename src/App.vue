<script setup>
import { reactive, computed, ref, onMounted, watch } from "vue";
import { toast } from "vue3-toastify";
import { marked } from "marked";
import SidebarComponent from "./components/SidebarComponent.vue";
import axios from "axios";
import { useTemplateStore } from "./stores/templateStore";
import { useMainStore } from "./stores/mainStore";

const templateStore = useTemplateStore();
const mainStore = useMainStore();

const inputs = reactive({});

marked.setOptions({
    breaks: true,
});

const replaceAll = (text, values) => {
    return text.replace(/!{([^}]+)}/g, (_, key) => values[key] || `!{${key}}`);
};

const generatedText = computed(() => {
    return replaceAll(
        templateStore.selectedTemplate.content.split("\\n").join("<br>"),
        mainStore.inputs,
    );
});

const copyGeneratedText = () => {
    navigator.clipboard.writeText(generatedText.value);
    toast.success("Copied to clipboard!", {
        duration: 2000,
        position: "top-center",
    });
};

// watch(selectedTemplateContent, () => {
//     detectKeysAndGenerateReactive();
// });

onMounted(() => {
    console.log(templateStore.rawTemplates[0].content);
});

const loading = ref(false);
const textAI = ref("");
const promptREF = ref("");

const postToAPI = async () => {
    loading.value = true;
    console.log(promptREF.value);

    try {
        const response = await axios.post(
            "http://localhost:3000/api/v1/deepseek/chat",
            {
                message: promptREF.value,
            },
        );

        console.log(response.data);
        textAI.value = response.data.data;
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="flex min-h-screen">
        <dialog id="my_modal_2" class="modal">
            <div class="modal-box flex flex-col">
                <h3 class="text-lg font-bold">DEEPSEEK ILE OLUSTUR</h3>
                <input
                    type="text"
                    class="input"
                    placeholder="WRITE PROPMPT"
                    v-model="promptREF"
                />
                <button class="btn" @click="postToAPI()">SUBMIT</button>
                <span
                    v-if="loading"
                    class="loading loading-spinner loading-xl"
                ></span>
                <p>{{ textAI }}</p>
                <button
                    class="btn"
                    @click="createNewTemplate('DEEPSEEK GENERATED', textAI)"
                >
                    SAVE
                </button>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
        <SidebarComponent />
        <div class="flex-1 p-6 w-full">
            <textarea
                class="textarea textarea-bordered w-full mb-4"
                rows="8"
                v-model="templateStore.selectedTemplate.content"
                @blur="templateStore.saveTemplateToLocalStorage"
            />
            <div
                class="generated-text bg-base-200 p-4 rounded shadow"
                v-html="marked.parse(generatedText)"
            ></div>

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
