import { toyService } from '../services/toy.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { saveToy } from '../store/actions/toy.actions.js'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MultiSelect } from '../cmps/MultiSelect.jsx'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Button, TextField } from '@mui/material'

function CustomInput(props) {
  return <TextField {...props} id='outlined-basic' variant='outlined' />
}

export function ToyEdit() {
  const SignupSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(20, 'Too Long!').required('Required'),
    price: Yup.string().required('Required'),
  })
  const [toyToEdit, setToyToEdit] = useState(toyService.getEmptyToy())
  const [selectedLabels, setSelectedLabels] = useState([])
  const navigate = useNavigate()
  const params = useParams()

  useEffect(() => {
    if (params.toyId) loadToy()
  }, [])

  async function loadToy() {
    try {
      const toy = await toyService.getById(params.toyId)
      setToyToEdit(toy)
      setSelectedLabels(toy.labels || [])
    } catch (err) {
      console.log('Had issued in toy edit:', err)
      navigate('/toy')
      showErrorMsg('Toy not found!')
    }
  }

  function onSetLabels(labels) {
    setToyToEdit({ ...toyToEdit, labels })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setToyToEdit({
      ...toyToEdit,
      [name]: value,
    })
  }

  function getYesNo() {
    return toyToEdit.inStock
  }

  async function onSaveToy(values) {
    console.log('adsgadg')
    const newToy = {
      ...toyToEdit,
      name: values.name,
      price: values.price,
      labels: selectedLabels,
      inStock: toyToEdit.inStock === 'false' ? false : true,
    }

    try {
      const res = await saveToy(newToy)
      console.log(res)
      navigate('/toy')

      console.log(toyToEdit)
    } catch {
      err
      showErrorMsg('Cannot save toy', err)
    }
  }

  return (
    <div className='toy-edit'>
      <Formik
        initialValues={{
          name: '',
          price: '',
        }}
        validationSchema={SignupSchema}
        onSubmit={onSaveToy}
      >
        {({ errors, touched }) => (
          <Form className='formik'>
            <Field as={CustomInput} type='text' name='name' placeholder='Name' />
            {errors.name && touched.name && <div>{errors.name}</div>}
            <Field as={CustomInput} type='number' name='price' placeholder='Price' />

            <MultiSelect selectedLabels={selectedLabels} setSelectedLabels={setSelectedLabels} />
            <select value={getYesNo() || '1'} onChange={handleChange} name='inStock' className='edit-input'>
              <option value={'1'} disabled>
                In Stock
              </option>
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>

            <button type='submit'>{params.toyId ? 'Update' : 'Add'} Toy</button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
