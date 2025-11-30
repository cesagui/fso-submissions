import Country from "./country";

const Content = ({countries, filter}) => {
    const filteredCountries = countries.filter(country =>
        country.name.common.toLowerCase().includes(filter.toLowerCase())
    )
    const countryCount = filteredCountries.length;
    if (countryCount >= 10){
        return(
            <div>Too many entries, please narrow your search!</div>
        )
    } else {
        if (countryCount == 0){
            return (
                <div>
                    No entries, what's going on? (Marvin Gaye reference?)
                </div>
            )
        }
        if (countryCount == 1){
            const n = filteredCountries[0].name.common;
            return (
                <Country name = {n}/>
            )
        }
        return (
            <div>
                {filteredCountries.map(country =><Entry key = {country.name.common.toLowerCase()} text = {country.name.common}/>)}
            </div>
        )
    }
}

const Entry = ({text}) => {
    return (
        <div>{text}</div>
    )
}

export default Content