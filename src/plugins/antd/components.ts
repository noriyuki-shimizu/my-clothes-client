/* eslint-disable no-param-reassign */
import Vue, { VueConstructor } from 'vue';
import {
    Affix,
    Anchor,
    AutoComplete,
    Alert,
    Avatar,
    BackTop,
    Badge,
    Breadcrumb,
    Button,
    Calendar,
    Card,
    Collapse,
    Carousel,
    Cascader,
    Checkbox,
    Col,
    DatePicker,
    Divider,
    Dropdown,
    Form,
    Icon,
    Input,
    InputNumber,
    Layout,
    List,
    LocaleProvider,
    message,
    Menu,
    Modal,
    notification,
    Pagination,
    Popconfirm,
    Popover,
    Progress,
    Radio,
    Rate,
    Row,
    Select,
    Slider,
    Spin,
    Statistic,
    Steps,
    Switch,
    Table,
    Transfer,
    Tree,
    TreeSelect,
    Tabs,
    Tag,
    TimePicker,
    Timeline,
    Tooltip,
    Upload,
    Drawer,
    Skeleton,
    Comment,
    ConfigProvider,
    Empty,
    Result,
    Descriptions,
    PageHeader
} from 'ant-design-vue';

export default (vue: VueConstructor<Vue>) => {
    vue.prototype.$message = message;
    vue.prototype.$notification = notification;
    vue.prototype.$info = Modal.info;
    vue.prototype.$success = Modal.success;
    vue.prototype.$error = Modal.error;
    vue.prototype.$warning = Modal.warning;
    vue.prototype.$confirm = Modal.confirm;
    vue.prototype.$destroyAll = Modal.destroyAll;

    vue.use(Affix);
    vue.use(Anchor);
    vue.use(AutoComplete);
    vue.use(Alert);
    vue.use(Avatar);
    vue.use(BackTop);
    vue.use(Badge);
    vue.use(Breadcrumb);
    vue.use(Button);
    vue.use(Calendar);
    vue.use(Card);
    vue.use(Collapse);
    vue.use(Carousel);
    vue.use(Cascader);
    vue.use(Checkbox);
    vue.use(Col);
    vue.use(DatePicker);
    vue.use(Divider);
    vue.use(Drawer);
    vue.use(Dropdown);
    vue.use(Form);
    vue.use(Icon);
    vue.use(Input);
    vue.use(InputNumber);
    vue.use(Layout);
    vue.use(List);
    vue.use(LocaleProvider);
    vue.use(Menu);
    vue.use(Modal);
    vue.use(Pagination);
    vue.use(Popconfirm);
    vue.use(Popover);
    vue.use(Progress);
    vue.use(Radio);
    vue.use(Rate);
    vue.use(Row);
    vue.use(Select);
    vue.use(Slider);
    vue.use(Spin);
    vue.use(Statistic);
    vue.use(Steps);
    vue.use(Switch);
    vue.use(Table);
    vue.use(Transfer);
    vue.use(Tree);
    vue.use(TreeSelect);
    vue.use(Tabs);
    vue.use(Tag);
    vue.use(TimePicker);
    vue.use(Timeline);
    vue.use(Tooltip);
    vue.use(Upload);
    vue.use(Skeleton);
    vue.use(Comment);
    vue.use(ConfigProvider);
    vue.use(Empty);
    vue.use(Result);
    vue.use(Descriptions);
    vue.use(PageHeader);

    vue.component(Affix.name, Affix);
    vue.component(Anchor.name, Anchor);
    vue.component(Anchor.Link.name, Anchor.Link);
    vue.component(AutoComplete.name, AutoComplete);
    vue.component(Alert.name, Alert);
    vue.component(Avatar.name, Avatar);
    vue.component(BackTop.name, BackTop);
    vue.component(Badge.name, Badge);
    vue.component(Breadcrumb.name, Breadcrumb);
    vue.component(Breadcrumb.Item.name, Breadcrumb.Item);
    vue.component(Button.name, Button);
    vue.component(Button.Group.name, Button.Group);

    vue.component(Calendar.name, Calendar);
    vue.component(Card.name, Card);
    vue.component(Card.Meta.name, Card.Meta);
    vue.component(Card.Grid.name, Card.Grid);
    vue.component(Collapse.name, Collapse);
    vue.component(Collapse.Panel.name, Collapse.Panel);
    vue.component(Carousel.name, Carousel);
    vue.component(Cascader.name, Cascader);
    vue.component(Checkbox.name, Checkbox);
    vue.component(Checkbox.Group.name, Checkbox.Group);
    vue.component(Col.name, Col);
    vue.component(DatePicker.name, DatePicker);
    vue.component(DatePicker.MonthPicker.name, DatePicker.MonthPicker);
    vue.component(DatePicker.RangePicker.name, DatePicker.RangePicker);
    vue.component(Divider.name, Divider);
    vue.component(Drawer.name, Drawer);
    vue.component(Dropdown.name, Dropdown);
    vue.component(Dropdown.Button.name, Dropdown.Button);
    vue.component(Form.name, Form);
    vue.component(Form.Item.name, Form.Item);
    vue.component(Icon.name, Icon);
    vue.component(Input.name, Input);
    vue.component(Input.Group.name, Input.Group);
    vue.component(Input.Search.name, Input.Search);
    vue.component(Input.TextArea.name, Input.TextArea);
    vue.component(InputNumber.name, InputNumber);
    vue.component(Layout.name, Layout);
    vue.component(Layout.Header.name, Layout.Header);
    vue.component(Layout.Footer.name, Layout.Footer);
    vue.component(Layout.Sider.name, Layout.Sider);
    vue.component(Layout.Content.name, Layout.Content);
    vue.component(List.name, List);
    vue.component(List.Item.name, List.Item);
    vue.component(List.Item.Meta.name, List.Item.Meta);
    vue.component(LocaleProvider.name, LocaleProvider);
    vue.component(Menu.name, Menu);
    vue.component(Menu.Item.name, Menu.Item);
    vue.component(Menu.SubMenu.name, Menu.SubMenu);
    vue.component(Menu.Divider.name, Menu.Divider);
    vue.component(Menu.ItemGroup.name, Menu.ItemGroup);
    vue.component(Modal.name, Modal);
    vue.component(Pagination.name, Pagination);
    vue.component(Popconfirm.name, Popconfirm);
    vue.component(Popover.name, Popover);
    vue.component(Progress.name, Progress);
    vue.component(Radio.name, Radio);
    vue.component(Radio.Group.name, Radio.Group);
    vue.component(Radio.Button.name, Radio.Button);
    vue.component(Rate.name, Rate);
    vue.component(Row.name, Row);
    vue.component(Select.name, Select);
    vue.component(Select.Option.name, Select.Option);
    vue.component(Select.OptGroup.name, Select.OptGroup);
    vue.component(Slider.name, Slider);
    vue.component(Spin.name, Spin);
    vue.component(Steps.name, Steps);
    vue.component(Steps.Step.name, Steps.Step);
    vue.component(Switch.name, Switch);
    vue.component(Table.name, Table);
    vue.component(Table.Column.name, Table.Column);
    vue.component(Table.ColumnGroup.name, Table.ColumnGroup);
    vue.component(Transfer.name, Transfer);
    vue.component(Tree.name, Tree);
    vue.component(Tree.TreeNode.name, Tree.TreeNode);
    vue.component(TreeSelect.name, TreeSelect);
    vue.component(TreeSelect.TreeNode.name, TreeSelect.TreeNode);
    vue.component(Tabs.name, Tabs);
    vue.component(Tabs.TabPane.name, Tabs.TabPane);
    vue.component(Tag.name, Tag);
    vue.component(Tag.CheckableTag.name, Tag.CheckableTag);
    vue.component(TimePicker.name, TimePicker);
    vue.component(Timeline.name, Timeline);
    vue.component(Timeline.Item.name, Timeline.Item);
    vue.component(Tooltip.name, Tooltip);
    vue.component(Upload.name, Upload);
    vue.component(Upload.Dragger.name, Upload.Dragger);
};
