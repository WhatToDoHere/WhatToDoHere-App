import { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

export default function SearchBar({
  placeholder,
  onSearch,
  style,
  editable = true,
}) {
  const [searchText, setSearchText] = useState('');

  const handleClear = () => {
    setSearchText('');
  };

  return (
    <View style={[styles.searchContainer, style]}>
      <Image
        source={require('../assets/icons/icon-search.png')}
        style={styles.icon}
      />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        value={searchText}
        onChangeText={(text) => {
          setSearchText(text);
          if (onSearch) onSearch(text);
        }}
        editable={editable}
        pointerEvents={editable ? 'auto' : 'none'}
      />
      {searchText.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Image
            source={require('../assets/icons/icon-clear.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 5,
  },
  clearButton: {
    marginLeft: 10,
  },
});
