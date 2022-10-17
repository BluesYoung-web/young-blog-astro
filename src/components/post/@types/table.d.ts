/*
 * @Author: zhangyang
 * @Date: 2021-12-09 19:25:21
 * @LastEditTime: 2021-12-10 09:58:18
 * @Description: 自定义表格组件的类型
 */
type TableHeadAligin = 'left' | 'center' | 'right' | undefined;

type TableHeadItem<T extends any = any> = {
  /**
   * 属性名
   */
  prop: keyof T;
  /**
   * 表头标题
   */
  label: string;
  /**
   * 宽度，带单位，不填则自适应；例如： 100px
   */
  width?: string;
  /**
   * 对齐方式，默认居中
   */
  aligin?: TableHeadAligin;
};

type TableDataItem<T extends any = any> = {
  [key in keyof T]: T[key];
} & Record<string, any>;

type MultiRowItem = {
  before?: unknown;
  value: unknown;
  after?: unknown;
};
