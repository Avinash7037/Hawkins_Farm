function PaymentMethod({ register, selectedMethod }) {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>

      <p className="mt-1 text-sm text-gray-500">
        Choose how you want to pay for your order.
      </p>

      <div className="mt-5 space-y-4">
        {/* =================================================
            Online Payment
        ================================================= */}

        <label
          className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition ${
            selectedMethod === "ONLINE"
              ? "border-emerald-500 bg-emerald-50"
              : "border-gray-200 hover:border-emerald-300"
          }`}
        >
          <input
            type="radio"
            value="ONLINE"
            {...register("paymentMethod", {
              required: "Please select a payment method",
            })}
            className="mt-1 h-5 w-5 accent-emerald-600"
          />

          <div>
            <p className="font-semibold text-gray-900">💳 Online Payment</p>

            <p className="mt-1 text-sm text-gray-500">
              Pay securely using Razorpay.
            </p>
          </div>
        </label>

        {/* =================================================
            Cash On Delivery
        ================================================= */}

        <label
          className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition ${
            selectedMethod === "COD"
              ? "border-emerald-500 bg-emerald-50"
              : "border-gray-200 hover:border-emerald-300"
          }`}
        >
          <input
            type="radio"
            value="COD"
            {...register("paymentMethod", {
              required: "Please select a payment method",
            })}
            className="mt-1 h-5 w-5 accent-emerald-600"
          />

          <div>
            <p className="font-semibold text-gray-900">💵 Cash on Delivery</p>

            <p className="mt-1 text-sm text-gray-500">
              Pay in cash when your order is delivered.
            </p>
          </div>
        </label>
      </div>
    </section>
  );
}

export default PaymentMethod;
