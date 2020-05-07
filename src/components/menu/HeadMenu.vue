<template>
    <a-menu theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
        <a-sub-menu class="mobile-sub-menu">
            <span slot="title" class="submenu-title-wrapper">
                <a-icon type="menu" :style="{ fontSize: '20px' }" />
            </span>
            <a-menu-item>
                <router-link to="/mobile/home">
                    Home
                </router-link>
            </a-menu-item>
            <a-menu-item>
                <router-link to="/mobile/coordinate">
                    Coordinate
                </router-link>
            </a-menu-item>
            <a-menu-item-group title="Parts">
                <a-menu-item key="clothes">Clothes</a-menu-item>
                <a-menu-item key="brand">Brand</a-menu-item>
                <a-menu-item key="genre">Genre</a-menu-item>
                <a-menu-item key="shop">Shop</a-menu-item>
            </a-menu-item-group>
            <a-menu-item>
                <router-link to="/mobile/total-price">
                    Price chart
                </router-link>
            </a-menu-item>
            <a-menu-item>
                <span @click="signOut">
                    Sign out
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
