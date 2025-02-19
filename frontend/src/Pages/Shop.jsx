import Hero from "../Components/Hero/Hero"
import NewCollections from "../Components/NewCollections/NewCollections"
import NewsLetter from "../Components/NewsLetter/NewsLetter"
import Offers from "../Components/Offers/Offers"
import Popular from "../Components/Popular/Popular"

const Shop = () => {
    return (
        <div>
            <Hero></Hero>
            <Popular></Popular>
            <Offers></Offers>
            <NewCollections></NewCollections>
            <NewsLetter></NewsLetter>
        </div>
    )
}

export default Shop