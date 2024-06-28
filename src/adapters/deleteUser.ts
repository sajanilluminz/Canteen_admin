import axios from 'axios';
import {deleteAUser} from '~state/getUsers';
import CanteenEndpoins from './CanteenEndpoins';

export const deleteUser = async ({
  token,
  userId,
  toast,
  setLoading,
  dispatch,
}: {
  token: string;
  userId: string;
  toast: any;
  dispatch: any;
  setLoading: any;
}) => {
  setLoading(true);
  let headers = {Authorization: `Bearer ${token}`};
  var data = {
    userId: userId,
  };
  var config = {
    data: data,
    headers: headers,
  };
  return await axios
    .delete(CanteenEndpoins.deleteUser, config)
    .then(response => {
      setLoading(false);
      toast.show('User deleted Sucessfully', {
        type: 'green',
      });
      dispatch(deleteAUser(userId));
    })
    .catch(error => {
      setLoading(false);
      if (error?.response) {
        toast.show(`${error?.response?.data?.message}`, {
          type: 'error',
        });
      } else {
        toast.show(`${error.message}`, {
          type: 'error',
        });
      }
      toast.hideAll();
    });
};
