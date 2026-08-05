import Input from "../../../components/common/Input";

function DeliveryForm({ register, errors }) {
  return (
    <div className="rounded-2xl border p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold">Delivery Address</h2>

      <Input
        label="Delivery Address"
        name="deliveryAddress"
        placeholder="Enter your complete address"
        register={register}
        error={errors.deliveryAddress}
      />
    </div>
  );
}

export default DeliveryForm;
