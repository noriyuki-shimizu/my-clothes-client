<template>
    <a-layout id="components-layout-demo-top" class="layout">
        <a-layout-header id="mobile_header">
            <img
                class="logo"
                :src="require('@/assets/image/mobile-icon.png')"
            />
            <head-menu />
        </a-layout-header>
        <a-layout-content id="main_layout_content">
            <app-content id="content" />
        </a-layout-content>
        <a-layout-footer id="main_layout_footer">
            <app-footer />
        </a-layout-footer>
    </a-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import AppContent from '@/components/layout/Content.vue';
import AppFooter from '@/components/layout/Footer.vue';
import HeadMenu from '@/components/menu/HeadMenu.vue';

@Component({
    components: {
        AppFooter,
        AppContent,
        HeadMenu
    }
})
export default class Layout extends Vue {
    mounted() {
        const header = document.getElementById('mobile_header') as HTMLElement;
        const headerHeight = header.clientHeight;
        let lastPos = 0;

        window.addEventListener('scroll', () => {
            const pos = window.scrollY;
            if (pos > headerHeight && pos > lastPos) {
                header.classList.add('mobile-header--unpinned');
            }
            if (pos < headerHeight || pos < lastPos) {
                header.classList.remove('mobile-header--unpinned');
            }

            lastPos = pos;
        });
    }
}
</script>

<style scoped>
.logo {
    width: 75px;
    height: 50px;
    margin: 7px;
    float: left;
}

#mobile_header {
    position: fixed;
    width: 100%;
    padding: 0;
    text-align: right;
    z-index: 10;
    -webkit-transition: -webkit-transform 0.2s ease;
    transition: -webkit-transform 0.2s ease;
    transition: transform 0.2s ease;
    transition: transform 0.2s ease, -webkit-transform 0.2s ease;
}

.mobile-header--unpinned {
    -webkit-transform: translateY(-150%);
    transform: translateY(-150%);
}

#main_layout_content {
    overflow: initial;
    padding-top: 60px;
}

#content {
    min-height: calc(100vh - 132px);
    padding: 24px;
    background: #fff;
    overflow: 'initial';
}

#main_layout_footer {
    width: 100%;
    padding: 15px 50px;
    background: #f0f2f5;
}
</style>
