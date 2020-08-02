<template>
    <div class="header-container">
        <account-popover />
        <language-select id="outer_language_block" />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AccountPopover from '@/components/user/AccountPopover.vue';
import LanguageSelect from '@/components/language/Select.vue';

@Component({
    components: {
        AccountPopover,
        LanguageSelect
    }
})
export default class Header extends Vue {}
</script>

<style scoped>
.header-container {
    display: flex;
    justify-content: space-between;
}

#outer_language_block {
    padding-top: 15px;
}
</style>
