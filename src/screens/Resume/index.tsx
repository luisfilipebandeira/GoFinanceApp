import React, {useEffect, useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HistoryCard from '../../components/HistoryCard';

import { VictoryPie } from 'victory-native'

import { 
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadContainer
 } from './styles';

import { categories } from '../../utils/categories';

import { useFocusEffect } from '@react-navigation/native';

import theme from '../../global/styles/theme';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ActivityIndicator } from 'react-native';
import { useAuth } from '../../hooks/auth';

 interface TransactionData {
   type: 'positive' | 'negative'
   name: string
   amount: string
   category: string
   date: string
 }

 interface CategoryData{
   name: string
   total: number
   totalFormatted: string
   color: string
   percentFormatted: string
   percent: number
 }

const Resume: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])

  const {user} = useAuth()

  function handleDateChange(action: 'next' | 'previous'){
    if(action == 'next'){
      const newDate = addMonths(selectedDate, 1)
      setSelectedDate(newDate)
    }else {
      const newDate = subMonths(selectedDate, 1)
      setSelectedDate(newDate)
    }
  }

  async function loadData() {
    setIsLoading(true)
    const dataKey = `@gofinances:transactions_user:${user.id}`
    const response = await AsyncStorage.getItem(dataKey)
    const responseFormatted = response ? JSON.parse(response) : []

    const expenses = responseFormatted
    .filter((expensive: TransactionData) => 
      expensive.type === 'negative' &&
      new Date(expensive.date).getMonth() === selectedDate.getMonth()  &&
      new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
    )

    const expensesTotal = expenses.reduce((accumulator: number, expenses: TransactionData) => {
      return accumulator + Number(expenses.amount)
    }, 0)

    const totalByCategory: CategoryData[] = []

    categories.forEach(category => {
      let categorySum = 0

      expenses.forEach((expensive: TransactionData) => {
        if(expensive.category === category.key){
          categorySum += Number(expensive.amount)
        }
      })

      if(categorySum > 0){
        const totalFormatted = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })

        const percent = (categorySum / expensesTotal * 100)
        const percentFormatted = `${percent.toFixed(0)}%`

        totalByCategory.push({
          name: category.name,
          total: categorySum,
          totalFormatted, 
          color: category.color,
          percent,
          percentFormatted
        })
      }
    })

    setTotalByCategories(totalByCategory)
    setIsLoading(false)

  }

  useFocusEffect(useCallback(() => {
    loadData()
  }, [selectedDate]))

  return (
    <Container>
        <Header>
           <Title>Resumo por categoria</Title>
        </Header>

 
        {isLoading ?
          <LoadContainer>
            <ActivityIndicator color={theme.colors.secondary} size="large"  />
          </LoadContainer>
        :
          <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight()
          }}
          >

          <MonthSelect>
            <MonthSelectButton onPress={() => handleDateChange('previous')}>
              <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>
              {format(selectedDate, 'MMMM, yyyy', {locale: ptBR})}
            </Month>

            <MonthSelectButton onPress={() => handleDateChange('next')}>
              <MonthSelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie 
              data={totalByCategories}
              colorScale={totalByCategories.map(category => category.color)}
              style={{
                labels: {
                  fontSize: 18,
                  fontWeight: 'bold',
                  fill: theme.colors.shape
                }
              }}
              labelRadius={50}

              x="percentFormatted"
              y="total"
            />
          </ChartContainer>

        {totalByCategories.map(item => (
          <HistoryCard 
            title={item.name} 
            key={item.name} 
            amount={item.totalFormatted} 
            color={item.color} 
          />
        ))
        }

      </Content>
      }

    </Container>
  );
}

export default Resume;