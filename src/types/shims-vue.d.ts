import Vue from 'vue';

declare module 'vue/types/vue' {
    interface Vue {
        // TODO: 一旦の対応として、ジェネリクスで退避
        // 統一感を持たせるのなら、vuex と同じように型を定義する
        $emit<T>(event: string, t: T): this;
    }
}
