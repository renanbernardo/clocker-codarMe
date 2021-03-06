
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useFetch } from '@refetty/react'
import { addDays, format, subDays } from 'date-fns'

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Box, Button, Container, IconButton, Spinner } from '@chakra-ui/react'

import { getToken } from './../config/firebase/client'
import { useAuth, Logo, formatDate } from './../components'

const getAgenda = async ({ when }) => {
  const token = await getToken()

  return axios({
    method: 'get',
    url: '/api/agenda',
    params: {
      date: format(when, 'yyyy-MM-dd')
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

const Header = ({ children }) => (
  <Box p={4} display="flex" alignItems="center" justifyContent="space-between">
    {children}
  </Box>
)
export default function Agenda() {
  const router = useRouter()
  const [auth, { logout }] = useAuth()
  const [when, setWhen] = useState(() => new Date())
  const [data, { loading, status, error }, fetch] = useFetch(getAgenda, { lazy: true })

  const addDay = () => setWhen(prevState => addDays(prevState, 1)) // prevState evita uma série de problemas
  const subDay = () => setWhen(prevState => subDays(prevState, 1)) // como a concorrência

  useEffect(() => {
    !auth.user && router.push('/')
  }, [auth.user])

  useEffect(() => {
    fetch(when)
  }, [when])

  return (
    <Container>
      <Header>
        <Logo size={150} />
        <Button onClick={logout}>Sair</Button>
      </Header>
      {/* Componetizar */}
      <Box mt={8} display="flex" alignItems="center">
        <IconButton icon={<ChevronLeftIcon />} bg="transparent" onClick={subDay}/>
        <Box flex={1} textAlign="center">
          {formatDate(when, 'PPPP')}
        </Box>
        <IconButton icon={<ChevronRightIcon />} bg="transparent" onClick={addDay}/>
      </Box>

      {loading && <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl"/>}

      {data?.map(doc => (
        <AgendaBlock key={doc.time} time={doc.time} name={doc.name} phone={doc.phone} />
      ))}
    </Container>
  )
}