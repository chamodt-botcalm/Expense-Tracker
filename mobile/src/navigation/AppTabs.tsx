import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/app/HomeScreen';
import TransactionsScreen from '../screens/app/TransactionsScreen';
import ProfileScreen from '../screens/app/ProfileScreen';
import { colors } from '../theme/colors';
import { View } from 'react-native';
import AppText from '../components/AppText';

export type AppTabParamList = {
  Home: undefined;
  Transactions: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

function Label({ title, focused }: { title: string; focused: boolean }) {
  return (
    <AppText style={{ fontSize: 12, marginTop: 2, color: focused ? colors.accent : colors.muted, fontWeight: '700' }}>
      {title}
    </AppText>
  );
}

function IconBubble({ focused, text }: { focused: boolean; text: string }) {
  return (
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? colors.accent : colors.surface,
        borderWidth: 1,
        borderColor: focused ? 'transparent' : colors.border,
      }}
    >
      <AppText style={{ color: focused ? colors.bg : colors.text, fontWeight: '900' }}>{text}</AppText>
    </View>
  );
}

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.border,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <IconBubble focused={focused} text="⌂" />
              <Label title="Home" focused={focused} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <IconBubble focused={focused} text="≋" />
              <Label title="Activity" focused={focused} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <IconBubble focused={focused} text="☺" />
              <Label title="Profile" focused={focused} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
