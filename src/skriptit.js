//En mä ny ihan joka riviä rupee kommentoimaan

//Modifies size of main elements to fit on screen on start and when window is resized
function screenSize(){
	var leftlist = document.getElementById("leftview");
	var rightlist = document.getElementById("rightview");

	leftlist.style.width = (window.innerWidth/2)-50+"px";
	leftlist.style.height = (window.innerHeight)-130+"px";

	rightlist.style.width = (window.innerWidth/2)-50+"px";
	rightlist.style.height = (window.innerHeight)-130+"px";

	redrawList();
}

//Called from HTML when creating new todo
function validateTodo(){
	if (validateAll()){
		//dlday muodossa yyyy-mm-dd
		//dltime muodossa hh:mm //tunnit 24
		addNew(document.newtodo.todo.value, document.newtodo.dlday.value, document.newtodo.dltime.value);
		return false;
	} else {
		return false;
	}
}

//Validates the text from new todo or when modifying:
function validateContent(todo){
	if (todo == null || todo == "") {
		return false;
	} else return true;
}

//Validates day input in new todo and when modifying
function validateDay(dayArr){ // [YYYY, MM, DD]

	//Parsing to integers:
	if (!(dayArr[0] = parseInt(dayArr[0]))) return false; //NaN or 0 == false :: !false == true == fail
	if (!(dayArr[1] = parseInt(dayArr[1]))) return false;
	if (!(dayArr[2] = parseInt(dayArr[2]))) return false;
	//Days in months
	var monthDays = [31,28,31,30,31,30,31,31,30,31,30,31];

	if ( (dayArr[0]%4==0 && !(dayArr[0]%100==0)) || dayArr[0]%400==0 ){
		//This is a leap year
		monthDays[1] = 29;
	}

	if ( !(dayArr[0] >= 2000 && dayArr[0] < 2100) ) return false;
	if ( !(dayArr[1] >= 1 && dayArr[1] <= 12) ) return false;
	if ( !(dayArr[2] >= 1 && dayArr[2] <= monthDays[dayArr[1]-1]) ) return false;

	return true;
}

//Validates time for new or modified todo
function validateTime(timeArr){ //[HH, MM]
	if ( !((timeArr[0] = parseInt(timeArr[0])) || timeArr[0] == 0) ) return false; //Same as above validateDay but 0 is okay 
	if ( !((timeArr[1] = parseInt(timeArr[1])) || timeArr[1] == 0) ) return false;
	//hours in day and minutes in hour:
	if ( !(timeArr[0] >= 0 && timeArr[0] < 24) ) return false;
	if ( !(timeArr[1] >= 0 && timeArr[1] < 60) ) return false;

	return true;
}

//Used when creating new todo:
function validateAll(){
	//Modifying strings to correct format
	var dayArr = document.newtodo.dlday.value.split("-");
	var timeArr = document.newtodo.dltime.value.split(":");
	var todo = document.newtodo.todo.value;

	var allGood = true;//To be returned
	var thisGood = true;//Temporary bool for different validations

	//Setting help-text to none and input fields to default
	document.getElementById("help").innerHTML = "";
	document.newtodo.todo.style.color = "BLACK";
	document.newtodo.todo.style.backgroundColor = "WHITE";
	document.newtodo.dlday.style.color = "BLACK";
	document.newtodo.dlday.style.backgroundColor = "WHITE";
	document.newtodo.dltime.style.color = "BLACK";
	document.newtodo.dltime.style.backgroundColor = "WHITE";

	//if validation fails, modify help and mark fields red
	if (!(thisGood = validateContent(todo)) ){
		document.getElementById("help").innerHTML += "Write something to do! "
		document.newtodo.todo.style.color = "WHITE";
		document.newtodo.todo.style.backgroundColor = "RED";
		console.log("content wrong");
	}
	allGood = allGood && thisGood;
	
	//if validation fails, modify help and mark fields red
	if (!(thisGood = validateDay(dayArr)) ){
		document.getElementById("help").innerHTML += "Day format is YYYY-MM-DD. Years 2000-2099. "
		document.newtodo.dlday.style.color = "WHITE";
		document.newtodo.dlday.style.backgroundColor = "RED";
		console.log("day wrong")
	}
	allGood = allGood && thisGood;

	//if validation fails, modify help and mark fields red
	if (!(thisGood = validateTime(timeArr)) ){
		document.getElementById("help").innerHTML += "Time format is HH:MM."
		document.newtodo.dltime.style.color = "WHITE";
		document.newtodo.dltime.style.backgroundColor = "RED";
		console.log("time wrong");
	}
	allGood = allGood && thisGood;
	//If all validations passed return true:
	return allGood;
}

