const MetricsLabel = ({
  label,
  value,
  target,
  className
}: {
  label: string;
  value: string | number;
  target?: number;
  className?: string;
}) => {
  return (
    <div className={`w-full flex justify-between items-center text-xs font-medium my-2 ${className}`}>
      <p className={`text-gray-700 ${className} bg-white px-2 rounded-full`}>{label}</p>
      <p className="w-[140px] truncate text-right">{label === "Completion" ? <meter value={value} min={0} max={target}></meter> : value}</p>
    </div>
  );
};

export default MetricsLabel;
