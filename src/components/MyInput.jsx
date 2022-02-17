import React from 'react'
import { InputNumber } from 'antd'

const MyInput = ({ value = '', onChange, addonBefore, addonAfter, defaultValue, name }) => {
  return (
    <InputNumber name={name} addonAfter={addonAfter} addonBefore={addonBefore} defaultValue={defaultValue} style={{width: '80%'}} value={value} onChange={onChange} />
  )
}

export default MyInput