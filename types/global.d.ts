declare interface ITab {
  key: string;
  label: string;
  children: React.ReactNode;
  closable?: boolean;
}

declare interface ILabel {
  label: string;
  value: string;
}

interface Window {
  $tabList: ITab[];
  $activeTab: string;
  $openKeys: string[];
}
