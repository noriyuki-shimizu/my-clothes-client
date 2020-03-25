<template>
    <div id="footer">
        My Clothes ©2019 Created by Noriyuki Shimizu.
        <router-link to="/privacy-policy">
            privacy policy
        </router-link>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Footer extends Vue {}
</script>

<style scoped>
#footer {
    text-align: center;
}
</style>
