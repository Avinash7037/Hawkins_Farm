function PaymentMethod({ register }) {
  return (
    <div className="rounded-2xl border p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">Payment Method</h2>

      <label className="flex items-center gap-3">
        <input
          type="radio"
          value="ONLINE"
          defaultChecked
          {...register("paymentMethod")}
        />
        Online Payment (Razorpay)
      </label>
    </div>
  );
}

export default PaymentMethod;
