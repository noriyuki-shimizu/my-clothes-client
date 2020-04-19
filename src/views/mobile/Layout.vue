<template>
    <a-layout id="components-layout-demo-top" class="layout">
        <a-layout-header class="mobile-header">
            <head-menu />
        </a-layout-header>
        <a-layout-content id="main_layout_content">
            <app-content id="content" />
        </a-layout-content>
        <a-layout-footer id="main_layout_footer">
            <app-footer />
        </a-layout-footer>
    </a-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import AppContent from '@/components/layout/Content.vue';
import AppFooter from '@/components/layout/Footer.vue';
import HeadMenu from '@/components/menu/HeadMenu.vue';

@Component({
    components: {
        AppFooter,
        AppContent,
        HeadMenu
    }
})
export default class Layout extends Vue {}
</script>

<style scoped>
.mobile-header {
    padding: 0;
    text-align: right;
}

#main_layout_content {
    overflow: initial;
}

#content {
    padding: 24px;
    background: #fff;
}

#main_layout_footer {
    width: 100%;
    padding: 15px 50px;
    background: #f0f2f5;
    position: absolute;
    bottom: 0;
}
</style>
