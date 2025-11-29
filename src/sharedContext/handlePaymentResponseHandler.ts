import { type HandleFetchStatusOptions, type HandlePaymentOptions, type PaymentClass, type RecommendedInstruments, APIStatus, TransactionStatus } from "../interface";
import { transformAndFilterList } from '../utility';
import Toast from 'react-native-toast-message'
import fetchPaymentMethods from '../postRequest/fetchPaymentMethods';
import fetchRecommendedInstruments from "../postRequest/fetchRecommendedInstruments";

export function handlePaymentResponse({
    response,
    upiId,
    checkoutDetailsErrorMessage,
    onSetStatus,
    onSetTransactionId,
    onSetPaymentUrl,
    onSetPaymentHtml,
    onSetFailedMessage,
    onShowFailedModal,
    onShowSuccessModal,
    onShowSessionExpiredModal,
    onNavigateToTimer,
    onOpenQr,
    onOpenUpiIntent, 
    setLoading
  }: HandlePaymentOptions) {
    switch(response.apiStatus) {
        case APIStatus.Success: {
            const apidata = response.data
            const { status, reason, reasonCode } = apidata.status;
            const actionsArray = apidata.actions || [];
            const txnStatus = status.toUpperCase() as TransactionStatus;
  
            onSetStatus(status);
            onSetTransactionId(apidata.transactionId);
        
            switch (txnStatus) {
                case TransactionStatus.RequiresAction: {
                    if (actionsArray.length > 0) {
                        const action = actionsArray[0];
            
                        switch (action.type) {
                        case 'html':
                            if (action.htmlPageString && onSetPaymentHtml) {
                                onSetPaymentHtml(action.htmlPageString);
                            }
                            break;
            
                        case 'redirect':
                            if (action.url && onSetPaymentUrl) {
                                onSetPaymentUrl(action.url);
                            }
                            break;
            
                        case 'appRedirect':
                            if (action.url && onOpenUpiIntent) {
                                onOpenUpiIntent(action.url); // 👈 launch UPI intent
                            }
                            break;
                            
                        case 'qrCode' : 
                            if(action.content && onOpenQr) {
                                onOpenQr(action.content)
                                setLoading(false);
                            }
                            break
            
                        default:
                            break;
                        }
                    } else {
                        setLoading(false);
                        if (upiId && onNavigateToTimer) {
                            onNavigateToTimer(upiId);
                        }
                    }
                    break;
                }
                case TransactionStatus.Failed:
                case TransactionStatus.Rejected: {
                    const fallback = checkoutDetailsErrorMessage;
                    const errorMessage =
                        reasonCode?.startsWith('UF')
                        ? reason?.includes(':')
                            ? reason.split(':')[1]?.trim() ?? fallback
                            : reason ?? fallback
                        : fallback;
            
                        if(onSetFailedMessage && onShowFailedModal) {
                    onSetFailedMessage(errorMessage);
                    onSetFailedMessage(errorMessage);
                    onSetStatus(TransactionStatus.Failed);
                            onSetFailedMessage(errorMessage);
                    onSetStatus(TransactionStatus.Failed);
                            onShowFailedModal();
                        }
                        setLoading(false);
                        break;
        
                }
                case TransactionStatus.Approved:
                case TransactionStatus.Success:
                case TransactionStatus.Paid: {
                    if(onShowSuccessModal) {
                        onShowSuccessModal(apidata.transactionTimestampLocale ?? '');
                    }
                    setLoading(false);
                    break;
                }
        
                case TransactionStatus.Expired:{
                    if(onShowSessionExpiredModal) {
                        onShowSessionExpiredModal();
                    }
                    setLoading(false);
                    break;
                }
        
                default:
                   { 
                    break;}
            }
        }
        break;
        case APIStatus.Failed : {
            if(onSetFailedMessage && onShowFailedModal) {
                onSetFailedMessage(response.data.status.reason);
                onShowFailedModal();
            }
            onSetStatus(TransactionStatus.Failed);
            setLoading(false);
        }
    }
}

