import Vue from 'vue';
import { Column } from 'ant-design-vue/types/table/column';
import { textIncludes } from '@/util/text';
import { Record } from './type';

export const getTableColumns = ($t: Vue['$t']): Partial<Column>[] => {
    const deletedText = $t('status.item.delete').toString();
    const notDeletedText = $t('status.item.not-delete').toString();
    return [
        {
            title: $t('dictionary.shop.name'),
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'customRender'
            },
            onFilter: (value: string, record: Record) =>
                textIncludes(record.name, value),
            width: 150
        },
        {
            title: $t('dictionary.image'),
            dataIndex: 'imageLink',
            key: 'imageLink',
            scopedSlots: { customRender: 'imageLink' },
            width: 170
        },
        {
            title: $t('dictionary.shop.business-status'),
            dataIndex: 'isBusinessStatus',
            key: 'isBusinessStatus',
            scopedSlots: { customRender: 'isBusinessStatus' },
            sorter: true,
            width: 150,
            align: 'center'
        },
        {
            title: $t('dictionary.link'),
            dataIndex: 'link',
            key: 'link',
            width: 250,
            scopedSlots: { customRender: 'link' }
        },
        {
            title: $t('dictionary.shop.station-name'),
            dataIndex: 'stationName',
            key: 'stationName',
            scopedSlots: {
                filterDropdown: 'filterDropdown',
                filterIcon: 'filterIcon',
                customRender: 'customRender'
            },
            onFilter: (value: string, record: Record) =>
                textIncludes(record.stationName, value),
            width: 150
        },
        {
            title: $t('dictionary.shop.address'),
            dataIndex: 'address',
            key: 'address',
            scopedSlots: { customRender: 'address' },
            onFilter: (value: string, record: Record) =>
                textIncludes(record.address, value)
        },
        {
            title: $t('dictionary.shop.business-hours'),
            dataIndex: 'businessHours',
            key: 'businessHours',
            width: 150
        },
        {
            title: $t('dictionary.shop.tel'),
            dataIndex: 'tel',
            key: 'tel',
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
