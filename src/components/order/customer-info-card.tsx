import { StyleSheet, Text, View } from 'react-native';

import { GradientFill } from '@/components/gradient';
import { Icon } from '@/components/icon';
import { Shadow } from '@/constants/theme';
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
      <View style={styles.clip}>
        <GradientFill from={{ x: 0, y: 0 }} to={{ x: 1, y: 1 }} />
      </View>
      <View style={styles.topRow}>
        <View style={styles.nameBlock}>
          <Text style={styles.label}>Customer name</Text>
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
          <Text style={styles.metaLabel}>Expected date</Text>
          <View style={styles.metaValueRow}>
            <Icon name="calendar" size={14} color="#FFFFFF" />
            <Text style={styles.metaValue}>{deliveryDate}</Text>
          </View>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Order status</Text>
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
    borderRadius: 28,
    padding: 20,
    marginHorizontal: 18,
    marginTop: 8,
    backgroundColor: '#FF308C',
    ...Shadow.glow,
  },
  clip: {
    ...StyleSheet.absoluteFill,
    borderRadius: 28,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  nameBlock: { flex: 1 },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  orderType: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 18,
    gap: 10,
  },
  metaItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  metaLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  metaValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    flexShrink: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
});
