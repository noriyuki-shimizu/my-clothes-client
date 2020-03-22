<template>
    <a-layout id="components-layout-fixed-sider">
        <a-layout-sider class="sidebar">
            <router-link to="/home">
                <div class="logo" />
            </router-link>
            <side-menu />
        </a-layout-sider>
        <a-layout :style="{ marginLeft: '200px' }">
            <a-layout-header id="header">
                <account-popover />
            </a-layout-header>
            <a-layout-content id="main_layout_content">
                <div id="content">
                    <router-view />
                </div>
            </a-layout-content>
            <a-layout-footer id="main_layout_footer">
                My Clothes ©2019 Created by Noriyuki Shimizu.
                <router-link to="/privacy-policy">
                    privacy policy
                </router-link>
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import AccountPopover from '@/components/user/AccountPopover.vue';
import SideMenu from '@/components/menu/SideMenu.vue';

@Component({
    components: {
        AccountPopover,
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

#components-layout-fixed-sider .logo {
    height: 112px;
    background-image: url('../assets/icon.jpg');
    background-size: contain;
    background-repeat: space;
    margin: 16px;
}

#header {
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
    text-align: center;
    padding: 15px 50px;
}
</style>
