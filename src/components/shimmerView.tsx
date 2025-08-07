import { View } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

const shimmerHeights = [
  { height: 90, marginTop: 10 },
  { height: 50, marginTop: 30 },
  { height: 50, marginTop: 25 },
  { height: 50, marginTop: 25 },
  { height: 50, marginTop: 25 },
];

const ShimmerView = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {shimmerHeights.map((item, index) => (
        <ShimmerPlaceHolder
          key={index}
          visible={false}
          style={{
            width: '100%',
            height: item.height,
            borderRadius: item.height === 90 ? 0 : 10,
            marginTop: item.marginTop,
          }}
        />
      ))}
    </View>
  );
};

export default ShimmerView;
