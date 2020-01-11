<template>
    <a-form
        id="components-form-validate-other"
        :form="form"
        v-bind="formItemLayout"
        @submit="handleSubmit"
    >
        <a-form-item v-bind="formItemLayout" label="Name">
            <a-input
                v-decorator="[
                    'name',
                    {
                        rules: [
                            {
                                max: 60
                            },
                            {
                                required: true
                            },
                            {
                                message:
                                    'A genre with the same name already exists.',
                                validator: nameValidator
                            }
                        ]
                    }
                ]"
                placeholder="Please enter genre name"
            />
        </a-form-item>

        <a-form-item v-bind="formItemLayout" label="Tag color">
            <a-select
                v-decorator="[
                    'color',
                    {
                        rules: [
                            {
                                required: true,
                                message: 'Please select your color.'
                            }
                        ]
                    }
                ]"
                placeholder="Please select a color"
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

        <a-form-item v-bind="formItemLayout" label="Remaining color">
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
                Submit
            </a-button>
        </div>
    </a-form>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Form } from 'ant-design-vue';
import { WrappedFormUtils } from 'ant-design-vue/types/form/form';
import * as Vuex from 'vuex';

import { colors, formItemLayout, FormFields } from '@/components/genre/form';
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
        if (this.target) {
            const { target } = this;
            this.form = this.$form.createForm(this, {
                mapPropsToFields: () => {
                    return {
                        name: this.$form.createFormField({
                            value: target.name
                        }),
                        color: this.$form.createFormField({
                            value: target.color
                        })
                    };
                }
            });
            return;
        }
        this.form = this.$form.createForm(this);
    }

    get genres() {
        return this.$store.getters['genre/genres'] as Readonly<Genre>[];
    }

    get remainingColors() {
        const { id } = this.$route.params;

        const genreColors = id
            ? this.genres
                  .filter(genre => genre.id !== Number(id))
                  .map(genre => genre.color)
            : this.genres.map(genre => genre.color);

        return colors.filter(color => genreColors.indexOf(color) < 0);
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
                this.$emit('onSubmit', values);
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
