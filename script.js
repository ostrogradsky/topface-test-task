
var recordArr = [];
var tagArr = [];
var activeRecord;
var sourceCodeFlag = false;
var input = document.getElementById('filter-input');

editorWorkspace.document.getElementsByTagName('head')[0].innerHTML = '<link rel="stylesheet" type="text/css" href="css/workspace.css">';


class Record{

	constructor(name){
		this.id = generateId('record');
		this.name = name;
		this.value = "";
		this.date = getCurrentDate();
	}
}

class Tag{
	constructor(name){
		this.id = generateId('tag');
		this.name = name;
	}
}

function initialiseEditor(){
	syncArray();
	updateList();
	scanForTags();
	countListItems();
	items = document.getElementsByTagName('strong');
}

function countListItems(){
	var items = document.getElementsByTagName('li');
    var counter = 0;
    var string;
    for (var i = items.length - 1; i >= 0; i--) {
    	if (items[i].currentStyle ? items[i].currentStyle.display :	getComputedStyle(items[i], null).display != 'none'){
    		counter ++;
     	}
    }
	if (counter!= null && counter != undefined){
		if (counter === 1)
		string = counter + " Record";
		else
		string = counter + " Records";
	}
	else{
		string = "0 Records";
	}	
	
	document.getElementById('records-count').innerHTML = string;
}


function revealModal(id){
	document.getElementById("alert").style.display = 'none';
	document.getElementById("alert-rename").style.display = 'none';
	document.getElementById(id).style.display = "block";
	document.getElementById("focus-overlay").style.display = "block";
	if (id === 'rename-record-modal'){
		document.getElementById('rename-record-name').value = activeRecord.name;
	}
}

function closeModal(id){
	document.getElementById(id).style.display = "none";
	document.getElementById("focus-overlay").style.display = "none";
	clearInputFields();
}

function exeFormatCmd(type){
	editorWorkspace.document.execCommand(type, false, null);
}

function toggleSource(){
	if(sourceCodeFlag){
		sourceCodeFlag = false;
		editorWorkspace.document.getElementsByTagName('body')[0].innerHTML = editorWorkspace.document.getElementsByTagName('body')[0].textContent;
	}
	else{
		sourceCodeFlag = true;
		editorWorkspace.document.getElementsByTagName('body')[0].textContent = editorWorkspace.document.getElementsByTagName('body')[0].innerHTML;
	}
}

function clearWorkSpace(){
	editorWorkspace.document.getElementsByTagName('body')[0].innerHTML = '';
}

function clearInputFields(){
	for (var i = document.getElementsByTagName('input').length - 1; i >= 0; i--) {
		document.getElementsByTagName('input')[i].value = '';
	}
}

function generateId(type){
	var id;
	switch (type){
		case 'record':
			id = "rec" + Math.random().toString(16).slice(2)
			break;
		case 'tag':
			id = "tag" + Math.random().toString(16).slice(2)
			break;
	}
	return id;
}

function updateList() {
	if (recordArr!= null && recordArr != undefined){
			var list = document.getElementById("records-list");
		while (list.firstChild) {
	    	list.removeChild(list.firstChild);
		}

	    for(var i = 0; i < recordArr.length; i++) {
	        var item = document.createElement('li');
	        item.setAttribute("id", recordArr[i].id);
	        var anchor = document.createElement('a');
	        var dateField = document.createElement('span');
	        dateField.className = 'records-list__record-date';
	        dateField.innerHTML = ' Created on '+ recordArr[i].date;
	                
	        item.onclick = function(){
	 
	        	event.cancelBubble=true;
	            var listElements = document.getElementsByTagName("ul")[0].getElementsByTagName("li");
	           	var anchorElements = [];

	           	for (var i = listElements.length - 1; i >= 0; i--) {
	           		listElements[i].children[0].className = "default";
	           	}
	           	           
	            
	            this.children[0].className = " selected";
	           	//console.log(document.getElementsByTagName("ul")[0].getElementsByTagName("li")[0].getElementsByTagName("a"));

	            //document.getElementById(" ").className =
	   			//document.getElementById(" ").className.replace
	      		//	( /(?:^|\s)setItem(?!\S)/g , '' )

	            //document.querySelector("ul > li");

	        	var tempValue;
	        	tempValue = getRecordValueByID(this.getAttribute('id'));
	        	setActiveRecord(this.getAttribute('id'));
	        	document.getElementById("editor-workspace").contentWindow.document.body.innerHTML = activeRecord.value;
	        }
	        anchor.className = 'default';
	        anchor.appendChild(document.createTextNode(recordArr[i].name));
	        item.appendChild(anchor);
	        anchor.appendChild(dateField);
	        list.appendChild(item);
	    }
	}
}

