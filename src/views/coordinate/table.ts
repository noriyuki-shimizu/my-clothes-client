import moment from 'moment';

import { CoordinateItem } from '@/store/coordinate/type';
import { AssistBrand, AssistShop, AssistGenre } from '@/store/clothes/type';

export type Record = Omit<CoordinateItem, 'id' | 'price'> & {
    key: number;
    price: string;
};

export const getColumns = (
    brands: AssistBrand[],
    shops: AssistShop[],
    genres: AssistGenre[]
) => [
    {
        title: 'Image',
        dataIndex: 'imageLink',
        key: 'imageLink',
        fixed: 'left',
        scopedSlots: { customRender: 'imageLink' },
        width: 170
    },
    {
        title: 'Brand name',
        dataIndex: 'brandName',
        key: 'brandName',
        filters: brands.map(({ name }) => ({
            text: name,
            value: name
        })),
        onFilter: (value: string, record: Record) => record.brandName === value,
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
        onFilter: (value: string, record: Record) => record.shopName === value,
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
            Number(a.price.replace(/,/, '')) - Number(b.price.replace(/,/, '')),
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
    }
];
