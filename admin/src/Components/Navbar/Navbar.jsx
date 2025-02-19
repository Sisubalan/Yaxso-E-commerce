import './Navbar.css'
import navlogo from '../../assets/nav-logo.svg'
import logo from '../../assets/logo.png'
import navProfile from '../../assets/nav-profile.svg'
import yaxsologo from '../../assets/yaxsologo.png'

const Navbar = () => {
    return (
        <div className="navbar">
            {/* <img src={navlogo} alt="" className="nav-logo" /> */}
            <div className="nav-logo">
                <img src={yaxsologo} alt="" />
                <div>
                    <h2>YAXSO</h2>
                    <p>Admin Pannel</p>
                </div>
            </div>
            <img src={navProfile} className='nav-profile' alt="" />
        </div>
    )
}

export default Navbar