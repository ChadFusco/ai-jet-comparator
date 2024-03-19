export type TableField = {
  key: string;
  label: string;
  sortable: boolean;
};

export type ComparisonCategory = {
  subprompt: string;
};

export type Comparisons = {
  [key: string]: ComparisonCategory;
};
