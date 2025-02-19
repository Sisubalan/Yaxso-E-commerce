import './DescriptionBox.css'

const DescriptionBox = () => {
    return(
        <div className="descriptionbox">
            <div className='descriptionbox-navigation'>
                <div className="descriptionbox-nav-box">Description</div>
                <div className="descriptionbox-nav-box fade">Reviews (155)</div> 
            </div>
            <div className="descriptionbox-description">
                <p>An eCommerce website serves as a comprehensive showcase for each item, providing customers with all the necessary information to make an informed purchase. At the top, high-resolution images and a product gallery allow shoppers to view the item from multiple angles with zoom functionality.
                    
                    Below the images, a clear and engaging product title is followed by a detailed description, highlighting key features, specifications, materials, and unique selling points.
                  A stock availability indicator informs customers whether the product is in stock, low in quantity, or out of stock.</p>
                <p></p>
            </div>
        </div>
    )
}

export default DescriptionBox