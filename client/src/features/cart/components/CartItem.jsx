import { Minus, Plus, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";

import { updateItemQuantity, deleteCartItem } from "../cartThunks";

function CartItem({ item }) {
  const dispatch = useDispatch();

  const increase = () => {
    dispatch(
      updateItemQuantity({
        id: item._id,
        quantity: item.quantity + 1,
      }),
    );
  };

  const decrease = () => {
    if (item.quantity === 1) return;

    dispatch(
      updateItemQuantity({
        id: item._id,
        quantity: item.quantity - 1,
      }),
    );
  };

  const remove = () => {
    dispatch(deleteCartItem(item._id));
  };

  const image =
    item.product.images?.[0]?.url ||
    "https://placehold.co/120x120?text=No+Image";

  return (
    <div className="flex items-center gap-6 rounded-2xl border p-5">
      <img
        src={image}
        alt={item.product.name}
        className="h-28 w-28 rounded-xl object-cover"
      />

      <div className="flex-1">
        <h2 className="text-xl font-semibold">{item.product.name}</h2>

        <p className="mt-1 text-gray-500">₹{item.product.price}</p>

        <p className="mt-1 text-sm text-gray-500">
          Farmer: {item.product.farmer.name}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={decrease} className="rounded-lg border p-2">
          <Minus size={18} />
        </button>

        <span className="w-8 text-center">{item.quantity}</span>

        <button onClick={increase} className="rounded-lg border p-2">
          <Plus size={18} />
        </button>
      </div>

      <button onClick={remove} className="text-red-500 hover:text-red-700">
        <Trash2 size={22} />
      </button>
    </div>
  );
}

export default CartItem;
