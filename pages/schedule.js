
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useFetch } from '@refetty/react'
import { addDays, subDays } from 'date-fns'
import axios from 'axios'

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Box, Container, IconButton, SimpleGrid, Spinner } from '@chakra-ui/react'

import { useAuth, Logo, formatDate, TimeBlock } from '../components'

const getSchedule = async ({ when }) => {

  return axios({
    method: 'get',
    url: '/api/schedule',
    params: { when, username: window.location.pathname },
  })
}

const Header = ({ children }) => (
  <Box p={4} display="flex" alignItems="center" justifyContent="space-between">
    {children}
  </Box>
)

export default function Schedule() {
  const router = useRouter()
  const [auth, { logout }] = useAuth()
  // TO-DO: when, addDay, subDay e data Podem ser um único Hook:
  const [when, setWhen] = useState(() => new Date())
  const [data, { loading, status, error }, fetch] = useFetch(getSchedule, { lazy: true })

  const addDay = () => setWhen(prevState => addDays(prevState, 1)) // prevState evita uma série de problemas
  const subDay = () => setWhen(prevState => subDays(prevState, 1)) // como a concorrência
  
  // forma de organização: Deixar o useEffect o mais próximo do render
  useEffect(() => {
    fetch(when)
  }, [when])
  
  return (
    <Container>
      <Header>
        <Logo size={150} />
      </Header>

      <Box mt={8} display="flex" alignItems="center">
        <IconButton icon={<ChevronLeftIcon />} bg="transparent" onClick={subDay}/>
        <Box flex={1} textAlign="center">
          {formatDate(when, 'PPPP')}
        </Box>
        <IconButton icon={<ChevronRightIcon />} bg="transparent" onClick={addDay}/>
      </Box>

      <SimpleGrid p={4} columns={2} spacing={4}>
          {loading && <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl"/>}
          {data?.map(time  => <TimeBlock key={time} time={time} date={when} />)}
      </SimpleGrid>
    </Container>
  )
}