function syncStorage(object){
	localStorage.setItem('record-arr', JSON.stringify(object));
	var retrievedObject = JSON.parse(localStorage.getItem('record-arr'));
}

function syncArray(){
	recordArr.splice(0,recordArr.length);
	recordArr = JSON.parse(localStorage.getItem('record-arr'));
}

function getRecordValueByID(id){
	var toReturn;
	for(var i = 0; i < recordArr.length; i++)
	{
	    if (recordArr[i].id == id){
	    	toReturn = recordArr[i].value;
	    	break;
	    }
	}
	return toReturn;
}

function addBlankRecord(){
	localStorage.setItem(generateId('record'), 'blank');
	fillRecordArray();
	updateList();
}

function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || " ";
}

function setActiveRecord(id){
	if (id === 'none') {
		switchControls('off');
		setActiveName('none');
		clearWorkSpace();
	}
	else{
		for (var i = recordArr.length - 1; i >= 0; i--) {
			if (recordArr[i].id == id){
		    	activeRecord = recordArr[i];
		    	break;
	    	}
		}
		switchControls('on');

		setActiveName();
		document.getElementById('rename-record-name').value = activeRecord.name;
	}
}

function setActiveName(arg){
	if (arg ==='none')
	{
		document.getElementById("selected-record-name").innerHTML = 'No Active Records';
	}
	else{
		document.getElementById("selected-record-name").innerHTML = activeRecord.name;
	}	
}

function switchControls(value){
	switch(value){
		case 'on':
			document.getElementById('save-record').style.display = "block";
			document.getElementById('rename-record').style.display = "block";
			document.getElementById('delete-record').style.display = "block";
			editorWorkspace.document.designMode = 'on';
			break;
		case 'off':
			document.getElementById('save-record').style.display = "none";
			document.getElementById('rename-record').style.display = "none";
			document.getElementById('delete-record').style.display = "none";
			editorWorkspace.document.designMode = 'off';
			break;
	}
}

function getCurrentDate(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; 
	var yyyy = today.getFullYear();
	var hh = today.getHours();
	var mins = today.getMinutes();

	if(dd<10) {
	    dd='0'+dd
	} 
	if(mins<10) {
	    mins='0'+mins
	} 
	if(hh<10) {
	    hh='0'+hh
	}
	if(mm<10) {
	    mm='0'+mm
	} 
	today = dd+'/'+mm+'/'+yyyy+' at ' +hh+':'+mins;
	return today;
}

function createNewRecord(){

	recordArr = recordArr || [];
	var name = document.getElementById('new-record-name').value;
	if (!name.replace(/\s/g, '').length) {
    	document.getElementById("alert").style.display = 'block';
	}
	else{
		createdRecord = new Record(name);
		recordArr.push(createdRecord);
		syncStorage(recordArr);
		updateList();
		countListItems();
		closeModal('new-record-modal');
	}	
}

