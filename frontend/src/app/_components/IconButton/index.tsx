interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function IconButton({ children, onClick }: IconButtonProps) {
  return (
    <button style={{ all: 'unset' }} onClick={onClick}>
      {children}
    </button>
  );
}
