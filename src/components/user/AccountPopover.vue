<template>
    <div>
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

    private visible = false;

    get currentUser() {
        return this.$store.getters['user/currentUser'];
    }

    showDrawer() {
        this.visible = true;
    }

    @Emit('on-close')
    onClose() {
        this.visible = false;
    }
}
</script>
