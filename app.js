var main = {
  dataRoot: [],

  getRootData: function(data) {
    this.dataRoot = data;
    ($('.counts').val() == "onscroll") ? this.displayTB(10) : this.displayTB(Number($('.counts').val()));;
  },

  updateLS: function (dataLS) {
    if(localStorage.storedData) {
      var tempArr = JSON.parse(localStorage.storedData);
      tempArr.push(dataLS);
      localStorage.storedData = JSON.stringify(tempArr);
    } else {
      localStorage.storedData = JSON.stringify(dataLS);
    }
    this.getRootData(JSON.parse(localStorage.storedData));
  },

  changesLS: function() {
    localStorage.storedData = JSON.stringify(this.dataRoot);
    ($('.counts').val() == "onscroll") ? this.displayTB(10) : this.displayTB(Number($('.counts').val()));;
  },

  editDataRoot: function(id, dataName) {
    // var id = Number[id.substr(5, 3)];
    // main.dataRoot[i][dataName] = dataName;
  },

  displayTB: (length) => {
    $( "tr#head" ).siblings().remove();
    for(var i = (main.dataRoot.length - 1) ; i > (main.dataRoot.length - 1 - length) ; i--){
      if(main.dataRoot[i]) {
        $('#main_table').append(`<tr id="user_${i}">`);
        $('#user_' +[i]).prepend(`<td>${main.dataRoot[i]["firstname"]}</td>`);
        $('#user_' +[i]).append(`<td>${main.dataRoot[i]["lastname"]}</td>`);
        $('#user_' +[i]).append(`<td>${main.dataRoot[i]["email"]}</td>`);
        $('#user_' +[i]).append(`<td>${main.dataRoot[i]["location"]}</td>`);
        $('#user_' +[i]).append(`<td>${main.dataRoot[i]["phone"]}</td>`);
        $('#user_' +[i]).append(`<td>${main.dataRoot[i]["batch"]}</td>`);
        $('#user_' +[i]).append(`<td>Communication: ${main.dataRoot[i].address.Communication} <br/>Permanent: ${main.dataRoot[i].address.Permanent}</td>`);
        $('#user_' +[i]).append(`<input type="button" id="view_${i}" class='ctrl-btn' value="View">`);
        $('#user_' +[i]).append(`<input type="button" id="edit_${i}" class='ctrl-btn' value="Edit">`);
        $('#user_' +[i]).append(`<input type="button" id="delete_${i}" class='ctrl-btn' value="Delete">`);
        $('#user_' +[i]).append(`</tr>`);
      } else {
        $('#main_table').append(`<tr id="user_${i}" class='hidden'>`);
        $('#user_' +[i]).append(`</tr>`);
      }
    }
  }
}

var loadTheData = (ajax) => {
  var array = [];
  for(var i=0; i < 100; i++) {
    var obj = {};
    obj.firstname = ajax.first[Math.round(Math.random()*93)];
    obj.lastname = ajax.last[Math.round(Math.random()*46)];
    obj.email = "user" + Math.round(Math.random() * 380) + "@gmail.com";
    obj.location = [ajax.states[Math.round(Math.random()*55)], ajax.states[Math.round(Math.random()*38)], ajax.states[Math.round(Math.random()*38)]];
    obj.phone = "(" + (Math.round(Math.random() * 5) + 100) + ")" + "-" +  (Math.floor(Math.random() * 510) + 201) + "-" + (Math.floor(Math.random() * 50) + 1000) ;
    obj.batch = ajax.batch[Math.round(Math.random() * 4)];
    obj.address = {
      "Communication": ajax.companies[Math.round(Math.random() * 11)] + ", " + ajax.states[Math.round(Math.random()*55)],
      "Permanent": ajax.companies[Math.round(Math.random() * 11)] + ", " + ajax.states[Math.round(Math.random()*55)]
    };
    obj.previous_employer = ["Computer Programmer", "Front end Developer", "Software Engineer"];
    array.push(obj);
  }
  main.updateLS(array);
}

var newPromise = new Promise(function(res, rej) {
  if(!localStorage.storedData) {
      var data =   $.ajax({
          type: "GET",
          url: "http://127.0.0.1:8001/data.json",
          success: function(data) {
            return "success";
          },
          error: function(err) {
            return err;
          }
        });

      if(data) {
        res(data);
      } else {
        rej(err);
      }
  } else {
    main.getRootData(JSON.parse(localStorage.storedData));
  }
});

newPromise.then(
  function(data) {
    loadTheData(data);
  },
  function(err) {
    console.log("Data is not present" + err);
  }
);

//Retrieving form data
var newObj = {firstname:"", lastname:"", location:"",phone:"", previous_employer:"",email:"", batch:"", address: {Communication: "",Permanent: ""}};
var val = [];

