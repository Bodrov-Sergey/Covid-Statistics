import * as axios from "axios";
import {countriesSelector} from "../utilits/countriesSelector";
import s from "../styles/Home.module.css"
import Link from 'next/link'
import {useEffect, useState} from "react";
import searchIcon from "../accets/searchIcon.png";
import leftArrow from "../accets/leftArrow.png";
import rightArrow from "../accets/rightArrow.png";
import Image from 'next/image';
import Layout from "../layout/Layout";


const Home = ({response: serverResponse}) => {
    const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    const [response, setResponse] = useState(serverResponse);
    let [inputValue, setInputValue] = useState('');
    let [selectedArray, setSelectedArray] = useState(countriesSelector(response, "A"));
    let [activePage, setActivePage] = useState("A");
    let [searchMode, setSearchMode] = useState(false);
    //Управление стрелками
    const nextPage = () => {
        let result;
        alphabet.forEach((value, index) => {
            if (value === activePage) {
                index === alphabet.length - 1 ? result = alphabet[0] : result = alphabet[index + 1];
            }
        })
        setActivePage(result);
    }
    const previousPage = () => {
        let result;
        alphabet.forEach((value, index) => {
            if (value === activePage) {
                index === 0 ? result = alphabet[alphabet.length - 1] : result = alphabet[index - 1];
            }
        })
        setActivePage(result);
    }
    //Запрос из фронта
    useEffect(() => {
        async function load() {
            const options = {
                method: 'GET',
                url: 'https://covid-193.p.rapidapi.com/countries',
                headers: {
                    'x-rapidapi-key': 'cd457c8509msh634a7248a0fdd62p151723jsn132cf630c616',
                    'x-rapidapi-host': 'covid-193.p.rapidapi.com'
                }
            };
            let data = await axios.request(options).then(function (response) {
                return response.data.response;
            }).catch(function (error) {
                return error;
            });
            setResponse(data);
            setSelectedArray(countriesSelector(data, "A"))
        }

        if (serverResponse === "") {
            load();
        }
    }, [])
    //Пагинатор
    useEffect(() => {
        !searchMode && (setSelectedArray(countriesSelector(response, activePage)))
    }, [activePage])
    //Запрос по названию
    useEffect(() => {
        const searchResult = async () => {

            const options = {
                method: 'GET',
                url: 'https://covid-193.p.rapidapi.com/countries',
                params: {search: inputValue},
                headers: {
                    'x-rapidapi-key': 'cd457c8509msh634a7248a0fdd62p151723jsn132cf630c616',
                    'x-rapidapi-host': 'covid-193.p.rapidapi.com'
                }
            };
            let data = await axios.request(options).then(function (response) {
                return response.data.response;
            }).catch(function (error) {
                return error;
            });
            setInputValue('')
            setSelectedArray(data);

            setSearchMode(false);
        }
        searchMode && searchResult()
    }, [searchMode])

    if (response === "") {
        return <Layout title={"Loading"}>
            <div className={s.mainLoading}>Loading...</div>
        </Layout>
    }

    return (
        <Layout title={"Covid-19 statistics"}>
            <div className={s.wrapper}>
                <div className={s.labelSearch}>Search by a country</div>
                <div className={s.inputContainer}>
                    <input className={s.input} value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                           placeholder={"Country..."}/>
                    <span className={s.searchIcon}><Image onClick={() => {
                        setSearchMode(true);
                        setActivePage('');
                    }} src={searchIcon} alt={"search"}/></span>
                </div>
                <section className={s.countriesLinks}>
                    {searchMode ? <div className={s.loading}>Loading...</div> : selectedArray.length === 0 ?
                        <div className={s.errorMessage}>No such countries</div> :
                        selectedArray.map((c) => {
                            return (
                                <span key={c} className={s.link}><Link href={`/statistics/[country]`}
                                                                       as={`/statistics/${c}`}>
                                    <a className={s.link}>{c} </a>
                                </Link></span>
                            )
                        })
                    }
                </section>
                <div className={s.navigation}>
                    <div onClick={previousPage} className={s.arrowNavL}><Image src={leftArrow}/></div>
                    {alphabet.map(l => <span className={activePage === l ? s.activePageLetter : s.pageLetter}
                                             onClick={() => {
                                                 if (searchMode) {
                                                     setSearchMode(false);
                                                 }
                                                 setActivePage(l[0]);

                                             }}
                                             key={l}>{l}</span>)}
                    <div onClick={nextPage} className={s.arrowNavR}><Image src={rightArrow}/></div>
                </div>
                <div className={s.mobileNav}>
                    <span onClick={previousPage}><Image src={leftArrow}/></span>
                    <span className={s.activePageLetter}>{activePage}</span>
                    <span onClick={nextPage}><Image src={rightArrow}/></span>

                </div>

            </div>
        </Layout>
    )
}
Home.getInitialProps = async (ctx) => {
    if (!ctx.req) {
        return {response: ""}
    }
    const options = {
        method: 'GET',
        url: 'https://covid-193.p.rapidapi.com/countries',
        headers: {
            'x-rapidapi-key': 'cd457c8509msh634a7248a0fdd62p151723jsn132cf630c616',
            'x-rapidapi-host': 'covid-193.p.rapidapi.com'
        }
    };
    let response = await axios.request(options).then(function (response) {
        return response.data.response;
    }).catch(function (error) {
        return error;
    });
    return {response};

}

export default Home;
