<template>
    <div>
        <a-popover trigger="click" placement="bottomLeft">
            <template slot="content">
                <div class="account-menu">
                    <a @click="showDrawer">Your account setting</a>
                </div>
                <div class="account-menu">
                    <a @click="signOut">Sign out</a>
                </div>
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
                    v-if="currentUser && currentUser.photoURL"
                    shape="square"
                    size="large"
                    :src="currentUser ? currentUser.photoURL : ''"
                />
                <a-avatar v-else shape="square" size="large" icon="user" />
            </a-badge>
        </a-popover>
        <account-setting :visible="visible" v-on:on-close="onClose" />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import * as Vuex from 'vuex';

import AccountSetting from '@/components/user/AccountSetting.vue';

@Component({
    components: {
        AccountSetting
    }
})
export default class AccountPopover extends Vue {
    $store!: Vuex.ExStore;

    visible = false;

    get currentUser() {
        return this.$store.getters['user/currentUser'];
    }

    showDrawer() {
        this.visible = true;
    }

    signOut() {
        this.$store.commit('brand/allStateReset');
        this.$store.commit('clothes/allStateReset');
        this.$store.commit('coordinate/allStateReset');
        this.$store.commit('genre/allStateReset');
        this.$store.commit('shop/allStateReset');
        this.$store.dispatch('user/signOut');
        this.$router.push({ name: 'signIn' });
    }

    @Emit('on-close')
    onClose() {
        this.visible = false;
    }
}
</script>

<style scoped>
.account-menu {
    padding-bottom: 8px;
}
</style>
