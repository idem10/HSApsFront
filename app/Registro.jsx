import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import moment from 'moment';
import { useState } from 'react';
import {
    Image,
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
//services
import { SetNewUser } from '../utils/services/LoginServices';

export default function RegistroScreen() {
  const router = useRouter();

  const [Uname, setUName] = useState('');
  const [name, setName] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');  

  const ClickNewregister = () => {
    if (!Uname || !name || !apellidos || !email || !password || !confirmPassword) {
      alert('Completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    SetNewUser({
        Id: 0,
        UserName: Uname,
        Email: email,
        Password: password,
        Nombre: name,
        Apellidos: apellidos,
        IsActive: 1,
        Rol: 2,
        Imagen: "",
        LastUpdate: moment().format('YYYY-MM-DDTHH:mm:ss'),
        App: "grill"
    }).then((res) => {
        console.log(res);
        alert('Registro exitoso!');
        // Después de registrarse, redirigir al login
        router.push('/Login');  
    }).catch((err) => {
        console.log(err);
    })
  }

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
            source={require('../assets/images/fondo2.jpg')} // fondo opcional
            style={styles.background}
            resizeMode="cover"
        >
            <LinearGradient
                colors={['rgba(15,23,42,0.7)', 'rgba(37,99,235,0.7)']}
                style={styles.overlay}
            >
                <View style={styles.card}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/images/logo.png')} // reemplaza con tu logo
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.title}>Crear Cuenta</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="User Name"
                        placeholderTextColor="#999"
                        value={Uname}
                        onChangeText={setUName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre"
                        placeholderTextColor="#999"
                        value={name}
                        onChangeText={setName}
                    />
                     <TextInput
                        style={styles.input}
                        placeholder="Apellidos"
                        placeholderTextColor="#999"
                        value={apellidos}
                        onChangeText={setApellidos}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Correo electrónico"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Confirmar contraseña"
                        placeholderTextColor="#999"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.button} onPress={ClickNewregister}>
                        <Text style={styles.buttonText}>Registrarse</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.push('/Login')}>
                        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
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
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10
  },
  title: {
    fontSize: 28,
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
    marginBottom: 15,
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
  }
});