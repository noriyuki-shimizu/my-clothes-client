<template>
    <a-layout id="components-layout-fixed-sider">
        <a-layout-sider class="sidebar">
            <router-link to="/home">
                <div class="logo" />
            </router-link>
            <a-menu theme="dark" mode="inline">
                <a-menu-item key="1">
                    <a-icon type="smile" />
                    <span>My photo book</span>
                </a-menu-item>
                <a-sub-menu key="2">
                    <span slot="title">
                        <a-icon type="setting" /><span>Maintenance</span>
                    </span>
                    <a-menu-item key="2-1">Clothes</a-menu-item>
                    <a-menu-item key="2-2">Brand</a-menu-item>
                    <a-menu-item key="2-3">Genre</a-menu-item>
                    <a-menu-item key="2-4">Shop</a-menu-item>
                </a-sub-menu>
                <a-menu-item key="3">
                    <a-icon type="pie-chart" />
                    <span>Pie chart</span>
                </a-menu-item>
                <a-divider />
                <a-menu-item @click="signOut" key="4">
                    <a-icon type="logout" />
                    <span>Sign out</span>
                </a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout :style="{ marginLeft: '200px' }">
            <a-layout-header id="header">
                <a-popover placement="bottomLeft">
                    <template slot="content">
                        <a @click="showDrawer">Your account setting.</a>
                    </template>
                    <template slot="title">
                        <span>
                            Signed in as
                            <div>
                                <strong>{{
                                    currentUser ? currentUser.displayName : ''
                                }}</strong>
                            </div>
                        </span>
                    </template>
                    <a-badge :count="0">
                        <a-avatar
                            v-if="currentUser ? currentUser.photoURL : ''"
                            shape="square"
                            size="large"
                            :src="currentUser ? currentUser.photoURL : ''"
                        />
                        <a-avatar
                            v-else
                            shape="square"
                            size="large"
                            icon="user"
                        />
                    </a-badge>
                </a-popover>
                <account-setting :visible="visible" v-on:onClose="onClose" />
            </a-layout-header>
            <a-layout-content
                :style="{ margin: '24px 16px 0', overflow: 'initial' }"
            >
                <div
                    :style="{
                        padding: '24px',
                        background: '#fff'
                    }"
                >
                    <router-view />
                </div>
            </a-layout-content>
            <a-layout-footer style="textAlign: center">
                My Clothes ©2019 Created by Noriyuki Shimizu
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';
import VueRoute from 'vue-router';
import { WrappedFormUtils, Form } from 'ant-design-vue/types/form/form';

import AccountSetting from '@/components/AccountSetting.vue';

@Component({
    components: {
        AccountSetting
    }
})
export default class Common extends Vue {
    private visible = false;
    $store!: Vuex.ExStore;

    get currentUser() {
        return this.$store.getters['user/currentUser'];
    }

    signOut() {
        this.$store.dispatch('user/signOut');
        this.$router.push({ name: 'signIn' });
    }

    showDrawer() {
        this.visible = true;
    }

    @Emit('onClose')
    onClose() {
        this.visible = false;
    }
}
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
</style>
