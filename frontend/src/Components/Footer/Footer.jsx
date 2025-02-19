import './Footer.css'
import yaxsologo from '../Assets/yaxsologo.png'

const Footer = () => {
    return (
        <>
            <div className="footer">
                <div className="desc">
                    <img src={yaxsologo} alt="" />
                    <h2>YAXSO</h2>
                    <p>Discover the latest trends in fashion with our stylish collection of clothing for men, women, and kids. From casual wear to elegant evening outfits, we offer high-quality apparel that fits every occasion.</p>
                </div>

                <div className="companydesc">
                    <h3>Company</h3>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy Ploicy</li>
                </div>

                <div className="contactdesc">
                    <h3>Get in Touch</h3>
                    <p>+1-212-456-7890</p>
                    <p>yaxso@gmail.com</p>
                </div>

            </div>
            <p className='copyright'>Copyright @ 2025 - All Right Reserved</p>
        </>
    )
}

export default Footer