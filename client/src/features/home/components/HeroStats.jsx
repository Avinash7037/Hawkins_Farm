import { heroStats } from "../data/heroStats";

function HeroStats() {
  return (
    <div className="grid grid-cols-3 gap-6 mt-10">
      {heroStats.map((item) => (
        <div key={item.id}>
          <h3 className="text-3xl font-bold text-emerald-600">{item.number}</h3>

          <p className="text-sm text-gray-500 mt-2">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

export default HeroStats;
