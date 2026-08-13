function DashboardCard({ title, value, color }) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition dark:border-gray-700 dark:bg-gray-900 ${color}`}
    >
      <h3 className="text-sm text-gray-500 dark:text-gray-400">{title}</h3>

      <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </h2>
    </div>
  );
}

export default DashboardCard;
