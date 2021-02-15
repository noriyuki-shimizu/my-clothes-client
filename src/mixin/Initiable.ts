import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Initiable extends Vue {
    private readonly SCROLL_TO_OPTIONS: ScrollToOptions = {
        top: 0,
        behavior: 'smooth'
    }

    created() {
        window.scrollTo(this.SCROLL_TO_OPTIONS);
    }
}
