import { Column } from 'ant-design-vue/types/table/column';
import moment from 'moment';
import { AssistBrand, AssistShop, AssistGenre } from '@/store/clothes/type';
import { Record } from '@/components/clothes/type';

const getColumns = (
    brands: AssistBrand[],
    shops: AssistShop[],
    genres: AssistGenre[]
): Partial<Column>[] => {
    return [
        {
            title: 'Image',
            dataIndex: 'imageLink',
            key: 'imageLink',
            fixed: 'left',
            scopedSlots: { customRender: 'imageLink' },
            width: 180
        },
        {
            title: 'Brand name',
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
            title: 'Shop name',
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
            title: 'Genre',
            key: 'genres',
            dataIndex: 'genres',
            filters: genres.map(({ name }) => ({
                text: name,
                value: name
            })),
            onFilter: (value: string, record: Record) =>
                record.genres.map(genre => genre.name).includes(value),
            scopedSlots: { customRender: 'genres' },
            width: 200
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: (a: Record, b: Record) =>
                Number(a.price.replace(/,/, '')) -
                Number(b.price.replace(/,/, '')),
            scopedSlots: { customRender: 'price' },
            width: 160
        },
        {
            title: 'Buy date',
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
            title: 'Comment',
            key: 'comment',
            dataIndex: 'comment',
            width: 300
        },
        {
            title: 'Satisfaction',
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
        },
        {
            title: 'Deleted',
            dataIndex: 'deleted',
            filters: [
                { text: 'Deleted', value: 'Deleted' },
                { text: 'Not deleted', value: 'Not deleted' }
            ],
            filterMultiple: false,
            onFilter: (value: string, record: Record) =>
                record.deleted === value,
            width: 150
        }
    ];
};

export const getColumnsForTable = (
    brands: AssistBrand[],
    shops: AssistShop[],
    genres: AssistGenre[]
): Partial<Column>[] => {
    return getColumns(brands, shops, genres).concat([
        {
            title: 'Operation',
            key: 'operation',
            fixed: 'right',
            width: 200,
            scopedSlots: { customRender: 'operation' }
        }
    ]);
};

export const getColumnsForFormTable = (
    brands: AssistBrand[],
    shops: AssistShop[],
    genres: AssistGenre[]
): Partial<Column>[] => {
    return getColumns(brands, shops, genres);
};

export default {};
