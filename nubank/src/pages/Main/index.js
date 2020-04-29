import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'

import { Animated } from 'react-native'
import { PanGestureHandler, State, setOffset} from 'react-native-gesture-handler'


import Header from '~/components/Header'
import Tabs from '~/components/tabs'
import Menu from '~/components/menu'

import { Container, Content, Card, CardHeader, CardFooter, CardContent, Title, Description, Annotation} from './styles'

export default function Main(){
  let offset = 0;
  const translateY = new Animated.Value(0); //60 fps

  const animatedEvent = Animated.event( //reconhecer o quanto deslocou e passar p translateY
    [
      {
        nativeEvent: {
          translationY: translateY,
        }
      }
    ],
    {useNativeDriver: true}, //Vai ser feito pelo driver native (objective c) +performance
  )

  function onHandlerStateChanged(event){
    if(event.nativeEvent.oldState === State.ACTIVE){
      let opened=false;
      const { translationY } = event.nativeEvent;

      offset+=translationY;

      if(translationY >= 100){
        opened = true;
      }else {
        translateY.setValue(offset);
        translateY.setOffset(0);
        offset=0;
      }
      Animated.timing(translateY,{
        toValue: opened ? 380 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        offset = opened ? 380: 0;
        translateY.setOffset(offset);
        translateY.setValue(0);
      });


    }
  }


  return(
    <Container>
      <Header />

      <Content>
        <Menu translateY={translateY}/>

      <PanGestureHandler
        onGestureEvent={animatedEvent}
        onHandlerStateChange={onHandlerStateChanged} //recebe info das ações do usuário
      >
        <Card style={{
          transform: [{
            translateY: translateY.interpolate({
              inputRange: [-350, 0, 380], 
              outputRange: [-50, 0, 380], //f(inputRange) = outputRange
              extrapolate: 'clamp',
            }),
          }]
        }}>
          <CardHeader>
            <Icon name="attach-money" size={28} color="#666" />
            <Icon name="visibility-off" size={28} color="#666" />
          </CardHeader>
          <CardContent>
              <Title>Saldo disponível</Title>
              <Description>R$ 1.000.000,00</Description>
          </CardContent>
          <CardFooter>
              <Annotation>
                Transferência de R$ 1,00 recebida de Pablo Arruda Araújo hoje às 06:00h
              </Annotation>
          </CardFooter>
        </Card>
      </PanGestureHandler>
      </Content>
      <Tabs translateY={translateY}/>
    </Container>
  )
}