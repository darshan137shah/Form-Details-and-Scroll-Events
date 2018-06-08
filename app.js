var main = {
  dataRoot: [],

  getRootData: function(data) {
    this.dataRoot = data;
    this.displayTB(this.dataRoot.length);
  },

  updateLS: function (dataLS) {
    if(localStorage.storedData) {
      var tempArr = JSON.parse(localStorage.storedData);
      tempArr.push(dataLS);
      localStorage.storedData = JSON.stringify(tempArr);
    } else {
      localStorage.storedData = JSON.stringify(dataLS);
    }
    console.log()
    this.getRootData(JSON.parse(localStorage.storedData));
  },

  displayTB: (length) => {
         $( "tr#head" ).siblings().remove();
    for(var i=0; i< length; i++){
      $('#main_table').append(`<tr id="user_${i}">`);
      $('#user_' +[i]).prepend(`<td>${main.dataRoot[i]["firstname"]}</td>`);
      $('#user_' +[i]).append(`<td>${main.dataRoot[i]["lastname"]}</td>`);
      $('#user_' +[i]).append(`<td>${main.dataRoot[i]["email"]}</td>`);
      $('#user_' +[i]).append(`<td>${main.dataRoot[i]["location"]}</td>`);
      $('#user_' +[i]).append(`<td>${main.dataRoot[i]["phone"]}</td>`);
      $('#user_' +[i]).append(`<td>${main.dataRoot[i]["batch"]}</td>`);
      $('#user_' +[i]).append(`<td>Communication: ${main.dataRoot[i].address.Communication} <br/>Permanent: ${main.dataRoot[i].address.Permanent}</td>`);
  //For appending on clicked    $('#user_' +[i]).append(`<td class="ex">Google: ${array[i]["previous_employer"][0]} <br/>Facebook: ${array[i]["previous_employer"][1]} <br/>LinkedIn: ${array[i]["previous_employer"][2]}  </td>`);
      $('#user_' +[i]).append(`</tr>`);
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

$('#btn1').click(function() {
  $(':input[type="text"]').each(function() {
    if(this.value.trim() != "") {
      if(this.name == 'address-Communication') {
        console.log(this.value);
        newObj['address']['Communication'] = this.value;
      } else if(this.name == 'address-Permanent') {
        console.log(this.value);
        newObj['address']['Permanent'] = this.value;
      }else {
        newObj[this.name] = this.value;
      }
    } else {
      val.push(this.name);
    }
  });

  if(val.length > 0) {
    alert('It will show the warnings');
  } else {
    main.updateLS(newObj);
    console.log('Success!!!');
  }
})
