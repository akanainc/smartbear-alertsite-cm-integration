# Akana Community Manager Integration
![Image of Akana] 
(https://www.akana.com/img/formerlyLOGO8.png) 
[Akana.com](http://akana.com)

## SmartBear AlertSite Community Manager Integration
This integration demonstrates basic integration with SmartBear AlertSite, an external monitoring solution. Provided is a simple widget that retrieves monitor data for the given API version.  More complex interesting scenarios are possible by extending this widget.   It is indented to be a starting point for you. 

Note: There are security considerations that need to be addressed by simply making Policy Manager policy.  

## SmartBear AlertSite
### About the SmartBear AlertSite
SmartBear AlertSite is an external monitor tool that allows you to monitor your customer's API experience from several locations around the world.  Leveraging AlertSite along with the API monitoring capabilities within in the Akana API Management platform gives you a complete view of what your API experience is for your API consumers.  It will help you troubleshoot and detect issues before they become a real problem.  

![Image of Alertsite Integration](dist/images/AlertSite-CM.png)

You can find out more about AlertSite at [SmartBear AlertSite](http://smartbear.com/product/alertsite/overview/)

### Pre-Reqs

- You must have an account with SmartBear AlertSite
    + You must define monitors for your APIs in SmartBear AlertSite by either using SoapUI or directly in the AlertSite website. 
- You need Policy Manager v7.2.11 or later
- You need Community Manager v7.2.4.1 or later
- you must install the pso extensions custom polices:
    + Download the zip and follow the instructions [here](http://github.com/akanainc/akana-pso-tools/tree/master/akana-pso-apihooks-extensions)

### Getting Started Instructions
#### Download and Import
- Download dist/org_AlertSite_export.zip
- Login to PolicyManager  example: http://localhost:9900
- Select the root "Registry" organisation and click on the "Import Package" from the Actions navigation window on the right side of the screen
  + click on button to browse for the org_AlertSite_export.zip archive file 
  + click Okay to start the importation of the hook.
  + when prompted click Okay to deploy the virtual service to the container later.
  + this will create a AlertSite Organization with the requisite artefacts needed to run the API.
    + Note: You will get prompted that the orginal container doesn't exist.  Don't worry we can host the virtual services to your container.   Here is the location you need to define when hosting the virtual services
        + Alert_Site_API_vs0
            + location: alertsite/v2
        + AlertSite_Detail_API_vso
            + location: alertsitedetail/v2

#### Activate Anonymous Contract
- Expand the contracts folder in the AlertSite Organization
- For each contract click on the "Activate Contract" workflow activity in the right-hand Activities portlet
- Ensure that the status changes to "Workflow Is Completed"

#### Modify and Activate AlertSite CORS policy
- Under the Aria Hooks organization you just imported
    + Expand Policies -> Operational Policies and click on AlertSiteCors
    + Click on Modify
    + Under the Allow Header section, change the X-Csrf-Token_heritage and replace heritage with your Community Manager tenant name
    + Click apply
    + On the right hand side of the screen click on the Activate Policy link

####  Modify Process Orchestration
+ NOTE: This is only a prototype:  I hardcoded the basic auth token in the process script.  You should pull this out into a policy and encrypt this. 
+ For both the Alert_Site_API_vs0 and AlertSite_Detail_API_vs0 preform the following:
    + From the Details tab, click on Operations click on the GET in the list -> select the Process tab
    + Open "script1" and replace the variable with your basic auth token.  You can get this from PostMan.
    
    ```
    var auth = "Basic cOF1cmEuaGVyaXRhZ2VAYWthbmEuY29tOkFkZGkxNDAyIQ=="; 

    ```
    
    + Click Finish and Save Process

#### Install SoapUI Project or the PostMan Collection, Configure Integration and Verify Import
- Download and import the AlertSite SoupUI project (AlertSite.xml)  or AlertSite PostMan collection (AlertSite.json.postman_collection)
    + You must change the following in the requests defined
        + GetSiteStatus - Used to verify your connection directly to the AlertSite APIs and to get monitor_ids
            + Change the "C85702" to be your identifier (You can find this by logging into AlertSite, going to the Reports view, selecting Detail and one of your monitors,  hit run report, select Report API - generate report externally link, and finally you should see a URL in a popup window just above the words 'Try it'.  Your id will be be at the end of the url before the ? https://www.alertsite.com/report-api/detail/C85702 )
            + Enter the Basic Auth information on the Authorization tab
            + Hit send and you should see a result of XML
        
        + GetStatusProxyJSON - Used to verify your connection through your proxy to the AlertSite APIs
            + Change the host to your proxied host
            + Change the "C85702" to be your identifier
            + Hit Send and you should see a JSON result  
                + NOTE: since we hardcoded the basic auth for AlertSite in the process anyone who has access to this URL can pull the report.  Again you will want to change this
                + Note: You may need to change the CORS policy in Policy manager for you host configurations.  If you change it by creating a new version, remember to activate it. 
        
        + PostMonitor - Used to link API versions to monitors in AlertSite
            + Change the host to be your PM host
            + Change the APIversionId in the URL to be the version Id of the API you want to link to a monitor.
            + Click on the Body tag and enter the monitor id (obj_device) and enter a name for each monitor
            + Enter your basic auth credentials for authenticating to Policy Manager and update the request
        
        + GetAPIVersionMonitor - Used to retrieve and view which monitors are configured to an API version in CM
            + Change API version in the URL
            + Enter your basic auth credentials for authenticating to Policy Manager and update the request

#### Import the theme into Community Manager
#####There are two options for installation of the theme.
1. From Community Manager's Config - Resources page, under Resource click on File Manager, and then click on Upload a Zip Archive.  Point to the dist/resource/theme.zip you download from github.
2. Change the configuration of you community manager to load the theme from a directory by:
    + Clone the GitHub repository
    + Logging into the admin console http://localhost:9900/admin
    + Clicking on Configuration
    + Select com.soa.atmosphere from the left nav.
        + Change the atmosphere.config.loadResourcesFromWorkspace to true
        + Change atmosphere atmosphere.config.resourcesPath :  {yourrootpath}/AkanaInc/smartbear-alertsite-cm-integration/src/com.soa.alertsite
    + Restart CM

For both options:
+ On the configuration view, go to  CONFIG -> CUSTOM SYTLES and click Rebuild Styles
+ Clear your browser cache. 

Option #2 is good for if you are going to do further developement on the theme.

##### What is in the theme
+ theme/default/DEMO/alertsite - Contains the files for the Community Manager AlertSite widget
+ SOA/CM/extensions - These files basically register the widget with the UI and create a the view
    + Left_nav.json - Overides the default left nav configuration and add the AlertSite link on the left navigation on the API view for the owner of the API.  You can configure this how you wish.
    + widget_factor.json - Defines the new widget. References the ejs files from the /theme/default/DEMO/alertsite directory
    + metadata.json - Defines the new alertsite view.  It references the widget key you defined in the widget_factory.json
+ locales and i18n - Are for Internationalization
+ less
    + custom.less - I set leftnav-active-icons: none;
    ```
    // path to the image file of 18px sprites of leftnav navigation items that reflect the current section of "subject" details
    @leftnav-active-icons: none;

    ```

  

### License
Copyright 2015 Akana, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

