if ($(".main__countries")[0]) {
    $(".filter__select").hide();
    $.getJSON("https://restcountries.com/v2/all")
        .done(function (data) {
            for (let i = 0; i < 6; i++) {
                addCountry(data[i]);
            }
            $(".main__countries").append('<button class="countries__more w-full py-3 rounded-md shadow-md text-sm font-semibold lg:col-span-3 xl:col-span-4">Show All</button>');
            $(".countries__more").click(function (e) {
                e.preventDefault();
                $(this).hide();
                for (let i = 6; i < data.length; i++) {
                    addCountry(data[i]);
                }
            })
        })
        .fail(function () {
            const content = `
            <div class="main__fail rounded-md shadow-md text-center py-8">
                <h2 class="font-extrabold text-base mb-2">Could Not Fetch Countries</h2>
                <span class="text-sm">Please Try Again Later</span>
            </div>`;
            $(".main__countries").append(content);
        });

    $(".form__search").submit(function (e) {
        e.preventDefault();
        let url;
        if ($(".search__input").val()) {
            url = `https://restcountries.com/v2/name/${$(".search__input").val()}`;
        } else {
            url = "https://restcountries.com/v2/all";
        }
        $(".main__countries").empty();
        $.getJSON(url)
            .done(function (data) {
                for (let i = 0; i < 6; i++) {
                    if (data[i]) {
                        addCountry(data[i]);
                    }
                }
                if (data.length > 6) {
                    $(".main__countries").append('<button class="countries__more w-full py-3 rounded-md shadow-md text-sm font-semibold lg:col-span-3 xl:col-span-4">Show All</button>');
                    $(".countries__more").click(function (e) {
                        e.preventDefault();
                        $(this).hide();
                        for (let i = 3; i < data.length; i++) {
                            addCountry(data[i]);
                        }
                    })
                }
            })
            .fail(function () {
                const content = `
                <div class="main__fail rounded-md shadow-md text-center py-8">
                    <h2 class="font-extrabold text-base mb-2">Could Not Fetch Countries</h2>
                    <span class="text-sm">Please Try Again Later</span>
                </div>`;
                $(".main__countries").append(content);
            });
    });

    $(".form__filter").click(function (e) {
        if ($(".filter__select").is(":hidden")) {
            $(".filter__select").slideDown("slow");
        } else {
            $(".filter__select").slideUp("slow");
        }

    });

    $(".select__region").click(function (e) {
        e.preventDefault();
        $(".main__countries").empty();
        $.getJSON(`https://restcountries.com/v2/region/${$(this).val()}`)
            .done(function (data) {
                for (let i = 0; i < 6; i++) {
                    addCountry(data[i]);
                }
                $(".main__countries").append('<button class="countries__more w-full py-3 rounded-md shadow-md text-sm font-semibold lg:col-span-3 xl:col-span-4">Show All</button>');
                $(".countries__more").click(function (e) {
                    e.preventDefault();
                    $(this).hide();
                    for (let i = 6; i < data.length; i++) {
                        addCountry(data[i]);
                    }
                })
            })
            .fail(function () {
                const content = `
            <div class="countries__fail rounded-md shadow-md text-center py-8">
                <h2 class="font-extrabold text-base mb-2">Could Not Fetch Countries</h2>
                <span class="text-sm">Please Try Again Later</span>
            </div>`;
                $(".main__countries").append(content);
            });
    });
} else {
    let country = new URLSearchParams(window.location.search).get("country");
    $.getJSON(`https://restcountries.com/v2/alpha/${country}`)
        .done(function (data) {
            addDetails(data);
        })
        .fail(function () {
            const content = `
            <div class="main__fail rounded-md shadow-md text-center py-8">
                <h2 class="font-extrabold text-base mb-2">Could Not Fetch Countries</h2>
                <span class="text-sm">Please Try Again Later</span>
            </div>`;
            $(".main__details").append(content);
        });
}

$(".header__theme").click(function (e) {
    e.preventDefault();
    $("body").toggleClass("dark-mode");
});

function addCountry(country) {
    const content = `
    <a class="countries__country rounded-md shadow-md overflow-hidden" href="country.html?country=${country.alpha3Code.toLowerCase()}">
        <img src="${country.flags.png}" class="country__flag">
        <div class="country__content px-6 pt-8 pb-12 flex flex-col gap-1">
            <h2 class="font-extrabold text-lg mb-4">${country.name}</h2>
            <span class="text-sm"><span class="font-semibold">Population:</span> ${country.population.toLocaleString()}</span>
            <span class="text-sm"><span class="font-semibold">Region:</span> ${country.region}</span>
            <span class="text-sm"><span class="font-semibold">Capital:</span> ${country.capital}</span>
        </div>
    </a>`
    $(".main__countries").append(content);
}

function addDetails(country) {
    let languages = currencies = borderSection = "";
    for (let i = 0; i < country.languages.length; i++) {
        languages += `${country.languages[i].name}, `;
    }
    for (let i = 0; i < country.currencies.length; i++) {
        currencies += `${country.currencies[i].name}, `;
    }
    if (country.borders) {
        for (let i = 0; i < country.borders.length; i++) {
            $.getJSON(`https://restcountries.com/v2/alpha/${country.borders[i]}`)
                .done(function (data) {
                    const borderCountry = `<a class="border__country px-6 rounded-sm shadow-md text-center text-xs py-2 grow" href="country.html?country=${data.alpha3Code.toLowerCase()}">${data.name}</a>`;
                    $(".details__border").append(borderCountry);
                })
        }
        borderSection = `<h2 class="text-base mb-4 font-semibold">Border Countries:</h2><div class="details__border flex justify-center gap-2 flex-wrap"></div>`;
    }

    const content = `<img src="${country.flags.png}" class="w-full mb-10">
    <h1 class="font-extrabold text-xl mb-4">${country.name}</h1>
    <span class="text-sm mb-2"><span class="font-semibold">Native Name: </span>${country.nativeName}</span>
    <span class="text-sm mb-2"><span class="font-semibold">Population: </span>${country.population.toLocaleString()}</span>
    <span class="text-sm mb-2"><span class="font-semibold">Region: </span>${country.region}</span>
    <span class="text-sm mb-2"><span class="font-semibold">Sub Region:</span> ${country.subregion}</span>
    <span class="text-sm mb-10"><span class="font-semibold">Capital: </span>${country.capital}</span>
    <span class="text-sm mb-2"><span class="font-semibold">Top Level Domain: </span>${country.topLevelDomain[0]}</span>
    <span class="text-sm mb-2"><span class="font-semibold">Currencies: </span>${currencies.slice(0, -2)}</span>
    <span class="text-sm mb-10"><span class="font-semibold">Languages: </span>${languages.slice(0, -2)}</span>
    ${borderSection}`;
    $(".main__details").append(content);
}