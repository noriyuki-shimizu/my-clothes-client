<template>
    <a-menu theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
        <a-sub-menu class="mobile-sub-menu">
            <span slot="title" class="submenu-title-wrapper">
                <a-icon type="menu" :style="{ fontSize: '20px' }" />
            </span>
            <a-menu-item>
                <router-link to="/mobile/home">
                    {{ $t('title.home') }}
                </router-link>
            </a-menu-item>
            <a-menu-item>
                <router-link to="/mobile/coordinate">
                    {{ $t('title.coordinate') }}
                </router-link>
            </a-menu-item>
            <a-menu-item>
                <router-link to="/mobile/maintenance/clothes">
                    {{ $t('title.clothes') }}
                </router-link>
            </a-menu-item>
            <a-menu-item>
                <router-link to="/mobile/maintenance/brand">
                    {{ $t('title.brand') }}
                </router-link>
            </a-menu-item>
            <a-menu-item>
                <router-link to="/mobile/maintenance/genre">
                    {{ $t('title.genre') }}
                </router-link>
            </a-menu-item>
            <a-menu-item>
                <router-link to="/mobile/maintenance/shop">
                    {{ $t('title.shop') }}
                </router-link>
            </a-menu-item>
            <a-menu-item>
                <router-link to="/mobile/total-price">
                    {{ $t('title.price-chart') }}
                </router-link>
            </a-menu-item>
            <a-menu-item>
                <span @click="signOut">
                    {{ $t('dictionary.authentication.signout') }}
                </span>
            </a-menu-item>
        </a-sub-menu>
    </a-menu>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as Vuex from 'vuex';

@Component
export default class HeadMenu extends Vue {
    $store!: Vuex.ExStore;

    signOut() {
        this.$store.commit('brand/allStateReset');
        this.$store.commit('clothes/allStateReset');
        this.$store.commit('coordinate/allStateReset');
        this.$store.commit('genre/allStateReset');
        this.$store.commit('shop/allStateReset');
        this.$store.dispatch('user/signOut');
        this.$router.push({ name: 'signIn' });
    }
}
</script>

<style scoped>
.mobile-sub-menu {
    width: 20vw;
}
</style>
