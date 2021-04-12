import { useFormik } from 'formik'
import * as yup from 'yup'
import Link from 'next/link'

import {
  Container,
  Box,
  Input,
  Button,
  Text,
  FormControl,
  FormLabel,
  FormHelperText
} from '@chakra-ui/react'

import { Logo } from './../components'
import { firebaseClient } from '../config/firebase/client'

// UMA ABSTRAÇÃO ERRADA É MTO PIOR QUE UM CÓDIGO DUPLICADO

const validationSchema = yup.object().shape({
  email: yup.string().email('E-mail inválido').required('Preenchimento obrigatório'),
  password: yup.string().required('Preenchimento obrigatório'),
  username: yup.string().required('Preenchimento obrigatório'), // TO-DO: consultar no banco se existe user
})

export default function Home() {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
    isSubmitting
  } = useFormik({
    onSubmit: async (values, form) => { 
      try {
        const user = await firebaseClient.auth().createUserWithEmailAndPassword(values.email, values.password)
        console.log(user);
      } catch(error) {
        console.log(error)
      }      
    },
    validationSchema,
    initialValues: {
      email: '',
      username: '',
      password: ''
    }
  })

  return (
    <Container p={4} centerContent>
      <Logo />
      <Box>
        <Text p={4} mt={8}>
          Crie sua agenda compartilhada
        </Text>
      </Box>
      <Box>
        <FormControl id="email" p={4} isRequired>
          <FormLabel>Email</FormLabel>
          <Input size="lg" type="email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
          {touched.email && <FormHelperText textColor={'#e74c3c'}>{errors.email}</FormHelperText>}
        </FormControl>

        <FormControl id="password" p={4} isRequired>
          <FormLabel>Senha</FormLabel>
          <Input size="lg" type="password" value={values.password} onChange={handleChange} onBlur={handleBlur} />
          {touched.password && <FormHelperText textColor={'#e74c3c'}>{errors.password}</FormHelperText>}
        </FormControl>

        <Box p={4}>
          <Button colorScheme="blue" width="100%" onClick={handleSubmit} isLoading={isSubmitting}>Entrar</Button>
        </Box>
      </Box>

      <Link href="/">Já tem uma conta? Acesse aqui.</Link>
    </Container>
  )
}