<template>
    <a-form
        id="components-form-validate-other"
        :form="form"
        v-bind="formItemLayout"
        @submit="handleSubmit"
    >
        <a-form-item
            v-bind="formItemLayout"
            :label="$t('dictionary.genre.name')"
        >
            <a-input
                v-decorator="[
                    'name',
                    {
                        rules: [
                            {
                                max: 60,
                                message: $t('message.validation.genre.name.max')
                            },
                            {
                                required: true,
                                message: $t(
                                    'message.validation.genre.name.required'
                                )
                            },
                            {
                                validator: nameValidator,
                                message: $t(
                                    'message.validation.genre.name.duplication'
                                )
                            }
                        ]
                    }
                ]"
            />
        </a-form-item>

        <a-form-item
            v-bind="formItemLayout"
            :label="$t('dictionary.genre.tag-color')"
        >
            <a-select
                v-decorator="[
                    'color',
                    {
                        rules: [
                            {
                                required: true,
                                message: $t(
                                    'message.validation.genre.tag-color.required'
                                )
                            }
                        ]
                    }
                ]"
            >
                <a-select-option
                    v-for="(color, i) in remainingColors"
                    :key="i"
                    :value="color"
                >
                    {{ color }}
                </a-select-option>
            </a-select>
        </a-form-item>

        <a-form-item
            v-bind="formItemLayout"
            :label="$t('dictionary.genre.color-list')"
        >
            <a-card>
                <a-tag
                    v-for="(color, i) in remainingColors"
                    :key="i"
                    :color="color"
                    class="color-list"
                >
                    {{ color }}
                </a-tag>
            </a-card>
        </a-form-item>

        <div class="form-submit-button">
            <a-button html-type="submit" type="primary">
                {{ $t('operation.submit') }}
            </a-button>
        </div>
    </a-form>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { Form } from 'ant-design-vue';
import { WrappedFormUtils } from 'ant-design-vue/types/form/form';
import * as Vuex from 'vuex';

import { formItemLayout } from '@/components/genre/form';
import { FormFields } from '@/components/genre/type';
import { Genre } from '@/store/genre/type';
import { getBase64 } from '@/util/file';
import { Route } from 'vue-router';

@Component
export default class GenreForm extends Vue {
    @Prop({ type: Object as () => Genre })
    target?: Genre;

    $store!: Vuex.ExStore;

    form!: WrappedFormUtils;

    formItemLayout = formItemLayout;

    created() {
        this.fetchCanSelectedColorsStateChange();
        this.form = this.$form.createForm(this);
    }

    @Watch('$i18n.locale')
    onLocalChange() {
        const fieldsValue = this.form.getFieldsValue();
        this.form.resetFields();
        this.form.setFieldsValue(fieldsValue);
    }

    @Watch('target')
    onTargetChange(newGenre: Genre) {
        if (newGenre) {
            this.form.setFieldsValue({
                name: newGenre.name,
                color: newGenre.color
            });
        }
    }

    get genres() {
        return this.$store.getters['genre/genres'] as Readonly<Genre>[];
    }

    get remainingColors() {
        return this.$store.getters['genre/canSelectedColors'];
    }

    async fetchCanSelectedColorsStateChange() {
        const { id } = this.$route.params;
        await this.$store
            .dispatch(
                'genre/fetchCanSelectedColorsStateChange',
                id ? Number(id) : null
            )
            .catch((err: any) => this.$emit('on-error', err));
    }

    nameValidator(_: any, value: string, cb: Function) {
        const { id } = this.$route.params;

        const someCallback = id
            ? (genre: Genre) => genre.name === value && genre.id !== Number(id)
            : (genre: Genre) => genre.name === value;

        this.genres.some(someCallback) ? cb(true) : cb();
    }

    handleSubmit(e: Event) {
        e.preventDefault();
        this.form.validateFields(async (err, values: FormFields) => {
            if (!err) {
                this.$emit<FormFields>('on-submit', values);
            }
        });
    }
}
</script>

<style>
.color-list {
    margin-bottom: 5px;
}

.form-submit-button {
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e9e9e9;
    padding: 10px 16px;
    background: #fff;
    text-align: right;
}
</style>
