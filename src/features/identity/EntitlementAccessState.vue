<script setup lang="ts">
import { Button, Card, ContentTemplate } from '@hugo-ui/shadcn-vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  detail?: string | null;
  kind:
    | 'error'
    | 'loading'
    | 'noAccounts'
    | 'noEntitlementScope'
    | 'organizationUnavailable'
    | 'renewing';
}>();

const emit = defineEmits<{
  (event: 'retry'): void;
}>();

const { t } = useI18n();

const copyKey = computed(() => `accessState.${props.kind}`);
const showRetry = computed(() => props.kind === 'error' || props.kind === 'noAccounts');
</script>

<template>
  <ContentTemplate type="error" :page-title="t(`${copyKey}.pageTitle`)">
    <Card aria-live="polite">
      <div class="grid max-w-2xl gap-3 p-6">
        <h2 class="m-0 text-xl font-bold leading-tight tracking-normal text-hugo-text-default">
          {{ t(`${copyKey}.title`) }}
        </h2>
        <p class="m-0 text-sm leading-6 text-hugo-text-subtle">
          {{ t(`${copyKey}.message`) }}
        </p>
        <p v-if="detail" class="m-0 text-sm leading-6 text-hugo-text-subtle">
          {{ detail }}
        </p>
        <div v-if="showRetry" class="pt-2">
          <Button type="button" variant="outline" tone="neutral" @click="emit('retry')">
            {{ t('accessState.actions.retry') }}
          </Button>
        </div>
      </div>
    </Card>
  </ContentTemplate>
</template>
