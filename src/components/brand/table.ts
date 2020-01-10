import { Column } from 'ant-design-vue/types/table/column';
import { Brand } from '@/store/brand/type';

export type Record = Pick<Brand, 'name' | 'link' | 'imageLink' | 'country'> & {
    key?: number;
    deleted: string;
};

export const columns: Partial<Column>[] = [
    {
        title: 'Name',
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
        title: 'Image',
        dataIndex: 'imageLink',
        key: 'imageLink',
        scopedSlots: { customRender: 'imageLink' },
        width: 120
    },
    {
        title: 'Link',
        dataIndex: 'link',
        key: 'link'
    },
    {
        title: 'Country',
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
        title: 'Deleted',
        dataIndex: 'deleted',
        filters: [
            { text: 'Deleted', value: 'Deleted' },
            { text: 'Not deleted', value: 'Not deleted' }
        ],
        filterMultiple: false,
        onFilter: (value: string, record: Record) => record.deleted === value,
        width: 150
    },
    {
        title: 'Operation',
        key: 'operation',
        fixed: 'right',
        width: 200,
        scopedSlots: { customRender: 'operation' }
    }
];