function saveRecord(){
	var value = document.getElementById("editor-workspace").contentWindow.document.body.innerHTML;

	var temp = value.match(/(#[^\x00-\x5E\60-\FF]+)|(#\w+)/g);
	var check;
	
	if (temp != null){
		for (var i = temp.length - 1; i >= 0; i--) {
			var pos = value.indexOf(temp[i]);
			check = value.substr(pos-8, 8);
			if (check != "<strong>") {
				value = value.replace(temp[i], "<strong>" + temp[i] + "</strong> &nbsp;");
			}			
		}
	}


	for (var i = recordArr.length - 1; i >= 0; i--) {
		if (recordArr[i].id == activeRecord.id){
			recordArr[i].value = value;
			syncStorage(recordArr);
			break;
		}
	}
	revealModal('save-alert-window');
	scanForTags();
	document.getElementById("editor-workspace").contentWindow.document.body.innerHTML = activeRecord.value;
}

function renameRecord(){
	var value = document.getElementById("rename-record-name").value;
	if (!value.replace(/\s/g, '').length) {
    	document.getElementById("alert-rename").style.display = 'block';
	}
	else{
		for (var i = recordArr.length - 1; i >= 0; i--) {
			if (recordArr[i].id == activeRecord.id){
				recordArr[i].name = value;
				syncStorage(recordArr);
				updateList();
				break;
			}
		}
		closeModal('rename-record-modal');
	}
}

function deleteRecord(){
	for (var i = recordArr.length - 1; i >= 0; i--) {
		if (recordArr[i].id == activeRecord.id){
			recordArr.splice(i, 1);
			
			syncStorage(recordArr);
			setActiveRecord('none');
			updateList();
			countListItems();
			clearWorkSpace();
			break;
		}
	}
	scanForTags();
	closeModal('delete-record-modal');
}

function scanForTags(){
	tagArr = tagArr || [];
	recordArr = recordArr || [];
	var currentTagsS = [];
	var currentTagsA = [];
	var temp;

	for (var i = recordArr.length - 1; i >= 0; i--) {
		if(recordArr[i].value.match(/(#[^\x00-\x5E\60-\FF]+)|(#\w+)/g) != null)
			currentTagsS.push(recordArr[i].value.match(/(#[^\x00-\x5E\60-\FF]+)|(#\w+)/g));
	}

	for (var i = currentTagsS.length - 1; i >= 0; i--) {
		temp = currentTagsS[i];
		for (var j = temp.length - 1; j >= 0; j--) {
			currentTagsA.push(temp[j]);
		}
	}
	tagArr = [ ...new Set(currentTagsA) ];
	popupateTagsPool();
}

function filterRecords() {
	var filterValue = document.getElementById('filter-param').options[document.getElementById('filter-param').selectedIndex].value;
	setActiveRecord('none');
	var recordToShow = [];
    var filter = input.value.toUpperCase();
    var lis = document.getElementsByTagName('li');

    if (filterValue == 1) {
    	for (var i = 0; i < lis.length; i++) {
	        var name = lis[i].children[0].innerHTML;
	        name = name.substring(0, name.indexOf('<span class'));
	        if (name.toUpperCase().indexOf(filter) !== -1) 
	            lis[i].style.display = 'list-item';
	        else
	        	lis[i].style.display = 'none';
   		}
    }

    filter = input.value.match(/(#[^\x00-\x5E\60-\FF]+)|(#\w+)/g);

    if (filterValue == 2 && filter != null) {

	    for (var i = recordArr.length - 1; i >= 0; i--) {
	    	if (recordArr[i].value.indexOf(filter) >= 0){
	    		recordToShow.push(recordArr[i].id);
	    	}
	    }
	    
	    for (var i = lis.length - 1; i >= 0; i--) {
	        for (var j = recordToShow.length - 1; j >= 0; j--) {
	        	if (lis[i].id == recordToShow[j]){
	        		lis[i].style.display = 'list-item';
	        		break;
	        	}
	        	else{
	        		lis[i].style.display = 'none';
	        	}
	        }
	    }
	}
	else{
		if (filterValue == 2) {
			for (var i = 0; i < lis.length; i++) {
		        lis[i].style.display = 'list-item';
	   		}
		}			
	}

	for (var i = 0; i < lis.length; i++) {
        lis[i].children[0].className = "default";      
   	}
	countListItems();

}

function popupateTagsPool(){

	tagArr = tagArr || [];
	document.getElementById('tags-pool').innerHTML = "";
	if (tagArr.length > 0){
		for (var i = tagArr.length - 1; i >= 0; i--) {
			var spanTemp = document.createElement('span');
			spanTemp.className = 'tag';
			spanTemp.id = tagArr[i];
			spanTemp.innerHTML = tagArr[i] + ' <span class="del-tag-button" onclick="deleteTag(this);event.cancelBubble=true;"><i class="fa fa-times" aria-hidden="true"></i><span>';
			spanTemp.onclick = function(){
				document.getElementById('filter-param').value = 2;
				input.value = this.innerText;
				filterRecords();
			}
			document.getElementById('tags-pool').appendChild(spanTemp);
		}
	}	
}

function deleteTag(element){
	tagToDelete = element.parentElement.id;
 	var replacement = tagToDelete.substring(1);
	for (var i = recordArr.length - 1; i >= 0; i--) {
		if (~recordArr[i].value.indexOf(tagToDelete)){
			recordArr[i].value = recordArr[i].value.replace('<strong>'+tagToDelete+'</strong> &nbsp;', replacement);
		}
	}
	syncStorage(recordArr);
	scanForTags();
	document.getElementById("editor-workspace").contentWindow.document.body.innerHTML = activeRecord.value;
	document.getElementById('filter-input').value = "";
	filterRecords();
}

function clearLocalStorage(){
	activeRecord = activeRecord || "";
	localStorage.clear();
	recordArr = [];
	document.getElementById('records-list').innerHTML = '';
	document.getElementById('tags-pool').innerHTML = '';
	document.getElementById("editor-workspace").contentWindow.document.body.innerHTML = activeRecord.value;
	setActiveRecord('none');
	countListItems();
	closeModal('clear-ls-modal');
}