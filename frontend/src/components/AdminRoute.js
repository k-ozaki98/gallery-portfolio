function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !user.is_admin) {
    return <Navigate to="/" />;
  }

  return children;
}
