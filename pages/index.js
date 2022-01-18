import {useEffect, useState} from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import axios, {get} from 'axios'
import Modal from 'react-modal'
import { useForm } from "react-hook-form";

export default function Home() {

  const [data, setData] = useState([])
  const [undo, setUndo] = useState({})
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenCreate, setIsOpenCreate] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onEdit = data => handleEdit(data);
  const onCreate = data => handleCreate(data);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  }

  const hadleRemove = (item) => {
    axios.delete(`http://localhost:3000/products/${item.id}`)
    setUndo(item)
  }
  
  const handleEdit = (item) => {
    axios.patch(`http://localhost:3000/products/${item.id}`,{...item})
    setUndo(item)
  }
  
  const handleCreate = (item) => {
    axios.post("http://localhost:3000/products/", {name: item.name, category: item.category, value: item.value})
    setUndo(item)
  }

  useEffect(() => {
    get('http://localhost:3000/products').then(
      res => setData(res.data)
    )
  },[undo])


  return (
    <div className={styles.container}>
      <Head>
        <title>Global Hitss - CRUD</title>
        <meta name="description" content="Avaliação - Global Hitss" />
      </Head>
      <h1>Produtcs</h1>
      <button type="button" onClick={() => setIsOpenCreate(true)}>Criar</button>
      <table>
        <tr>
            <td>Nome</td>
            <td>Categoria</td>
            <td>Valor</td>
            <td>Opções</td>
        </tr>
        {
          data.map(item =>{
            return (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.value}</td>
                <td>
                  <button onClick={() => setIsOpen(true)}>editar</button>
                  <button onClick={() => hadleRemove(item)}>excluir</button>
                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setIsOpen(false)}
                    style={customStyles}
                    contentLabel="Example Modal"
                  >
                    <h1> Editar </h1>
                    <form onSubmit={handleSubmit(onEdit)}>
                      <label>Id: </label>
                      <input defaultValue={item.id} {...register("id")} value={item.id}/>
                      <label>Nome: </label>
                      <input defaultValue={item.name} {...register("name")} />
                      <label>Categoria: </label>
                      <select defaultValue={item.category} {...register("category")}>
                        <option value="internet"> internet </option>
                        <option value="tv"> tv </option>
                        <option value="celular"> celular </option>
                        <option value="fixo"> fixo </option>
                      </select>
                      <label>Valor: </label>
                      <input defaultValue={item.value} {...register("value")} />
                      <input type="submit" value="Editar"/>
                      <button type="button" onClick={() => setIsOpen(false)}>Cancelar</button>
                    </form>
                  </Modal>
                </td>
              </tr>
            )
          })
        }
    </table>
      <Modal
        isOpen={modalIsOpenCreate}
        onRequestClose={() => setIsOpenCreate(false)}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h1> Criar </h1>
        <form onSubmit={handleSubmit(onCreate)}>
          <label>Nome: </label>
          <input  {...register("name")} />
          <label>Categoria: </label>
          <select{...register("category")}>
            <option value="internet"> internet </option>
            <option value="tv"> tv </option>
            <option value="celular"> celular </option>
            <option value="fixo"> fixo </option>
          </select>
          <label>Valor: </label>
          <input {...register("value")} />
          <input type="submit" value="Criar"/>
          <button type="button" onClick={() => setIsOpenCreate(false)}>Cancelar</button>
        </form>
      </Modal>
    </div>
  )
}
