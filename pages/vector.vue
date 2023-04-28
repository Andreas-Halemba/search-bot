<template>
    <div>
        <div style="width: 400px; margin: 20px auto; text-align: center;">
            <h1>Vector Search</h1>
            <p>Search for similar documents</p>
            <FormKit type="text" label="Query" v-model="query" />
            <FormKit type="button" input-class="full-width" label="Search" @click="search" />
        </div>
        <div style="width: 80%; margin: 20px auto;">
            <p v-for="(document, index) in documents" :key="index">
                <h3>{{ document.metadata.title }}</h3>
                <p>{{ document.metadata.cluster }}</p>
                <p>{{  document.pageContent  }}</p>
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Document } from "langchain/document";
let documents = reactive<Document[]>([]);
const query = ref("");
const search = async () => {
    if (!query.value.trim()) return
    const { data } = await useFetch<Document[]>('/api/searchChroma', {
        method: 'GET',
        params: {
            query: query.value
        }
    })
    if(data !== null) {
        documents.splice(0)
        data.value?.map((document: Document) => documents.push(document))
    }
}

</script>