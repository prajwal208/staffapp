import { StyleSheet, Text, View } from 'react-native';

import { Brand, Spacing } from '@/constants/theme';

type Props = {
  previousStatus: string;
  currentStatus: string;
};

function buildSteps(previousStatus: string, currentStatus: string) {
  const steps = [previousStatus, currentStatus].filter(Boolean);
  const unique = steps.filter((step, index) => steps.indexOf(step) === index);
  while (unique.length < 4) {
    unique.push('');
  }
  return unique.slice(0, 4);
}

export function ProductionFlowSection({ previousStatus, currentStatus }: Props) {
  const steps = buildSteps(previousStatus, currentStatus);
  const activeIndex = Math.max(steps.indexOf(currentStatus), 1);
  const progressPercent = Math.round(((activeIndex + 1) / steps.length) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>PRODUCTION FLOW</Text>
        <View style={styles.percentBadge}>
          <Text style={styles.percentText}>{progressPercent}% COMPLETE</Text>
        </View>
      </View>
      <View style={styles.track}>
        {steps.map((step, index) => {
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;
          return (
            <View key={`${step}-${index}`} style={styles.segmentWrap}>
              <View
                style={[
                  styles.segment,
                  isCompleted && styles.segmentCompleted,
                  isActive && styles.segmentActive,
                ]}
              />
              {step ? (
                <Text style={[styles.stepLabel, (isCompleted || isActive) && styles.stepLabelActive]}>
                  {step.toUpperCase()}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.three,
    marginTop: Spacing.four,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: Brand.textMuted,
    letterSpacing: 0.8,
  },
  percentBadge: {
    backgroundColor: Brand.blueLight,
    borderRadius: 12,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
  },
  percentText: {
    color: Brand.blueAccent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  track: {
    flexDirection: 'row',
    gap: 6,
  },
  segmentWrap: {
    flex: 1,
    gap: 6,
  },
  segment: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Brand.borderLight,
  },
  segmentCompleted: {
    backgroundColor: Brand.blueDark,
  },
  segmentActive: {
    backgroundColor: Brand.blueAccent,
  },
  stepLabel: {
    fontSize: 8,
    fontWeight: '600',
    color: Brand.textMuted,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: Brand.blueDark,
  },
});
