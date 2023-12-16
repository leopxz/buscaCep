import React, { useState, useEffect  } from 'react';
import { Alert, Image,StyleSheet } from 'react-native';
import {
    Container,
    Animation,
    Input,
    Button,
    ButtonText,
    AddressArea,
    Text
} from './styles';
import logo from '../../assets/fundoNovo.png';
import api from '../../services/api';
import MapView, {Marker}from 'react-native-maps';

import * as Location from 'expo-location';



export default function Home() {
    const [cep, setCep] = useState('');
    const [address, setAddress] = useState(null);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        (async () => {
          
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let locationn = await Location.getCurrentPositionAsync({});
          setLocation(locationn);
        })();
      }, []);

      let latitude = 'Waiting..';
      if (errorMsg) {
        latitude = errorMsg;
      } else if (location) {
        latitude = JSON.stringify(location.coords.latitude);
      }

      let longitude = 'Waiting..';
      if (errorMsg) {
        longitude = errorMsg;
      } else if (location) {
        longitude = JSON.stringify(location.coords.longitude);
      }

    async function handleBuscar() {
        try {
            const { status, data } = await api.get(`${cep}/json/`);

            if (status != 200 || data.erro) {
                Alert.alert('Buscar', 'Digite um CEP válido.');
            } else {
                setAddress(data);
            }

        } catch (error) {
            Alert.alert('Buscar', 'Digite um CEP válido');
        }
    };

    async function handleLimpar() {
        setAddress(null);
        setCep('');
    }

    return (
        <Container>
            <Animation
                animation='bounceInDown'
                delay={200}
                duration={1500}
            >
                <Image source={logo}  style={styles.img}/>
            </Animation>

            <Animation
                animation='bounceInRight'
                delay={100}
                duration={3500}
            >
                {!address &&
                    <Input
                        keyboardType="numeric"
                        maxLength={8}
                        onChangeText={setCep}
                        onSubmitEditing={handleBuscar}
                        placeholder="Digite o CEP que você deseja"
                        placeholderTextColor="#000"
                        value={cep}
                    />
                }

                <Button
                    activeOpacity={0.8}
                    onPress={address ? handleLimpar : handleBuscar}>
                    <ButtonText>
                        {address ? 'Limpar' : 'Buscar'}
                    </ButtonText>
                </Button>
            </Animation>

            {address &&
                <AddressArea>
                    <Text>CEP: {cep}</Text>
                    <Text>{address.logradouro}</Text>
                    <Text>Bairro: {address.bairro}</Text>
                    <Text>Cidade: {address.localidade}</Text>
                    <Text>IBGE: {address.ibge}</Text>
                    <Text>DDD: {address.ddd}</Text>
                    <Text>UF: {address.uf}</Text>
                </AddressArea>

                
            }
           {address && (
            <MapView style={styles.map} 
                initialRegion={{
                    longitude: location.coords.longitude,
                    latitude: location.coords.latitude,
                    longitudeDelta: 0.005,
                    latitudeDelta: 0.005
                }}
            >
                <Marker
                    coordinate={{
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                    }}
                />
            </MapView>
        )}
            
        </Container>
    );
}

const styles = StyleSheet.create({
   
    map: {
        marginTop: 10,
      width: '90%',
      height: 200,
    },
    img:{
        height: 300,
        top: -50,
        marginBottom: -60
    }
  });