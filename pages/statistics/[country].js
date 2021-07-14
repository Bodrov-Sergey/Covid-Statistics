import Router, {useRouter} from "next/router";
import * as axios from "axios";
import Head from "next/head";
import Link from 'next/link'
import s from "../../styles/CountryStatistic.module.css";
import {useEffect, useState} from "react";
import Layout from "../../layout/Layout";


const CountryStatistic = ({response: serverResponse}) => {
    const router = useRouter();
    const [response, setResponse] = useState(serverResponse);
    //Запрос из фронта
    useEffect(() => {
        async function load() {
            let date = new Date;
            const options = {
                method: 'GET',
                url: 'https://covid-193.p.rapidapi.com/statistics',
                params: {country: router.query.country},
                headers: {
                    'x-rapidapi-key': 'cd457c8509msh634a7248a0fdd62p151723jsn132cf630c616',
                    'x-rapidapi-host': 'covid-193.p.rapidapi.com'
                }
            };
            let data = await axios.request(options).then(function (response) {
                return response.data.response[0];
            }).catch(function (error) {
                return error;
            });
            setResponse(data);
        }

        if (serverResponse === "") {
            load();
        }
    }, [])

    const perMillion = "1M_pop";


    if (response === "") {
        return <Layout title={"Loading"}>
            <div className={s.loading}>Loading...</div>
        </Layout>
    }
    if (!response) {
        return <Layout title={"Error"}>
            <div className={s.errorWrapper}>
                <h2 className={s.error}>Error</h2>
                <Link href={'/'}><a className={s.errorBackButton}>Back</a></Link>
            </div>
        </Layout>
    }
    return <Layout title={`Covid-19 statistics | ${response.country}`}>
        <div className={s.wrapper}>
            <h2 className={s.country}>{response.country}</h2>
            <div className={s.criteria}>
                <span className={s.item}>Continent:</span>
                <span className={s.item}>{response.continent}</span>
            </div>
            <div className={s.criteria}>
                <span className={s.item}>Population:</span>
                <span className={s.item}>{response.population}</span>
            </div>

            <div className={s.statisticsContainer}>
                <div className={s.list}>
                    <div className={s.criteria}>
                        <span className={s.itemMain}>Sick:</span>
                        <span className={s.itemMain}>{response.cases.total}</span>
                    </div>
                    <div className={s.criteria}>
                        <span className={s.itemGray}>{response.cases[perMillion]}</span>
                        <span className={s.itemGray}>/1 mln. population</span>
                    </div>
                    <div className={s.criteria}>
                        <span className={s.item}>New cases:</span>
                        <span className={s.itemRed}>{response.cases.new || 0}</span>
                    </div>
                    <div className={s.criteria}>
                        <span className={s.item}>Getting sick on active stage:</span>
                        <span className={s.item}>{response.cases.active || 0}</span>
                    </div>
                    <div className={s.criteria}>
                        <span className={s.item}>Critically sick:</span>
                        <span className={s.item}>{response.cases.critical || 0}</span>
                    </div>
                    <div className={s.criteria}>
                        <span className={s.item}>Recovered:</span>
                        <span className={s.item}>{response.cases.recovered || 0}</span>
                    </div>

                </div>
                <div className={s.list}>
                    <div className={s.criteria}>
                        <span className={s.itemMain}>Deaths:</span>
                        <span className={s.itemMain}>{response.deaths.total}</span>
                    </div>
                    <div className={s.criteria}>
                        <span className={s.itemGray}>{response.deaths[perMillion]}</span>
                        <span className={s.itemGray}>/1 mln. population</span>
                    </div>
                    <div className={s.criteria}>
                        <span className={s.item}>New cases:</span>
                        <span className={s.itemRed}>{response.deaths.new || 0}</span>
                    </div>

                </div>
                <div className={s.list}>
                    <div className={s.criteria}>
                        <span className={s.itemMain}>Tests:</span>
                        <span className={s.itemMain}>{response.tests.total}</span>
                    </div>
                    <div className={s.criteria}>
                        <span className={s.itemGray}>{response.tests[perMillion]}</span>
                        <span className={s.itemGray}>/1 mln. population</span>
                    </div>
                </div>
            </div>
            <button className={s.backButton} onClick={() => Router.push("/")}>Back</button>
        </div>
    </Layout>
}
CountryStatistic.getInitialProps = async (ctx) => {
    if (!ctx.req) {
        return {response: ""}
    }
    let date = new Date;
    const options = {
        method: 'GET',
        url: 'https://covid-193.p.rapidapi.com/statistics',
        params: {country: ctx.query.country},
        headers: {
            'x-rapidapi-key': 'cd457c8509msh634a7248a0fdd62p151723jsn132cf630c616',
            'x-rapidapi-host': 'covid-193.p.rapidapi.com'
        }
    };
    let response = await axios.request(options).then(function (response) {
        return response.data.response[0];
    }).catch(function (error) {
        return error;
    });
    return {response};
}


export default CountryStatistic;