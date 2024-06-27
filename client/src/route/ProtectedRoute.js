import { useSelector } from 'react-redux';
import {Navigate} from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProtectedRoute ({children, allowedRoles}) {
    const { isAuthenticated, loading, user } = useSelector(state => state.authState)

    if(!isAuthenticated && !loading) {
        // console.log("loading");
        return <Navigate to="/login" />
    }

    if(isAuthenticated) {
        if(!allowedRoles.includes(user.role)) {
            // console.log("notallowed");
            return <Navigate to="/" />
        }
        // console.log("allowed");
        return children;
    }

    if(loading) {
        return <LoadingSpinner/>
    }   
}