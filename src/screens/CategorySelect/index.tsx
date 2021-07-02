import React from 'react';
import { categories } from '../../utils/categories';

import { 
    Container,
    Header, 
    Title,
    Category,
    Icon,
    Name,
    Separator,
    Footer,
 } from './styles';

import {Button} from '../../components/Forms/Button'

import { FlatList } from 'react-native'

interface Category{
    key: string
    name: string
}

interface Props{
    category: Category
    setCategory: (category: Category) => void
    closeSelectCategory: () => void
}

const CategorySelect: React.FC<Props> = ({category, closeSelectCategory, setCategory}) => {
  function handleCategorySelect(category: Category){
    setCategory(category)
  }
  return (
      <Container>
          <Header>
              <Title>Categoria</Title>
          </Header>

          <FlatList 
            data={categories}
            style={{ flex: 1, width: '100%'}}
            keyExtractor={(item) => item.key}
            renderItem={({item}) => (
                <Category 
                    onPress={() => handleCategorySelect(item)}
                    isActive={category.key === item.key}    
                >
                    <Icon name={item.icon} />
                    <Name>{item.name}</Name>
                </Category>
            )}
            ItemSeparatorComponent={() => <Separator />}
             />


            <Footer>
                <Button onPress={closeSelectCategory} title="Selecionar" />
            </Footer>
      </Container>
  );
}

export default CategorySelect;