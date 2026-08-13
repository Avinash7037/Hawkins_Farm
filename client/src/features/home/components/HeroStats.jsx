import { Gavel, ShoppingBag, MessageCircle } from "lucide-react";

function HeroStats() {
  const features = [
    {
      id: 1,
      icon: ShoppingBag,
      title: "Marketplace",
      description: "Buy farm products",
    },
    {
      id: 2,
      icon: Gavel,
      title: "Live Auctions",
      description: "Bid on farm products",
    },
    {
      id: 3,
      icon: MessageCircle,
      title: "Direct Chat",
      description: "Connect with farmers",
    },
  ];

  return (
    <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {features.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            className="
              rounded-2xl
              border
              border-emerald-100
              bg-white/70
              p-4
              backdrop-blur-sm
              transition
              hover:-translate-y-1
              hover:shadow-md

              dark:border-gray-800
              dark:bg-gray-900/70
            "
          >
            <Icon
              size={24}
              className="text-emerald-600 dark:text-emerald-400"
            />

            <h3
              className="
                mt-3
                font-semibold
                text-gray-900

                dark:text-gray-100
              "
            >
              {item.title}
            </h3>

            <p
              className="
                mt-1
                text-sm
                text-gray-500

                dark:text-gray-400
              "
            >
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default HeroStats;
