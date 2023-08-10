@isTest
public class LookupControllerCmpTest {
    @TestSetup
    public static void testData(){
        
       /* Sales_Org__c sales_org = new Sales_Org__c();
        sales_org.Name = 'Chile';
        sales_org.Sales_Org_Code__c = '5661';
        sales_org.CurrencyIsoCode = 'CLP';
        insert sales_org;*/
        
         // Id recordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Account').getRecordTypeId();
        Account a = new Account();
        a.Name = 'Test';
       // a.Email__c= 'TestEmail@example.com';
       // a.RecordTypeId = recordTypeId;
       // a.CurrencyIsoCode = 'CLP';
       // a.Sales_Org__c = sales_org.Id;
        insert a;
        
        User u = new User(
     ProfileId = [SELECT Id FROM Profile WHERE Name = 'System Administrator'].Id,
     LastName = 'Test',
     Email = 'test@test.com',
     Username = 'test@test.com' + System.currentTimeMillis(),
     CompanyName = 'TEST',
     Title = 'title',
     Alias = 'alias',
     TimeZoneSidKey = 'America/Los_Angeles',
     EmailEncodingKey = 'UTF-8',
     LanguageLocaleKey = 'en_US',
     LocaleSidKey = 'en_US'
);
        insert u;
       
    }

    @istest
    public static void searchTest(){
        Test.startTest();
         LookupControllerCmp.searchedLookupList('Account','Name','name!=null','phone');
         LookupControllerCmp.searchedLookupList('Account','Name','name!=null',null);
        Test.stopTest();
    }

}