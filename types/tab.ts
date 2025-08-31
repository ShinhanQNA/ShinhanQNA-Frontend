export default interface TabProps {
  tabs: string[];
  focusedTab: string;
  onTabClick: (tab: string) => void;
}