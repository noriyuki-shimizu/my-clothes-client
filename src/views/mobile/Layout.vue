<template>
    <a-layout id="components-layout-demo-top" class="layout">
        <a-layout-header class="mobile-header">
            <div class="logo" />
            <a-menu
                theme="dark"
                mode="horizontal"
                :style="{ lineHeight: '64px' }"
            >
                <a-sub-menu class="mobile-sub-menu">
                    <span slot="title" class="submenu-title-wrapper">
                        <a-icon type="menu" :style="{ fontSize: '20px' }" />
                    </span>
                    <a-menu-item>
                        Coordinate
                    </a-menu-item>
                    <a-menu-item-group title="Parts">
                        <a-menu-item key="clothes">Clothes</a-menu-item>
                        <a-menu-item key="brand">Brand</a-menu-item>
                        <a-menu-item key="genre">Genre</a-menu-item>
                        <a-menu-item key="shop">Shop</a-menu-item>
                    </a-menu-item-group>
                    <a-menu-item>
                        Price chart
                    </a-menu-item>
                </a-sub-menu>
            </a-menu>
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

@Component({
    components: {
        AppFooter,
        AppContent
    }
})
export default class Layout extends Vue {}
</script>

<style scoped>
#components-layout-demo-top-side-2 .logo {
    width: 120px;
    height: 31px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px 28px 16px 0;
    float: left;
}

.mobile-header {
    padding: 0;
    text-align: right;
}

.mobile-sub-menu {
    width: 20vw;
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
