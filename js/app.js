$('document').ready(function(){
	makeSortable($(".sidebar-list.sortable"), "y");
	makeSortable($(".app-list.sortable"), "x");
	//makeSortable($(".ui-tabs__list"), "x");

	$(".sidebar-subtitle > .toggle").on("click", function(){
		var $sideBar = $(this).parents().find(".sidebar-list").slideToggle("fast");
		$(this).text($(this).text() == "Show" ? "Hide" : "Show");
	});
	
});

function selectAppWindow() {
	var $desktop = $("#desktop");
	var $appWindow = $(".app-window");

	$desktop.on("click", function(){
		$appWindow.addClass("disabled-window");
	});
	$appWindow.on("mousedown click", function(e){
		e.stopPropagation();
		$appWindow.addClass("disabled-window").removeClass("current-window");
		$(this).removeClass("disabled-window").addClass("current-window");
	});
};
selectAppWindow();

function closeAppWindow() {
	var $closeButton = $(".close-icon, .mini-icon");
	$closeButton.on("click", function(e) {
		e.stopPropagation();
		var $appWindow = $(this).closest(".app-window");
		$appWindow.removeClass("window-opened").addClass("window-closed").hide();
	});
}
closeAppWindow();

function openAppWindow() {
	$(".dock-app").on("click", function(e) {
		var $appIcon = $(this);
		var $appName = $appIcon.find("div").data("app");
		var $appWindow = $("#desktop").find("#app-"+$appName);
		var $otherWindows = $(".app-window");
		e.stopPropagation();
		$otherWindows.addClass("disabled-window").removeClass("current-window");
		$appWindow
			.removeClass("window-closed").addClass("window-opened").removeClass("disabled-window").addClass("current-window")
			.show();
	});
}
openAppWindow();

function maximizeAppWindow() {
	var $maxButton = $(".max-icon");
	var $appWindow = $maxButton.closest(".app-window");

	$maxButton.on("click", function(e) {
		e.stopPropagation();

		if($appWindow.hasClass("window-miximized")) {
			$appWindow.css({
				"left": "85px",
				"right": "auto",
				"top": "60px",
				"width": "770px",
				"height": "430px"
			}).removeClass("window-miximized");
		}
		else {
			$appWindow.css({
				"left": "5px",
				"right": "5px",
				"top": 0,
				"width": "99%",
				"height": $("#desktop").height() - 85
			}).addClass("window-miximized");
		}
		
	});
}
maximizeAppWindow();



(function sidebarSelect() {
	var $sidebarItems = $(".sidebar-list__item");
	var $windowHeader = $("#app-finder .window-title");
	$sidebarItems.on("click", function(){
		$sidebarItems.removeClass("selected");
		$windowHeader.find("img").attr("src", $(this).find("img").attr("src"));
		$windowHeader.find("span").text($(this).text());
		$(this).addClass("selected");
	});
})();

(function optionsSelect() {
	var $optionsItems = $(".ui-button-group__item");
	$optionsItems.on("click", function(){
		$optionsItems.removeClass("selected");
		$(this).addClass("selected");
	});
})();



(function resizableWindow () {
	var $resizableWindow = $(".resizable-window");
	$resizableWindow.resizable({
		handles: 'all',
		disabled: false,
		minWidth: 320,
		minHeight: 255,
		maxWidth: $("#desktop").width(),
		maxheight: $("#desktop").height()
	});
})();

(function resizableSidebar () {
	var $resizableSidebar = $(".resizable-sidebar");
	$resizableSidebar.resizable({
		handles: 'all',
		disabled: false,
		minWidth: 110,
		maxWidth: 180
	});
})();

(function draggableWindow() {
	var $draggableWindow = $(".draggable-window");
	$draggableWindow.draggable({
		handle: $draggableWindow.find("header"),
		containment: '#desktop',
		disabled: false,
		delay: 300,
		start: function(event, ui) {
		}
	});
})();

function makeSortable(e, axis) {
	e.sortable({
		axis: axis
	});
}



(function clockRun() {
	var date = new Date();
	setTimeout(function() {
		setInterval(function() {
			clockFactory();
		}, 1000);
	}, 1000 - date.getMilliseconds());
})();

var clockFactory = function clockFactory() {
	var formatedDate = {
		smallFormat: "",
		fullFormat: ""
	};

	var date = new Date();
	var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var months = ["January", "February", "March", "April", "May", "June", "July", "September", "October", "November", "December"];

	var currentWeekDay = weekdays[date.getDay()];
	var currentMonth = months[date.getMonth()];
	var currentDay = date.getDate();
	var currentYear = date.getFullYear();

	formatedDate.fullFormat = currentWeekDay + ", " + currentMonth + currentDay + ", " + currentYear;
	
	var sufix = " AM";
	var hour = date.getHours();
	if (hour >= 12) {
		hour = parseInt(hour) - 12;
		sufix = " PM";
	}

	var minutes = date.getMinutes();
	if(minutes < 10)
		minutes = "0" + minutes;

	formatedDate.smallFormat = currentWeekDay.slice(0, 3) + " " + hour + ":" + minutes + sufix;

	var clockSmall = $("#time-box").text(formatedDate.smallFormat);
	var clockFull = $(".full-time").text(formatedDate.fullFormat);

	return formatedDate;
};
clockFactory();


/* Safari Tabs */
var $tabsList = $(".ui-tabs__list");

function countTabs() {
	return $tabsList.find("li").length;
}
function selectLastTab() {
	var numOfTabs = countTabs();
	if(numOfTabs > 0)
		$tabsList.find("li")[numOfTabs-1].click();

	if(numOfTabs === 0)
		shrinkTabsHeader();
}

function addNewTab() {
	$tabsList.append("<li class='ui-tabs__item'><span class='close-tab'></span><span class='ui-tabs__item-title'>Favorites</span></li>");
	selectLastTab();
	if(countTabs() == 1)
		expandTabsHeader()
}
$(".ui-new-tab").on("click", addNewTab);

function closeTab() {
	$(this).parent().remove();
	$tabsList.find(".ui-tabs__item").removeClass("current-tab");
	selectLastTab();

	if($(this).data('tab')){
		$('#app-safari .window-body').find("iframe[data-tab='"+$(this).data('tab')+"']").remove();
	}
}
$tabsList.on("click", ".close-tab", closeTab);
function selectTab() {
	$tabsList.find(".ui-tabs__item").removeClass("current-tab");
	$(this).addClass("current-tab");

	if($(this).data('tab')){
		$('#app-safari .window-body').find("iframe").css("zIndex", 3);
		$('#app-safari .window-body').find("iframe[data-tab='"+$(this).data('tab')+"']").css("zIndex", 4);
	}
}
$tabsList.on("click", ".ui-tabs__item", selectTab);

function shrinkTabsHeader() {
	var $tabsHeader = $(".app-window__safari.tabs-on > header");
	var $tabArea = $(".ui-tabs");
	var $windowBody = $(".window-body");

	$tabArea.css("display", "none");
	$tabsHeader.css("height", "37px");
	$tabsHeader.find(".ui-window-nav").css("height", "23px");
	$windowBody.css("height", "calc(100% - 37px)");
}

function expandTabsHeader() {
	var $tabsHeader = $(".app-window__safari.tabs-on > header");
	var $tabArea = $(".ui-tabs");
	var $windowBody = $(".window-body");

	$tabArea.css("display", "block");
	$tabsHeader.css("height", "59px");
	$tabsHeader.find(".ui-window-nav").css("height", "45px");
	$windowBody.css("height", "calc(100% - 58px)");
}

function changeTabs() {

}

