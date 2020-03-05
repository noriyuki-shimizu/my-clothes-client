import { Column } from 'ant-design-vue/types/table/column';

import { Record } from './type';

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
        key: 'link',
        width: 250,
        scopedSlots: { customRender: 'link' }
    },
    {
        title: 'Station name',
        dataIndex: 'stationName',
        key: 'stationName',
        scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender'
        },
        onFilter: (value: string, record: Record) =>
            record.stationName
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        width: 150
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        scopedSlots: { customRender: 'address' },
        onFilter: (value: string, record: Record) =>
            record.address
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase())
    },
    {
        title: 'Business hours',
        dataIndex: 'businessHours',
        key: 'businessHours',
        width: 150
    },
    {
        title: 'Tel',
        dataIndex: 'tel',
        key: 'tel',
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
