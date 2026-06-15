# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 02-07-2024
    - Demand Edge Initial Code.

 ## [1.0.1] - 04-07-2024
    - Changed the names in data selection.
    - Changed the color of the menu.
    - Referring to new api.

 ## [1.0.2] - 09-07-2024
   - Bug Fix , Corrected Next Step Redirect to 'Data Selection' tab.

 ## [1.0.3] - 09-07-2024
   - Bug Fix , corrected bug. Bug : In Review and Launch Workflow for Workflow Name, it was appearing 'No Value' string when it is empty. Now it is corrected to display blank if empty.

 ## [1.0.4] - 09-07-2024
  -  Changed to new logo of DemandDraft on the webpage tab.

 ## [1.0.5] - 09-07-2024
  -  Added Demo page for promotions. app/forecast_ui/src/components/Demo.js

 ## [1.0.6] - 12-07-2024
  -  Added Datagrid, Section Promotion, File Upload Controls, Orders Page

 ## [1.0.7] - 14-07-2024
  - corrected overlapping border issue in listitem group display, by using outline (case1) and border of lastchild to 0px(case2)
  ### Enchancement
  - Added DataGridModalComponent to display modal popup and within that datagrid.

   ## [1.0.8] - 15-07-2024
    - UI Enhancements done. 
    - Added Order Results.
  
  
 ## [1.0.9] - 16-07-2024
  - Created two pages for order details, which fetch sample data from json files
  - Only UI Changes done

 ## [1.0.10] - 17-07-2024
  - In Workflow Form > Data Selection > Categories, changed flex to grid orientation of data items.

 ## [1.0.11] - 22-07-2024
  - Changes Index to Weeks
  - Removed Menu Item 'Promotions' in Workflow form.
  - css changes - width of datagrid increased
  - Included 'MultiSelect' with all options enabled for SKU's selection, (2) Filters altered 
  - Text change in sectionF - review and submit workflow
  - Text correction - Safety Stock
  - plotly js, (1) added forecast curve (2) added text in the co-ordinate (3)hidden gridlines

 ## [1.0.12] - 21-08-2024
  - Added the button hover style for 'Dealer promotions' button list.
  - Changed the static values of  'Dealer promotions' as per business requirement.
  - style of menu tab buttons added for inactive tabs like 'promotions tab'.
  - Removed promotions menu.
  ### Major Changes
    - Added fileUploadComponent , binded values for Enums, env file and made use of util functions
  ### Technical
  - Used styleElement prop of react-select as styled-compoment didn't work on react-select control

## [1.0.13] - 27-08-2024
  - In Temporial Settings, added Data Frequency and Frequency Period. Granularity values gets disabled as data frequency changes, default frequency periods are added. Requested by Shriya.
  - UI changes of model is done.

## [2.0.0] - 16-09-2024
  - Updated frontpage to the new html and css provided by shruthi team and addded its assets.
  -Integrated login and signup to keycloak.
  -Added data frequency and forecast period variables on form object in session storage.

## [2.0.1] - 19-09-2024
  - For Keybenefits and Features section, removed the jquery script library and added react package and modified the styles accordingly.


## [2.0.2] - 24-09-2024
   - Clean Code of new Design of Demand Edge initial version.

## [2.0.3] - 24-09-2024
   - Integrated Dashboard Page, In Create Workflow > Initialize Workflow , Temporial Settings html and css as react components.
  
## [2.0.4] - 07-10-2024
   - added login popup. Integrated with new API's for token and userinfo
      - refer : https://www.baeldung.com/postman-keycloak-endpoints
   - Removed unwanted packages which were used in older UI 
   - Added login and signup popup UI and it is functional
   - Added State Navigator.

## [2.0.5] - 08-10-2024
    - refer https://keycloak.discourse.group/t/register-user-with-keycloak-rest-api/27296/4 for new user registeration.
    - bug : change the color of text in nav header menu from white to black
        -replicated menu.js for frontpage and dashboard>navbar component. Which resolved the issue
    -plus mark removal and add logout icon 
    -give padding in the textboxes
        -css custom rule overriding the bootstrap rule. Removed it.
    -minimize the signup and login popup, so that it could be able to see on screen

