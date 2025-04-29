<script setup>
import { ref } from "vue";
import axios from "axios";
import { useTemplateStore } from "../stores/templateStore";

const templateStore = useTemplateStore();

const loading = ref(false);
const textAI = ref("");
const promptREF = ref("");
const cancelTokenSource = ref(null);
const eventSource = ref(null);

const postToAPI = async () => {
    loading.value = true;
    textAI.value = "";

    if (eventSource.value) {
        eventSource.value.close();
    }

    eventSource.value = new EventSource(
        `http://localhost:3000/api/v1/deepseek/chatWithStream?message=${encodeURIComponent(promptREF.value)}`,
    );

    eventSource.value.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.content && !textAI.value.endsWith(data.content)) {
                textAI.value += data.content;
            }
        } catch (e) {
            console.error("Parse error:", e);
        }
    };

    eventSource.value.onerror = () => {
        loading.value = false;
        if (eventSource.value) {
            eventSource.value.close();
        }
    };
};
</script>

<template>
    <dialog id="my_modal_2" class="modal">
        <div class="modal-box flex flex-col gap-5 max-w-1/2">
            <h3 class="text-lg font-bold text-center">
                Create Template With Deepseek
            </h3>
            <textarea
                type="text"
                class="textarea w-full p-2"
                placeholder="WRITE PROPMPT"
                rows="4"
                v-model="promptREF"
                :disabled="textAI.length > 0"
            />
            <button class="btn" @click="postToAPI()">SUBMIT</button>
            <p class="bg-base-300 p-4" v-if="textAI">{{ textAI }}</p>
            <button
                class="btn"
                @click="
                    () => {
                        templateStore.createTemplate(
                            'DEEPSEEK GENERATED',
                            textAI,
                        );
                        textAI = '';
                        promptREF = '';
                    }
                "
            >
                SAVE
            </button>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>
