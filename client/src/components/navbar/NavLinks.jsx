import { NavLink } from "react-router-dom";

const links = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Marketplace",
    path: "/products",
  },
  {
    name: "About",
    path: "/about",
  },
];

function NavLinks({ mobile = false, onClick }) {
  return (
    <>
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          onClick={onClick}
          className={({ isActive }) =>
            `${mobile ? "block py-3" : ""}
            font-medium
            transition
            ${
              isActive
                ? "text-emerald-600"
                : "text-gray-700 hover:text-emerald-600"
            }`
          }
        >
          {link.name}
        </NavLink>
      ))}
    </>
  );
}

export default NavLinks;
