<template>
    <div id="app-layout">
      <main style="font-family: Roboto;">
        <div style="display: flex; gap: 25px; justify-content: center; align-items: center; text-transform: uppercase; font-family: Roboto; font-weight: bold; height: 50px; border-bottom: 2px solid #333;">
            <div><NuxtLink to="/">Chat</NuxtLink></div>
            <div><NuxtLink to="/vector">Vector Search</NuxtLink></div>
            <div><NuxtLink to="/import">Program import</NuxtLink></div>
        </div>
          <slot />
      </main>
    </div>
  </template>