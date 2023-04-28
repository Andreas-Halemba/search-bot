<template>
    <div style="width: 400px; margin: 50px auto;">
        <div>
            <div style="display: flex; flex-flow: column;">
                <h2 style="text-align: center;">Summarize Programs</h2>
                <FormKit type="number" step="10" label="Offset" v-model="offset" />
                <FormKit type="button" input-class="full-width" label="Summarize Programs" @click="summarizePrograms" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const offset = ref(0);
const summarizePrograms = async () => {
    const programInfo = await useFetch('/api/summarizePrograms', {
        params: {
            offset: offset.value
        },
    });
};
</script>