//Adding already validated new todo:
function addNew(inText, inDate, inTime){

	//This is a todo:
	var htmlToPush = `
		<div class="listobject">
			<div class="todocontent">`+inText+`</div>
			<div class="rightfloater">
				<div class="tododeadline">`+formatDate(inDate)+"<br>"+formatTime(inTime)+`</div>
				<div class="control">
					Done :<input type="checkbox" class="donebox" name="checktest" value="undone" onchange="doneCheck(this);"><br>
					<select class="chtodo" onchange="todoMod();">
						<option value="modify">Modify</option>
						<option value="chcontent">Todo</option>
						<option value="chdeadline">Deadlin</option>
						<option value="deltodo">Delete</option>
					</select>
				</div>
			</div>
			<div style="clear:both;"></div>
		</div>
	`;
	
	//adds new todo to bottom of list:
	document.getElementById("leftview").innerHTML += htmlToPush;

	//This function handles sorting:
	redrawList();
}

//Date should be YY-MM-DD
function formatDate(inDate){
	inDateArr = inDate.split("-");
	inDateArr[0] = parseInt(inDateArr[0]);//Make sure there's no text in these
	inDateArr[1] = parseInt(inDateArr[1]);
	inDateArr[2] = parseInt(inDateArr[2]);
	return ("00"+inDateArr[2]).slice(-2)+"-"+("00"+inDateArr[1]).slice(-2)+"-"+("00"+inDateArr[0]).slice(-2);

}

//Time should be HH:MM
function formatTime(inTime){
	inTime = inTime.split(":");
	inTime[0] = parseInt(inTime[0]);//Make sure there's no text
	inTime[1] = parseInt(inTime[1]);
	return ("00"+inTime[0]).slice(-2)+":"+("00"+inTime[1]).slice(-2);
}

//Checking done-checkbox on onChange and coloring todo to grey or white
function doneCheck(check){
	if (check.value == "undone"){
		check.value = "done";
		check.parentNode.parentNode.parentNode.style.backgroundColor = "#757474";
	} else {
		check.value = "undone";
		check.parentNode.parentNode.parentNode.style.backgroundColor= "WHITE";
	}
}

//HTML onChange: Selecting something else than "Modify" from todo's dropdown:
function todoMod(){

	var found = false;//Used for setting dropdown back to default state and stopping for-loop
	//Find the offending todo:
	for (i = 0; i < document.getElementsByClassName("listobject").length; i++){
		switch (document.getElementsByClassName("listobject")[i].getElementsByClassName("chtodo")[0].value){
			case "modify":	//default state
				break;
			case "chcontent":
				changeContent(document.getElementsByClassName("listobject")[i]);
				found = true;
				break;
			case "chdeadline":
				changeDeadline(document.getElementsByClassName("listobject")[i])
				found = true;
				break;
			case "deltodo":
				delTodo(document.getElementsByClassName("listobject")[i]);
				break;
		}
		//Back to default & end loop:
		if (found){
			document.getElementsByClassName("listobject")[i].getElementsByClassName("chtodo")[0].value = "modify";
			break;
		}
	}
	//Deadlines may have been changed so new sort:
	redrawList();
}

//Delete todo from dropdown:
function delTodo(todo){
	if (confirm("Are you sure you want to delete this todo?")) todo.remove();
}

//Changing deadline from dropdown:
function changeDeadline(todo){

	var dateTime = todo.getElementsByClassName("tododeadline")[0].innerHTML.split("<br>");
	//Rearranging data:
	try {
		var newTime = prompt("Modify deadline:",dateTime[0]+" "+dateTime[1]);
		var tempArr = newTime.split(" ")[0].split("-");
		var newDayArr = ["20"+tempArr[2], tempArr[1], tempArr[0]];
		tempArr = newTime.split(" ")[1].split(":");
		var newTimeArr = tempArr;
	}catch(error){return false;}	//in case the input is totally wrong
	if (validateDay(newDayArr) && validateTime(newTimeArr)){
		var date = newDayArr[0]+"-"+newDayArr[1]+"-"+newDayArr[2];
		//Put stuff back in the same order as found:
		todo.getElementsByClassName("tododeadline")[0].innerHTML = formatDate(date)+"<br>"+formatTime(newTime.split(" ")[1]);
	}
	
}

