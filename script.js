var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var noResults = "<h4 class='article-title no-result p-2'>NO RESULTS FOUND</h4>";
$(document).ready(function(){
  getNews("", "entertainment", "eNews");
  getNews("", "technology", "tNews");
  getNews("", "sports", "sNews");

  $("#searchbtn").on("click", function(event) {
    event.preventDefault();

    let search = $("#searchquery").val();
    $("#aNews").html("");
    getNews(search, "entertainment", "eNews");
    getNews(search, "technology", "tNews");
    getNews(search, "sports", "sNews");
  });
});

function getNews(search, category, id) {
  let url;
  let output = "";

  if(search == "")
    url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=78b9d599c4f94f8fa3afb1a5458928d6`;
  else
    url = `https://newsapi.org/v2/top-headlines?q=${search}&country=us&category=${category}&apiKey=78b9d599c4f94f8fa3afb1a5458928d6`;

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

      for(var i in articles) {
    
        let content = articles[i].content
        if(content != null) {
          content = content.substring(0, 200);
          lastSpace = content.lastIndexOf(" ");
          content = content.substring(0, lastSpace) +  `...<a class="article-link" href="${articles[i].url}" target="_blank">continue reading</a>`;
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
          <h4 class="article-title"><a class="article-link" href="${articles[i].url}" target="_blank">${title}</a></h4>
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

      if(output == "") {
        output = noResults;
      }

      id = "#" + id;
      $(id).html(output);

      if($("#aNews").html() == "" || $("#aNews").html() == noResults) {
        $("#aNews").html(output);
      }
      else if(output != noResults){
        $("#aNews").append(output);
      }
    },

    error: function(){
      console.log("error");
    }
  });
}