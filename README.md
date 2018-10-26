# Sample Database
This project has one goal: provide a consistent set of data that can be used across data storage formats for testing.
To achieve this, this project contains 2 components:

1. A generator to create a schema-consistent set of randomized data.
2. A long-term generated set of data with a solid architecture that can be relied on for unit-testing down to specific values.

Both the generator and the long-term dataset ("LTD") provide an output in a number of data storage formats using the long-term schema (LTS). Contributors are welcome to include additional formats of the LTD and update the generator to support additional outputs.

## Long-Term Schema & Dataset
This project leverages a schema for all data that ensures consistency for the life of the project. No columns/fields, data types, or constraints will *ever* be removed or altered once established in an official version. This helps guarantee this project can be used for things such as unit-testing. The schema is intentionally kept relatively small.

For more information, see the [Architecture](#Architecture) section below.

The long-term dataset is a defined set of data that is [versioned by release name](#Current-Releases) and supported for the life of this project. Unit-tests based on these dataset releases are able to rely on the exising configuration long-term, and in general each LTD supports as many data file formats and database engines as reasonably possible.

### Updates
Any schema or data changes to the LTS will result in a new LTD package, maintained in a seperate directory from the prior LTD. This ensures users can continue to rely on a previous LTD for their tests without any changes. Additional file formats may be added to existing releases over time.

#### Current Releases
| # | Name | Release Date |
| - | ---- | ------------ |
| 1 | [Ammolite](./LTD/Ammolite) | TBD |

## Generator
The generator outputs randomized data using any LTS release that you can utilize or modify as needed for your project. 

## Supported Databases & Files
The goal of the project is to support a wide array of data file and database formats.

### Databases
Database scripts do not include any "create database" operations (unless required). You will need to create a database
first and then run the appropriate script to create the schema and data.

| Name | LTD Available | Generator |
| ---- | ------------- | --------- |
| [CSV](./LTD/Ammolite/CSV/) | Yes | Yes |
| [JSON](./LTD/Ammolite/JSON) | Yes | Yes |
| [Microsoft SQL Server](./LTD/Ammolite/MSSQL) | Yes | Yes |
| [MySQL](./LTD/Ammolite/MySQL) | Yes | Yes |
| [Postgres](./LTD/Ammolite/Postgres) | Yes | Yes |
| [SQLite 3](./LTD/Ammolite/SQLite) | Yes | Yes |
| [TOML](./LTD/Ammolite/TOML) | Yes | Yes |
| [TSV](./LTD/Ammolite/TSV) | Yes | Yes |
| [YAML](./LTD/Ammolite/YAML) | Yes | Yes |
| [XML](./LTD/Ammolite/XML) | Yes | Yes |

## Architecture
This architecture is intentionally kept simple - we are not considering stored procedures or functions.

Some database engines or file formats may not support all features (like views) - in such case we will use a similar feature,
if possible, to create a similar result. Not all column contraints or features may be supported by all file formats.

### Time-stamps
Certain tables utilize a "DateDeleted" Date/Time column - this column acts as a "soft-delete" flag for the record. 
Whether this is great architecture or not typically depends on your needs, but because it's often used we're including
it on the following tables: Customers, Products, and Users.

In file-based formats, where a column is a Binary data type, we will use a base-64 encoded string.

Databases will use foreign-key constraints, indexes, and primary-keys whenever possible.

### Schema

1. #### [Addresses](./LTD/Ammolite/Markdown/Addresses.md)  
    Contains geographical US-based addresses.    
    Addresses are semi-accurrate with cities, states, postal-codes, and countries matching real combinations. Latitude and longitude should match the postal code or city average geographical location. Line1 & Line2 are randomly crafted and do not represent real addresses.
    ##### Columns:
    | Name | Type | Key | Nullable | Notes |
    | ---- | ---- | --- | -------- | ----- |
    | ID | Integer | Yes | No | |
    | Line1 | String | No | No | |
    | Line2 | String | No | Yes | |
    | City | String | No | Yes | |
    | PostalCode | String | No | Yes | |
    | StateProvince | String | No | Yes | |
    | Country | String | No | Yes | |
    | Latitude | Floating-Point | No | Yes | This value cooresponds to the latitude by postal-code or city. |
    | Longitude | Floating-Point | No | Yes | This value cooresponds to the longitude by postal-code or city. |
1. #### [Customers](./LTD/Ammolite/Markdown/Customers.md)  
    Contains customer (person) information.    
    Due to the low amount of seed content, the photo data is likely duplicated across multiple customers.
    ##### Columns:
    | Name | Type | Key | Nullable | Notes |
    | ---- | ---- | --- | -------- | ----- |
    | ID | Integer | Yes | No | |
    | FirstName | String | No | No | |
    | LastName | String | No | No | |
    | Suffix | String | No | Yes | |
    | CompanyName | String | No | Yes | |
    | Title | String | No | Yes | |
    | Notes | String | No | Yes | |
    | AccountNumber | Integer | No | Yes | |
    | Photo | Binary | No | Yes | |
    | DateCreated | Date/Time | No | No | |
    | DateUpdated | Date/Time | No | Yes | |
    | DateDeleted | Date/Time | No | Yes | |
1. #### [Orders](./LTD/Ammolite/Markdown/Orders.md)    
    ##### Columns:
    | Name | Type | Key | Nullable | Notes |
    | ---- | ---- | --- | -------- | ----- |
    | ID | Integer | Yes | No | |
    | CustomerID | Integer | Foreign | No | |
    | AddressID | Integer | Foreign | No | |
    | Status | Integer | No | No | |
    | PaymentMethod | String | No | Yes | |
    | Weight | Floating-Point | No | Yes | |
    | Shipped | Boolean | No | Yes | |
    | TrackingNumber | String | No | Yes | |
    | DateShipped | Date | No | Yes | |
    | TimeShipped | Time | No | Yes | |
1. #### [OrderProducts](./LTD/Ammolite/Markdown/OrderProducts.md)    
    ##### Columns:
    | Name | Type | Key | Nullable | Notes |
    | ---- | ---- | --- | -------- | ----- |
    | OrderID | Integer | Foreign | No | |
    | ProductID | Integer | Foreign | No | |
    | Quantity | Integer | No | No | |
    | UnitCost | Floating-Point | No | No | |
    | UnitPrice | Floating-Point | No | No | |
    | TotalCost | Floating-Point | No | No | |
    | TotalPrice | Floating-Point | No | No | |
1. #### [Products](./LTD/Ammolite/Markdown/Products.md)    
    ##### Columns:
    | Name | Type | Key | Nullable | Notes |
    | ---- | ---- | --- | -------- | ----- |
    | ID | Integer | Yes | No | |
    | Name | String | No | No | |
    | ScanCode | String | No | Yes | |
    | Cost | Floating-Point | No | No | |
    | Price | Floating-Point | No | No | |
    | ImageURL | String | No | Yes | |
    | DateCreated | Date/Time | No | No | |
    | DateUpdated | Date/Time | No | Yes | |
    | DateDeleted | Date/Time | No | Yes | |
1. #### [Users](./LTD/Ammolite/Markdown/Users.md)    
    ##### Columns:
    | Name | Type | Key | Nullable | Notes |
    | ---- | ---- | --- | -------- | ----- |
    | ID | Integer | Yes | No | |
    | RoleID | Integer | Foreign | No | |
    | UserName | String | No | No | |
    | Password | String | No | No | Passwords are stored as the [SHA1](https://en.wikipedia.org/wiki/SHA-1) hexidecimal hash digest of "password" concatenated with the row ID (e.g.: "password33" on a user with ID 33) |
    | DateCreated | Date/Time | No | No | |
    | DateUpdated | Date/Time | No | Yes | |
    | DateDeleted | Date/Time | No | Yes | |
1. #### [Roles](./LTD/Ammolite/Markdown/Roles.md)    
    ##### Columns:
    | Name | Type | Key | Nullable | Notes |
    | ---- | ---- | --- | -------- | ----- |
    | ID | Integer | Yes | No | |
    | Name | String | No | No | The name will always be "Administrator" with role on ID equalling 1, "User" on ID equalling 2, and "Visitor" on ID equalling 3. |
1. #### [Theme](./LTD/Ammolite/Markdown/Theme.md)    
    ##### Columns:
    | Name | Type | Key | Nullable | Notes |
    | ---- | ---- | --- | -------- | ----- |
    | ID | Integer | Yes | No | |
    | Name | String | No | No | |
    | HexCode | String | No | No | |

## Contributing
Want to provide a fix or provide a new format? Just create a merge request with the change.