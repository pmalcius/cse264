// Library Client Side

function loadLibraryRows(books) {
  $("#libraryrows").empty();
  books.forEach((book, index) => {
    $("#libraryrows").append(`<tr><td>${book.title}</td><td>${book.author}</td><td>${book.ttype}</td><td>${book.publisher}</td><td>${book.year}</td><td>${getBookType(book)}</td></tr>`);
  });
}

function getBookType(book) {
  let type = [];
  if (book.hardcover) type.push("Hardcover");
  if (book.paperback) type.push("Paperback");
  if (book.ebook) type.push("Ebook");
  if (book.audio) type.push("Audio");
  return type.join(", ");
}

function loadAuthors() {
  $.ajax({
    url: "/authors",
    type: "GET",
    dataType: "json",
    success: function (authors) {
      authors.forEach(author => {
        $("#authorDropdown").append(`<option value="${author}">${author}</option>`);
      });
    }
  });
}

function loadPublishers() {
  $.ajax({
    url: "/publishers",
    type: "GET",
    dataType: "json",
    success: function (publishers) {
      publishers.forEach(publisher => {
        $("#publisherDropdown").append(`<option value="${publisher}">${publisher}</option>`);
      });
    }
  });
}

$("#authorDropdown").change(function() {
  $("#author").val($(this).val());
});

$("#publisherDropdown").change(function() {
  $("#publisher").val($(this).val());
});

$("#add").click(() => {
  $.ajax(
    "/add",
    {
      type: "GET",
      processData: true,
      data: {
        title: $("#title").val(),
        author: $("#author").val(),
        ttype: $("#ttype").val(),
        publisher: $("#publisher").val(),
        year: $("#year").val(),
        hardcover: $("#hardcover").is(":checked"),
        paperback: $("#paperback").is(":checked"),
        ebook: $("#ebook").is(":checked"),
        audio: $("#audio").is(":checked")
      },
      dataType: "json",
      success: function (books) {
        loadLibraryRows(books);
        // Clear and refresh author and publisher dropdowns
        $("#authorDropdown").empty();
        $("#publisherDropdown").empty();
        loadAuthors();
        loadPublishers();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert("Error: " + jqXHR.responseText);
        alert("Error: " + textStatus);
        alert("Error: " + errorThrown);
      }
    }
  );
  $("#title").val("");
  // $("#author").val(""); // No need to clear this field
  // $("#publisher").val(""); // No need to clear this field
  $("#year").val("");
});


function init() {
  //make the table invisible until we press list button
  $("#display").hide();

  loadAuthors();
  loadPublishers();
  $.ajax(
    "/load",
    {
      type: "GET",
      dataType: "json",
      success: function (books) {
        loadLibraryRows(books);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert("Error: " + jqXHR.responseText);
        alert("Error: " + textStatus);
        alert("Error: " + errorThrown);
      }
    }
  );
}

// Event listener for the "List" button
$("#list").click(function() {
  // Show the table when "List" button is clicked
  $("#display").show();
  // Optionally, you could reload the table data here if you want it to refresh every time the button is clicked
});

$( () => {
  init();
});