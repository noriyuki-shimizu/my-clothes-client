import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Initiable extends Vue {
    created() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}
