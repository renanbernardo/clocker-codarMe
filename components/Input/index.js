import { mask, unMask } from 'remask'
import {
  Input as InputBase, FormControl, FormLabel, FormHelperText
} from '@chakra-ui/react'

export const Input = ({ error, label, touched, mask: pattern, ...props }) => {
  const handleChange = event => {
    const unmaskedValue = unMask(event.target.value)
    const maskedValue = masl(unmaskedValue, pattern)

    onChange && onChange(event.target.name)(maskedValue)
  }

  return (
    <FormControl id={props.name} p={4} isRequired>
      <FormLabel>{label}</FormLabel>
      <InputBase {...props} onChange={pattern ? handleChange : onChange} />
      {touched && <FormHelperText textColor={'#e74c3c'}>{error}</FormHelperText>}
    </FormControl>
  )
}