import { Text, View } from '@/components/Themed';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { FlatList, Image, ImageBackground, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function TabOneScreen() {
  const router = useRouter();
  const [User, setUser] = useState(null);

  const [text, setText] = useState('');
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await SecureStore.getItemAsync('userToken');
        if (userData) {
          const user = JSON.parse(userData);
          setUser(user);
        }
      } catch (error) {
        console.error('Error leyendo SecureStore:', error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userToken');
    router.push("/Login")
  }

  const [posts, setPosts] = useState([
    {
      id: '1',
      user: 'Carlos M.',
      avatar: require('../../assets/images/logo.png'),
      image: require('../../assets/images/logo.png'),
      caption: 'Disfrutando el atardecer 🌅',
    },
    {
      id: '2',
      user: 'Ana G.',
      avatar: require('../../assets/images/logo.png'),
      image: require('../../assets/images/logo.png'),
      caption: 'Nueva receta de brunch 🍳',
    },
  ]);

  const handlePost = () => {
    console.log('Publicación:', { text, images });
    // Aquí iría la lógica para subir el post a tu backend
    setText('');
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

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={item.avatar} style={styles.avatar} />
        <Text style={styles.postUser}>{item.user}</Text>
      </View>
      <Image source={item.image} style={styles.postImage} />
      <Text style={styles.postCaption}>{item.caption}</Text>
    </View>
  );

  
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/fondo2.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(15,23,42,0.7)', 'rgba(37,99,235,0.7)']}
          style={styles.overlay}
        >
          {/* Header profesional con avatar, nombre y botones */}
            <View style={styles.header}>
              {/* Avatar + nombre/email */}
              <View style={styles.userInfo}>
                <Image
                  source={User?.Avatar || require('../../assets/images/logo.png')}
                  style={styles.avatar}
                />
                <View style={styles.userText}>
                  <Text style={styles.userName}>{User?.Nombre} {User?.Appelidos}</Text>
                  <Text style={styles.userEmail}>{User?.Email}</Text>
                </View>
              </View>

              {/* Botones */}
              <View style={styles.headerButtons}>
                <ScrollView style={styles.container}>
                  {/* Botones de acción */}
                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
                      <Ionicons name="image-outline" size={24} color="#1877f2" />
                      <Text style={styles.actionText}>Imagen</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                      <MaterialIcons name="videocam" size={24} color="#1877f2" />
                      <Text style={styles.actionText}>Video</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                      <FontAwesome name="user-plus" size={24} color="#1877f2" />
                      <Text style={styles.actionText}>Etiquetar</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Botón publicar */}
                  <TouchableOpacity style={styles.postButton} onPress={handlePost}>
                    <Text style={styles.postButtonText}>Publicar</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </View>
          {/* Lista de posts */}
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={renderPost}
            contentContainerStyle={styles.postsList}
            showsVerticalScrollIndicator={false}
          />
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  overlay: { flex: 1, padding: 15 },
  postsList: { paddingBottom: 20 },
  postCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 10 },  
  postUser: { fontWeight: 'bold', fontSize: 16 },
  postImage: { width: '100%', height: 200 },
  postCaption: { padding: 10, fontSize: 14, color: '#0f172a' },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#2563eb',
    marginRight: 15,
  },
  userText: {
    flexDirection: 'column',
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#ddd',
    fontSize: 14,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoutButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  createPostButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  createPostText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 4,
    color: '#1877f2',
    fontWeight: '500',
  },
  postButton: {
    backgroundColor: '#1877f2',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});