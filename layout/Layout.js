import Head from "next/head";
import s from "../styles/Layout.module.css"

const Layout = (props)=>{
    return (
        <>
            <Head>
                <title>{props.title}</title>
            </Head>
            <header className={s.header}>
                <h1 className={s.title}>COVID-19 Statistics</h1>
            </header>
            <main className={s.main}>
                {props.children}
            </main>
        </>
    )
}
export default Layout;