## [2.0.6]- 08-10-2024
    - bug: on different tabs session value getting cleared. solution : used cookie instead of session storage 

## [2.0.7]- 09-10-2024
    - css bg color change of logout tooltip

## [2.0.8]- 09-10-2024
    - Added script for previous and next button for workflow tabs.
    - Added temp script for edit and submit event handlers in review and launch code.
    - corrected keyboard navigation on login page using tab.
    - Copied UI Code for tabs - data selection, data availability, promotions, review and launch

## [2.0.9]- 10-10-2024
  - Bug Fix : Removed harecoded values of keycloak variables and moved it to .env file. Updated .env.sample
  - Bug Fix : Moved 2 libraries from devDependencies to Dependencies in package.json.

## [2.0.10]- 10-10-2024
## [2.0.11]- 10-10-2024
  - Bug Fix : changed code to not use keycloak.json in index.js

## [2.0.12]- 21-11-2024
  - Upgraded with form workflow name, desc,models are binded and create workflow form
  - changed label names in login & signup, contact number as requested.

## [2.0.13]- 25-11-2024
    - commented the confirm box to reset workflow as it is on hold.
    - login and signup styles are kept in that files styled component. so that it does not conflict with global styles.
    - created and added CustomizedDialogs for foc, ed etc.
    - made changes in css.css global style. 
    -- * Added react-bootstrap package which is compatible with bootstrap 3.4.1 in which UI is designed initially.

## [2.0.14]- 27-11-2024
    - changed the href of a tag to /
    - updated Data selection
    - updated ManageWorkflow
    - update Dashboard - Comparsion and Indentation

## [2.0.15]- 03-12-2024
    - major changes done on Data selection heirarchy, chooseitem and selecteditem

## [2.0.16]- 03-12-2024
    - in stage3hierarchy added option to display css for currently selected item in treeview

## [2.0.17]- 03-12-2024
    - Stage3 - Search Functionality Added.

## [2.0.18]- 04-12-2024
    - Initialise Workflow and Temporial Settings UI changes are added.

## [2.0.19]- 05-12-2024
    -removed unwanted console logs
    -renamed default id of html elements
    -added missed key in the react list
    -correcting the code - Unknown Value to Unknown levelname
    -class to classNames corrections

## [2.0.20]- 10-12-2024
    -integrated getDateRange api
    -added workflow creation initial object
    -manage workflow initial design
    
## [2.0.21]- 11-12-2024
    - Added Loader at Stage3, when GET API awaits.

## [2.0.22]- 12-12-2024
    - Removed Readme file
    - Integrated file Upload API in Stage1 of workflow creation
    - Enabled React-Notification-Component with some css changes.

## [2.0.22]- 13-12-2024
    - Made activeTab to be selected even on refresh of the page.
    - change request : In Stage2, the availability info message color changed to green.

## [2.0.23]- 13-12-2024
    - Added 'size' props to loader having 'large' and 'small'
    - used useRef to refer workflow_name in stage1 to focus
    - used e.preventDefault() to prevents scrolling to the top 
    - labels for error, success added additionally for each upload component.
    
## [2.0.24]- 19-12-2024    
    - changes in Temporial Settings and Data Selection Tabs

## [2.0.25]- 19-12-2024  
    - getProductsHierarchy data with IndexedDB for level6 done.

## [2.0.26]- 19-12-2024  
    - added react-window for loading large data.

## [2.0.27]- 19-12-2024  
    - added Geography Heirarchy. Initial Stage.

## [2.0.28]- 19-12-2024  
    - added missed out file SampleGeographyHierarchy.json in Utils directory

## [2.0.29]- 21-12-2024 
    - bux fix : there was a mismatch in the level_id passing from hierarchy to choosenitem. its corrected.
    - for reference kept  console.log in hierarchy open

## [2.0.30]- 23-12-2024
    - added Geography Heirarchy Treeview functionality, choosing items and select items functionality.


## [2.0.31]- 26-12-2024
    - added validation error in Initialize Workflow
    - added validation error in Temporal Settings
    - Temporal Settings : Rebinding of data to controls - Data frequency, Train and Test percentage, Forecast frequency, forecast period.
    - Data Selection : selected SKUS and selected Geographys are saved in formData object.
    - Post Request added in Stage4 Data Availability.

