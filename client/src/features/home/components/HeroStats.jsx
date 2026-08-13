import { heroStats } from "../data/heroStats";

function HeroStats() {
  return (
    <div className="mt-10 grid grid-cols-3 gap-6">
      {heroStats.map((item) => (
        <div key={item.id}>
          <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {item.number}
          </h3>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export default HeroStats;
