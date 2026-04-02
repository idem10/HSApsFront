import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import {
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
//
import { GetLogin } from '../utils/services/LoginServices';

export default function LoginScreen() {
  const router = useRouter();
  const [Loading, setLoading] = useState(false);
  const [UserName, setUserName] = useState('');
  const [password, setPassword] = useState('');  

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await SecureStore.getItemAsync('userToken');
        if (userData) {
          router.push("/(tabs)")
        }
      } catch (error) {
        console.error('Error leyendo SecureStore:', error);
      }
    };
    fetchUser();
  }, []);

  const handleLogin = async () => {
    if (!UserName || !password) {
      alert('Completa todos los campos');
      return;
    }

    try {
      setLoading(true);

      // Llamada a tu API
      const res = await GetLogin({
        User: UserName,
        Pwd: password,
        App: "grill"
      });

      if (!res) {
        alert('Usuario o contraseña incorrectos');
        setLoading(false);
        return;
      }
      if(res.UsuarioExiste){
        await SecureStore.setItemAsync('userToken', JSON.stringify(res));
        setLoading(false);      
        router.replace('/(tabs)');
      }else{
        alert('Usuario o contraseña incorrectos');
        setUserName("");
        setPassword("");
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Ocurrió un error al iniciar sesión');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ImageBackground
          source={require('../assets/images/fondo2.jpg')}
          style={styles.background}
          resizeMode="cover"
        >
          {/* Overlay de gradiente semitransparente */}
          <LinearGradient
            colors={['rgba(15,23,42,0.7)', 'rgba(37,99,235,0.7)']}
            style={styles.overlay}
          >
            <View style={styles.card}>
              <View style={styles.logoContainer}>
                <Animated.Image
                  source={require('../assets/images/logo.png')} // tu logo
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>Iniciar Sesión</Text>

              <TextInput
                style={styles.input}
                placeholder="User Name"
                placeholderTextColor="#999"
                value={UserName}
                onChangeText={setUserName}
                autoCapitalize="none"
                editable={!Loading}
              />

              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!Loading}
              />

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/Registro")}>
                <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  background: {
    flex: 1,
    justifyContent: 'center'
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 12
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#ffffff'
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#0f172a'
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  },
  link: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  logo: {
    width: 120,       // ancho del logo
    height: 120,      // alto del logo
    borderRadius: 20  // opcional: bordes redondeados
  },
  inputDisabled: {
    backgroundColor: '#e0e0e0', // gris claro
    color: '#888',              // texto gris
  }
});