//Form Validations and Data Rendering
$('#btn1').click(function() {
  $('form#myForm :input[type="text"]').each(function() {
    if(this.value.trim() != "") {
      if(this.name == 'address-Communication') {
        newObj['address']['Communication'] = this.value;
      } else if(this.name == 'address-Permanent') {
        newObj['address']['Permanent'] = this.value;
      }else {
        newObj[this.name] = this.value;
      }
    } else {
      val.push(this.name);
    }
  });

  if(val.length > 0) {
    alert(`Please fill the followings: ${val}`);
  } else {
    main.updateLS(newObj);
  }
})

// View Content Function
var viewContent = function(id, isEditable) {
  var ele = $('.views' + id);
  var data = main.dataRoot[id];
  var eleCss = ele.css('display');
  if(ele.length == 0)  {
    $('tr#user_'+id).before('<td id="one" class="views' + id + '"></td>');
    var form = `
      <td><input type="text" name="firstname" value="${data.firstname}" placeholder="First Name"></td>
      <td><input type="text" name="lastname" value="${data.lastname}"  placeholder="Last Name" ></td>
      <td><input type="text" name="email" value="${data.email}" placeholder="Email" ></td>
      <td><input type="text" name="location" value="${data.location}" placeholder="Location" ></td>
      <td><input type="text" name="phone" value="${data.phone}" placeholder="Phone" ></td>
      <td><input type="text" name="batch" value="${data.batch}"  placeholder="Batch" ></td>
      <td><input type="text" name="address-Communication" value="${data.address.Communication}" placeholder="Address Communication" >
      <input type="text" name="address-Permanent" value="${data.address.Permanent}" placeholder="Address Parmanent" >
      <input type="text" name="previous_employer" value="${data.previous_employer}" placeholder="Previous Employer" >
      <input type="button" id="updateData_${id}" name="btn1" value="Submit"></td>
    `;
    $("td[class='views"+id+"']").html(form);
    // $('.views'+id+' input').attr('disabled', true);
  } else if(eleCss == 'table-row-group') {
    ele.css('display','none');
  } else {
    ele.css('display','table-row-group');
  }

  if (isEditable) {
    $(`#updateData_${id}`).css('display', '');
  } else {
    $(`#updateData_${id}`).css('display', 'none');
  }
}


//View Btn Events
$('table').on('click', 'input[id^=view]', function() {
  var id = this.id.substr(5, 3);
  viewContent(id, false);
})

//Edit Btn Events
$('table').on('click', 'input[id^=edit]', function() {
  //getting the data of that id from editDataRoot
  var id = this.id.substr(5, 3);
  viewContent(id, true);
  // updateInstance = newInstance;
})


//Update Data Function
// ******************Validation for the second form
function update(id) {
var newObj = {firstname:"", lastname:"", location:"",phone:"", previous_employer:"",email:"", batch:"", address: {Communication: "",Permanent: ""}};
var val = [];

  $(`.views${id} input[type="text"]`).each(function() {
    if(this.value.trim() != "") {
      if(this.name == 'address-Communication') {
        newObj['address']['Communication'] = this.value;
      } else if(this.name == 'address-Permanent') {
        newObj['address']['Permanent'] = this.value;
      }else {
        newObj[this.name] = this.value;
      }
    } else {
      val.push(this.name);
    }
  });

  if(val.length > 0) {
    alert(`Please fill the followings: ${val}`);
  } else {
    main.dataRoot[id] = newObj;
    main.changesLS();
    $('.views' + id).css('display', 'none');
  }
}

$('table').on('click', 'input[id^=updateData]', function() {
  var id = this.id.substr(11, 3);
  update(id);
})


//Delete Data Function
$('table').on('click', 'input[id^=delete]', function() {
  //getting the data of that id from editDataRoot
  var id = this.id.substr(7, 3);
  delete main.dataRoot[id];
  main.changesLS();
  // viewContent(id, true);
  // updateInstance = newInstance;
});

//OnScroll Event
//View Counts Event
$('.counts').change(function() {
  if(this.value == 'onscroll') {
    k = 10;
    main.displayTB(10);
    $(window).scroll(function() {
         if(($(window).scrollTop() + $(window).height()) == $(document).height()) {
           if (k == main.dataRoot.length) {
            } else if (k <= (main.dataRoot.length-10)) {
               k = k + 10;
               main.displayTB(k);
            } else if (k >= (main.dataRoot.length-10)) {
               k = k + 1;
               main.displayTB(k);
            }
         }
    });
  } else {
    k = undefined;
    main.displayTB(this.value);
  }
})


//Search function
function myFunction(keyValue, f) {
  var filter, table, tr;
  filter = keyValue.toUpperCase();
  table = $("table");

  var tr = $("tr[id^='user'] > td:nth-of-type(" + f + ")");
   tr.each(function(index, e)  {
    if($(e).text().toUpperCase().indexOf(filter) > -1) {
      $(this).parent().css('display', '')
    } else {
      $(this).parent().css('display', 'none')
    }
  })
}

//Search Input Event
$("#search").on("keyup", function() {
  f = $('.searchby').val();
  myFunction(this.value, Number(f));
})
