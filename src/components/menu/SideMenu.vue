<template>
    <a-menu theme="dark" mode="inline">
        <a-menu-item key="1">
            <router-link to="/coordinate">
                <a-icon type="camera" />
                <span>Coordinate</span>
            </router-link>
        </a-menu-item>
        <a-menu-item key="2">
            <router-link to="/maintenance/clothes">
                <a-icon type="skin" />
                Clothes
            </router-link>
        </a-menu-item>
        <a-menu-item key="3">
            <router-link to="/maintenance/brand">
                <a-icon type="gold" />
                Brand
            </router-link>
        </a-menu-item>
        <a-menu-item key="4">
            <router-link to="/maintenance/genre">
                <a-icon type="line" />
                Genre
            </router-link>
        </a-menu-item>
        <a-menu-item key="5">
            <router-link to="/maintenance/shop">
                <a-icon type="shop" />
                Shop
            </router-link>
        </a-menu-item>
        <a-menu-item key="3">
            <router-link to="/total-price">
                <a-icon type="pie-chart" />
                <span>Price chart</span>
            </router-link>
        </a-menu-item>
    </a-menu>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as Vuex from 'vuex';

@Component
export default class SideMenu extends Vue {}
</script>

<style scoped></style>
