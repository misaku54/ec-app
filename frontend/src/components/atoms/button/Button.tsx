type Props = {
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<Props> = ({ children }) => {
  return <button>{children}</button>;
}