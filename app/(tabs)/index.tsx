import { Text, View } from '@/components/Themed';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  RefreshControl,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

// services
import { GetAllPost } from '../../utils/services/DashServices';

export default function TabOneScreen() {
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);

  const [User, setUser] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  
  const lastScrollY = useRef(0);
  const [showHeader, setShowHeader] = useState(true);
  const translateY = useRef(new Animated.Value(0)).current;
  
  const handleScroll = (event: any) => {
    const currentY = event.nativeEvent.contentOffset.y;

    if (currentY > lastScrollY.current && currentY > 50) {
      if (showHeader) setShowHeader(false); // bajar
    } else {
      if (!showHeader) setShowHeader(true); // subir
    }

    lastScrollY.current = currentY;
  };
  
  useEffect(() => {
    Animated.spring(translateY, {
      toValue: showHeader ? 0 : -220,
      useNativeDriver: true,
    }).start();
  }, [showHeader]);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await SecureStore.getItemAsync('userToken');
      if (userData) setUser(JSON.parse(userData));
    };
    fetchUser();
  }, []);

  useEffect(() => {
    GetAllPost().then(setPosts);
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    router.push('/Login');
  };

  const handlePost = () => {
    console.log('Post:', images);
    setImages([]);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      setImages([...images, ...(result.assets?.map((a) => a.uri) || [])]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await GetAllPost();
      setPosts(res);
    } catch (error) {
      console.error('Error al refrescar:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderPost = ({ item }: any) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.UserImagen }} style={styles.avatar} />
        <Text style={styles.postUser}>{item.UserName}</Text>
      </View>

      <Image source={{ uri: item.Imagen }} style={styles.postImage} />

      <Text style={styles.postCaption}>{item.Contenido}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/fondo2.jpg')}
        style={styles.background}
      >
        <LinearGradient
          colors={['rgba(15,23,42,0.7)', 'rgba(37,99,235,0.7)']}
          style={styles.overlay}
        >

          {/* HEADER ANIMADO */}
          <Animated.View
            style={[
              styles.header,
              {
                transform: [{ translateY }],
                opacity: showHeader ? 1 : 0.98,
              },
            ]}
          >
            <View style={styles.userInfo}>
              <Image
                source={
                  User?.Avatar
                    ? { uri: User.Avatar }
                    : require('../../assets/images/logo.png')
                }
                style={styles.avatar}
              />
              <View>
                <Text style={styles.userName}>
                  {User?.Nombre} {User?.Appelidos}
                </Text>
                <Text style={styles.userEmail}>{User?.Email}</Text>
              </View>
            </View>

            {/* BOTONES */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
                <Ionicons name="image-outline" size={22} color="#1877f2" />
                <Text style={styles.actionText}>Imagen</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <MaterialIcons name="videocam" size={22} color="#1877f2" />
                <Text style={styles.actionText}>Video</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <FontAwesome name="user-plus" size={22} color="#1877f2" />
                <Text style={styles.actionText}>Etiquetar</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.postButton} onPress={handlePost}>
              <Text style={styles.postButtonText}>Publicar</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* LISTA */}
          <Animated.FlatList
            data={posts}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            renderItem={renderPost}
            contentContainerStyle={{
              paddingTop: 240,
              paddingBottom: 20,
            }}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#1877f2']} // Android
                tintColor="#1877f2" // iOS
              />
            }
          />
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  overlay: { flex: 1 },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },

  userName: { color: '#fff', fontWeight: 'bold' },
  userEmail: { color: '#ccc', fontSize: 12 },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    marginVertical: 10,
  },

  actionButton: { alignItems: 'center' },
  actionText: { color: '#1877f2', fontSize: 12 },

  postButton: {
    backgroundColor: '#1877f2',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },

  postButtonText: { color: '#fff', fontWeight: 'bold' },

  logoutButton: {
    backgroundColor: '#ef4444',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  logoutText: { color: '#fff' },

  postCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },

  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },

  postUser: { fontWeight: 'bold' },
  postImage: { width: '100%', height: 200 },
  postCaption: { padding: 10 },
});