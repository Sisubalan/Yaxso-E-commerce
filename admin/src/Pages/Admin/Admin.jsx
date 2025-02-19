import { Route, Routes } from 'react-router-dom'
import Sidebar from '../../Components/Sidebar/Sidebar'
import './Admin.css'
import AddProduct from '../../Components/AddProduct/AddProduct'
import ListProduct from '../../Components/ListProduct/ListProduct'

const Admin = () =>{
    return(
        <div className="admin">
            <Sidebar></Sidebar>
            <Routes>
                <Route path='/addproduct' element={<AddProduct></AddProduct>}></Route>
                <Route path='/listproduct' element={<ListProduct></ListProduct>}></Route>
            </Routes>
        </div>
    )
}

export default Admin