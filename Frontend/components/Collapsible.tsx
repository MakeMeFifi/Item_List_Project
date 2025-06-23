import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <ThemedText style={styles.text} type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 30,
    width: '100%',
    borderRadius: 10,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: "rgba(66, 87, 125, 0.0)",
  },
  text: {
    fontSize: 20,
    alignItems: "center",
    flex: 1,             // nimmt den verfügbaren Platz ein
  },
  container: {
    alignSelf: 'stretch',
    backgroundColor: "rgba(66, 87, 125, 0.0)",
  }
});
