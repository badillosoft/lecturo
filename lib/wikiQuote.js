function getMyRandomQuote() {
    const myRandomArtistArray = ["Mercedes Sosa", "Atahualpa Yupanqui", "León Gieco", "Charly García", "Alí Primera", "Facundo Cabral"];
    const myRandomIndexArtist = randomRange(0, myRandomArtistArray.length - 1);//myRandomArtistArray.length - 1
    const autor = myRandomArtistArray[myRandomIndexArtist];
    WikiquoteApi.getRandomQuote(autor,
        function (myNewQuote) {
            console.log(myNewQuote);
            // $("#quote").html(myNewQuote.quote);
            // $("#autor").html(autor);
        },
        function (msg) {
            alert(msg);
        });
}

function randomRange(myMin, myMax) {
    return Math.floor(Math.random() * (myMax - myMin + 1)) + myMin;
}

let WikiquoteApi = (function () {

    let wqa = {};

    let API_URL = "https://es.wikiquote.org/w/api.php";//change to spanish url api

    /**
     * Query based on "titles" parameter and return page id.
     * If multiple page ids are returned, choose the first one.
     * Query includes "redirects" option to automatically traverse redirects.
     * All words will be capitalized as this generally yields more consistent results.
     */
    wqa.queryTitles = function (titles, success, error) {
        $.ajax({
            url: API_URL,
            dataType: "jsonp",
            data: {
                format: "json",
                action: "query",
                redirects: "",
                titles: titles
            },

            success: function (result, status) {
                let pages = result.query.pages;
                let pageId = -1;
                for (let p in pages) {
                    let page = pages[p];
                    // api can return invalid recrods, these are marked as "missing"
                    if (!("missing" in page)) {
                        pageId = page.pageid;
                        break;
                    }
                }
                if (pageId > 0) {
                    success(pageId);
                } else {
                    error("No results");
                }
            },

            error: function (xhr, result, status) {
                error("Error processing your query");
            }
        });
    };

    /**
     * Get the sections for a given page.
     * This makes parsing for quotes more manageable.
     * Returns an array of all "1.x" sections as these usually contain the quotes.
     * If no 1.x sections exists, returns section 1. Returns the titles that were used
     * in case there is a redirect.
     */
    wqa.getSectionsForPage = function (pageId, success, error) {
        $.ajax({
            url: API_URL,
            dataType: "jsonp",
            data: {
                format: "json",
                action: "parse",
                prop: "sections",
                pageid: pageId
            },

            success: function (result, status) {
                let sectionArray = [];
                let sections = result.parse.sections;
                for (let s in sections) {
                    let splitNum = sections[s].number.split('.');
                    if (splitNum.length > 1 && splitNum[0] === "1") {
                        sectionArray.push(sections[s].index);
                    }
                }
                // Use section 1 if there are no "1.x" sections
                if (sectionArray.length === 0) {
                    sectionArray.push("1");
                }
                success({ titles: result.parse.title, sections: sectionArray });
            },
            error: function (xhr, result, status) {
                error("Error getting sections");
            }
        });
    };

    /**
     * Get all quotes for a given section.  Most sections will be of the format:
     * <h3> title </h3>
     * <ul>
     *   <li> 
     *     Quote text
     *     <ul>
     *       <li> additional info on the quote </li>
     *     </ul>
     *   </li>
     * <ul>
     * <ul> next quote etc... </ul>
     *
     * The quote may or may not contain sections inside <b /> tags.
     *
     * For quotes with bold sections, only the bold part is returned for brevity
     * (usually the bold part is more well known).
     * Otherwise the entire text is returned.  Returns the titles that were used
     * in case there is a redirect.
     */
    wqa.getQuotesForSection = function (pageId, sectionIndex, success, error) {
        $.ajax({
            url: API_URL,
            dataType: "jsonp",
            data: {
                format: "json",
                action: "parse",
                noimages: "",
                pageid: pageId,
                section: sectionIndex
            },

            success: function (result, status) {
                let quotes = result.parse.text["*"];
                let quoteArray = []

                // Find top level <li> only
                let $lis = $(quotes).find('li:not(li li)');
                $lis.each(function () {
                    // Remove all children that aren't <b>
                    $(this).children().remove(':not(b)');//elimina tags q pueden ser necesarios en la interpretacion de la cita
                    let $bolds = $(this).find('b');

                    // If the section has bold text, use it.  Otherwise pull the plain text.
                    if ($bolds.length > 0) {
                        quoteArray.push($bolds.html());
                    } else {
                        quoteArray.push($(this).html());
                    }
                });
                success({ titles: result.parse.title, quotes: quoteArray });
            },
            error: function (xhr, result, status) {
                error("Error getting quotes");
            }
        });
    };

    /**
     * Get Wikipedia page for specific section
     * Usually section 0 includes personal Wikipedia page link
     */
    wqa.getWikiForSection = function (title, pageId, sec, success, error) {
        $.ajax({
            url: API_URL,
            dataType: "jsonp",
            data: {
                format: "json",
                action: "parse",
                noimages: "",
                pageid: pageId,
                section: sec
            },

            success: function (result, status) {

                let wikilink;
                console.log('what is iwlink:' + result.parse.iwlinks);
                let iwl = result.parse.iwlinks;
                for (let i = 0; i < (iwl).length; i++) {
                    let obj = iwl[i];
                    if ((obj["*"]).indexOf(title) != -1) {
                        wikilink = obj.url;
                    }
                }
                success(wikilink);
            },
            error: function (xhr, result, status) {
                error("Error getting quotes");
            }
        });
    };
    /**
     * Search using opensearch api.  Returns an array of search results.
     */
    wqa.openSearch = function (titles, success, error) {
        $.ajax({
            url: API_URL,
            dataType: "jsonp",
            data: {
                format: "json",
                action: "opensearch",
                namespace: 0,
                suggest: "",
                search: titles
            },

            success: function (result, status) {
                success(result[1]);
            },
            error: function (xhr, result, status) {
                error("Error with opensearch for " + titles);
            }
        });
    };

    /**
     * Get a random quote for the given title search.
     * This function searches for a page id for the given title, chooses a random
     * section from the list of sections for the page, and then chooses a random
     * quote from that section.  Returns the titles that were used in case there
     * is a redirect.
     */
    wqa.getRandomQuote = function (titles, success, error) {

        let errorFunction = function (msg) {
            error(msg);
        };

        let chooseQuote = function (quotes) {
            let randomNum = Math.floor(Math.random() * quotes.quotes.length);
            success({ titles: quotes.titles, quote: quotes.quotes[randomNum] });
        };

        let getQuotes = function (pageId, sections) {
            let randomNum = Math.floor(Math.random() * sections.sections.length);
            wqa.getQuotesForSection(pageId, sections.sections[randomNum], chooseQuote, errorFunction);
        };

        let getSections = function (pageId) {
            wqa.getSectionsForPage(pageId, function (sections) { getQuotes(pageId, sections); }, errorFunction);
        };

        wqa.queryTitles(titles, getSections, errorFunction);
    };

    /**
     * Capitalize the first letter of each word
     */
    wqa.capitalizeString = function (input) {
        let inputArray = input.split(' ');
        let output = [];
        for (s in inputArray) {
            output.push(inputArray[s].charAt(0).toUpperCase() + inputArray[s].slice(1));
        }
        return output.join(' ');
    };

    return wqa;
}());