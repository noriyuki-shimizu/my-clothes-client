<template>
    <div id="content">
        <router-view />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Content extends Vue {}
</script>

<style scoped>
#content {
    padding: 24px;
    background: #fff;
    min-height: 85vh;
}
</style>
