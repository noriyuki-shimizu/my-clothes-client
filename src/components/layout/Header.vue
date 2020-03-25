<template>
    <div>
        <account-popover />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AccountPopover from '@/components/user/AccountPopover.vue';

@Component({
    components: {
        AccountPopover
    }
})
export default class Header extends Vue {}
</script>
