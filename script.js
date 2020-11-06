var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var noResults = "<h4 class='no-result font-italic text-center p-4'>No Results</h4>";
var totalNum = 0;
var showNum = false;

$(document).ready(function(){
  getNews("", "entertainment", "eNews");
  getNews("", "technology", "tNews");
  getNews("", "sports", "sNews");

  $("#searchbtn").on("click", function(event) {
    event.preventDefault();
    searchNews();
  });

  $("#searchquery").keypress(function(event) {
    if(event.key == "Enter") {
      event.preventDefault();
        searchNews();
    }
  });
});

function searchNews() {
  let search = $("#searchquery").val();
  $("#aNews").html("");
  // let totalNum = setTimeout(getNews(search, "entertainment", "eNews"), 3000)
  //         + setTimeout(getNews(search, "technology", "tNews"), 3000)
  //         + setTimeout(getNews(search, "sports", "sNews"), 3000);
  setTimeout(getNews(search, "entertainment", "eNews"), 1000);
  setTimeout(getNews(search, "technology", "tNews"), 1000);
  setTimeout(getNews(search, "sports", "sNews"), 100000000000);
  console.log(totalNum);

  if(totalNum == 0)
    $("#aNews").html(noResults);
  else {
    let temp = $("#aNews").html();
    $("#aNews").html(`<h4 class="text-center font-italic p-4">${totalNum} Results Found for "${search}"</h4>` + temp);
  }

  totalNum = 0;
}

function getNews(search, category, id) {
  let url;
  let output = "";
  let numArticles = 0;

  if(search == "") {
    showNum = false;
    url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=78b9d599c4f94f8fa3afb1a5458928d6`;
  }
  else {
    showNum = true;
    url = `https://newsapi.org/v2/top-headlines?q=${search}&country=us&category=${category}&apiKey=78b9d599c4f94f8fa3afb1a5458928d6`;
  }

  $.ajax({
    url: url, 
    method: "GET",
    dataType: "json", 

    beforeSend: function(){
      $("#loader").show();
    },

    complete:  function(){
      $("#loader").hide();
    },

    success: function(news) {
      let articles = news.articles;
      numArticles = news.totalResults;

      for(var i in articles) {
    
        let content = articles[i].content
        if(content != null) {
          content = content.substring(0, 200);
          lastSpace = content.lastIndexOf(" ");
          content = content.substring(0, lastSpace) +  `...<a class="article-link" href="${articles[i].url}" target="_blank" rel="noopner noreferrer">continue reading</a>`;
        }
        else
          content = "No content available, please click on the title for more information."

        let imageURL = articles[i].urlToImage;
        if(imageURL == null)
          imageURL = "https://www.dia.org/sites/default/files/No_Img_Avail.jpg"

        let tempDate = articles[i].publishedAt;
        let dateSplit = tempDate.split("-");
        let day = "";
        if (dateSplit[2].charAt(0) == "0")
          day = dateSplit[2].charAt(1)
        else
          day = dateSplit[2].substr(0, 2);
        let date = `${months[parseInt(dateSplit[1]) - 1]} ${day}, ${dateSplit[0]} at ${dateSplit[2].substr(3, 5)} UTC`;

        let title = articles[i].title.substr(0, articles[i].title.lastIndexOf(" - "))
        
        output += `
        <div class="article">
          <h6 class="article-source font-weight-bold">${articles[i].source.name}</h6>
          <h4 class="article-title"><a class="article-link" href="${articles[i].url}" target="_blank" rel="noopner noreferrer">${title}</a></h4>
          <p class="article-date font-italic">${date}</p>
          <div class="row d-flex">
            <div class="col-sm-4 image-container">
              <img class="article-img" src="${imageURL}" style="width: 100%;">
            </div>
            <div class="col-sm-8">
              <p class="article-content">${content}</p>
            </div>
          </div>
        </div>
        `;
      }

      id = `#${id}`;

      if(output == "") {
        $(id).html(noResults);
      }
      else {
        $("#aNews").append(output);

        if(showNum) {
          totalNum += numArticles;
          $(id).html(`<h4 class="text-center font-italic p-4">${numArticles} Results Found for "${search}"</h4>`);
        }

        $(id).append(output);
        console.log(totalNum);
      }
    },

    error: function(){
      console.log("error");
    }
  });
}