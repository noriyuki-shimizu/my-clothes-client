import { Column } from 'ant-design-vue/types/table/column';
import Vue from 'vue';
import { Record } from './type';

export const getTableColumns = ($t: Vue['$t']): Partial<Column>[] => {
    const deletedText = $t('status.item.delete').toString();
    const notDeletedText = $t('status.item.not-delete').toString();
    return [
        {
            title: $t('dictionary.brand.name'),
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'customRender'
            },
            onFilter: (value: string, record: Record) =>
                record.name
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            width: 150
        },
        {
            title: $t('dictionary.image'),
            dataIndex: 'imageLink',
            key: 'imageLink',
            scopedSlots: { customRender: 'imageLink' },
            width: 160
        },
        {
            title: $t('dictionary.link'),
            dataIndex: 'link',
            key: 'link',
            scopedSlots: { customRender: 'link' }
        },
        {
            title: $t('dictionary.brand.country'),
            dataIndex: 'country',
            key: 'country',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'customRender'
            },
            onFilter: (value: string, record: Record) =>
                record.country
                    .toString()
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            width: 150
        },
        {
            title: $t('dictionary.status'),
            dataIndex: 'deleted',
            filters: [
                { text: deletedText, value: deletedText },
                { text: notDeletedText, value: notDeletedText }
            ],
            filterMultiple: false,
            onFilter: (value: string, record: Record) =>
                record.deleted === value,
            width: 150
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
