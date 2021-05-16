import { useState } from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import axios from 'axios' // TO-DO: Criar uma pasta SDK e jogar tudo que for conexão com a API
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter
} from '@chakra-ui/react'

import { Input } from '../Input'

const setSchedule = async  data => {
    return axios({
      method: 'post',
      url: '/api/schedule',
      data: { 
          ... data,
            username: window.location.pathname.replace('/', '')
        },
    })
  }

const ModalTimeBlock = ({ isOpen, onClose, onComplete, children }) => (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Faça sua Reserva</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {children}
            </ModalBody>

            <ModalFooter>
                <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                <Button colorScheme="blue" mr={3} onClick={onComplete}>
                    Reservar Horário
                  </Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
)

export const TimeBlock = ({ time }) => {
    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => setIsOpen(prevState => !prevState)

    const { values, handleSubmit, handleChange, handleBlur, errors, touched } = useFormik({
        onSubmit: (values) => setSchedule({ ...values, when: time }),
        initialValues: {
            name: '', // pode ser que tenha sido corrigido nas versões mais novas
            email: '',
        },
        validationSchema: yup.object().shape({
            name: yup.string().required('Preenchimento obrigatório'),
            phone: yup.string()
                .required('Preenchimento obrigatório')
        })
    })

    // <> </> Fragment
    return (
        <Button p={8} bg="blue.500" color="white" onClick={toggle}>
            {time}
            <ModalTimeBlock isOpen={isOpen} onClose={toggle} onComplete={handleSubmit}>
                <>
                    <Input
                        label="Nome:"
                        values={values.name}
                        touched={touched.name}
                        name="name"
                        error={errors.name}
                        placeholder="Seu nome"
                        size="lg"
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    <Input
                        label="Telefone:"
                        values={values.phone}
                        error={errors.phone}
                        name="phone"
                        placeholder="Seu Telefone"
                        size="lg"
                        mt={4}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </>
            </ModalTimeBlock>
        </Button>
    )
}
