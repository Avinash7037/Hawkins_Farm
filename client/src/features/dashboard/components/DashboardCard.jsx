function DashboardCard({ title, value, color }) {
  return (
    <div className={`rounded-xl border bg-white p-6 shadow-sm ${color}`}>
      <h3 className="text-sm text-gray-500">{title}</h3>

      <h2 className="mt-2 text-3xl font-bold">{value}</h2>
    </div>
  );
}

export default DashboardCard;
