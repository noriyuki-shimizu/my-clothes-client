<template>
    <a-layout id="components-layout-fixed-sider">
        <a-layout-sider class="sidebar">
            <router-link to="/home">
                <img
                    class="logo"
                    :src="require('@/assets/image/icon-white.png')"
                />
            </router-link>
            <side-menu />
        </a-layout-sider>
        <a-layout :style="{ marginLeft: '200px' }">
            <a-layout-header id="main_layout_header">
                <app-header />
            </a-layout-header>
            <a-layout-content id="main_layout_content">
                <app-content id="content" />
            </a-layout-content>
            <a-layout-footer id="main_layout_footer">
                <app-footer />
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import AppHeader from '@/components/layout/Header.vue';
import AppContent from '@/components/layout/Content.vue';
import AppFooter from '@/components/layout/Footer.vue';
import SideMenu from '@/components/menu/SideMenu.vue';

@Component({
    components: {
        AppHeader,
        AppFooter,
        AppContent,
        SideMenu
    }
})
export default class Layout extends Vue {}
</script>

<style scoped>
.sidebar {
    overflow: auto;
    height: 100vh;
    position: fixed;
    left: 0;
}

#components-layout-fixed-sider .logo[data-v-692a017f] {
    height: 68px;
    margin: 16px 16px 40px;
}
.logo {
    width: 168px;
}

#components-layout-fixed-sider .logo {
    height: 112px;
    background-size: contain;
    background-repeat: space;
    margin: 16px;
}

#main_layout_header {
    background: #fff;
    padding: 0 5% 0;
}

#main_layout_content {
    margin: 24px 16px 0;
    overflow: initial;
}

#content {
    padding: 24px;
    background: #fff;
    min-height: 85vh;
}

#main_layout_footer {
    padding: 15px 50px;
}
</style>
