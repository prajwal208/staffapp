import { StyleSheet, Text, View } from 'react-native';

import { GradientFill } from '@/components/gradient';
import { Colors } from '@/constants/theme';

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
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Production flow</Text>
        <View style={styles.percentBadge}>
          <Text style={styles.percentText}>{progressPercent}% complete</Text>
        </View>
      </View>
      <View style={styles.track}>
        {steps.map((step, index) => {
          const isReached = index <= activeIndex;
          return (
            <View key={`${step}-${index}`} style={styles.segmentWrap}>
              <View style={styles.segment}>{isReached ? <GradientFill /> : null}</View>
              {step ? (
                <Text style={[styles.stepLabel, isReached && styles.stepLabelActive]}>
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
  card: {
    marginHorizontal: 18,
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.line,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.purple,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  percentBadge: {
    backgroundColor: Colors.orangeTint,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  percentText: {
    color: Colors.orange,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  track: {
    flexDirection: 'row',
    gap: 6,
  },
  segmentWrap: {
    flex: 1,
    gap: 8,
  },
  segment: {
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.line,
    overflow: 'hidden',
  },
  stepLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.faint,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: Colors.ink,
  },
});
