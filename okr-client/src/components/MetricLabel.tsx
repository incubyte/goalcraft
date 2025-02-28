const MetricsLabel = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number;
  className?: string;
}) => {
  return (
    <div
      className={`w-full flex justify-between items-center text-xs font-medium mt-2 ${className}`}
    >
      <p className={`text-gray-700 ${className} bg-white shadow-sm px-2 rounded-md`}>{label}</p>
      <p className="w-[140px] truncate text-right">{value}</p>
    </div>
  );
};

export default MetricsLabel;
