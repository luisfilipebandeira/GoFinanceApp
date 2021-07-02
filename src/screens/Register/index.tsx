import React from 'react';
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';

import {Button} from '../../components/Forms/Button';
import TransactionTypeButton from '../../components/Forms/TransactionTypeButton';
import CategorySelectButton from '../../components/Forms/CategorySelectButton';
import InputForm from '../../components/Forms/InputForm'

import AsyncStorage from '@react-native-async-storage/async-storage'

import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes
} from './styles';

import { useState } from 'react';

import CategorySelect from '../CategorySelect'
import { useForm } from 'react-hook-form';

import uuid from 'react-native-uuid'
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

interface FormData{
    name: string
    amount: string 
}

const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    amount: Yup.number().typeError('Informe um valor numério')
    .positive('O valor não pode ser negativo').required('O valor é obrigatório')

})

const Register: React.FC = () => {
    const [transactionType, setTransactionType] = useState('')
    const [categoryModalOpen, setCategoryModalOpen] = useState(false)

    const {user} = useAuth()

    const navigation = useNavigation()

    const dataKey = `@gofinances:transactions_user:${user.id}`

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria'
    })

    const { control, handleSubmit, formState: {errors}, reset } = useForm({
        resolver: yupResolver(schema)
    })

    function handleTransactionTypeSelect(type: 'positive' | 'negative'){
        setTransactionType(type)
    }

    function handleCloseSelectCategoryModal(){   
        setCategoryModalOpen(false)
    }
    
    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true)
    }

    async function handleRegister(form: FormData){
        if(!transactionType)
            return Alert.alert('Selecione o tipo da transação')

        if(category.key === 'category')
            return Alert.alert('Selecione a categoria')


        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        try {
            const data = await AsyncStorage.getItem(dataKey)
            const currentData = data ? JSON.parse(data) : []

            const dataFormatted = [
                ...currentData,
                newTransaction
            ]

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))

            reset()
            setTransactionType('')
            setCategory({
                key: 'category',
                name: 'Categoria'
            })


            navigation.navigate('Listagem')

        } catch(error){
            console.log(error)
            Alert.alert("Não foi possivel salvar!")
        }
    }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
        <Header>
            <Title>Cadastro</Title>
        </Header>

        <Form>
            <Fields>
                <InputForm 
                    name="name"
                    control={control}
                    placeholder="Nome"
                    autoCapitalize="sentences"
                    autoCorrect={false}
                    error={errors.name && errors.name.message}
                />
                <InputForm
                    name="amount"
                    control={control}
                    keyboardType="number-pad"
                    placeholder="Preço"
                    error={errors.amount && errors.amount.message}
                />

                <TransactionsTypes>
                    <TransactionTypeButton 
                        onPress={() => handleTransactionTypeSelect('positive')} 
                        title="Income" 
                        type="up"
                        isActive={transactionType === 'positive'} />
                    <TransactionTypeButton 
                        onPress={() => handleTransactionTypeSelect('negative')} 
                        title="Outcome" 
                        type="down"
                        isActive={transactionType === 'negative'} />
                </TransactionsTypes>

                <CategorySelectButton 
                    onPress={handleOpenSelectCategoryModal}
                    title={category.name}
                    />
            </Fields>

            <Button onPress={handleSubmit(handleRegister)} title="Enviar" />
        </Form>

        <Modal visible={categoryModalOpen}>
            <CategorySelect 
                category={category}
                setCategory={setCategory}
                closeSelectCategory={handleCloseSelectCategoryModal}
            />
        </Modal>
        </Container>
    </TouchableWithoutFeedback>
  );
}

export default Register;