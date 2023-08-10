# Dynamic Lookup Component

## Description

The Lookup component is used to enables users to search for and select a record from a Salesforce object. The component displays a search bar and a list of search results, which can be filtered based on search terms and selected based on user input.


## How to use
```
<c-dynamiclookupcmp placeholder='select account' iconname='standard:account'
   onremove={handleRemoveAcc} onselected={handleAccChange}  singleselectedrec={AccName} 
   sobject='Account' keyfield = 'Id' displayfields='Name' mergefields='Phone,Rating' 
   filter='name!=null' disable={disableBox} showinput={hideInput} cmpwidth='width:400px;'
   spinnerwidth='margin-left: 22rem;' requireattribute={requireattribute}> 
</c-dynamiclookupcmp>
```

## Properties And Events
```
select account : Placeholder text.
standard:account : Specifies the icon to be displayed next to the lookup input field. 
handleRemoveAcc : Executed when an Account is removed or cleared from the lookup component.
handleAccChange : Triggered when an Account is selected or changed in the lookup component.
AccName : Represents the current selected Account record.
Account : Specifies the Salesforce object from which the records are retrieved.
Name : Determines the fields to be displayed in the lookup component's dropdown results.
Phone,Rating : Specifies additional fields from the Account object that can be merged into the selected record's display.
width:400px : specifies that the component should have a width of 400 pixels.
margin-left: 22rem : sets the left margin of the spinner element to 22 rems.
```