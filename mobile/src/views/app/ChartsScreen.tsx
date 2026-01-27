import React, { useContext, useMemo } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import AppText from "../../components/AppText";
import Card from "../../components/Card";
import { spacing } from "../../theme/colors";
import { TransactionsContext } from "../../store/transactions";
import { formatMoney } from "../../utils/money";
import { scaleHeight } from "../../constants/size";
import { ThemeContext } from "../../store/theme";
import Svg, { Circle, Rect, Text as SvgText } from "react-native-svg";
import { ProfileContext } from "../../store/profile";

const { width } = Dimensions.get("window");

function monthKey(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
}

function monthLabel(d: Date) {
  // short month label: Jan, Feb...
  return d.toLocaleString("en-US", { month: "short" });
}

export default function ChartsScreen() {
  const { items } = useContext(TransactionsContext);
  const { colors } = useContext(ThemeContext);
  const { currency } = useContext(ProfileContext);

  const categoryData = useMemo(() => {
    const expenses = items.filter((t) => t.amount < 0);
    const categories: Record<string, number> = {};

    expenses.forEach((t) => {
      const cat = t.category || "Other";
      categories[cat] = (categories[cat] || 0) + Math.abs(t.amount);
    });

    const total = Object.values(categories).reduce((a, b) => a + b, 0);

    return Object.entries(categories)
      .map(([name, value]) => ({
        name,
        value,
        percentage: total > 0 ? (value / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [items]);

  // ✅ Real-time monthly totals (last 6 months)
  const monthlyData = useMemo(() => {
    const now = new Date();

    // Prepare last 6 months (oldest -> newest)
    const buckets = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return { key: monthKey(d), month: monthLabel(d), income: 0, expense: 0 };
    });

    const idx = new Map<string, number>();
    buckets.forEach((b, i) => idx.set(b.key, i));

    items.forEach((tx) => {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(tx.dateISO);
      if (!m) return;
      const key = `${m[1]}-${m[2]}`;

      const i = idx.get(key);
      if (i === undefined) return;

      if (tx.amount >= 0) buckets[i].income += tx.amount;
      else buckets[i].expense += Math.abs(tx.amount);
    });

    return buckets;
  }, [items]);

  const chartColors = ["#DBFF00", "#4DFF88", "#00D9FF", "#FF4D4D", "#FF9D00"];

  const renderPieChart = () => {
    const size = width - 80;
    const center = size / 2;
    const radius = size / 2 - 20;
    let currentAngle = -90;

    if (categoryData.length === 0) {
      return (
        <View style={{ height: size, justifyContent: "center", alignItems: "center" }}>
          <AppText muted>No expense data</AppText>
        </View>
      );
    }

    return (
      <Svg width={size} height={size}>
        {categoryData.map((item, index) => {
          const angle = (item.percentage / 100) * 360;
          const startAngle = currentAngle;

          // advance angle for next slice
          currentAngle += angle;

          // A ring-style pie (strokeDasharray trick)
          const circumference = 2 * Math.PI * radius;
          const sliceLen = (item.percentage / 100) * circumference;
          const offset = -((startAngle + 90) / 360) * circumference;

          return (
            <Circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={chartColors[index % chartColors.length]}
              strokeWidth={40}
              strokeDasharray={`${sliceLen} ${circumference}`}
              strokeDashoffset={offset}
            />
          );
        })}
      </Svg>
    );
  };

  const renderBarChart = () => {
    const chartHeight = 200;
    const chartWidth = width - 80;
    const barWidth = (chartWidth / monthlyData.length) / 2.5;

    const maxValueRaw = Math.max(...monthlyData.flatMap((d) => [d.income, d.expense]));
    const maxValue = maxValueRaw > 0 ? maxValueRaw : 1;

    if (monthlyData.every((d) => d.income === 0 && d.expense === 0)) {
      return (
        <View style={{ height: chartHeight, justifyContent: "center", alignItems: "center" }}>
          <AppText muted>No monthly data yet</AppText>
        </View>
      );
    }

    return (
      <View>
        <Svg width={chartWidth} height={chartHeight}>
          {monthlyData.map((data, index) => {
            const x = (index * chartWidth) / monthlyData.length + 10;
            const incomeHeight = (data.income / maxValue) * (chartHeight - 40);
            const expenseHeight = (data.expense / maxValue) * (chartHeight - 40);

            return (
              <React.Fragment key={index}>
                <Rect
                  x={x}
                  y={chartHeight - incomeHeight - 20}
                  width={barWidth}
                  height={incomeHeight}
                  fill={colors.success}
                  rx={4}
                />
                <Rect
                  x={x + barWidth + 4}
                  y={chartHeight - expenseHeight - 20}
                  width={barWidth}
                  height={expenseHeight}
                  fill={colors.danger}
                  rx={4}
                />
                <SvgText x={x + barWidth} y={chartHeight - 5} fill={colors.muted} fontSize="10" textAnchor="middle">
                  {data.month}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
            <AppText style={{ fontSize: 12, color: colors.muted }}>Income</AppText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
            <AppText style={{ fontSize: 12, color: colors.muted }}>Expense</AppText>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={[styles.wrap, { backgroundColor: colors.bg }]} showsVerticalScrollIndicator={false}>
      <AppText style={styles.title}>Analytics</AppText>

      <Card elevated style={{ marginTop: 20 }}>
        <AppText style={{ fontWeight: "800", fontSize: 16, marginBottom: 20 }}>Expense by Category</AppText>
        {renderPieChart()}

        <View style={{ marginTop: 20 }}>
          {categoryData.map((item, index) => (
            <View key={index} style={styles.categoryRow}>
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <View style={[styles.colorDot, { backgroundColor: chartColors[index % chartColors.length] }]} />
                <AppText style={{ fontSize: 14 }}>{item.name}</AppText>
              </View>

              <AppText mono style={{ fontWeight: "700", fontSize: 14 }}>
                {formatMoney(item.value, currency)}
              </AppText>

              <AppText muted style={{ fontSize: 12, width: 50, textAlign: "right" }}>
                {item.percentage.toFixed(1)}%
              </AppText>
            </View>
          ))}
        </View>
      </Card>

      <Card elevated style={{ marginTop: 20 }}>
        <AppText style={{ fontWeight: "800", fontSize: 16, marginBottom: 20 }}>Monthly Overview</AppText>
        {renderBarChart()}
      </Card>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: spacing.lg,
    marginTop: scaleHeight(50),
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
