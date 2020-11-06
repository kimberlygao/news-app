var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var noResults = '<h4 class="no-result font-italic text-center p-4 m-0">No Results</h4>';
var showNum = false;

$(document).ready(function(){

  //get news on load
  getNews("", "entertainment", "eNews");
  getNews("", "technology", "tNews");
  getNews("", "sports", "sNews");

  //call searched news on click
  $("#searchbtn").on("click", function(event) {
    event.preventDefault();
    searchNews();
  });

  //call searched news on keypress
  $("#searchquery").keypress(function(event) {
    if(event.key == "Enter") {
      event.preventDefault();
        searchNews();

    }
  });
});

//function get searched news
function searchNews() {
  let search = $("#searchquery").val();
  $("#aNews").html(noResults);
  setTimeout(getNews(search, "entertainment", "eNews"), 3000)
  setTimeout(getNews(search, "technology", "tNews"), 3000)
  setTimeout(getNews(search, "sports", "sNews"), 3000);
}

//function get all news
function getNews(search, category, id) {
  let url; //url from news api
  let output = ""; //output to append
  let numArticles = 0; //number of articles

  if(search == "") { //empty search query
    showNum = false;
    url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=78b9d599c4f94f8fa3afb1a5458928d6`;
  }
  else { //non empty query
    showNum = true;
    url = `https://newsapi.org/v2/top-headlines?q=${search}&country=us&category=${category}&apiKey=78b9d599c4f94f8fa3afb1a5458928d6`;
  }

  $.ajax({
    url: url, 
    method: "GET",
    dataType: "json", 

    //show loader when start
    beforeSend: function(){
      $("#loader").show();
    },
    
    //hide loader when done
    complete:  function(){
      $("#loader").hide();
    },

    success: function(news) {
      let articles = news.articles; //all article arrays
      numArticles = news.totalResults; //number of articles

      for(var i in articles) {
        
        //edit content
        let content = articles[i].content;
        if(content != null) {
          content = content.substring(0, 200);
          lastSpace = content.lastIndexOf(" ");
          content = content.substring(0, lastSpace) +  `...<a class="article-link" href="${articles[i].url}" target="_blank" rel="noopner noreferrer">continue reading</a>`;
        }
        else
          content = `No content available, please click <a class="article-link" href="${articles[i].url}" target="_blank" rel="noopner noreferrer">here<a> for more information.`;

        //check if image needs to be replaced
        let imageURL = articles[i].urlToImage;
        if(imageURL == null)
          imageURL = "https://www.dia.org/sites/default/files/No_Img_Avail.jpg"

        //format the date
        let tempDate = articles[i].publishedAt;
        let dateSplit = tempDate.split("-");
        let day = "";
        if (dateSplit[2].charAt(0) == "0")
          day = dateSplit[2].charAt(1)
        else
          day = dateSplit[2].substr(0, 2);
        let date = `${months[parseInt(dateSplit[1]) - 1]} ${day}, ${dateSplit[0]} at ${dateSplit[2].substr(3, 5)} UTC`;

        //format source out of article
        let title = articles[i].title.substr(0, articles[i].title.lastIndexOf(" - "))
        
        //add div to output
        output += `
        <div class="article">
          <h6 class="article-source font-weight-bold">${articles[i].source.name}</h6>
          <h4 class="article-title"><a class="article-link" href="${articles[i].url}" target="_blank" rel="noopner noreferrer">${title}</a></h4>
          <p class="article-date font-italic">${date}</p>
          <div class="row d-flex">
            <div class="col-sm-4 image-container">
              <a href="${articles[i].url}" target="_blank" rel="noopner noreferrer"><img class="article-img" src="${imageURL}" style="width: 100%;"></a>
            </div>
            <div class="col-sm-8">
              <p class="article-content">${content}</p>
            </div>
          </div>
        </div>
        `;
      }
      
      //add # to id 
      id = `#${id}`;

      //output is empty -> no results
      if(output == "") {
        $(id).html(noResults); 

      }
      else { //has results 
        if($("#aNews").html() == noResults) { //check if all categories tab need to be reset
            $("#aNews").html("");
        }

        $("#aNews").append(output); //append to categories

        if(search != "") { //if not all articles, show number of results
          $(id).html(`<h4 class="text-center font-italic pt-4">${numArticles} Results Found for "${search}"</h4>`); //add num results
          $(id).append(output); //add output
        }
        else 
          $(id).html(output); //set output
      }
    },

    error: function(){
      console.log("error");
    }
  });
}