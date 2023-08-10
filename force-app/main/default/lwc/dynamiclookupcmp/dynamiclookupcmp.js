import { LightningElement, track, api, wire } from 'lwc';
import searchedList from '@salesforce/apex/LookupControllerCmp.searchedLookupList'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import no_data from '@salesforce/label/c.No_data_found';
import pleaseWait from '@salesforce/label/c.Please_wait';

const MAXLIMIT = 5;
export default class Lookupcmp extends LightningElement {
    /**
     * The placeholder text for the input field.
     * @api
     */
    @api placeholder;
    /**
     * The name of the icon to display.
     * @api
     */
    @api iconname;
    /**
     * The Salesforce object to search for records.
     * @api
     */
    @api sobject;
    /**
     * The filter criteria for record search.
     * @api
     */
    @api filter;
    /**
     * Indicates whether the input box is disabled.
     * @api
     */
    @api disable = false;
    /**
     * A boolean property that requires the user to select a record.
     * @api
     */
    @api requireattribute = false;
    /**
     * This variable hold selected record ID.
     * @api
     */
    @api singleselectedrec = '';
    /**
     * Indicates whether to hide the input Box.
     * @api
     */
    @api hideinput = false;
    /**
     * The array of record data.
     * @api
     */
    @api recordData = [];
    /**
     * A string that specifies the fields to display for records.
     * @api
     */
    @api displayfields = '';
    /**
     * A string that merge two fields.
     * @api
     */
    @api mergefields = '';
    /**
     * A string that specifies the key field for records.
     * @api
     */
    @api keyfield = '';
    /**
     * To set the width of the Input box.
     * @api
     */
    @api cmpwidth = 'width:300px;';
    /**
     * To set the margin of the spinner.
     * @api
     */
    @api spinnerwidth = 'margin-left: 20rem;';

    @track searchRecords = undefined;
    @track i = 0;
    @track message = false;
    @track loadmessage = false;
    @track flag;
    @track recordDataseleted;
    @track recordVisibility = false;
    @track spinner_flag = false;
    @track mouse_enter;
    @track mouse_leave;
    @track btn_flag;
    @track btn_clear = false;
    @track is_multiple;
    @track hidebox = '';
    @track deleteitemdetail = false;
    @track textboxclass = '';
    @track dropdownClass = ''
    @track hasRendered = true;
    @track no_data_label = no_data;
    @track please_wait = pleaseWait;
    @track searchKey = '';
    mergeFieldsArray = [];
    records = [];
    virtualRecords = [];
    @track isloading = false;
    @track loadData = true;



    /**
     * Initializes the component.
     * @override
     */
    connectedCallback() {
        console, console.log('change@@@@ lookup');
        this.isloading = false;
        this.message = false;
        this.textboxclass = 'slds-combobox__input slds-input slds-combobox__input-value';
        this.dropdownClass = 'display: none;';
        if(this.singleselectedrec!=''){
            this.hidebox = 'hideboxcss';
        }
    }
    /**
     * Searches for records based on the user input.
     * @param {Event} event - The input event.
     */
    searchField(event) {
        this.message = false;
        this.textboxclass = 'slds-combobox__input slds-input slds-combobox__input-value';
        if (this.loadData == true) {
            this.disable=true;
            this.isloading = true;
            this.loadmessage=true;
            searchedList({ obj: this.sobject, name: this.displayfields, filter: this.filter, mergefield: this.mergefields })
                .then(result => {
                    this.disable=false;
                    this.loadmessage=false;
                    this.isloading = false;
                    this.textboxclass = 'slds-input mytextbsmall';
                    this.dropdownClass = 'dropdownsmall dropdown slds-scrollable';
                    this.loadData = false;
                    if (result.length > 0) {
                        this.flag = true;
                        this.btn_flag = false;
                        this.message = false;
                        this.searchRecords = result;
                        this.spinner_flag = false;
                        this.mergeFieldsArray = this.mergefields.split(',')

                        let data = this.searchRecords.map(ele => {
                            let obj = {};
                            obj['keyfield'] = ele[this.keyfield];
                            obj['displayfields'] = ele[this.displayfields];
                            obj['mergeFields'] = '';
                            this.mergeFieldsArray.forEach(field => {
                                obj[field] = ele[field] ? ele[field] : '';
                                obj['mergeFields'] = obj['mergeFields'] + ' - ' + obj[field];
                            });
                            return obj;
                        });
                        this.records = JSON.parse(JSON.stringify(data));
                        this.virtualRecords = JSON.parse(JSON.stringify(data));
                    } else {
                        this.loadData = false;
                        this.flag = false;
                        this.btn_flag = false;
                        this.message = true;
                        this.searchRecords = [];
                        this.spinner_flag = false;
                    }

                }).catch(error => {
                    this.loadData = true;
                    this.message = true;
                    this.flag = false;
                    this.spinner_flag = false;
                })

        } else {
            this.textboxclass = 'slds-input mytextbsmall';
            this.dropdownClass = 'dropdownsmall dropdown slds-scrollable';

            this.isloading = true;
            this.searchKey = event.target.value;
            if (this.searchKey == '' || this.searchKey == null) {
                this.records = this.virtualRecords;
                this.flag = true;
                this.message = false;
            } else {
                if (this.searchKey.length > 2) {
                    this.flag = false;
                    this.isloading = true;
                    this.message = false;
                    setTimeout(() => {
                        this.records = this.virtualRecords.filter(ele => {
                            return ele['displayfields'].toLowerCase().includes(this.searchKey.toLowerCase()) || ele['mergeFields'].toLowerCase().includes(this.searchKey.toLowerCase());
                        });
                        this.flag = true;
                        this.isloading = false;

                    }, 300);
                }
            }
            if (this.records.length == 0) {
                this.message = true;
                this.isloading = false;
            }
        }
    }
    /**
     * Sets the selected record and dispatches the 'selected' event.
     * @param {Event} event - The click event on a record.
     */
    setSelectedrecord(event) {
        this.isloading = false;
        this.message = false;
        const recid = event.target.dataset.val;
        const recname = event.target.dataset.name;
        let newObj = { 'recId': recid, 'recName': recname };

        if (recname !== undefined) {
            this.singleselectedrec = recname;
            this.spinner_flag = false;
            this.flag = false;
            const selectEvent = new CustomEvent('selected', { detail: newObj });
            this.dispatchEvent(selectEvent);
            this.hidebox = 'hideboxcss';

        }

    }
    /**
     * This method is  called when the component loses focus
     */
    focusOut_event() {
        if (this.mouse_leave === true)
            this.flag = false;
    }
    /**
     * This method is called when the mouse enters a specific element or area of the component.
     */
    mouseIn() {
        this.mouse_enter = true;
        this.mouse_leave = false;
    }
    /**
     * This method is called when the mouse leaves a specific element or area of the component.
     */
    mouseOut() {
        this.mouse_leave = true;
        this.mouse_enter = false;
    }
    /**
     * Removes the selected record and dispatches the 'remove' event.
     * @param {Event} event - The click event on the remove button.
     */
    removeSingleHandler(event) {
        const removeEvent = new CustomEvent('remove', { detail: this.singleselectedrec });
        this.dispatchEvent(removeEvent);
        this.hidebox = ''
        const element = this.template.querySelector('[data-id="inputtext"]');
        element.value = '';
    }
}