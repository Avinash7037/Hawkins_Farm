function Loader() {
  return (
    <div className="flex items-center justify-center py-10">
      <div
        className="
          h-10
          w-10
          animate-spin
          rounded-full
          border-4
          border-green-600
          border-t-transparent
          dark:border-green-500
          dark:border-t-transparent
        "
      />
    </div>
  );
}

export default Loader;
