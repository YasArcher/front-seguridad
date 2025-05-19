export interface SwitchToggleProps {
  label: string;
  icon?: React.ReactNode;
  checked: boolean;
  onChange: (newValue: boolean) => void;
}
