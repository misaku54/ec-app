type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<Props> = ({ children, onClick, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}