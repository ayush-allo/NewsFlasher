import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import NewsComponent from './components/NewsComponent'
import SideBar from './components/SideBar'
import TrendingNews from './components/TrendingNews'
import NavBar from './components/NavBar'
import Router from 'next/router';
import { useEffect, useState } from 'react'

export default function Home(props) {
  const [categories, setCategories] = useState('');
  const [query, setQuery] = useState('');
  const [showHam, setShowHam] = useState(true);

  const changeHam = () => {
    setShowHam(!showHam);
  }
  //outside hamburger click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('.hamActive')) {
        return;
      }
      setShowHam(true);
    }
    document.addEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(()=>{
    let s1 = categories !== ''?'category='+categories+'&':'';
    let s2 = query !== ''?'q='+query:'';
    Router.push(`?${s1}${s2}`);
  },[categories,query])
  
  //for debounce search data
  const data=[];
  props.articles.map(item => data.push(item.title));

  return (
    <>
      <Head>
        <title>My News App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.circles}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <main style={{ display: 'flex' }}>
        <SideBar setCategories={setCategories} ham = {showHam}/>
        <div className={styles.container}>
          <NavBar setQuery={setQuery} data={data} ham = {showHam} changeHam = {changeHam} />
          <div className={styles.cont2}>
            <NewsComponent news={props.articles} />
            <TrendingNews news={props.trendingArticles}/>
          </div>
        </div>
      </main>
    </>
  )
}
export const getServerSideProps = async (context) => {

  let trendingUrl = {"articles":[]};
  trendingUrl = `https://newsapi.org/v2/top-headlines?pageSize=20&country=in`;
  const trendingData = await fetch(trendingUrl,
    {
      headers: {
          Authorization: `Bearer ${process.env.NEWS_API_KEY}`,
      },
  },
    ).then(response => response.json());

  const query = context.query;
  let category = 'general';
  let q='';
  if(query.category) category=query.category;
  if(query.q) q=query.q;

  const url = `https://newsapi.org/v2/top-headlines?q=${q}&category=${category}&language=en&pageSize=100`;
  let data = {"articles":[]};
  data = await fetch(url,
    {
      headers: {
          Authorization: `Bearer ${process.env.NEWS_API_KEY}`,
      },
  },
    ).then(response => response.json());

  return {
    props: {articles: data.articles, trendingArticles:trendingData.articles}
  }
}

