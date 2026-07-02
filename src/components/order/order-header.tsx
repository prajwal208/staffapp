import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DefaultAvatar } from '@/components/order/default-avatar';
import { Brand, Spacing } from '@/constants/theme';

type Props = {
  customerName: string;
  billNo?: string | number;
  orderNumber: string | number;
  deliveryDate: string;
  orderType: string;
  customerImageUri?: string;
  onBack?: () => void;
};

export function OrderHeader({
  customerName,
  billNo,
  orderNumber,
  deliveryDate,
  orderType,
  customerImageUri,
  onBack,
}: Props) {
  const [imageError, setImageError] = useState(false);
  const showDefaultAvatar = !customerImageUri || imageError;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {onBack ? (
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <Text style={styles.customerName}>{customerName}</Text>
        {showDefaultAvatar ? (
          <DefaultAvatar />
        ) : (
          <Image
            source={{ uri: customerImageUri }}
            style={styles.avatar}
            contentFit="cover"
            onError={() => setImageError(true)}
          />
        )}
      </View>
      <View style={styles.meta}>
        {billNo != null ? <Text style={styles.metaText}>Bill No : {billNo}</Text> : null}
        <Text style={styles.metaText}>Order Number : {orderNumber}</Text>
        <Text style={styles.metaText}>Date of Delivery : {deliveryDate}</Text>
        <Text style={styles.metaText}>Order Type : {orderType}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Brand.blue, paddingHorizontal: Spacing.three, paddingBottom: Spacing.four, paddingTop: Spacing.two },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  backButton: { padding: Spacing.one },
  backPlaceholder: { width: 32 },
  backIcon: { color: Brand.white, fontSize: 24, fontWeight: '600' },
  customerName: { flex: 1, color: Brand.white, fontSize: 26, fontWeight: '700' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: Brand.white },
  meta: { marginTop: Spacing.two, gap: 4 },
  metaText: { color: Brand.white, fontSize: 14, opacity: 0.95 },
});
