import { SymbolView } from 'expo-symbols';
import { StyleSheet, Text, View } from 'react-native';

import { Brand, Spacing } from '@/constants/theme';
import { getStatusColor } from '@/utils/order';

type Props = {
  customerName: string;
  orderType: string;
  category?: string;
  deliveryDate: string;
  statusLabel: string;
  statusColor?: string;
};

export function CustomerInfoCard({
  customerName,
  orderType,
  category,
  deliveryDate,
  statusLabel,
  statusColor,
}: Props) {
  const dotColor = getStatusColor(statusColor ?? 'green');

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.nameBlock}>
          <Text style={styles.label}>CUSTOMER NAME</Text>
          <Text style={styles.name}>{customerName}</Text>
          <Text style={styles.orderType}>{orderType}</Text>
        </View>
        {category ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{category.toUpperCase()}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>EXPECTED DATE</Text>
          <View style={styles.metaValueRow}>
            <SymbolView
              name={{ ios: 'calendar', android: 'calendar_today', web: 'calendar_today' }}
              size={14}
              tintColor="rgba(255,255,255,0.85)"
            />
            <Text style={styles.metaValue}>{deliveryDate}</Text>
          </View>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>ORDER STATUS</Text>
          <View style={styles.metaValueRow}>
            <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
            <Text style={styles.metaValue}>{statusLabel}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Brand.blueDark,
    borderRadius: 16,
    padding: Spacing.three,
    marginHorizontal: Spacing.three,
    marginTop: Spacing.three,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  nameBlock: { flex: 1 },
  label: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  name: {
    color: Brand.white,
    fontSize: 26,
    fontWeight: '700',
  },
  orderType: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    marginTop: 4,
  },
  badge: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    borderRadius: 6,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
  },
  badgeText: {
    color: Brand.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: Spacing.three,
    gap: Spacing.three,
  },
  metaItem: { flex: 1 },
  metaLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  metaValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaValue: {
    color: Brand.white,
    fontSize: 14,
    fontWeight: '600',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
