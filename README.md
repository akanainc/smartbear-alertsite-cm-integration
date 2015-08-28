# Akana Community Manager Integration
![Image of Akana] 
(https://www.akana.com/img/formerlyLOGO8.png) 
[Akana.com](http://akana.com)

## SmartBear AlertSite Community Manager Integration
This integration demonstrates basic integration with SmartBear AlertSite external monitoring solution. Provided is a simple widget that retrieves monitor data for the given API version.  More complex interesting scenarios are possible by extending this widget.   It is indented to be a starting point for you. 

## SmartBear AlertSite
### About the SmartBear AlertSite


### Pre-Reqs
- Download and import the AlertSite PostMan collection
    + You must change the following in the requests defined
        + GetSiteStatus - Used to verify your connection directly to the AlertSite APIs and to get monitor_ids
            + Change the "C85702" to be your identifier (You can find this by logging into AlertSite, going to the Reports view, selecting Detail and one of your monitors,  hit run report, select Report API - generate report externally link, and finally you should see a URL in a popup window just above the words 'Try it'.  Your id will be be at teh end of the url before the ? https://www.alertsite.com/report-api/detail/C85702 )
            + Enter the Basic Auth information on the Authorization tab of postman
        +GetStatusProxyJSON - Used to verify your connection through your proxy to the AlertSite APIs
            + Change the host to your proxied host
            + Change the "C85702" to be your identifier
        +PostMonitor - Used to link API versions to monitors in AlertSite
            + Change the host to be your PM host
            + Change the APIversionId in the URL to be the version Id of the API you want to link to a monitor.
            + Click on the Body tag and enter the monitor id (obj_device) and enter a name for each monitor
            + Enter the basic auth credentials and update the request
        +GetAPIVersionMOnitor - Used to retrive and view which monitors are configured to an API version in CM
            + Change API version in the URL
            + Enter the basic auth credentials and update the request
- You must have an account with SmartBear AlertSite
    + You must define monitors for your API in SmartBear AlertSite
    + You must be able to find the monitor ids by calling the above postman requests.
- You need Policy Manager v7.2.11 or later
- You need Community Manager v7.2.4.1 or later
- you must install the pso extensions custom polices:
    + unzip the com.akana.pso.apihooks.extensions_7.2.3.zip (available in this repository) into the <Policy Manager Home>/sm70 directory. 
   + Using the SOA Admin Console, install the following Plug-ins in each PM container:
        * Akana PSO API Gateway Extensions for API Hooks
        * Akana PSO Simple Things API
    + Using the SOA Admin Console, install the following Plug-ins in each ND container:
        * Akana PSO API Gateway Extension for API Hooks
    + restart all PM and ND(s)
### Getting Started Instructions
#### Download and Import
- Download AlertSite.zip
- Login to PolicyManager  example: http://localhost:9900
- Select the root "Registry" organisation and click on the "Import Package" from the Actions navigation window on the right side of the screen
  - click on button to browse for the AlertSite.zip archive file 
  - click Okay to start the importation of the hook.
  - when prompted click Okay to deploy the virtual service to the container later.
- this will create a AlertSite Organization with the requisite artefacts needed to run the API.

#### Verify Import
- Expand the services folder in the AlertSite you imported and find Alert_Site__API_VS0

#### Host Virtual Services
- bla bal

#### Activate Anonymous Contract
- Expand the contracts folder in the AlertSite Organization
- for each contract click on the "Activate Contract" workflow activity in the right-hand Activities portlet
- ensure that the status changes to "Workflow Is Completed"


#### Import the theme into Community Manager

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

