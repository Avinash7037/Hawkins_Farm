function Navbar() {
  return (
    <nav className="bg-green-700 text-white px-8 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hawkins Farm 🌾</h1>

        <ul className="flex gap-8">
          <li className="cursor-pointer hover:text-green-200">Home</li>
          <li className="cursor-pointer hover:text-green-200">Products</li>
          <li className="cursor-pointer hover:text-green-200">Login</li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
