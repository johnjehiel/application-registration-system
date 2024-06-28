import { useSelector } from 'react-redux';
import {Navigate} from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProtectedRoute ({children, allowedRoles}) {
    const { isAuthenticated, loading, user } = useSelector(state => state.authState)

    if(!isAuthenticated && !loading) {
        return <Navigate to="/login" />
    }

    if(isAuthenticated) {
        if(!allowedRoles.includes(user.role)) {
            return <Navigate to="/" />
        }
        return children;
    }

    if(loading) {
        return <LoadingSpinner/>
    }   
}