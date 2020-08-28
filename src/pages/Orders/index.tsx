import React, { useEffect, useState, useMemo } from 'react';
import { Image } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import FeatherIcon from 'react-native-vector-icons/Feather';
import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  HeaderTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
  FoodQuantity,
  FinishOrderButton,
  ButtonText,
  IconContainer,
  TotalPrice,
  Footer,
  RemoveButton,
} from './styles';

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  formattedValue: number;
  thumbnail_url: string;
  foodQuantity: string;
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Food[]>([]);

  useEffect(() => {
    async function loadOrders(): Promise<void> {
      const response = await api.get('/orders');

      setOrders(response.data);
    }

    loadOrders();
  }, []);

  const cartTotal = useMemo(() => {
    const total = orders.reduce((accumulator, order) => {
      const ordersSubtotal = order.price * order.foodQuantity;

      return accumulator + ordersSubtotal;
    }, 0);
    return formatValue(total);
  }, [orders]);

  async function handleDeleteFood(id: number): Promise<void> {
    try {
      await api.delete(`/orders/${id}`);

      setOrders(orders.filter(order => order.id !== id));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus pedidos</HeaderTitle>
      </Header>

      <FoodsContainer>
        <FoodList
          data={orders}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Food key={item.id} activeOpacity={0.6}>
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: item.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{item.name}</FoodTitle>
                <FoodDescription>{item.description}</FoodDescription>
                <FoodQuantity>Quantity: {item.foodQuantity}</FoodQuantity>
                <FoodPricing>
                  {formatValue(item.price * item.foodQuantity)}
                </FoodPricing>
              </FoodContent>

              <RemoveButton
                testID={`remove-${item.id}`}
                onPress={() => handleDeleteFood(item.id)}
              >
                <FeatherIcon name="trash-2" color="#E83F5B" size={16} />
              </RemoveButton>
            </Food>
          )}
        />
      </FoodsContainer>

      <Footer>
        <FinishOrderButton onPress={() => handleFinishOrder()}>
          <ButtonText>Finalizar pedido</ButtonText>
          <TotalPrice>{cartTotal}</TotalPrice>
          <IconContainer>
            <Icon name="check-square" size={24} color="#fff" />
          </IconContainer>
        </FinishOrderButton>
      </Footer>
    </Container>
  );
};

export default Orders;
