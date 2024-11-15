import ProtectedRoute from '../components/ProtectedRoute';

const Dashboard: React.FC = () => {
  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome to your dashboard! Only logged-in users can see this.</p>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
