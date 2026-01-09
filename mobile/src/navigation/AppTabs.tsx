import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../views/app/HomeScreen';
import TransactionsScreen from '../views/app/TransactionsScreen';
import ProfileScreen from '../views/app/ProfileScreen';
import { colors } from '../theme/colors';
import { Pressable, View } from 'react-native';
import AppText from '../components/AppText';
import { scaleHeight } from '../constants/size';
import AddTransactionScreen from '../views/app/AddTransactionScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type AppTabParamList = {
  Home: undefined;
  Transactions: undefined;
  Add: undefined;
  Profile: undefined;
  Charts: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

function Label({ title, focused }: { title: string; focused: boolean }) {
  return (
    <AppText numberOfLines={1} style={{ fontSize: 10, marginTop: 2, color: focused ? colors.accent : colors.muted, fontWeight: '700' }}>
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
        alignItems:'center',
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
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.border,
          height: scaleHeight(100) + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: scaleHeight(40),
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
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
            <View>
              <IconBubble focused={focused} text="≋" />
              <Label title="Activity" focused={focused} />
            </View>
          ),
        }}
      />
       <Tab.Screen
        name="Add"
        component={AddTransactionScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View >
               <View style={{
                 width: 50,
                 height: 50,
                 borderRadius: 30,
                 alignItems: 'center',
                 justifyContent: 'center',
                 backgroundColor: colors.accent,
                 marginBottom: scaleHeight(40),
               }}>
                 <AppText style={{ color: colors.bg, fontWeight: '900' }}>＋</AppText>
               </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Charts"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View >
              <IconBubble focused={focused} text="☺" />
              <Label title="Charts" focused={focused} />
            </View>
          ),
        }}
      />
       <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View >
              <IconBubble focused={focused} text="☺" />
              <Label title="Profile" focused={focused} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
