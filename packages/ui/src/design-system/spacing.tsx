import {
  createElement,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../lib/utils';

const SPACING_MAP = {
  none: '',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-12',
  '3xl': 'gap-16',
} as const;

type Spacing = keyof typeof SPACING_MAP;

interface FlexProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: ReactNode;
  spacing?: Spacing;
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
}

interface GridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: ReactNode;
  spacing?: Spacing;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'none' | 'subgrid';
  colsLg?:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 'none'
    | 'subgrid';
  colsXl?:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 'none'
    | 'subgrid';
  colsMd?:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 'none'
    | 'subgrid';
  colsSm?:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 'none'
    | 'subgrid';
  rows?: 1 | 2 | 3 | 4 | 5 | 6 | 'none' | 'subgrid';
  autoFlow?: 'row' | 'col' | 'dense' | 'row-dense' | 'col-dense';
}

const GRID_COLS_MAP = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
  11: 'grid-cols-11',
  12: 'grid-cols-12',
  none: 'grid-cols-none',
  subgrid: 'grid-cols-subgrid',
} as const;

const GRID_COLS_SM_MAP = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-5',
  6: 'sm:grid-cols-6',
  7: 'sm:grid-cols-7',
  8: 'sm:grid-cols-8',
  9: 'sm:grid-cols-9',
  10: 'sm:grid-cols-10',
  11: 'sm:grid-cols-11',
  12: 'sm:grid-cols-12',
  none: 'sm:grid-cols-none',
  subgrid: 'sm:grid-cols-subgrid',
} as const;

const GRID_COLS_MD_MAP = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
  7: 'md:grid-cols-7',
  8: 'md:grid-cols-8',
  9: 'md:grid-cols-9',
  10: 'md:grid-cols-10',
  11: 'md:grid-cols-11',
  12: 'md:grid-cols-12',
  none: 'md:grid-cols-none',
  subgrid: 'md:grid-cols-subgrid',
} as const;

const GRID_COLS_LG_MAP = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  7: 'lg:grid-cols-7',
  8: 'lg:grid-cols-8',
  9: 'lg:grid-cols-9',
  10: 'lg:grid-cols-10',
  11: 'lg:grid-cols-11',
  12: 'lg:grid-cols-12',
  none: 'lg:grid-cols-none',
  subgrid: 'lg:grid-cols-subgrid',
} as const;

const GRID_COLS_XL_MAP = {
  1: 'xl:grid-cols-1',
  2: 'xl:grid-cols-2',
  3: 'xl:grid-cols-3',
  4: 'xl:grid-cols-4',
  5: 'xl:grid-cols-5',
  6: 'xl:grid-cols-6',
  7: 'xl:grid-cols-7',
  8: 'xl:grid-cols-8',
  9: 'xl:grid-cols-9',
  10: 'xl:grid-cols-10',
  11: 'xl:grid-cols-11',
  12: 'xl:grid-cols-12',
  none: 'xl:grid-cols-none',
  subgrid: 'xl:grid-cols-subgrid',
} as const;

const GRID_ROWS_MAP = {
  1: 'grid-rows-1',
  2: 'grid-rows-2',
  3: 'grid-rows-3',
  4: 'grid-rows-4',
  5: 'grid-rows-5',
  6: 'grid-rows-6',
  none: 'grid-rows-none',
  subgrid: 'grid-rows-subgrid',
} as const;

const FLEX_DIRECTION_MAP = {
  row: 'flex-row',
  col: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'col-reverse': 'flex-col-reverse',
} as const;

const FLEX_ALIGN_MAP = {
  start: 'items-start',
  end: 'items-end',
  center: 'items-center',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
} as const;

const FLEX_JUSTIFY_MAP = {
  start: 'justify-start',
  end: 'justify-end',
  center: 'justify-center',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
} as const;

const FLEX_WRAP_MAP = {
  wrap: 'flex-wrap',
  nowrap: 'flex-nowrap',
  'wrap-reverse': 'flex-wrap-reverse',
} as const;

const GRID_FLOW_MAP = {
  row: 'grid-flow-row',
  col: 'grid-flow-col',
  dense: 'grid-flow-dense',
  'row-dense': 'grid-flow-row-dense',
  'col-dense': 'grid-flow-col-dense',
} as const;

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      children,
      className,
      spacing = 'md',
      direction = 'row',
      align,
      justify,
      wrap,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      'flex',
      SPACING_MAP[spacing],
      FLEX_DIRECTION_MAP[direction],
      align && FLEX_ALIGN_MAP[align],
      justify && FLEX_JUSTIFY_MAP[justify],
      wrap && FLEX_WRAP_MAP[wrap],
      className
    );

    return createElement(
      'div',
      { ...props, ref, className: classes },
      children
    );
  }
);

Flex.displayName = 'Flex';

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      children,
      className,
      spacing = 'md',
      cols = 1,
      colsLg,
      colsXl,
      colsMd,
      colsSm,
      rows,
      autoFlow,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      'grid',
      SPACING_MAP[spacing],
      GRID_COLS_MAP[cols],
      colsXl && GRID_COLS_XL_MAP[colsXl],
      colsLg && GRID_COLS_LG_MAP[colsLg],
      colsMd && GRID_COLS_MD_MAP[colsMd],
      colsSm && GRID_COLS_SM_MAP[colsSm],
      rows && GRID_ROWS_MAP[rows],
      autoFlow && GRID_FLOW_MAP[autoFlow],
      className
    );

    return createElement(
      'div',
      { ...props, ref, className: classes },
      children
    );
  }
);

Grid.displayName = 'Grid';
