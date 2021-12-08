
$(document).ready(function () {


    let Data = {
        "search_keyword": "",
        "total_members_scraped": "",
        "members": []
    };


    var start = 0;
    var count = 100;


    var numberOfProfile = window.prompt("Enter No. of profiles to fetch");
    var numberOfPages, pageroundof, rem, pages;
    if (numberOfProfile <= 100) {
        count = numberOfProfile;
        pages = 1;
    }
    else {
        numberOfPages = numberOfProfile / 100;
        rem = numberOfPages % 1;
        rem = Number(rem.toFixed(2));
        pageroundof = numberOfPages - rem;

        if (rem != 0) {
            pages = pageroundof + 1;
        }
        else {
            pages = pageroundof;
        }


    }



    //Data.total_members_scraped = numberOfProfile;


    // Getting Search Keyword
    var keyword = /keyword\w*=([^;]+)/i.test(document.location) ? RegExp.$1 : false;
    var key_word = keyword.replaceAll('%', "").split('&')[0];
    //// console.log(key_word);

    Data.search_keyword = key_word;


    const extra = rem * 100;




    const startScrape = async () => {



        // Getting Search ID
        // var search_id = /Sear\w*ID=([^;]+)/i.test(document.location) ? RegExp.$1 : false;
        // var searchID = search_id.substring(0,10);
        ////console.log(searchID);

        // Getting SessionID

        //var sess_id = /SESS\w*ID=([^;]+)/i.test(document.location) ? RegExp.$1 : false;
        //var session_id = sess_id.replaceAll('%',"");
        ////console.log(session_id);



        // Getting CSRF Token from Browser
        var csrf_token = /SESS\w*ID=([^;]+)/i.test(document.cookie) ? RegExp.$1 : false;
        var csrf = csrf_token.split('"')[1];
        //console.log(csrf);

        // Getting Cookie
        var cookie = document.cookie.split(';')[0];
        //console.log(cookie);

        // Fetching Response From Server
        var myHeaders = new Headers();      // Creating Headers
        myHeaders.append("cookie", cookie); // Adding Browser Cookie to Header
        myHeaders.append("csrf-token", csrf); // Adding CSRF Token to Header
        myHeaders.append("x-restli-protocol-version", "2.0.0");

        // Requesting with Method, headers
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };



        //let res = "" ;

        // API Url for LinkedIn Sales Search
        fetch(`https://www.linkedin.com/sales-api/salesApiPeopleSearch?q=peopleSearchQuery&start=${start}&count=${count}&query=(doFetchHeroCard:true,keywords:${key_word},recentSearchParam:(doLogHistory:true),spellCorrectionEnabled:true,spotlightParam:(selectedType:ALL),doFetchFilters:true,doFetchHits:true,doFetchSpotlights:true)&decorationId=com.linkedin.sales.deco.desktop.search.DecoratedPeopleSearchHitResult-10`, requestOptions)
            .then(response => response.text())
            .then((result) => {
                let data = JSON.parse(result); // parsing the response into JSON Object
                let len = data.elements.length;

                /*
                 console.log(data.paging.start);
                console.log(data.paging.count);
                console.log(data.paging.total);
               */

                for (let i = 0; i < len - 1; i++) {


                    let past_role = "";
                    let industry = "";
                    let profilePictureUrl = "";
                    let profileUrn = data.elements[i].entityUrn.split('(')[1].replaceAll(")", "");
                    let profile_url = "https://www.linkedin.com/sales/people/" + profileUrn;
                    let conn_degree = "";
                    let premium = "";
                    let company_url = "";
                    let companyName = "";
                    let current_Company_tenure = "";
                    let title = "";
                    let summary = "";
                    let visited = "";
                    let companyNo = "";
                    let company_domain_url = "";



                    try {
                        if (data.elements[i].currentPositions[0].companyUrn.split('y:')[1] === undefined) {
                            companyNo = "1337";
                        }
                        else {
                            companyNo = data.elements[i].currentPositions[0].companyUrn.split('y:')[1];
                        }
                    } catch (error) { }


                    try {
                        if (data.elements[i].currentPositions[0].companyUrn === undefined) {
                            company_url = "Not Available";

                        }
                        else {
                            company_url = "https://www.linkedin.com/sales/company/" + data.elements[i].currentPositions[0].companyUrn.split('y:')[1];
                        }

                    } catch (error) {
                    }


                    try {
                        if (data.elements[i].viewed == true) {
                            visited = "Yes";
                        }
                        else {
                            visited = "No";
                        }
                    } catch (error) { }



                    try {
                        if (data.elements[i].summary === undefined) {
                            summary = "Not Available";
                        }
                        else {
                            summary = data.elements[i].summary.replaceAll(/[\"]/g, "").replaceAll('\n', "");
                        }
                    } catch (error) {

                    }

                    try {
                        title = data.elements[i].currentPositions[0].title;
                    } catch (error) { }

                    try {
                        let year = "";
                        let start_month = "";
                        let start_year = "";
                        if (data.elements[i].currentPositions[0].tenureAtCompany.numYears === undefined) {
                            year = "";
                        }
                        else {
                            year = data.elements[i].currentPositions[0].tenureAtCompany.numYears + " " + "Year";
                        }
                        if (data.elements[i].currentPositions[0].startedOn.month === undefined || data.elements[i].currentPositions[0].startedOn.year === undefined) {
                            start_month = "NA";
                            start_year = "NA";
                        }
                        else {
                            start_month = data.elements[i].currentPositions[0].startedOn.month;
                            start_year = data.elements[i].currentPositions[0].startedOn.year;
                        }
                        current_Company_tenure = "Started on: " + start_month + "/" + start_year + " " + "|| tenure at company " + year + " " + data.elements[i].currentPositions[0].tenureAtCompany.numMonths + " Month";
                    } catch (error) {

                    }

                    try {
                        companyName = data.elements[i].currentPositions[0].companyName;
                    } catch (error) { }

                    // checking if the Profile has PastRole
                    try {
                        if (data.elements[i].pastPositions === undefined) {
                            past_role = "No Past Experiences Available";
                        }
                        else {
                            past_role = data.elements[i].pastPositions;
                        }

                    } catch (error) { }


                    // checking if the profile has Industry information
                    try {

                        if (data.elements[i].currentPositions[0].companyUrnResolutionResult.industry === undefined) {
                            industry = "Not Available";
                        }
                        else {
                            industry = data.elements[i].currentPositions[0].companyUrnResolutionResult.industry;
                        }
                    } catch (error) { }


                    // Checking if the profilePicture is not throwing errror
                    try {
                        if (data.elements[i].profilePictureDisplayImage === undefined) {
                            profilePictureUrl = "Not Available";
                        }
                        else {
                            profilePictureUrl = data.elements[i].profilePictureDisplayImage.rootUrl + data.elements[i].profilePictureDisplayImage.artifacts[3].fileIdentifyingUrlPathSegment;
                        }
                    } catch (error) { }

                    // Making a string for the Profiles which are in your CONNECTION
                    try {
                        if (data.elements[i].degree == -1) {
                            conn_degree = "Your Connection";
                        }
                        else {
                            conn_degree = data.elements[i].degree;
                        }


                    } catch (error) { }

                    // Giving Premium a string YES/No for true?false
                    try {
                        if (data.elements[i].premium == true) {
                            premium = "Yes";
                        }
                        else {
                            premium = "No";
                        }
                    } catch (error) { }



                    // Pushing Data into Array Object named Data.Members
                    Data.members.push({
                        name: data.elements[i].fullName,
                        first_name: data.elements[i].firstName,
                        last_name: data.elements[i].lastName,
                        company: companyName,
                        company_domain: "Not Available",
                        designation: title,
                        location: data.elements[i].geoRegion,
                        tenure_at_company: current_Company_tenure,
                        premium_member: premium,
                        connection_degree: conn_degree,
                        industry: industry,
                        profile_viewed: visited,
                        company_url: company_url,
                        profile_pic: profilePictureUrl,
                        linkedin_profile_link: profile_url,
                        about: summary,
                        experiences: past_role,

                    })


                    try {

                        var myHeadersData = new Headers();
                        myHeadersData.append("cookie", cookie);
                        myHeadersData.append("csrf-token", csrf);
                        myHeadersData.append("x-restli-protocol-version", "2.0.0");

                        var requestOp = {
                            method: 'GET',
                            headers: myHeadersData,
                            redirect: 'follow'
                        };

                        try {

                            if (companyNo === "") {
                                companyNo = 100;
                            }
                            else {

                                fetch(`https://www.linkedin.com/sales-api/salesApiCompanies/${companyNo}?decoration=%28website%29`, requestOp)
                                    .then(response => response.text())
                                    .then(result => {
                                        obj = JSON.parse(result);
                                        Data.members[i].companyURl = obj.website;

                                        //console.log(obj)
/*
                                        try {
                                            if (obj.website === undefined) {
                                                company_domain_url = "Not Available";
                                                // console.log("Not Worked")

                                            }
                                            else {
                                                company_domain_url = obj.website;
                                                // console.log("worked")
                                            }
                                        } catch (error) {
                                        }
                                        Data.members[i].company_domain = company_domain_url;
*/

                                    })
                                    .catch(error => console.log('error', error))
                            }

                        } catch (error) { }



                    } catch (error) { }


                }



            })
            .catch(error => console.log('error', error));
    }

    // startScrape();
    // console.log(Data)



    for (let i = 1; i <= pages; i++) {

        setTimeout(() => {

            startScrape();
            start += 100;
            if (i === pages - 1) {
                count = extra;
            }

        }, 14000 * i);

    }




    setTimeout(() => {
        Data.total_members_scraped = Data.members.length;
        console.log(Data)
    }, 60000);
});























/*
Data.Members.push({
                                    profile_Name : data.elements[i].fullName,
                                    premium_member : data.elements[i].premium,
                                    connection_degree : data.elements[i].degree,
                                    location : data.elements[i].geoRegion,
                                    company : data.elements[i].currentPositions[0].companyName,
                                    industry :  data.elements[i].currentPositions[0].companyUrnResolutionResult.industry,
                                    profile_picture_url : data.elements[i].profilePictureDisplayImage.rootUrl,


                                    })



*/





/*** User Mimic for sales Navigator


$(document).ready( () => {


        console.log("reached")
        setTimeout(() => {

            let scrapeData = {
                "scraper" : "LinkedIn Sales Navigator",
                "Members" : [ {
                    "profile_name" : "",
                    "profile_url" : "",
                    "profile_pic_url" : "",
                    "company_name" : "",
                    "company_name_url" : "",
                    "designation" : "",
                    "company_duration": "",
                    "premium_member": "",
                    "connection_degree": "",
                    "location": "",
                    "past_role" :
                        {
                        "past_role_desiganation" : "",
                        "past_company_name" : "",
                        "past_company_url": "",
                        "past_company_duration" : "",
                    }

                }]
            }

            let data = [ {
                "profile_name" : "",
                "profile_url" : "",
                "profile_pic_url" : "",
                "company_name" : "",
                "company_name_url" : "",
                "designation" : "",
                "company_duration": "",
                "premium_member": "",
                "connection_degree": "",
                "location": "",
                "past_role" :
                    {
                    "past_role_desiganation" : "",
                    "past_company_name" : "",
                    "past_company_url": "",
                    "past_company_duration" : "",
                }

            }];


            const startScrape = () => {
                    setTimeout(() => {


                        let arr = [];





                var count  = document.getElementsByClassName('search-results__result-list')[0].childElementCount;
                console.log(count);

                for(let i=0;i<count;i++){

                    let user = document.getElementsByClassName('search-results__result-list')[0].children[i].querySelector('.ember-view > article');

                    let premium = user.children[1].children[1].children[0].children[1].children[1].querySelector('ul').childElementCount;

                    let past_role_des = document.getElementsByClassName('search-results__result-list')[0].children[i].querySelector('.result-context.relative.pt1').querySelector('.mt2');

                    var pastRole = ""

                    if(past_role_des == null ){
                        pastRole = "Not Available"

                    }
                    else{

                        pastRole = document.getElementsByClassName('search-results__result-list')[0].children[i].querySelector('.result-context.relative.pt1').querySelector('.mt2').innerText.split('\n') ;

                    }


                    var premium_mem = "";

                    if(premium == 2){
                        premium_mem  = "Yes";
                    }
                    else {
                        premium_mem  = "No";
                    }



                    arr.push({
                                // Fetching Profile Name
                              Profile_Name : user.children[1].children[1].children[0].children[1].children[0].children[0].innerText,

                              // Fetching Profile URL
                              profile_url : user.children[1].children[1].children[0].children[1].children[0].children[0].href,

                              // Fetching Profile Photo URL
                              profile_photo : user.children[1].children[1].children[0].children[0].children[0].href,

                              //Fetching Desiganation
                              desiganation : user.children[1].children[1].children[0].children[1].children[2].children[0].innerText,

                              //Fetching Company URL
                              company_url : user.children[1].children[1].children[0].children[1].children[2].children[1].querySelector('a').href,

                              //FEtching Company Name
                              company_name : user.children[1].children[1].children[0].children[1].children[2].children[1].querySelector('a').children[0].innerText,

                              //Fetching Company Duration
                             company_duration : user.children[1].children[1].children[0].children[1].children[3].innerText,

                             //Fetching Location
                             location : user.children[1].children[1].children[0].children[1].children[4].innerText,

                             //Fetching Degree Connection
                             //connection_degree : user.children[1].children[1].children[0].children[1].children[1].querySelector('li').children[1].innerText,

                             //Fetching LinkedIn Premium Details
                             LinkedIn_premium_member : premium_mem ,

                             // Fetching Past Roles
                             Past_Role : pastRole

                                });

                            }

                            console.log(arr)

                    }, 2000);


            }

            let number_of_profiles = window.prompt("Enter Number of Profiles to be scraped.")

            let n = Number (number_of_profiles);

            let pages = n/25;
            setTimeout(() => {

                for(let i=0;i<pages;i++){

                    console.log("woho");
                    startScrape();

                    console.log(scrapeData)

                    while(pages==0){

                    }
                }


            }, 5000);







        }, 20000);


})





 *name :  document.getElementsByClassName('search-results__result-list')[0].children[0].querySelector('.ember-view > article').children[1].children[1].children[0].children[1].children[0].children[0].innerText
 *
 *
 * profile_url : document.getElementsByClassName('search-results__result-list')[0].children[0].querySelector('.ember-view > article').children[1].children[1].children[0].children[1].children[0].children[0].href
 *
 *
 * profile_photo : document.getElementsByClassName('search-results__result-list')[0].children[i].querySelector('.ember-view > article').children[1].children[1].children[0].children[0].children[0].href;
 *
 * desiganation : document.getElementsByClassName('search-results__result-list')[0].children[0].querySelector('.ember-view > article').children[1].children[1].children[0].children[1].children[2].children[0].innerText
 *
 *
 * company_url : document.getElementsByClassName('search-results__result-list')[0].children[0].querySelector('.ember-view > article').children[1].children[1].children[0].children[1].children[2].children[1].children[0].children[0].href
 *
 * company_name : document.getElementsByClassName('search-results__result-list')[0].children[0].querySelector('.ember-view > article').children[1].children[1].children[0].children[1].children[2].children[1].children[0].children[0].children[0].innerText
 *
 * company_duration : document.getElementsByClassName('search-results__result-list')[0].children[0].querySelector('.ember-view > article').children[1].children[1].children[0].children[1].children[3].innerText
 *
 * location : document.getElementsByClassName('search-results__result-list')[0].children[0].querySelector('.ember-view > article').children[1].children[1].children[0].children[1].children[4].innerText
 *
 *
 * for(var i=0;i<25;i++){
    var n = document.getElementsByClassName('search-results__result-list')[0].children[i].querySelector('.ember-view > article').children[1].children[1].children[0].children[0].children[0];
    var imga = n.href;
    console.log(imga);}
 *
 */