import React, { useState, useEffect, useCallback } from 'react';
import { AdCard } from '../../components/AdCard/AdCard';
import { Search } from '../../components/Main/Search/Search';
import { Loader } from '../../components/UI/Loader/Loader';
import { URL_API } from '../../CONSTS';
import { CMain } from '../../containers/Main/CMain';
import './Main.css';

export const Main = () => {
    const [ads, setAds] = useState<Array<IAds>>([]);
    const [adsIds, setAdsIds] = useState<Array<IAdsIds>>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState({
        searchValue: '',
        searchCategory: '',
    });
    const [filterAds, setFilterAds] = useState<null | Array<IAds>>(null);
    const user_id = localStorage.getItem('user_id');

    useEffect(() => {
        fetch(`${URL_API}/ads/all`)
            .then((res) => res.json())
            .then((res) => {
                setAds(res.ads);
            });

        fetch(`${URL_API}/ads/favorites/${user_id}`)
            .then((res) => res.json())
            .then((res) => {
                setAdsIds(res.ads);
                setLoading(false);
            });

        getHrefSearch();
    }, [user_id]);

    useEffect(() => {
        filteredCards(ads);
    }, [ads]);

    useEffect(() => {
        console.log(search);
    }, [search]);

    function getHrefSearch(): void {
        if (
            window.location.search.includes('?searchCategory=') &&
            window.location.search.includes('?searchValue=')
        ) {
            setSearch({
                ...search,
                searchValue: decodeURIComponent(
                    window.location.search.split('?')[1].replace('searchValue=', ''),
                ),
                searchCategory: decodeURIComponent(
                    window.location.search.split('?')[2].replace('searchCategory=', ''),
                ),
            });
        } else if (window.location.search.includes('?searchValue=')) {
            setSearch({
                ...search,
                searchValue: decodeURIComponent(
                    window.location.search.split('?')[1].replace('searchValue=', ''),
                ),
                searchCategory: '',
            });
        } else if (window.location.search.includes('?searchCategory=')) {
            setSearch({
                ...search,
                searchCategory: decodeURIComponent(
                    window.location.search.split('?')[1].replace('searchCategory=', ''),
                ),
                searchValue: '',
            });
        }
    }

    function changeInputSearch(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
        if (e.nativeEvent.type === 'input') {
            setSearch({ ...search, searchValue: e.target.value });
        }

        if (e.nativeEvent.type === 'change') {
            setSearch({ ...search, searchCategory: e.target.value });
        }
    }

    function filteredCards(ads: any[]) {
        if (
            window.location.search.includes('?searchCategory=') ||
            window.location.search.includes('?searchValue=')
        ) {
            const filterCardsValue = ads.filter((card) =>
                card.ad_name.includes(search.searchValue),
            );
            const filterCardsCategory = filterCardsValue.filter((card) =>
                card.ad_category.includes(
                    search.searchCategory === 'Все' ? '' : search.searchCategory,
                ),
            );
            setFilterAds(filterCardsCategory);
        }
    }

    const mapAds = ads
        .map((a) => {
            const check = adsIds.filter((c) => c.favorite_id === a.ad_id);
            return (
                <AdCard
                    favorite={check[0] && check[0].favorite_user === Number(user_id)}
                    id={a.ad_id}
                    name={a.ad_name}
                    category={a.ad_category}
                    city={a.ad_city}
                    price={a.ad_price}
                    photo={a.ad_photo}
                    key={a.ad_id}
                    date={a.ad_date}
                    edit={a.ad_creator === Number(user_id)}
                />
            );
        })
        .reverse();

    const mapFilteredCards = filterAds
        ?.map((card) => {
            const check = adsIds.filter((c) => c.favorite_id === card.ad_id);
            return (
                <AdCard
                    favorite={check[0] && check[0].favorite_user === Number(user_id)}
                    id={card.ad_id}
                    name={card.ad_name}
                    category={card.ad_category}
                    city={card.ad_city}
                    price={card.ad_price}
                    photo={card.ad_photo}
                    key={card.ad_id}
                    date={card.ad_date}
                    edit={card.ad_creator === Number(user_id)}
                />
            );
        })
        .reverse();

    return (
        <>
            <CMain>
                <div className="ads-pages">
                    <div className="ads-page">
                        <Search change={changeInputSearch} search={search} />
                        <div className="ads-page-ads">
                            {loading ? (
                                <Loader />
                            ) : filterAds === null && ads.length ? (
                                mapAds
                            ) : filterAds?.length ? (
                                mapFilteredCards
                            ) : filterAds === null ? (
                                <div className="ads-page-not-found">Объявлений пока что нету</div>
                            ) : (
                                <div className="ads-page-not-found">
                                    По вашему запросу ничего не найдено
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CMain>
        </>
    );
};

interface IAds {
    ad_id: number;
    ad_name: string;
    ad_creator: number;
    ad_price: string;
    ad_category: string;
    ad_youtube: string;
    ad_description: string;
    ad_city: string;
    ad_telephone: string;
    ad_way_communication: string;
    ad_photo: string;
    ad_date: string;
    favorite_id: number;
    favorite_user: number;
}

interface IAdsIds {
    favorite_id: number;
    favorite_user: number;
}
