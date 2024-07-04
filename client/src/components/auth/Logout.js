import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import LoadingSpinner from "../LoadingSpinner";
import {useDispatch, useSelector} from 'react-redux';
import { logout } from '../../actions/userActions';

const Logout = () => {
  const { loading } = useSelector(state => state.authState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      dispatch(logout);
      setIsLoading(false);
      toast.success("Logged Out Successfully")
      navigate("/login", { replace: true } )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (<>
     {(isLoading || loading) ? <LoadingSpinner /> : null}
        </>
  )
}

export default Logout;