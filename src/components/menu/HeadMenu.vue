<template>
    <a-menu theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
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
                <router-link to="/mobile/total-price">
                    Price chart
                </router-link>
            </a-menu-item>
        </a-sub-menu>
    </a-menu>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class HeadMenu extends Vue {}
</script>

<style scoped>
.mobile-sub-menu {
    width: 20vw;
}
</style>
