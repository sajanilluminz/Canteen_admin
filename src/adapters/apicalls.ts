import {ISuggestion, updateSuggestions} from '~state/suggestionSlice';
import {Routes} from '~utils/routes';
import {PatchApiCall} from './ApiManager';
import CanteenEndpoins from './CanteenEndpoins';

export const acceptOrRejectSuggestion = async ({
  productId,
  token,
  status,
  reason,
  dispatch,
  setLoadingState,
  toast,
}: {
  productId: string;
  token: string;
  status: 'accept' | 'reject';
  reason?: string;
  setLoadingState?: any;
  dispatch: any;
  toast: any;
}) => {
  setLoadingState(true);
  const acceptedAxiosArgs = {
    productId: productId,
    productStatus: 1,
  };
  const rejectedAxiosArgs = {
    productId: productId,
    productStatus: 2,
    reason: reason,
  };
  let headers = {Authorization: `Bearer ${token}`};
  return await PatchApiCall({
    url: CanteenEndpoins.acceptOrRejectSuggestion,
    data: status === 'accept' ? acceptedAxiosArgs : rejectedAxiosArgs,
    headers,
  })
    .then(response => {
      var res = response.data.data;
      var obj: ISuggestion = {
        name: res?.name,
        price: res?.price,
        productStatus: res?.productStatus,
        reason: res?.reason,
        userName: res?.user.name,
        suggestionId: res?._id,
      };
      dispatch(updateSuggestions(obj));
      setLoadingState(false);
      toast.show(
        status === 'accept' ? 'Suggestion accepted' : 'Suggestion rejected',
        {
          type: 'green',
        },
      );
      toast.hideAll();
    })
    .catch(error => {
      console.log(error);

      setLoadingState(false);
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
