import Vue from 'vue';
import { Column } from 'ant-design-vue/types/table/column';
import { textIncludes } from '@/util/text';
import { Record } from './type';

export const getTableColumns = ($t: Vue['$t']): Partial<Column>[] => {
    return [
        {
            title: $t('dictionary.genre.name'),
            dataIndex: 'name',
            key: 'name',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'customRender'
            },
            onFilter: (value: string, record: Record) =>
                textIncludes(record.name, value),
            width: 300
        },
        {
            title: $t('dictionary.genre.tag-color'),
            dataIndex: 'color',
            key: 'color',
            scopedSlots: { customRender: 'color' },
            width: 150
        },
        {
            title: $t('dictionary.genre.description'),
            dataIndex: 'description',
            key: 'description',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'customRender'
            },
            onFilter: (value: string, record: Record) =>
                textIncludes(record.description, value),
            width: 500
        },
        {
            title: $t('dictionary.operation'),
            key: 'operation',
            fixed: 'right',
            width: 200,
            scopedSlots: { customRender: 'operation' }
        }
    ];
};

export default {};
