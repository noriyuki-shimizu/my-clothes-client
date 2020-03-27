<template>
    <a-menu theme="dark" mode="inline">
        <a-menu-item key="1">
            <router-link to="/coordinate">
                <a-icon type="smile" />
                <span>Coordinate</span>
            </router-link>
        </a-menu-item>
        <a-sub-menu key="2">
            <span slot="title">
                <a-icon type="setting" />
                <span>Parts</span>
            </span>
            <a-menu-item key="2-1">
                <router-link to="/maintenance/clothes">
                    Clothes
                </router-link>
            </a-menu-item>
            <a-menu-item key="2-2">
                <router-link to="/maintenance/brand">
                    Brand
                </router-link>
            </a-menu-item>
            <a-menu-item key="2-3">
                <router-link to="/maintenance/genre">
                    Genre
                </router-link>
            </a-menu-item>
            <a-menu-item key="2-4">
                <router-link to="/maintenance/shop">
                    Shop
                </router-link>
            </a-menu-item>
        </a-sub-menu>
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
