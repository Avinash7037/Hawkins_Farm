import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

// =====================================================
// Base Links
// =====================================================

const baseLinks = [
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

// =====================================================
// Role-Based Links
// =====================================================

const getRoleLinks = (role) => {
  switch (role) {
    // =================================================
    // Buyer
    // =================================================

    case "buyer":
      return [
        {
          name: "Dashboard",
          path: "/buyer",
        },
        {
          name: "Cart",
          path: "/cart",
        },
        {
          name: "Orders",
          path: "/orders",
        },
        {
          name: "Messages",
          path: "/chat",
        },
      ];

    // =================================================
    // Farmer
    // =================================================

    case "farmer":
      return [
        {
          name: "Dashboard",
          path: "/farmer/dashboard",
        },
        {
          name: "Products",
          path: "/farmer/products",
        },
        {
          name: "Orders",
          path: "/farmer/orders",
        },
        {
          name: "Messages",
          path: "/farmer/messages",
        },
      ];

    // =================================================
    // Admin
    // =================================================

    case "admin":
      return [
        {
          name: "Admin Dashboard",
          path: "/admin/dashboard",
        },
        {
          name: "Users",
          path: "/admin/users",
        },
        {
          name: "Products",
          path: "/admin/products",
        },
        {
          name: "Orders",
          path: "/admin/orders",
        },
        {
          name: "Reviews",
          path: "/admin/reviews",
        },
      ];

    // =================================================
    // Default
    // =================================================

    default:
      return [];
  }
};

// =====================================================
// Navigation Links
// =====================================================

function NavLinks({ mobile = false, onClick }) {
  const { user } = useSelector((state) => state.auth);

  const roleLinks = getRoleLinks(user?.role);

  const links = [...baseLinks, ...roleLinks];

  return (
    <>
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          onClick={onClick}
          className={({ isActive }) =>
            `
              ${mobile ? "block py-3" : ""}
              font-medium
              transition
              ${
                isActive
                  ? "text-emerald-600"
                  : "text-gray-700 hover:text-emerald-600"
              }
            `
          }
        >
          {link.name}
        </NavLink>
      ))}
    </>
  );
}

export default NavLinks;
