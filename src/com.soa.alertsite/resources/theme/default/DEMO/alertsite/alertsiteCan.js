steal("iconsole/SOA/console").then(function(){
	
    
	// Need to put in your ND host
	var host = 'http://heritage.soa.local:5501';
	
 	var storedMonitors;
	var currentMonitorID;

	

	can.getObject("alertsite.alertsiteForm", window, true);
	alertsite.alertsiteForm = SOA.Console.BaseControl(
		/* @Static */
			{
			"defaults" : function() {}
			},
			/* @Prototype */
			{
			   "display" : function() {
				    var thisControl = this;
   						
			     	SOA.Framework.Common.WidgetFactory.draw("alertsiteCustomForm", {
							}, thisControl.element);
				  		  	
					var apiVersionID = thisControl.options.routeDetails.objectVersionId;
					//console.log("apiversionid = "  + apiVersionID);
					getMonitors(apiVersionID);
					
					var div = $( thisControl.element).find("#alertsite-status-page");
					
					displayStoredMonitors(div);	
					drawMonitorStatus(div);
							
				},
			     "#myselect change": function( element, event ) {
			     	  event.preventDefault();
					var thisControl = this;
		        	currentMonitorID = element.val();
		        	drawMonitorStatus(thisControl.element);
   					 },
			 }
			);
         

          function getMonitors(apiID) {
					currentAPI = apiID;
					storedMonitors = null;
		        	console.log("in get Monitors");
					$.ajax({
			        url: "/simplethings/AlertSite/monitors/" + apiID + ".json",
			        dataType: "json",
			        username: 'admin',
			        password: 'password',
			        type : "GET",
			        contentType : 'application/json',
			        async : false,
			        success : function (data){
			          //console.log("SUCCESS : " + JSON.stringify(data));
			           storedMonitors = data;
			           return data;
			        }
			       });
				};

	    function drawMonitorStatus(element){
	    	getAlertSiteStatus(element);
			getAlertSiteDetail(element);
	    };


	    function displayStoredMonitors(element){
 					var i, item, listItem, monitors;
    					
					if(!storedMonitors){
						console.log("No monitors for this API");

					}else{
						monitors = storedMonitors.monitors;
						//console.log("this is monitors list length = " + monitors.length);
					i=0;
					while(i < monitors.length){
							console.log("This is monitorID = " + monitors[i].id);
						if(i==0){
							//set default monitor
							currentMonitorID = monitors[i].id;
						}

						$(element).find('#myselect').append($("<option id='myoption' name='myoption'></option>").attr("value",monitors[i].id ).text(monitors[i].id + ": " + monitors[i].name));
					
						i++;
					}
					
					}
    			};

		function getAlertSiteDetail(element){
			      //console.log("calling Things");
			      $.ajax({
			        url: host+ '/alertsitedetail/v2/detail/C85701?obj_device='+storedMonitors.monitors[0].id+'&location=73,50&rdate=LastSevenDays&showrecs=&sort_order=asc',
			        type : "GET",
			        async : false,
			        headers : {'Accept' : 'application/json' },
			  
			        success : function (data){
			         //  console.log("This is AlertSite Site Status" + JSON.stringify(data));   
                       displayPerformance(element, data);
			        },
			        error: function (err){
			        	console.log("err" + JSON.stringify(err));
			        }
			      });
			    };

         function getAlertSiteStatus(element){
			      //console.log("calling Things");
			      $.ajax({
			        url: host + '/alertsite/v2/sitestatus/C85701?obj_device=250135&rdate=Now&sort_order=asc',
			        type : "GET",
			        async : false,
			        headers : {'Accept' : 'application/json' },
			  
			        success : function (data){
			         //  console.log("This is AlertSite Site Status" + JSON.stringify(data));   
                       displayAlertSiteStatus(element, data);
			        },
			        error: function (err){
			        	console.log("err" + JSON.stringify(err));
			        }
			      });
			    };

	      function sortByKeyAsc(array, key) {
	      	console.log("SORTING");
    		  return array.sort(function(a, b) {
       			 var x = a[key]; var y = b[key];
       			 return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    			});
			};
		
			function sortByKeyDesc(array, key) {
	      	 console.log("SORTING");
    		  return array.sort(function(a, b) {
       			 var x = a[key]; var y = b[key];
       			 return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    			});
			};

			

	      function displayAlertSiteStatus(element, data){
			console.log("displayAlertSiteStatus");
			row = $( element ).find("#site_status_details .copy");
			//delete all rows
            $(element).find("#site_status_details > tbody:last").children().remove();
            //add copy row back
             $(element).find('#site_status_details').append(row);
			
			//Gets all AlertSite Monitors because API doesn't work for filter
			var devices = data.Account.Device;

			var locations;
			for(var i=0; i < devices.length; i++){
				console.log("this is @obj_device" + devices[i]['@obj_device']);
				
				if(devices[i]['@obj_device'] == currentMonitorID){
					
					//Get Locations and sort descending by the last status
					locations = sortByKeyDesc(devices[i].Location, 'dt_last_status');
					
	
		    		var aboutMonitorDiv = $( element ).find("#alertsite-accounts");
		    		var name = $( aboutMonitorDiv ).find("#monitor_name");
     	 			name.text(devices[i]['@descrip']);
     	 			var type = $( aboutMonitorDiv ).find("#monitor_type");
     	 			type.text(devices[i]['@type']);
     	 			var run = $( aboutMonitorDiv ).find("#run_interval");
     	 			run.text(devices[i]['@monitor_interval'] + " min");
     	 			var last = $( element ).find("#last_response_time");
     	 			last.text(locations[0].resptime_last + " Secs");
     	 			
     	 		
		    			
					for(var j=0; j < locations.length; j++){
			 			var currentItem = row.clone();
			  			 currentItem.children('.monitor_location').text(locations[j]["@loc_descrip"]);
			  			 currentItem.children('.monitor_description').text(locations[j].display_descrip);
			   			 currentItem.children('.last_response_time').text(locations[j].resptime_last);
			    		 currentItem.children('.last_error').text(locations[j].dt_last_error);
			   			 currentItem.children('.last_status').text(locations[j].dt_last_status);
			  			 currentItem.removeClass('copy').show();
			  			 
			 			 $(element).find('#site_status_details').append(currentItem);
					 } 
					 break;

				}

			}

		
			
		   	
		};


		 function displayPerformance(element, data){
		 	var location = data.Location;
		 	//get all measurements across all locations

		 	var measurements = location[0].Measurement;
		 	var location1City = location[0]['@City'];
		 	var measurements2 = location[1].Measurement;
		 	var location2City = location[1]['@City'];



		 	var location1 = _.map(measurements, function(period) {
			       var date = new Date(period['@Timestamp']);
 					var point = [date.getTime(), parseFloat(period.Timings['@Total'])];
 					  return point;
			  });

		 	var location2 = _.map(measurements2, function(period) {
			      var date = new Date(period['@Timestamp']);
 				  var point = [date.getTime(), parseFloat(period.Timings['@Total'])];
 				  return point;
			  });

		 	var weeklyPrefChart = $(element).find("#performance-chart");
			steal('iframework/libraries/highcharts').then(function () {
			  return  $(weeklyPrefChart).highcharts({
			  	//Chart begin code
       			   chart: {
            type: 'spline'
        },
        title: {
            text: 'Response Time Past 7 Days'
        }
        ,
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { 
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%e. %b'
                
            },
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            title: {
                text: 'Response Time (Secs)'
            },
            min: 0
        },
        tooltip: {
          pointFormat: '{series.name} <br/>  {point.y:.4f} Secs '
        },

        plotOptions: {
            spline: {
                marker: {
                    enabled: false
                }
            }
        },

        series: [{
            name: location1City,
            data: location1
        }, {

        	name: location2City,
            data: location2

        }]

			  	//end code
			  });

			});
		 };

	return alertsite.alertsiteForm;
});



  				