
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

const CurrentUser = () => {
  const { user, token } = useSelector(state => state.auth);

  console.log('Token:', token);
  console.log('Current User:', user);

  if (!user) {
    return <p className="text-center mt-5">No user logged in</p>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Current User Information</h2>
      <div className="card">
        <div className="card-body">
          <ul className="list-group">
            <li className="list-group-item"><strong>ID:</strong> {user.id}</li>
            <li className="list-group-item"><strong>Name:</strong> {user.name}</li>
            <li className="list-group-item"><strong>Username:</strong> {user.username}</li>
            <li className="list-group-item"><strong>Email:</strong> {user.email}</li>
            <li className="list-group-item"><strong>Phone Number:</strong> {user.phoNo}</li>
            <li className="list-group-item"><strong>Roles:</strong> {user.roles.map(role => role.name).join(', ')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CurrentUser;