export function handleFetchStatusResponseHandler({
    response,
    checkoutDetailsErrorMessage,
    onSetStatus,
    onSetTransactionId,
    onSetFailedMessage,
    onShowFailedModal,
    onShowSuccessModal,
    onShowSessionExpiredModal,
    setLoading,
    stopBackgroundApiTask,
    isFromUPIIntentFlow
} : HandleFetchStatusOptions) {
    switch(response.apiStatus) {
        case APIStatus.Success: {
            const apidata = response.data
            const status = apidata.status;
            const reasonCode = apidata.reasonCode
            const reason = apidata.reason
            const txnStatus = status.toUpperCase() as TransactionStatus;
  
            onSetStatus(status);
            onSetTransactionId(apidata.transactionId);
        
            switch (txnStatus) {
                case TransactionStatus.Failed:
                case TransactionStatus.Rejected:
                    {const fallback = checkoutDetailsErrorMessage;
                    const errorMessage =
                        reasonCode?.startsWith('UF')
                        ? reason?.includes(':')
                            ? reason.split(':')[1]?.trim() ?? fallback
                            : reason ?? fallback
                        : fallback;
            
                    onSetFailedMessage(errorMessage);
                    onSetStatus(TransactionStatus.Failed);
                    onShowFailedModal();
                    stopBackgroundApiTask?.();
                    setLoading?.(false);
                    break;}
        
                case TransactionStatus.Approved:
                case TransactionStatus.Success:
                case TransactionStatus.Paid:
                    {onSetStatus(TransactionStatus.Success);
                    onShowSuccessModal(apidata.transactionTimestampLocale ?? '');
                    stopBackgroundApiTask?.();
                    setLoading?.(false);
                    break;}
        
                case TransactionStatus.Expired:
                    {onSetStatus(TransactionStatus.Expired);
                    onShowSessionExpiredModal();
                    stopBackgroundApiTask?.();
                    setLoading?.(false);
                    break;}
        
                default:
                    {
                        if(isFromUPIIntentFlow) {
                            const fallback = checkoutDetailsErrorMessage;
                    const errorMessage =
                        reasonCode?.startsWith('UF')
                        ? reason?.includes(':')
                            ? reason.split(':')[1]?.trim() ?? fallback
                            : reason ?? fallback
                        : fallback;
            
                    onSetFailedMessage(errorMessage);
                    onSetStatus(TransactionStatus.Failed);
                    onShowFailedModal();
                    stopBackgroundApiTask?.();
                    setLoading?.(false);
                        }
                    break;
                    }
            }
        }
        break;
        case APIStatus.Failed : {
            onSetFailedMessage(response.data.status.reason);
            onSetStatus(TransactionStatus.Failed);
            onShowFailedModal();
            setLoading?.(false);
        }
    }
}

interface fetchPaymentMethodHandlerArgs {
    paymentType : string,
    setList : (list:PaymentClass[]) => void
}

export async function fetchPaymentMethodHandler({
    paymentType,
    setList
}:fetchPaymentMethodHandlerArgs) {
    const response = await fetchPaymentMethods();
      
      switch (response.apiStatus) {
        case APIStatus.Success: {
          const paymentMethodList = transformAndFilterList(response.data, paymentType);
          setList(paymentMethodList);
          break;
        }
  
        case APIStatus.Failed: {
          Toast.show({
            type: 'error',
            text1: 'Oops!',
            text2: 'Something went wrong. Please try again.',
          });
          break;
        }
  
        default:
          break;
      }
}

interface fetchSavedInstrumentsArgs {
    setRecommendedList : (list:PaymentClass[]) => void,
    setUpiInstrumentList : (list : PaymentClass[]) => void,
    setCardInstrumentList : (list : PaymentClass[]) => void
}


export async function fetchSavedInstrumentsHandler({setRecommendedList, setUpiInstrumentList, setCardInstrumentList} : fetchSavedInstrumentsArgs) {
    const response = await fetchRecommendedInstruments()
    switch(response.apiStatus) {
        case APIStatus.Success : {
            const instrumentList = response.data
            const upiList : PaymentClass[] = []
            const cardList : PaymentClass[] = []
            instrumentList.forEach((instrument: RecommendedInstruments) => {
                const item: PaymentClass = {
                  type: instrument.type,
                  id: instrument.instrumentRef,
                  displayName: instrument.cardNickName ? instrument.cardNickName : '',
                  displayValue: instrument.displayValue,
                  iconUrl: instrument.logoUrl ? instrument.logoUrl : '///',
                  instrumentTypeValue: instrument.instrumentRef,
                  isSelected: false,
                };
              
                if (instrument.type.toLowerCase() === 'upi') {
                  upiList.push(item);
                } else if (instrument.type.toLowerCase() === 'card') {
                  cardList.push(item);
                }
            });
            setRecommendedList(upiList.slice(0, 2));
            setUpiInstrumentList(upiList)
            setCardInstrumentList(cardList)
            break
        }
        case APIStatus.Failed: {
            Toast.show({
                type: 'error',
                text1: 'Oops!',
                text2: 'Something went wrong. Please try again.',
            });
            break;
        }
        default:
          break;
    }
}