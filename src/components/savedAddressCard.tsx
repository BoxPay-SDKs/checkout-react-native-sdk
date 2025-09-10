import type { FetchSavedAddress } from "../interface"
import { View, Text, Pressable, Image, TouchableOpacity } from 'react-native';
import { formatAddress } from "../utils/stringUtils";
import styles from "../styles/components/savedAddressCardStyles";
import { userDataHandler } from "../sharedContext/userdataHandler";


interface SavedAddressComponentArgs {
    savedAddressList : FetchSavedAddress[],
    onClickAddress : (savedAddress : FetchSavedAddress) => void,
    onClickOtherOptions : (savedAddress : FetchSavedAddress) => void
}


const SavedAddressComponent = ({savedAddressList, onClickAddress, onClickOtherOptions} : SavedAddressComponentArgs) => {
    const {userData} = userDataHandler

    return(
        <View style={{ paddingBottom: 12, paddingHorizontal:16 }}>
            {savedAddressList.map((address) => (
        <View key={address.addressRef}>
          <SavedAddressCard
          isSelected={
            address.labelName
              ? address.labelName === userData.labelName
              : address.labelType === userData.labelType
          }
          labelName = {address.labelName ? address.labelName : address.labelType}
          labelType = {address.labelType}
          address = {formatAddress({
            address1 : address.address1,
            address2: address.address2,
            city : address.city,
            state : address.state,
            postalCode : address.postalCode,
            countryCode : address.countryCode,
            labelName : address.labelName,
            labelType : address.labelType
          })}
          onClickOtherOptions = {()=> {
            onClickOtherOptions(address)
          }}
          onClickAddress = {()=> onClickAddress(address)}
          phone= {address.phoneNumber}
          />
          <View
            style={{
              flexDirection: 'row',
              height: 1,
              backgroundColor: '#ECECED',
            }}
          />
        </View>
      ))}
        </View>
    )

}

interface SavedAddressCardArgs {
    isSelected : boolean,
    labelName : string,
    labelType : string,
    address : string,
    phone : string,
    onClickOtherOptions : () => void,
    onClickAddress : () => void,
}

const SavedAddressCard = ({isSelected, labelType, address, onClickAddress, onClickOtherOptions, labelName, phone}: SavedAddressCardArgs) => {

  const icons = {
    home: require('../../assets/images/ic_home.png'),
    work: require('../../assets/images/ic_work.png'),
    other: require('../../assets/images/ic_other.png'),
  };
  const addressIcon =
    icons[labelType.toLowerCase() as keyof typeof icons] || icons.other;
  return (
        <Pressable style={[styles.card, isSelected && styles.cardSelected]} onPress={onClickAddress}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={[styles.labelContainer, {marginBottom:10}]}>
        <Image
            source={addressIcon}
            style={styles.imageStyle}
        />
          <Text style={styles.labelName}>{labelName}</Text>

          {isSelected && (
            <View style={styles.selectedTag}>
              <Text style={styles.selectedTagText}>CURRENTLY SELECTED</Text>
            </View>
          )}
        </View>

        {/* More options */}
        <TouchableOpacity onPress={onClickOtherOptions}>
        <Image
            source={require('../../assets/images/ic_more.png')}
            style={styles.imageStyle}
        />
        </TouchableOpacity>
      </View>

      {/* Address */}
      <Text style={styles.addressText}>{address}</Text>
      <Text style = {styles.addressText}>Mobile: {phone}</Text>
    </Pressable>
    )
}

export default SavedAddressComponent
