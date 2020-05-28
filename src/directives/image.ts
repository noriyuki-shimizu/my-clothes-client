import { DirectiveOptions } from 'vue';

export const tableImage: DirectiveOptions = {
    bind(el: HTMLElement) {
        el.addEventListener('error', () => {
            el.style.height = '150px';
            el.style.width = '200px';
            (el as HTMLImageElement).src = require('@/images/no-img.png');
        });
    }
};

export default {};