## [2.0.32]- 02-01-2025
    - Added validation function for initiaize workflow and temporal settings.
    - Corrected the bug between train and test percentages.
    - Changed the models list in the workflow configuration.

## [2.0.33]- 06-01-2025
    - updated user_id field in payload to get dataavailability as required.
    - review and launch tab updated with data binding.
    - font size of selected item in data selection changed to 14px.

## [2.0.34]- 07-01-2025
        - model description changes regarding exogenious param done as requested by shriya. 
        - changed null to empty string in stage4 data availability payload.

## [2.0.35]- 07-01-2025
        - As requested by Sanjeev sir, changes made in heirarchy of products tree structure. reduced one level of display.
        - changed the sorting order in heirarchy 

## [2.0.36]- 07-01-2025
        - upated getDataAvailability.
        - Added components for Indentation and workflow details pages. And updated breadcrumbs accordingly.

## [2.0.37]- 08-01-2025
         - Added Submit Task
         - Added GetDataAvailability

## [2.0.38] - 20-01-2025
        - As per request 'Disable Submit when no workflow details are selected' Added validations in Review and Launch step of create workflow.

## [2.0.39] - 20-01-2025
        - Added get_workflow details
        - In Dashboard, changed text 'Get Started' to 'Go'.
        - In Review and Launch step of create workflow, file upload type row is added.
        - get format changed, to fix default start date in change date field.
        - some text changes in initialize workflow.
        - removed wf_ in workflow id.

## [2.0.40] - 20-01-2025
        - Bug fix. corrected the text in model description.

## [3.0.0] - 21-01-2025
        - Corrected the breadcrumbs
        - removed unwanted comments
        - resetFormdata on successful save of workflow.
        - bootstrap version changed
        - changed the css style on details link in manage workflow.

## [3.0.1] - 21-01-2025
        - bug fix corrected the date format in manage workflow.
        - highlighted the color of details link in manage workflow.
        - marked as manadatory for Forecast file upload option as requested.
        - corrected time series x-axis to meaningful value to 'weekly frequency'

## [3.0.2] - 24-01-2025
        - Bug fix : Select All Options in data selection corrected.

## [3.0.3] - 27-01-2025
        - Bug fix : Search field in data selection corrected.
        - Data selection logic for geography implemented. On selection of location of any level, its parent and children shall be removed automatically.

## [3.0.4] - 28-01-2025 
        - Enhancement: Added RemoveAllOptions in data selection.

## [3.0.5] - 29-01-2025 Raghu
        - Display comparsion menu option in Navbar
        - Align 'Quation' logo to center in Footer Section
        - Color change for Workflow Status and Approval status based on its value
        - MyProfile Updated

## [3.0.6] - 31-01-2025 Raghu
        - Sorting the records in descending order of train data available.
        - Applied scrolling and fixed header row for data availability list.
        - Implemented Data selection retain on tab change in data availability list.

## [3.0.7] - 06-02-2025
        -  Updated Indentation Component

## [3.0.8] - 06-02-2025
        -  Updated in Navbar menu for indentation.
        -  Bug fixes in indentation

## [3.0.9] - 06-02-2025
       -  Bug fixes in indentation

## [3.0.10] - 07-02-2025
        - Bug Fixes in Initialized Workflow to display upload controls on tab change.
        - changed payload format for sku and geography for submittask workflows.
        - bug fixes in workflow list display in manage workflow

## [3.0.11] - 07-02-2025
        - minor bug fixed. corrected spelling tabular

## [3.0.12] - 07-02-2025
        - submittask api payload updated with skuDetails instead of sku and geography.

## [3.1.0] - 19-02-2025
        - Changed the UI of Workflow Details.

## [3.1.1] - 19-02-2025
        - changed the choosen item list on selection of Tree structure for Products

## [3.1.2] - 19-02-2025
        - added 'product_category' list selection control in temporal settings

## [3.1.3] - 10-03-2025
        - changed http configurationt to get token on every http request
        - getToken is changed from keycloak's UserService.js to AuthService.js

