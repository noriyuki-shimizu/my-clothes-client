import { AssistItem, Record } from '@/components/clothes/type';
import { Column } from 'ant-design-vue/types/table/column';
import moment from 'moment';
import Vue from 'vue';

const getColumns = (
    $t: Vue['$t'],
    { brands, shops, genres }: AssistItem
): Partial<Column>[] => {
    return [
        {
            title: $t('dictionary.image'),
            dataIndex: 'imageLink',
            key: 'imageLink',
            fixed: 'left',
            scopedSlots: { customRender: 'imageLink' },
            width: 160
        },
        {
            title: $t('dictionary.brand.name'),
            dataIndex: 'brandName',
            key: 'brandName',
            filters: brands.map(({ name }) => ({
                text: name,
                value: name
            })),
            onFilter: (value: string, record: Record) =>
                record.brandName === value,
            width: 160
        },
        {
            title: $t('dictionary.shop.name'),
            dataIndex: 'shopName',
            key: 'shopName',
            filters: shops.map(({ name }) => ({
                text: name,
                value: name
            })),
            onFilter: (value: string, record: Record) =>
                record.shopName === value,
            width: 160
        },
        {
            title: $t('dictionary.genre.index'),
            key: 'genres',
            dataIndex: 'genres',
            filters: genres.map(({ name }) => ({
                text: name,
                value: name
            })),
            onFilter: (value: string, record: Record) =>
                record.genres.map((genre) => genre.name).includes(value),
            scopedSlots: { customRender: 'genres' },
            width: 200
        },
        {
            title: $t('dictionary.price'),
            dataIndex: 'price',
            key: 'price',
            sorter: (a: Record, b: Record) => a.price - b.price,
            scopedSlots: { customRender: 'price' },
            width: 160
        },
        {
            title: $t('dictionary.clothes.buy-date'),
            key: 'buyDate',
            dataIndex: 'buyDate',
            sorter: (a: Record, b: Record) => {
                const aBuyDate = moment(a.buyDate);
                const bBuyDate = moment(b.buyDate);
                if (aBuyDate.isSame(bBuyDate)) {
                    return 0;
                }
                return aBuyDate.isSameOrAfter(bBuyDate) ? 1 : -1;
            },
            width: 150
        },
        {
            title: $t('dictionary.comment'),
            key: 'comment',
            dataIndex: 'comment',
            width: 300
        },
        {
            title: $t('dictionary.clothes.satisfaction'),
            dataIndex: 'satisfaction',
            key: 'satisfaction',
            sorter: (a: Record, b: Record) => {
                if (a.satisfaction && b.satisfaction) {
                    return a.satisfaction - b.satisfaction;
                }
                return 0;
            },
            scopedSlots: { customRender: 'satisfaction' },
            width: 200
        }
    ];
};

export const getColumnsForTable = (
    $t: Vue['$t'],
    { brands, shops, genres }: AssistItem
): Partial<Column>[] => {
    const deletedText = $t('status.item.delete').toString();
    const notDeletedText = $t('status.item.not-delete').toString();
    return getColumns($t, { brands, shops, genres }).concat([
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
    ]);
};

export const getColumnsForFormTable = (
    $t: Vue['$t'],
    { brands, shops, genres }: AssistItem
): Partial<Column>[] => {
    return getColumns($t, { brands, shops, genres });
};

export default {};
