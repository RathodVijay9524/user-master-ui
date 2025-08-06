import { useSelector } from "react-redux";

// src/components/AdminHome.js
const AdminHome = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <div>
      <h2>Welcome to the Admin Dashboard </h2>
      <p>Welcome to {user.name}</p>
      <p>This is the home page for the Admin. You can manage users, view reports, and more.</p>

    </div>
  );
};

export default AdminHome;