## [3.1.4] - 13-03-2025
        - Forecast Output at Report3 css changes

## [3.1.5] - 17-03-2025
        - Added wf_name_check api with react-query
        - Pagination in manage workflow
        - temporarily removed filter by date

## [3.1.6] - 17-03-2025
        - Updated getOrderDetails function api name and input param

## [3.1.7] - 19-03-2025
        - Added access_token in headers - authorisation and access_token . in all the api's done by subhendu.

## [3.1.8] - 25-03-2025
        - Seasonality changes
            - Weekly and monthly seasonality value based on forecast value change in temopral setting.
            - file upload control
        - comparison view - Indentation link if it is approved.
## [3.1.9] - 28-03-2025
        - date format changes - yyyy-mm-dd for start_date and end_Date

## [3.2.0] - 22-04-2025
        - bug fix in data availability of breadcrumb mapping

## [3.2.1] - 22-04-2025
        - enchancement : Added SKU to Sales Person Mapping.
## [3.2.2] - 07-07-2025
        - Dummy Push
## [3.2.3] - 15-07-2025
        - table color changed 
        - SKU added
        -Seasonality Changes added
## [3.2.4] - 29-08-2025
        - select prod not working - fixed
        - id else threshold added
        - nivo graph added
        - indentation componenet revamped 
        - Frequency desabled functionality added
        - hierarchy coloring added
## [3.2.4.1] - 29-08-2025
        - package added with nivo chart
## [3.2.5] - 05-09-2025
        - Manual edit option enabled
        - Sales person can be added now. For this backend code aslo added in main.py
## [3.2.6] - 13-10-2025
        - Revamped Dashboard UI for better visual clarity and layout consistency.
        - Refined UI across all Workflow Stages (1–7) for a unified design experience.
        - Author - Kaustubh 
## [3.2.7] - 31-10-2025
        - Designed Ui for remaining tabs Manageworkflow, Comparision, Indentation and Configuration Pages.
        - Fixed Color for Borders/Wrappers/Cards Overall      application.
        - Author - Kaustubh
## [3.2.8] - 06-11-2025
        - Merged all code
        - prepared for 3.0
        - removed unused files
        - setting up first 3.0 version
        - Author : Subhendu 
## [f-3.2.9] - 20-11-2025
        - few UI changes
## [f-3.3.0] - 20-11-2025
        - Major UI chnage
        - new UI added
## [f-3.3.1] - 09-12-2025
        - Dashboard matrics added 
## [f-3.3.2] - 10-11-2025
        - Dashboard matrics added 2.0 
## [f-4.0.0] - 22-12-2025
        - logo changed
        - footer changed
        - form context chnaged - new context added - clone added
        - major changes 
        - Author : Subhendu 
## [f-4.0.1] - 22-12-2025
        - penidng task fixed
        - Proactive Insight Feed fixed
        - Author : Subhendu 
## [f-4.0.2] - 22-01-2026
        - hindware UI separated
        - New branch created
        - comparison new table added
        - Two india issue fixed
        - Sanjeev requested UI added
        - Report 3 flexiable table added
        - Universal Date added
## [f-4.0.3] - 05-03-2026
        - Multiple model added to the UI
        - new apis added
        - Author : Subhendu 
## [f-4.0.4] - 06-03-2026
        - Added model list
        - stage4 cache fixed
        - Author : Subhendu 
## [f-4.0.5] - 06-03-2026
        - Table fixed
        - Report Best model added
        - Author : Subhendu 
## [b-4.0.5] - 06-03-2026
        - initial details for Himanshu
        - Author : Subhendu 
## [f-4.0.6] - 13-03-2026
        - Making Product Hierarchy selection easier 
        - other random stuffs
        - Author : Subhendu 
## [f-4.0.7] - 17-03-2026
        - Stage4 fixed (cloend + select all)
        - Save Report added
        - Author : Subhendu 
## [f-5.0.0] - 14-04-2026
        - full new UI
        - new branch created
        - Redux added
        - tree structure added
## [f-5.0.1] - 16-04-2026
        - zero fixed
## [f-5.0.2] - 27-04-2026
        - clone fixed
        - higlight modified value added
## [f-5.0.3] - 27-04-2026
        - indentation added
