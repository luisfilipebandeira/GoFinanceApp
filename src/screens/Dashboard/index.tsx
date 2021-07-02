import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native'

import { useFocusEffect } from '@react-navigation/native';

import HighLightCard from '../../components/HighLightCard';
import TransactionCard, {TransactionCardProps} from '../../components/TransactionCard';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
  Container,
  Header,
  UserContainer,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  Username,
  Icon,
  HighLightCards,
  Transactions, 
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer
 } from './styles';


import { useTheme } from 'styled-components'
import { useAuth } from '../../hooks/auth';
 
export interface DataListProps extends TransactionCardProps {
  id: string
}

interface HighLightProps{
  amount: string
  lastTransaction: string
}

interface HighLightData {
  entries: HighLightProps,
  expensives: HighLightProps,
  total: HighLightProps
}

const screens: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [transaction, setTransaction] = useState<DataListProps[]>()
  const [highlightData, setHighlightData] = useState<HighLightData>({} as HighLightData)

  const theme = useTheme()
  const {signOut, user} = useAuth()

  function getLastTransactionDate(collection: DataListProps[], type: 'positive' | 'negative'){
    const collectionFiltered = collection
    .filter(transaction => transaction.type === type)

    const lastTransaction = new Date(
      Math.max.apply(Math, collectionFiltered
        .map(transaction => new Date(transaction.date).getTime()
      )))

    if(collectionFiltered.length === 0){
      return 0
    }

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-Br', {month: 'long'})}`
  }
  
  async function loadTransaction(){
    const dataKey = `@gofinances:transactions_user:${user.id}`
    const response = await AsyncStorage.getItem(dataKey)
    const transactions = response ? JSON.parse(response) : []

    let entriesTotal = 0
    let expensesTotal = 0

    const transactionsFormatted: DataListProps[] = transactions
    .map((item: DataListProps) => {

      if(item.type === 'positive'){
        entriesTotal += Number(item.amount)
      }else {
        expensesTotal += Number(item.amount)
      }

      const amount = Number(item.amount).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })

      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(item.date))

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date
      }
    })

    setTransaction(transactionsFormatted)

    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive')
    const lastTransactionExpenses = getLastTransactionDate(transactions, 'negative')
    const totalInterval = lastTransactionExpenses === 0 ? 'Não transações' : `01 a ${lastTransactionExpenses}`
  
    const total = entriesTotal - expensesTotal

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionEntries === 0 ? 'Não há transações' 
        : `Ultima entrada dia ${lastTransactionEntries}`,
      },
      expensives: {
        amount: expensesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionExpenses === 0 ? 'Não há saidas' 
        : `Ultima saída dia ${lastTransactionExpenses}`
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalInterval
      }
    })

    setIsLoading(false)
  }

  useEffect(() => {
    loadTransaction()
  }, [])

  useFocusEffect(useCallback(() => {
      loadTransaction( )
  }, []))

  return (
      <Container>
        
        { isLoading ? 
           <LoadContainer>
             <ActivityIndicator color={theme.colors.secondary} size="large"  />
           </LoadContainer>
          :
          <>
            <Header>
            <UserContainer>
              <UserInfo>
                <Photo source={{ uri: user.photo }} />
                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <Username>{user.name}</Username>
                </User>
              </UserInfo>

              <LogoutButton onPress={() => {signOut()}}>
                <Icon name="power" />
              </LogoutButton>
            </UserContainer>
          </Header>

          <HighLightCards>
            <HighLightCard type="up" title="Entradas" amount={highlightData.entries.amount} lastTransaction={highlightData.entries.lastTransaction} />
            <HighLightCard type="down" title="Saídas" amount={highlightData.expensives.amount} lastTransaction={highlightData.expensives.lastTransaction} />
            <HighLightCard type="total" title="Total" amount={highlightData.total.amount} lastTransaction={highlightData.total.lastTransaction}/>
          </HighLightCards>
          
          <Transactions>
            <Title>Listagem</Title>

            <TransactionList
              data={transaction}
              keyExtractor={item => item.id}
              renderItem={({item}) => <TransactionCard data={item} />}
            />
          </Transactions>
          </>
        }
      </Container>
  );
}

export default screens;