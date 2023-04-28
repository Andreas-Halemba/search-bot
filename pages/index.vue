<template>
  <div style="padding: 50px 0; display: flex; justify-content: space-around;">
    <div class="chat">
      <h2 class="full-width" style="text-align: center;">Chat</h2>
      <div class="messages">
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
          <span v-if="message.type === 'sent'"
            style="text-align: right; padding-bottom: 3px; font-weight: bolder;">Visitor:</span>
          <span v-else style="text-align: left; padding-bottom: 3px; font-weight: bolder;">Bot:</span>
          {{ message.text }}
        </div>
      </div>
      <div>
        <FormKit v-model="interestField" type="select" :options="clusterOptions"
          placeholder="Wählen Sie ein Themenbereich" />
        <FormKit v-model="newMessage" type="text" placeholder="Stellen Sie Ihre Frage ..." />
        <FormKit type="submit" input-class="full-width" label="Send" @click="submitMessage" />
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">
type Message = {
  text: string | any;
  type: 'sent' | 'received';
};
type BotResponse = {
  result: {
    text: string;
  };
};

import { ref, reactive } from 'vue';
const messages = reactive<Message[]>([]);
const newMessage = ref('');
const interestField = ref('');
const { data } = await useFetch<string[]>(process.env.UPSKILLING_CMS_BASE_URL + '/api/ai/programs/clusters');
const clusterOptions: Array<{value: string, label:string}>|undefined = data.value?.map(cluster => ({ value: cluster, label: cluster }));

messages.push({ text: 'Für welchen Themenberich interessieren sie sich?', type: 'received' });
const submitMessage = async () => {
  if (newMessage.value.trim()) {
    const recommendationRequest = useFetch('/api/getRecommedaton', {
      method: 'POST',
      body: {
        history: messages.map((message) => message.text),
        question: newMessage.value.trim(),
        fieldOfInterest: interestField.value,
      },
    });
    messages.push({ text: newMessage.value.trim(), type: 'sent' });
    newMessage.value = '';
    const { data } = await recommendationRequest;
    messages.push({ text: data.value?.result.text, type: 'received' });

  }
};
</script>

<style scoped>
* {
  font-family: Roboto;
}

.chat {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  margin: 10px;
  width: 400px;
}

.messages {
  border: 1px solid #807d7d;
  padding: 10px;
  border-radius: 5px;
  min-height: 50px;
  max-height: 400px;
  overflow-y: scroll;
  overflow-x: hidden;
}

h2 {
  margin: 0;
}
</style>
<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;400;700&display=swap');

.full-width {
  min-width: 100%;
}

.message {
  display: flex;
  flex-flow: column;
}

.sent {
  background-color: rgba(185, 241, 185, 0.596);
  border-radius: 5px;
  padding: 5px;
  margin-bottom: 5px;
  text-align: right;
}

.received {
  background-color: lightcyan;
  border-radius: 5px;
  padding: 5px;
  margin-bottom: 5px;
  text-align: left;
}
</style>
