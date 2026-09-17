interface MoneyDisplayProps {
  amount: number;
  size?: 'sm' | 'md';
}

export default function MoneyDisplay({ amount, size = 'md' }: MoneyDisplayProps) {
  const isSm = size === 'sm';
  return (
    <div
      className={`flex items-center gap-1.5 rounded-full bg-white/95 shadow-sm ${
        isSm ? 'px-2.5 py-1' : 'px-3.5 py-1.5'
      }`}
    >
      <span className={isSm ? 'text-base' : 'text-lg'}>💰</span>
      <span className={`font-display font-bold text-ink ${isSm ? 'text-sm' : 'text-base'}`}>
        R$ {amount.toFixed(2).replace('.', ',')}
      </span>
    </div>
  );
}
