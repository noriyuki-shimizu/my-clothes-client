import { Column } from 'ant-design-vue/types/table/column';
import { Genre } from '@/store/genre/type';

export type Record = Pick<Genre, 'name' | 'color'> & {
    key?: number;
};

export const columns: Partial<Column>[] = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
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
        width: 500
    },
    {
        title: 'Tag Color',
        dataIndex: 'color',
        key: 'color',
        scopedSlots: { customRender: 'color' },
        width: 500
    },
    {
        title: 'Operation',
        key: 'operation',
        fixed: 'right',
        width: 200,
        scopedSlots: { customRender: 'operation' }
    }
];
