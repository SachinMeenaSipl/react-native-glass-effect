<script setup lang="ts">
import { computed, ref } from 'vue';
import { useData, withBase } from 'vitepress';

// Shows one example scene: the live web build (iframe) and the native Android capture.
const props = defineProps<{ id: string; height?: number }>();
const { site } = useData();

const tab = ref<'android' | 'web'>('android');
const frameHeight = computed(() => props.height ?? 640);
const webUrl = computed(() => `${site.value.base}demo/?embed=1#/${props.id}`);
const androidSrc = computed(() => withBase(`/previews/android/${props.id}.jpg`));
const androidMissing = ref(false);
</script>

<template>
  <div class="lg-preview">
    <div class="lg-tabs" role="tablist">
      <button
        role="tab"
        :aria-selected="tab === 'android'"
        :class="{ active: tab === 'android' }"
        @click="tab = 'android'"
      >
        Android (native)
      </button>
      <button role="tab" :aria-selected="tab === 'web'" :class="{ active: tab === 'web' }" @click="tab = 'web'">
        Web (live)
      </button>
      <a class="lg-open" :href="webUrl.replace('?embed=1', '')" target="_blank" rel="noopener">Open full screen ↗</a>
    </div>

    <div class="lg-stage" :style="{ height: `${frameHeight}px` }">
      <template v-if="tab === 'android'">
        <img
          v-if="!androidMissing"
          :src="androidSrc"
          :alt="`${id} example on Android`"
          loading="lazy"
          @error="androidMissing = true"
        />
        <p v-else class="lg-missing">No Android capture yet for this example. Try the Web tab.</p>
      </template>
      <iframe v-else :src="webUrl" :title="`${id} example, live`" loading="lazy" />
    </div>

    <p class="lg-caption">
      <template v-if="tab === 'android'">
        Captured on an Android emulator (shader renderer: blur, refraction and rim light).
      </template>
      <template v-else>
        Running live in your browser through react-native-web. The web uses CSS blur, so refraction and
        touch lighting don't show here. Scroll inside the frame to see the glass blur live.
      </template>
    </p>
  </div>
</template>

<style scoped>
.lg-preview {
  margin: 20px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}
.lg-tabs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.lg-tabs button {
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.lg-tabs button.active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
.lg-open {
  margin-left: auto;
  font-size: 13px;
}
.lg-stage {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0b0b14;
}
.lg-stage img {
  height: 100%;
  width: auto;
  max-width: 100%;
  object-fit: contain;
}
.lg-stage iframe {
  width: min(400px, 100%);
  height: 100%;
  border: 0;
}
.lg-missing {
  color: #c8c8d4;
  padding: 16px;
}
.lg-caption {
  margin: 0;
  padding: 8px 12px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  border-top: 1px solid var(--vp-c-divider);
}
</style>