//Changing todo text from dropdown:
function changeContent(todo){
	var newContent = prompt("Modify contents of todo:", todo.getElementsByClassName("todocontent")[0].innerHTML);
	if (validateContent(newContent)){
		todo.getElementsByClassName("todocontent")[0].innerHTML = newContent;
	}
}

//Sorts and updates:
function redrawList(){
	//Sorting stuff out:
	var todosCollection = document.getElementsByClassName("listobject");

	//transform to array:
	var todos = Array.from(todosCollection);

	//great style:
	todos.sort(function(a,b){return compareTodos(a,b)});

	//Remove old todos:
	document.getElementById("leftview").innerHTML = "";
	document.getElementById("rightview").innerHTML = "";

	//Add stored todos to left or right view:
	var todoHeights = 10; //margins for left view
	for (i = 0; i < todos.length; i++){

		//leftview will act as a temporary holder so that the heights will be visible
		document.getElementById("leftview").innerHTML += "<div class=\"listobject\">"+todos[i].innerHTML+"</div>";

		var comingHeight = document.getElementById("leftview").getElementsByClassName("listobject")[document.getElementById("leftview").getElementsByClassName("listobject").length-1].clientHeight + 7;
		//remove temporary item:
		document.getElementById("leftview").getElementsByClassName("listobject")[document.getElementById("leftview").getElementsByClassName("listobject").length-1].remove();

		//If todo fits to left put it there, if not put it right if it fits, if not spam alerts:
		if (todoHeights+comingHeight <= document.getElementById("leftview").style.height.slice(0,-2)){
			document.getElementById("leftview").innerHTML += "<div class=\"listobject\">"+todos[i].innerHTML+"</div>";
		} else if (todoHeights+comingHeight <= document.getElementById("rightview").style.height.slice(0,-2)*2){
			document.getElementById("rightview").innerHTML += "<div class=\"listobject\">"+todos[i].innerHTML+"</div>";
		} else {
			alert("You have too much to do!\nDropping least pressing todos. 1");
			break;	 
		}
		//Should have made a div without style to avoid magic numbers
		todoHeights += document.getElementsByClassName("listobject")[i].clientHeight+7;
	}

	//fix overflowing:
	var loHeights = 7;
	for (i = 0; i < document.getElementById("rightview").getElementsByClassName("listobject").length; i++){
		if (document.getElementById("rightview").getElementsByClassName("listobject")[i].clientHeight+7 + loHeights > document.getElementById("rightview").style.height.slice(0,-2)){
			document.getElementById("rightview").getElementsByClassName("listobject")[i].remove();
			alert("You have too much to do!\nDropping least pressing todos. 2");
		} else {
			loHeights += document.getElementById("rightview").getElementsByClassName("listobject")[i].clientHeight+7;
		}
	}

	//fix done-checkbox:
	for (i = 0; i < document.getElementsByClassName("donebox").length; i++){
		if (document.getElementsByClassName("donebox")[i].value == "done"){
			document.getElementsByClassName("donebox")[i].checked = true;
			document.getElementsByClassName("listobject")[i].style.backgroundColor = "#757474";
		}
	}

}

//Used by the array sort function:
function compareTodos(a,b){
	//Make these [DD, MM, YYhh:mm]
	var aday = a.getElementsByClassName("tododeadline")[0].innerText.split("-");
	var bday = b.getElementsByClassName("tododeadline")[0].innerText.split("-");
	//Extract times
	var atime = aday[2].slice(3).split(":");
	var btime = bday[2].slice(3).split(":");
	//Fix years:
	aday[2] = aday[2].slice(0,2);
	bday[2] = bday[2].slice(0,2);

	//Days are now ["dd","mm","yy"]
	//times are    ["hh","mm"]

	if (aday[2] != bday[2]){return aday[2]-bday[2];}			//Sort by years
	else if (aday[1] != bday[1]){return aday[1]-bday[1];}		//months
	else if (aday[0] != bday[0]){return aday[0]-bday[0];}		//days
	else if (atime[0] != btime[0]){return atime[0]-btime[0];}	//hours
	else if (atime[1] != btime[1]){return atime[1]-btime[1];}	//minutes
	else {return 0;}											//equal deadlines

}

//Sets default values as example for new todo fields, since not all browsers(aka. firefox) support these fancy features
function setDefault(){
	document.newtodo.todo.value = "";
	document.newtodo.dlday.value = "2017-12-10";
	document.newtodo.dltime.value = "08:00";
}

//Initialization:
function init(){
	screenSize();
	setDefault();
	//window resize listener:
	window.addEventListener('resize', function(){screenSize();}, true);
}

document.onload = init();
