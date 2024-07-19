import { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

export default function SearchBar({ placeholder, onSearch, editable = true }) {
  const [searchText, setSearchText] = useState('');

  const handleClear = () => {
    setSearchText('');
  };

  return (
    <View style={styles.searchContainer}>
      <Image
        source={require('../assets/icons/icon-search.png')}
        style={styles.searchIcon}
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
            style={styles.clearIcon}
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 5,
    fontFamily: 'Pretendard-Regular',
  },
  clearButton: {
    marginLeft: 10,
  },
  searchIcon: {
    width: 15,
    height: 15,
    marginRight: 10,
  },
  clearIcon: {
    width: 15,
    height: 15,
  },
});
